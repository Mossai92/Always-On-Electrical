<?php
declare(strict_types=1);
// Always On Electrical — callout request handler.
// Takes the form post, checks it (including the weekday/weekend rule), emails Peter with any photos,
// texts him if SMS is switched on, and emails the customer a confirmation.

require __DIR__ . '/lib/rules.php';
require __DIR__ . '/lib/http.php';
require __DIR__ . '/lib/mail.php';
require __DIR__ . '/lib/sms.php';

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    aoe_json(500, ['ok' => false, 'error' => 'The website is not set up to send requests yet. Please call instead.']);
}
$cfg = require $configFile;
date_default_timezone_set($cfg['timezone'] ?? 'Europe/Dublin');
$tz = new DateTimeZone($cfg['timezone'] ?? 'Europe/Dublin');
$root = aoe_site_root();
$backHref = $root . 'contact.html#request';
$wantsJson = aoe_wants_json();

function aoe_log(array $cfg, string $line): void
{
    if (empty($cfg['log'])) {
        return;
    }
    $dir = $cfg['data_dir'];
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
        return;
    }
    @file_put_contents($dir . '/requests.log', date('c') . ' ' . $line . "\n", FILE_APPEND | LOCK_EX);
}

/** Sends a failure to the caller in whichever form it expects. */
function aoe_fail(int $status, string $message, array $problems, bool $wantsJson, string $backHref, array $cfg): void
{
    if ($wantsJson) {
        aoe_json($status, ['ok' => false, 'error' => $message, 'problems' => array_values($problems)]);
    }
    aoe_html_page($status, 'That did not go through', $message, array_values($problems), $backHref, $cfg['business_phone']);
}

/** Bots get a quiet "success" so they learn nothing. */
function aoe_pretend_success(bool $wantsJson, string $root): void
{
    if ($wantsJson) {
        aoe_json(200, ['ok' => true]);
    }
    aoe_redirect($root . 'thank-you.html');
}

// ---- method and size ----
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    aoe_fail(405, 'This address only accepts the request form.', [], $wantsJson, $backHref, $cfg);
}
$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 0 && empty($_POST) && empty($_FILES)) {
    // PHP dropped the whole body: post_max_size exceeded
    aoe_fail(413, 'The photos were too large to send. Please try again with smaller photos, or leave them out.', [], $wantsJson, $backHref, $cfg);
}

// ---- spam checks ----
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    aoe_log($cfg, 'spam honeypot');
    aoe_pretend_success($wantsJson, $root);
}
$ts = (float) ($_POST['ts'] ?? 0);
if ($ts > 0) {
    $openFor = (microtime(true) * 1000) - $ts;
    if ($openFor >= 0 && $openFor < ($cfg['min_seconds'] ?? 3) * 1000) {
        aoe_log($cfg, 'spam too-fast');
        aoe_pretend_success($wantsJson, $root);
    }
}

// ---- rate limit per IP (file based; skipped if the data folder is not writable) ----
$ip = aoe_client_ip();
$limit = $cfg['rate_limit'] ?? ['count' => 5, 'window' => 3600];
$dataDir = $cfg['data_dir'];
if (is_dir($dataDir) || @mkdir($dataDir, 0755, true)) {
    $rlFile = $dataDir . '/ratelimit.json';
    $fh = @fopen($rlFile, 'c+');
    if ($fh !== false && flock($fh, LOCK_EX)) {
        $raw = stream_get_contents($fh);
        $state = json_decode((string) $raw, true);
        if (!is_array($state)) {
            $state = [];
        }
        $now = time();
        $key = hash('sha256', $ip);
        $hits = array_values(array_filter($state[$key] ?? [], fn($t) => is_int($t) && $t > $now - (int) $limit['window']));
        if (count($hits) >= (int) $limit['count']) {
            flock($fh, LOCK_UN);
            fclose($fh);
            aoe_log($cfg, 'rate-limited');
            aoe_fail(429, 'That is a few requests in a row from this connection. Please wait a while, or call instead.', [], $wantsJson, $backHref, $cfg);
        }
        $hits[] = $now;
        $state[$key] = $hits;
        foreach ($state as $k => $list) {
            $state[$k] = array_values(array_filter($list, fn($t) => is_int($t) && $t > $now - (int) $limit['window']));
            if ($state[$k] === []) {
                unset($state[$k]);
            }
        }
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($state));
        flock($fh, LOCK_UN);
        fclose($fh);
    }
}

// ---- fields ----
$problems = [];
$job = aoe_clean_text((string) ($_POST['job'] ?? ''), 5000);
$address = aoe_clean_text((string) ($_POST['address'] ?? ''), 300);
$name = aoe_clean_text((string) ($_POST['name'] ?? ''), 100);
$phone = aoe_clean_text((string) ($_POST['phone'] ?? ''), 30);
$email = aoe_clean_text((string) ($_POST['email'] ?? ''), 254);

if (strlen($job) < 5) {
    $problems['job'] = 'Tell us a little about the job.';
}
if (strlen($address) < 5) {
    $problems['address'] = 'Add the address of the job.';
}
if (strlen($name) < 2) {
    $problems['name'] = 'Add your name.';
}
if (!aoe_valid_phone($phone)) {
    $problems['phone'] = 'Add a phone number Peter can call or text.';
}
if (!aoe_valid_email($email)) {
    $problems['email'] = 'Add an email address for your confirmation.';
}
$day1 = aoe_validate_day((string) ($_POST['date1'] ?? ''), (string) ($_POST['window1'] ?? ''), true, $tz);
if ($day1['error'] !== null) {
    $problems['date1'] = $day1['error'];
}
$day2 = aoe_validate_day((string) ($_POST['date2'] ?? ''), (string) ($_POST['window2'] ?? ''), false, $tz);
if ($day2['error'] !== null) {
    $problems['date2'] = $day2['error'];
}

// ---- photos ----
$attachments = [];
$allowedTypes = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif', 'image/heic' => 'heic', 'image/heif' => 'heif'];
if (!empty($_FILES['photos']) && is_array($_FILES['photos']['name'] ?? null)) {
    $count = count($_FILES['photos']['name']);
    $max = (int) ($cfg['max_photos'] ?? 3);
    $maxBytes = (int) ($cfg['max_photo_bytes'] ?? 8 * 1024 * 1024);
    $finfo = function_exists('finfo_open') ? finfo_open(FILEINFO_MIME_TYPE) : false;
    for ($i = 0; $i < $count; $i++) {
        $err = (int) $_FILES['photos']['error'][$i];
        if ($err === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if ($err === UPLOAD_ERR_INI_SIZE || $err === UPLOAD_ERR_FORM_SIZE) {
            $problems['photos'] = 'One of the photos is too large. Photos need to be under ' . (int) ($maxBytes / 1048576) . ' MB each.';
            continue;
        }
        if ($err !== UPLOAD_ERR_OK) {
            $problems['photos'] = 'One of the photos did not upload properly. Please try again.';
            continue;
        }
        if (count($attachments) >= $max) {
            $problems['photos'] = 'Up to ' . $max . ' photos can be sent.';
            break;
        }
        $tmp = (string) $_FILES['photos']['tmp_name'][$i];
        if (!is_uploaded_file($tmp)) {
            continue;
        }
        if ((int) $_FILES['photos']['size'][$i] > $maxBytes) {
            $problems['photos'] = 'Photos need to be under ' . (int) ($maxBytes / 1048576) . ' MB each.';
            continue;
        }
        $type = $finfo ? (string) finfo_file($finfo, $tmp) : (string) mime_content_type($tmp);
        if (!isset($allowedTypes[$type])) {
            $problems['photos'] = 'Photos need to be JPEG, PNG, WebP, GIF or HEIC images.';
            continue;
        }
        $attachments[] = ['path' => $tmp, 'name' => 'photo-' . (count($attachments) + 1) . '.' . $allowedTypes[$type], 'type' => $type];
    }
    if ($finfo) {
        finfo_close($finfo);
    }
}

if ($problems !== []) {
    aoe_fail(400, 'A few details are missing or need a look.', $problems, $wantsJson, $backHref, $cfg);
}

// ---- compose ----
$when1 = aoe_day_label($day1['date']) . ' · ' . AOE_WINDOWS[$day1['window']];
$when2 = $day2['date'] !== null ? aoe_day_label($day2['date']) . ' · ' . AOE_WINDOWS[$day2['window']] : 'Not given';
$photoNote = count($attachments) === 0 ? 'None' : count($attachments) . ' attached';
$sentAt = date('D j M Y, H:i');

$rows = [
    ['Name', $name],
    ['Phone', $phone],
    ['Email', $email],
    ['Address', $address],
    ['Job', $job],
    ['Preferred day', $when1],
    ['Another day', $when2],
    ['Photos', $photoNote],
];
$text = "New callout request from the website\n\n";
foreach ($rows as [$label, $value]) {
    $text .= $label . ': ' . $value . "\n";
}
$text .= "\nSent " . $sentAt . ". Reply to this email to answer " . $name . " directly.\n";
$html = aoe_html_email('New callout request', $rows, 'Sent ' . $sentAt . '. Reply to this email to answer ' . $name . ' directly.');

$subject = 'Callout request: ' . $name . ' · ' . $when1;
$mailOk = aoe_send_mail($cfg, $cfg['to_email'], $cfg['to_name'], $subject, $text, $html, $attachments, $email, $name);
if (!$mailOk) {
    aoe_log($cfg, 'error mail-to-peter failed');
    aoe_fail(500, 'The request could not be sent just now. Please try again in a few minutes, or call.', [], $wantsJson, $backHref, $cfg);
}

// ---- text alert (the switch lives in config) ----
$jobFlat = preg_replace('/\s+/', ' ', $job) ?? $job;
$jobShort = function_exists('mb_substr') ? mb_substr($jobFlat, 0, 70) : substr($jobFlat, 0, 70);
$smsBody = $cfg['business_name'] . ': new callout from ' . $name . ' (' . $phone . '). ' . $when1 . '. ' . $jobShort . '… Details in email.';
$sms = aoe_send_sms($cfg['sms'] ?? [], $smsBody);

// ---- confirmation to the customer ----
$first = explode(' ', trim($name))[0] ?: $name;
$cRows = [
    ['Job', $job],
    ['Preferred day', $when1],
    ['Another day', $when2],
    ['Address', $address],
    ['Your phone', $phone],
];
$cText = 'Hi ' . $first . ",\n\nThanks, your request is in. Peter will be in touch by call or text to confirm the day.\n\nWhat you sent:\n";
foreach ($cRows as [$label, $value]) {
    $cText .= $label . ': ' . $value . "\n";
}
$cText .= "\nIf anything changes, call or text " . $cfg['business_phone'] . " or reply to this email.\n\n" . $cfg['business_name'] . ' · ' . $cfg['site_url'] . "\n";
$cHtml = aoe_html_email('Request received', array_merge([['Hello', 'Hi ' . $first . ', thanks, your request is in. Peter will be in touch by call or text to confirm the day.']], $cRows), 'If anything changes, call or text ' . $cfg['business_phone'] . ' or reply to this email. ' . $cfg['business_name'] . ' · ' . $cfg['site_url']);
$confirmOk = aoe_send_mail($cfg, $email, $name, 'Your callout request to ' . $cfg['business_name'], $cText, $cHtml, [], $cfg['to_email'], $cfg['to_name']);

aoe_log($cfg, sprintf('ok photos=%d confirm=%s sms=%s', count($attachments), $confirmOk ? 'sent' : 'failed', $sms['ok'] ? 'sent' : $sms['info']));

if ($wantsJson) {
    aoe_json(200, ['ok' => true]);
}
aoe_redirect($root . 'thank-you.html');

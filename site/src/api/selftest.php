<?php
declare(strict_types=1);
// One-off check after uploading: …/api/selftest.php?key=YOUR_SECRET
// Reports whether the server can send mail and text messages, and sends one test of each.
// Set 'selftest' => false in config.php once the site is live.

require __DIR__ . '/lib/rules.php';
require __DIR__ . '/lib/http.php';
require __DIR__ . '/lib/mail.php';
require __DIR__ . '/lib/sms.php';

header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    echo "config.php is missing. Copy config.example.php to config.php and fill it in.\n";
    exit;
}
$cfg = require $configFile;
$key = (string) ($_GET['key'] ?? '');
if (empty($cfg['selftest']) || $key === '' || !hash_equals((string) $cfg['secret'], $key)) {
    http_response_code(404);
    echo "Not found.\n";
    exit;
}
date_default_timezone_set($cfg['timezone'] ?? 'Europe/Dublin');

$line = fn(string $label, string $value) => printf("%-22s %s\n", $label . ':', $value);
echo "Always On Electrical — handler self-test\n\n";
$line('PHP version', PHP_VERSION . (version_compare(PHP_VERSION, '8.0.0', '>=') ? ' (ok)' : ' (too old, needs 8.0+)'));
$line('mail() available', function_exists('mail') ? 'yes' : 'NO');
$line('curl available', function_exists('curl_init') ? 'yes' : 'no (SMS will not work)');
$line('fileinfo available', function_exists('finfo_open') ? 'yes' : 'no (photo type checks weaker)');
$line('upload_max_filesize', (string) ini_get('upload_max_filesize'));
$line('post_max_size', (string) ini_get('post_max_size'));
$line('max_file_uploads', (string) ini_get('max_file_uploads'));
$dataDir = $cfg['data_dir'];
$writable = (is_dir($dataDir) || @mkdir($dataDir, 0755, true)) && is_writable($dataDir);
$line('data folder writable', $writable ? 'yes' : 'NO (rate limiting and logging are off)');
$line('secret changed', $cfg['secret'] === 'change-me-to-a-long-random-string' ? 'NO, change it' : 'yes');
$line('SMS switch', !empty($cfg['sms']['enabled']) ? 'on' : 'off');

$tz = new DateTimeZone($cfg['timezone'] ?? 'Europe/Dublin');
$sat = new DateTimeImmutable('next saturday', $tz);
$tue = new DateTimeImmutable('next tuesday', $tz);
$line('rule check', 'Saturday allows ' . implode(', ', aoe_allowed_windows($sat)) . '; Tuesday allows ' . implode(', ', aoe_allowed_windows($tue)));

echo "\nSending a test email to " . $cfg['to_email'] . " …\n";
$ok = aoe_send_mail($cfg, $cfg['to_email'], $cfg['to_name'], 'Test from the Always On Electrical website', "This is a test from the website's request handler. If you can read this, email works.\n", aoe_html_email('Test from the website', [['Result', 'If you can read this, email works.']], 'Sent by selftest.php at ' . date('c')), []);
$line('email', $ok ? 'handed to the mail system (check the inbox and spam folder)' : 'FAILED: mail() returned false');

if (!empty($cfg['sms']['enabled'])) {
    echo "\nSending a test text to " . $cfg['sms']['to'] . " …\n";
    $res = aoe_send_sms($cfg['sms'], $cfg['business_name'] . ': test from the website. If you can read this, texts work.');
    $line('sms', $res['ok'] ? 'sent (' . $res['info'] . ')' : 'FAILED: ' . $res['info']);
} else {
    echo "\nSMS is switched off in config.php; nothing sent.\n";
}
echo "\nDone. Set 'selftest' => false in config.php once you are happy.\n";

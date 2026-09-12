<?php
declare(strict_types=1);
// Text-message alert. A switch in config: when 'enabled' is false nothing is sent and the request
// still succeeds. Twilio is the only provider wired up; add another in the match below.

/** @return array{ok: bool, info: string} */
function aoe_send_sms(array $sms, string $body): array
{
    if (empty($sms['enabled'])) {
        return ['ok' => false, 'info' => 'disabled'];
    }
    $provider = $sms['provider'] ?? 'twilio';
    return match ($provider) {
        'twilio' => aoe_sms_twilio($sms, $body),
        default => ['ok' => false, 'info' => 'unknown provider ' . $provider],
    };
}

/** @return array{ok: bool, info: string} */
function aoe_sms_twilio(array $sms, string $body): array
{
    $sid = trim((string) ($sms['twilio_sid'] ?? ''));
    $token = trim((string) ($sms['twilio_token'] ?? ''));
    $to = trim((string) ($sms['to'] ?? ''));
    $from = trim((string) ($sms['from'] ?? ''));
    if ($sid === '' || $token === '' || $to === '' || $from === '') {
        return ['ok' => false, 'info' => 'twilio details missing'];
    }
    if (!function_exists('curl_init')) {
        return ['ok' => false, 'info' => 'curl not available'];
    }
    $ch = curl_init('https://api.twilio.com/2010-04-01/Accounts/' . rawurlencode($sid) . '/Messages.json');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query(['From' => $from, 'To' => $to, 'Body' => $body]),
        CURLOPT_USERPWD => $sid . ':' . $token,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_CONNECTTIMEOUT => 6,
    ]);
    $res = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($res === false) {
        return ['ok' => false, 'info' => 'curl: ' . $err];
    }
    $json = json_decode((string) $res, true);
    if ($status >= 200 && $status < 300 && is_array($json) && !empty($json['sid'])) {
        return ['ok' => true, 'info' => 'twilio ' . $json['sid']];
    }
    $msg = is_array($json) && isset($json['message']) ? (string) $json['message'] : ('http ' . $status);
    return ['ok' => false, 'info' => 'twilio: ' . $msg];
}

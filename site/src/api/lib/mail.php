<?php
declare(strict_types=1);
// Sends a text + HTML email with optional attachments through PHP's mail(), which on cPanel hands
// the message to the server's own mail system. No libraries needed.

function aoe_mime_word(string $s): string
{
    return preg_match('/[^\x20-\x7E]/', $s) ? '=?UTF-8?B?' . base64_encode($s) . '?=' : $s;
}

function aoe_address(string $email, string $name): string
{
    $name = trim(str_replace(["\r", "\n", '"'], '', $name));
    return $name === '' ? $email : aoe_mime_word($name) . ' <' . $email . '>';
}

/**
 * @param array<int, array{path: string, name: string, type: string}> $attachments
 */
function aoe_send_mail(array $cfg, string $toEmail, string $toName, string $subject, string $text, string $html, array $attachments = [], ?string $replyTo = null, ?string $replyToName = null): bool
{
    $eol = "\r\n";
    $mixed = 'mixed-' . bin2hex(random_bytes(12));
    $alt = 'alt-' . bin2hex(random_bytes(12));

    $headers = [
        'From: ' . aoe_address($cfg['from_email'], $cfg['from_name']),
        'Reply-To: ' . aoe_address($replyTo ?? $cfg['to_email'], $replyToName ?? $cfg['to_name']),
        'MIME-Version: 1.0',
        'Content-Type: multipart/mixed; boundary="' . $mixed . '"',
        'X-Mailer: always-on-electrical-site',
    ];

    $body = '--' . $mixed . $eol
        . 'Content-Type: multipart/alternative; boundary="' . $alt . '"' . $eol . $eol
        . '--' . $alt . $eol
        . 'Content-Type: text/plain; charset=UTF-8' . $eol
        . 'Content-Transfer-Encoding: base64' . $eol . $eol
        . chunk_split(base64_encode($text), 76, $eol)
        . '--' . $alt . $eol
        . 'Content-Type: text/html; charset=UTF-8' . $eol
        . 'Content-Transfer-Encoding: base64' . $eol . $eol
        . chunk_split(base64_encode($html), 76, $eol)
        . '--' . $alt . '--' . $eol;

    foreach ($attachments as $a) {
        $data = @file_get_contents($a['path']);
        if ($data === false) {
            continue;
        }
        $name = preg_replace('/[^A-Za-z0-9._-]/', '_', $a['name']) ?: 'photo';
        $body .= '--' . $mixed . $eol
            . 'Content-Type: ' . $a['type'] . '; name="' . $name . '"' . $eol
            . 'Content-Disposition: attachment; filename="' . $name . '"' . $eol
            . 'Content-Transfer-Encoding: base64' . $eol . $eol
            . chunk_split(base64_encode($data), 76, $eol);
    }
    $body .= '--' . $mixed . '--' . $eol;

    $to = aoe_address($toEmail, $toName);
    $encSubject = aoe_mime_word(str_replace(["\r", "\n"], ' ', $subject));
    $params = '-f' . $cfg['from_email'];

    $ok = @mail($to, $encSubject, $body, implode($eol, $headers), $params);
    if (!$ok) {
        // some hosts refuse the envelope-sender parameter; try once without it
        $ok = @mail($to, $encSubject, $body, implode($eol, $headers));
    }
    return (bool) $ok;
}

/** Wraps plain text as a simple, readable HTML email in the site's colours. */
function aoe_html_email(string $title, array $rows, string $footer): string
{
    $out = '<!doctype html><html><body style="margin:0;padding:24px;background:#F3F2F2;font-family:Archivo,Helvetica,Arial,sans-serif;color:#201E1D">'
        . '<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;padding:28px">'
        . '<h1 style="margin:0 0 18px;font-size:22px;letter-spacing:-0.02em">' . aoe_h($title) . '</h1>'
        . '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.5">';
    foreach ($rows as [$label, $value]) {
        $out .= '<tr><td style="padding:8px 12px 8px 0;vertical-align:top;color:#6F7478;white-space:nowrap">' . aoe_h($label) . '</td>'
            . '<td style="padding:8px 0;vertical-align:top;white-space:pre-line">' . aoe_h($value) . '</td></tr>';
    }
    $out .= '</table><p style="margin:24px 0 0;font-size:13px;color:#6F7478;line-height:1.5">' . aoe_h($footer) . '</p></div></body></html>';
    return $out;
}

<?php
declare(strict_types=1);
// Responses: JSON for the site's script, a redirect or a small branded page for plain form posts.

function aoe_wants_json(): bool
{
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $xrw = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    return str_contains($accept, 'application/json') || strcasecmp($xrw, 'XMLHttpRequest') === 0;
}

function aoe_json(int $status, array $data): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function aoe_site_root(): string
{
    // /api/request.php -> /
    $script = $_SERVER['SCRIPT_NAME'] ?? '/api/request.php';
    $root = rtrim(dirname(dirname($script)), '/\\');
    return $root === '' ? '/' : $root . '/';
}

function aoe_redirect(string $path): void
{
    http_response_code(303);
    header('Location: ' . $path);
    exit;
}

function aoe_client_ip(): string
{
    // cPanel behind Cloudflare sets CF-Connecting-IP; otherwise trust REMOTE_ADDR only.
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

function aoe_h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** A small page in the site's colours for people submitting without JavaScript. */
function aoe_html_page(int $status, string $title, string $message, array $problems, string $backHref, string $phone): void
{
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    $items = '';
    foreach ($problems as $p) {
        $items .= '<li>' . aoe_h($p) . '</li>';
    }
    echo '<!doctype html><html lang="en-IE"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' . aoe_h($title) . '</title>'
        . '<style>body{margin:0;font-family:Archivo,"Helvetica Neue",Arial,sans-serif;background:#201E1D;color:#F3F2F2;padding:40px 20px}main{max-width:560px;margin:0 auto}h1{font-size:28px;letter-spacing:-0.02em;margin:0 0 12px}p{line-height:1.5;color:rgba(243,242,242,.75)}ul{line-height:1.6;padding-left:20px}a.btn{display:inline-block;margin-top:20px;background:#EC3013;color:#F3F2F2;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:6px}a{color:#F3F2F2}</style></head><body><main>'
        . '<h1>' . aoe_h($title) . '</h1><p>' . aoe_h($message) . '</p>'
        . ($items !== '' ? '<ul>' . $items . '</ul>' : '')
        . '<p>Or call or text ' . aoe_h($phone) . '.</p>'
        . '<a class="btn" href="' . aoe_h($backHref) . '">Back to the form</a></main></body></html>';
    exit;
}

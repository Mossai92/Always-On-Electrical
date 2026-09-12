<?php
// Always On Electrical — handler configuration.
// Copy this file to config.php on the server and fill it in. config.php is never committed to git
// and is blocked from the web by .htaccess. Requires PHP 8.0 or newer.
return [
    // Where requests go. The mailbox that receives them.
    'to_email' => 'pete@alwaysonelectrical.ie',
    'to_name' => 'Peter Agnew',

    // The address the website sends FROM. It must be on the same domain as the site for mail to
    // be delivered reliably (SPF). Create it as a mailbox in cPanel even if nobody reads it.
    'from_email' => 'noreply@alwaysonelectrical.ie',
    'from_name' => 'Always On Electrical website',

    'site_url' => 'https://alwaysonelectrical.ie',
    'business_name' => 'Always On Electrical',
    'business_phone' => '+353 (83) 481 2044',
    'timezone' => 'Europe/Dublin',

    // Text-message alert to Peter. Off until the Twilio details are filled in.
    'sms' => [
        'enabled' => false,
        'provider' => 'twilio',
        'to' => '+353834812044',   // Peter's mobile in international format
        'from' => 'AlwaysOn',       // alphanumeric sender ID (free for Ireland) or a Twilio number
        'twilio_sid' => '',
        'twilio_token' => '',
    ],

    // Long random string. Needed to open selftest.php (…/api/selftest.php?key=THIS).
    'secret' => 'change-me-to-a-long-random-string',
    // Set to false once the site is live and tested.
    'selftest' => true,

    // Photos
    'max_photos' => 3,
    'max_photo_bytes' => 8 * 1024 * 1024,

    // Spam and abuse limits
    'min_seconds' => 3,                                  // form open for less than this = bot
    'rate_limit' => ['count' => 5, 'window' => 3600],    // requests per IP per window

    // Writable folder for the rate-limit state and the log; blocked from the web by its .htaccess.
    'data_dir' => __DIR__ . '/data',
    'log' => true,
];

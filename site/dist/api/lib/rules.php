<?php
declare(strict_types=1);
// Availability rule and field validation for the callout request.
// Peter works evenings on weekdays and any window at weekends. The browser applies this rule too,
// but the browser can be bypassed, so it is enforced here as well.

const AOE_WINDOWS = ['any' => 'Any time', 'morning' => 'Morning', 'afternoon' => 'Afternoon', 'evening' => 'Evening'];

function aoe_parse_date(string $value, DateTimeZone $tz): ?DateTimeImmutable
{
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
        return null;
    }
    $d = DateTimeImmutable::createFromFormat('!Y-m-d', $value, $tz);
    return ($d !== false && $d->format('Y-m-d') === $value) ? $d : null;
}

function aoe_is_weekend(DateTimeImmutable $d): bool
{
    return (int) $d->format('N') >= 6;
}

/** @return string[] window keys allowed on that date */
function aoe_allowed_windows(DateTimeImmutable $d): array
{
    return aoe_is_weekend($d) ? array_keys(AOE_WINDOWS) : ['evening'];
}

function aoe_day_label(DateTimeImmutable $d): string
{
    return $d->format('D j M Y');
}

/**
 * Validates one date + window pair.
 * @return array{date: ?DateTimeImmutable, window: ?string, error: ?string}
 */
function aoe_validate_day(string $dateValue, string $windowValue, bool $required, DateTimeZone $tz): array
{
    $dateValue = trim($dateValue);
    $windowValue = trim($windowValue);
    if ($dateValue === '') {
        return ['date' => null, 'window' => null, 'error' => $required ? 'Pick a day that would suit.' : null];
    }
    $d = aoe_parse_date($dateValue, $tz);
    if ($d === null) {
        return ['date' => null, 'window' => null, 'error' => 'That date is not valid.'];
    }
    $today = new DateTimeImmutable('today', $tz);
    if ($d < $today) {
        return ['date' => null, 'window' => null, 'error' => 'That date is in the past.'];
    }
    if ($d > $today->modify('+1 year')) {
        return ['date' => null, 'window' => null, 'error' => 'That date is more than a year away.'];
    }
    if (!isset(AOE_WINDOWS[$windowValue])) {
        return ['date' => $d, 'window' => null, 'error' => 'Choose an arrival window for ' . aoe_day_label($d) . '.'];
    }
    if (!in_array($windowValue, aoe_allowed_windows($d), true)) {
        return ['date' => $d, 'window' => null, 'error' => aoe_day_label($d) . ' is a weekday, so only an evening callout is available.'];
    }
    return ['date' => $d, 'window' => $windowValue, 'error' => null];
}

function aoe_clean_text(string $value, int $max): string
{
    $value = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '');
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max);
    }
    return substr($value, 0, $max);
}

function aoe_valid_phone(string $value): bool
{
    return (bool) preg_match('/^\+?[0-9][0-9 ()\-]{6,19}$/', $value);
}

function aoe_valid_email(string $value): bool
{
    return filter_var($value, FILTER_VALIDATE_EMAIL) !== false && strlen($value) <= 254;
}

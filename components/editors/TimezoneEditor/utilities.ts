// utilities:
export const convertTimezoneToReadableClock = (timezone: number): string => {
    const timezoneAbs       = Math.abs(timezone);
    const timezoneHours     = Math.floor(timezoneAbs / 60);
    const timezoneMinutes   = Math.round(timezoneAbs - (timezoneHours * 60));
    return `${(timezone >= 0) ? '+' : '-'}${(timezoneHours < 10) ? '0' : ''}${timezoneHours}:${(timezoneMinutes < 10) ? '0' : ''}${timezoneMinutes}`;
};

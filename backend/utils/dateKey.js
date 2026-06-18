const getConfiguredTimeZone = () =>
  process.env.DAILY_DSA_TIMEZONE ||
  process.env.CRON_TIMEZONE ||
  process.env.TIMEZONE ||
  process.env.TZ;

const getLocalParts = (date) => ({
  year: date.getFullYear(),
  month: String(date.getMonth() + 1).padStart(2, '0'),
  day: String(date.getDate()).padStart(2, '0')
});

const getTimeZoneParts = (date, timeZone) => {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const parts = formatter.formatToParts(date).reduce((accumulator, part) => {
      if (part.type === 'year' || part.type === 'month' || part.type === 'day') {
        accumulator[part.type] = part.value;
      }

      return accumulator;
    }, {});

    return {
      year: parts.year,
      month: parts.month,
      day: parts.day
    };
  } catch {
    return getLocalParts(date);
  }
};

export const getDailyDsaTimeZone = () => getConfiguredTimeZone();

export const getLocalDateKey = (date = new Date(), timeZone = getConfiguredTimeZone()) => {
  const parts = timeZone ? getTimeZoneParts(date, timeZone) : getLocalParts(date);

  return `${parts.year}-${parts.month}-${parts.day}`;
};
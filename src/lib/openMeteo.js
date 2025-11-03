export const defaultCoords = {
  // London, UK
  latitude: 51.5072,
  longitude: -0.1276,
};

// Fetch a single day's forecast by day number (0 = today, 1 = tomorrow, ...)

/**
 * Fetch a single day's forecast from the Open-Meteo API.
 *
 * This function requests daily summary fields for a single date computed
 * relative to the local time of the target location. By default it returns
 * today's forecast (dayNumber = 0). Pass a positive integer to get the
 * forecast for future dates (1 = tomorrow, 2 = day after tomorrow, ...).
 *
 * @param {number} [dayNumber=0]
 *   The day offset relative to today (0 = today, 1 = tomorrow, ...). Must
 *   be a number >= 0. Non-integers are allowed but typically you should
 *   pass integers.
 *
 * @param {{latitude:number, longitude:number}} [coords=defaultCoords]
 *   An object with numeric `latitude` and `longitude`. When omitted the
 *   function uses `defaultCoords` (London, UK).
 *
 * @returns {Promise<{
 *   dateISO: string,
 *   label: string,
 *   tMax: number,
 *   tMin: number,
 *   precip: number,
 *   code: number,
 *   description: string,
 *   timezone: string
 * }>}
 *   Resolves with a plain object describing the day's summary.
 *   - dateISO: ISO date string (YYYY-MM-DD) for the requested day.
 *   - label: a localized short label for the date (e.g. "Mon, Nov 3").
 *   - tMax / tMin: rounded maximum and minimum temperatures (°C).
 *   - precip: rounded precipitation total (mm) for the day.
 *   - code: numeric weather code returned by Open-Meteo.
 *   - description: human-friendly short text for the weather code.
 *   - timezone: timezone string returned by the API.
 *
 * @throws {Error} If `dayNumber` is invalid, network request fails, or the
 *   API returns no daily data for the computed date.
 *
 * @example
 * // basic usage (today)
 * const today = await dailyForecast();
 * console.log(today.label, today.tMax, today.description);
 *
 * @example
 * // specific location and tomorrow
 * const coords = { latitude: 40.7128, longitude: -74.0060 }; // New York
 * const tomorrow = await dailyForecast(1, coords);
 *
 */
export async function dailyForecast(dayNumber = 0, coords = defaultCoords) {
  if (typeof dayNumber !== "number" || dayNumber < 0) {
    throw new Error("dayNumber must be a number >= 0");
  }

  // Compute the target date (local time) and format as YYYY-MM-DD
  const target = new Date();
  target.setHours(12, 0, 0, 0); // avoid DST edge cases by using midday
  target.setDate(target.getDate() + dayNumber);

  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, "0");
  const d = String(target.getDate()).padStart(2, "0");
  const dayStr = `${y}-${m}-${d}`;

  const baseUrl = "https://api.open-meteo.com/v1/forecast";
  const daily = "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum";
  const url = `${baseUrl}?latitude=${coords.latitude}&longitude=${coords.longitude}&daily=${daily}&timezone=auto&start_date=${dayStr}&end_date=${dayStr}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not load weather data");
  }
  const json = await response.json();

  if (!json || !json.daily || json.daily.time.length === 0) {
    throw new Error("No daily data for selected date");
  }

  const dd = json.daily;
  const iso = dd.time[0];
  const dateObj = new Date(iso);
  const label = dateObj.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const code = dd.weather_code[0];
  // Map the weather code to simple text (common ones only)
  const codeText = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Heavy rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm + hail",
    99: "Thunderstorm + heavy hail",
  };
  const description = codeText[code] || `Code ${code}`;

  const day = {
    dateISO: iso,
    label: label,
    tMax: Math.round(dd.temperature_2m_max[0]),
    tMin: Math.round(dd.temperature_2m_min[0]),
    precip: Math.round(dd.precipitation_sum[0] || 0),
    code: code,
    description: description,
    timezone: json.timezone,
  };

  return day;
}

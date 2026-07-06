import React, { useEffect, useState } from "react";

/**
 * Simple list of common time zones — আপনি ইচ্ছা করলে এখানে আরো যোগ করতে পারবেন।
 */
const COMMON_ZONES = [
  { label: "Local", timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { label: "UTC", timeZone: "UTC" },
  { label: "New York", timeZone: "America/New_York" },
  { label: "London", timeZone: "Europe/London" },
  { label: "Dhaka", timeZone: "Asia/Dhaka" },
  { label: "Tokyo", timeZone: "Asia/Tokyo" },
  { label: "Sydney", timeZone: "Australia/Sydney" },
];

function formatTime(date, timeZone, hour12 = false) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12,
    timeZone,
  }).format(date);
}

function formatDateShort(date, timeZone) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone,
  }).format(date);
}

export default function DigitalClock({ initial = COMMON_ZONES }) {
  const [zones, setZones] = useState(initial);
  const [now, setNow] = useState(() => new Date());
  const [selected, setSelected] = useState(COMMON_ZONES[0].timeZone);

  // tick every second
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  function addZone(tz) {
    if (!tz) return;
    if (zones.some((z) => z.timeZone === tz)) return;
    const fromList = COMMON_ZONES.find((c) => c.timeZone === tz);
    const label = fromList ? fromList.label : tz;
    setZones((s) => [...s, { label, timeZone: tz }]);
  }

  function removeZone(tz) {
    setZones((s) => s.filter((z) => z.timeZone !== tz));
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">World Clocks</h3>

        <div className="flex items-center gap-2">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="px-2 py-1 border rounded bg-white text-sm"
            aria-label="Select time zone"
          >
            {COMMON_ZONES.map((c) => (
              <option key={c.timeZone} value={c.timeZone}>
                {c.label} — {c.timeZone}
              </option>
            ))}
          </select>
          <button
            onClick={() => addZone(selected)}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {zones.map((z) => (
          <div
            key={z.timeZone}
            className="p-3 bg-white border rounded shadow-sm flex flex-col"
            role="group"
            aria-label={`Clock for ${z.label}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{z.label}</div>
                <div className="text-xs text-gray-400">{z.timeZone}</div>
              </div>
              <button
                onClick={() => removeZone(z.timeZone)}
                className="text-xs text-red-500 hover:underline"
                aria-label={`Remove ${z.label}`}
              >
                Remove
              </button>
            </div>

            <div className="mt-4 flex-1 flex flex-col justify-center">
              <div className="text-2xl md:text-3xl font-mono">
                {formatTime(now, z.timeZone)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatDateShort(now, z.timeZone)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

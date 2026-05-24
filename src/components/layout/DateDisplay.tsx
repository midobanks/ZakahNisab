'use client';

import { useEffect, useState } from 'react';

interface HijriDisplay {
  hijriDisplay: string;
  gregorianDate: string;
  weekday?: string;
}

interface DateDisplayProps {
  className?: string;
}

export function DateDisplay({ className }: DateDisplayProps) {
  const [hijri, setHijri] = useState<HijriDisplay | null>(null);

  useEffect(() => {
    async function fetchDate() {
      try {
        const res = await fetch('/api/hijri/today');
        if (res.ok) {
          const data = await res.json();
          setHijri({
            hijriDisplay: data.hijriDisplay,
            gregorianDate: data.gregorianDate,
            weekday: data.weekday,
          });
        }
      } catch {
        // silently fail
      }
    }
    fetchDate();
  }, []);

  if (!hijri) return null;

  const gregDate = new Date(hijri.gregorianDate + 'T00:00:00');
  const gregFormatted = gregDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <span className={`text-xs text-gray-500 hidden lg:inline ${className ?? ''}`}>
      {hijri.hijriDisplay} &bull; {gregFormatted}
    </span>
  );
}

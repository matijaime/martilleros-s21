import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

interface CalendarEvent {
  title: string;
  start: string;
  location: string;
}

const ICS_URL =
  'https://siglo21.instructure.com/feeds/calendars/user_FBDqJZIuJW2PawnmVhNT98UBKIpZ1mzQB35Jns5o.ics';

export async function GET() {
  try {
    const response = await fetch(ICS_URL, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json({ events: [] }, { status: 200 });
    }

    const text = await response.text();
    const events = parseICS(text);

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] }, { status: 200 });
  }
}

function parseICS(icsText: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const now = new Date();

  // Split into VEVENT blocks
  const blocks = icsText.split('BEGIN:VEVENT');
  blocks.shift(); // remove header before first VEVENT

  for (const block of blocks) {
    const lines = block.split(/\r?\n/);

    let title = '';
    let startStr = '';
    let location = '';

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Handle line folding (continuation lines start with space or tab)
      while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
        i++;
        line += lines[i].substring(1);
      }

      if (line.startsWith('SUMMARY')) {
        title = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('DTSTART')) {
        startStr = line.split(':').slice(1).join(':').trim();
      } else if (line.startsWith('LOCATION')) {
        location = line.split(':').slice(1).join(':').trim();
      }
    }

    if (!title || !startStr) continue;

    const startDate = parseICSDate(startStr);
    if (!startDate || startDate < now) continue;

    events.push({
      title,
      start: startDate.toISOString(),
      location: location || '',
    });
  }

  // Sort by date and return next 5
  return events
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);
}

function parseICSDate(str: string): Date | null {
  try {
    // Format: 20240316T120000Z or 20240316T120000 or 20240316
    const clean = str.replace(/[^0-9TZ]/g, '');
    if (clean.length === 8) {
      // Date only: YYYYMMDD
      const y = clean.slice(0, 4);
      const m = clean.slice(4, 6);
      const d = clean.slice(6, 8);
      return new Date(`${y}-${m}-${d}T00:00:00Z`);
    }
    if (clean.length >= 15) {
      const y = clean.slice(0, 4);
      const mo = clean.slice(4, 6);
      const d = clean.slice(6, 8);
      const h = clean.slice(9, 11);
      const mi = clean.slice(11, 13);
      const s = clean.slice(13, 15);
      const utc = clean.endsWith('Z') ? 'Z' : '';
      return new Date(`${y}-${mo}-${d}T${h}:${mi}:${s}${utc}`);
    }
    return null;
  } catch {
    return null;
  }
}

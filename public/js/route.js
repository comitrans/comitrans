const clamp = (value) => Math.min(1, Math.max(0, value));

// How far down the page the reader is, from 0 at the top to 1 at the very bottom.
export function progress(scrolled, pageHeight, viewHeight) {
  const range = pageHeight - viewHeight;
  return range > 0 ? clamp(scrolled / range) : 0;
}

export const lastStop = (stops, km) => stops.findLast((stop) => stop.km <= km) ?? stops[0];

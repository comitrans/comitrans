const fill = (pattern, values) => pattern.replace(/\{(\w+)\}/g, (_, key) => values[key]);

export function formatDate(iso, strings) {
  const [year, month, day] = iso.split("-").map(Number);
  return fill(strings.date, { d: day, m: month, month: strings.months[month - 1], y: year });
}

function when({ date, time }, strings) {
  if (date && time) return `${formatDate(date, strings)} ${strings.at} ${time}`;
  return date ? formatDate(date, strings) : time;
}

function route({ route, direction }, strings, routes) {
  const airport = routes[route];
  if (!airport) return "";
  return direction === "from" ? `${airport} → ${strings.base}` : `${strings.base} → ${airport}`;
}

// The message a customer sends: a greeting, then one line for each thing they filled in.
export function buildMessage(trip, strings, routes) {
  const lines = [
    [strings.route, route(trip, strings, routes)],
    [strings.when, when(trip, strings)],
    [strings.address, trip.address],
    [strings.destination, trip.destination],
    [strings.passengers, trip.passengers],
    [strings.luggage, trip.luggage],
    [strings.flight, trip.flight],
    [strings.name, trip.name],
    [strings.note, trip.note],
  ];
  return [
    strings.greeting,
    ...lines.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`),
  ].join("\n");
}

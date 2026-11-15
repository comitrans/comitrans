const digits = (number) => number.replace(/\D/g, "");

function withQuery(base, params, separator = "?") {
  const query = Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return query ? base + separator + query : base;
}

export const callLink = (number) => `tel:+${digits(number)}`;

export const whatsappLink = (number, text) =>
  withQuery(`https://wa.me/${digits(number)}`, { text });

export const viberLink = (number, text) =>
  withQuery(`viber://chat?number=%2B${digits(number)}`, { draft: text }, "&");

export const mailLink = (address, subject, body) =>
  withQuery(`mailto:${address}`, { subject, body });

// Which other language to offer a visitor, if any: the one their browser asks
// for when this page is not in it, else the fallback when they read neither.
export function suggestion(preferred, page, others, fallback) {
  if (page.speakers.includes(preferred)) return null;
  const match = others.find(({ speakers }) => speakers.includes(preferred));
  if (match) return match.code;
  return page.code === fallback ? null : fallback;
}

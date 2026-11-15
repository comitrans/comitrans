const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

class Markup {
  constructor(text) {
    this.text = text;
  }

  toString() {
    return this.text;
  }
}

export const escape = (value) => String(value).replace(/[&<>"]/g, (char) => ESCAPES[char]);

export const raw = (text) => new Markup(String(text));

function piece(value) {
  if (value === null || value === undefined || typeof value === "boolean") return "";
  if (value instanceof Markup) return value.text;
  if (Array.isArray(value)) return value.map(piece).join("");
  return escape(value);
}

// Every interpolated value is escaped unless it is itself markup, so content
// can never inject a tag.
export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += piece(values[i]) + strings[i + 1];
  return new Markup(out);
}

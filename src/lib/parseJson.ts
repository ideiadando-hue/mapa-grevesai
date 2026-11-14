export function parseJsonTolerante<T = unknown>(texto: string): T {
  const limpo = texto.replace(/^\uFEFF/, '');

  try {
    return JSON.parse(limpo) as T;
  } catch {
    let out = '';
    let inStr = false;
    let esc = false;

    for (let i = 0; i < limpo.length; i++) {
      const c = limpo[i];

      if (esc) {
        out += c;
        esc = false;
        continue;
      }

      if (c === '\\') {
        out += c;
        esc = true;
        continue;
      }

      if (c === '"') {
        if (!inStr) {
          inStr = true;
          out += c;
          continue;
        }

        const rest = limpo.slice(i + 1).trimStart();

        if (rest[0] === ',' || rest[0] === '}' || rest[0] === ']' || rest[0] === ':') {
          inStr = false;
          out += c;
        } else {
          out += '\\"';
        }
        continue;
      }

      out += c;
    }

    return JSON.parse(out) as T;
  }
}
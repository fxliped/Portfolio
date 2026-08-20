/**
 * Tiny build-time pixel-art renderer.
 *
 * Scenes are authored on a small integer grid — one cell per art "pixel" — then
 * emitted as inline SVG. Two things make that practical:
 *
 * 1. **Run-length encoding.** One `<rect>` per pixel is 8,000+ nodes for a
 *    192×44 scene, which is hundreds of kB of HTML. `rects()` merges each row
 *    into horizontal runs of one colour, which collapses a banded scene like a
 *    sunset by roughly 20×.
 * 2. **Palette keys, not colours.** A cell holds a key such as `"sky2"`; the
 *    component maps keys to CSS custom properties, so a scene re-themes with
 *    the rest of the site instead of needing a second exported asset.
 *
 * Runs at build time only — no client JS ships for any of this.
 */

/** `grid[y][x]` is a palette key, or "" for transparent. */
export type Grid = string[][];

export function makeGrid(w: number, h: number): Grid {
  return Array.from({ length: h }, () => Array.from({ length: w }, () => ""));
}

export function setPx(grid: Grid, x: number, y: number, key: string): void {
  if (y < 0 || y >= grid.length) return;
  if (x < 0 || x >= grid[0].length) return;
  grid[y][x] = key;
}

/**
 * Stamp a sprite. A sprite is rows of characters; each character is looked up in
 * `map` to get a palette key. Any character missing from `map` — space or `.` by
 * convention — leaves the cell untouched, so sprites composite over a scene.
 */
export function blit(
  grid: Grid,
  sprite: readonly string[],
  x0: number,
  y0: number,
  map: Record<string, string>,
): void {
  sprite.forEach((row, dy) => {
    for (let dx = 0; dx < row.length; dx++) {
      const key = map[row[dx]];
      if (key) setPx(grid, x0 + dx, y0 + dy, key);
    }
  });
}

export function fillRect(
  grid: Grid,
  x0: number,
  y0: number,
  w: number,
  h: number,
  key: string,
): void {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) setPx(grid, x, y, key);
  }
}

/**
 * Outlined rectangle — fill first, then trace the border over it.
 *
 * Worth having rather than hand-plotting rows of `#`: a rectangle authored as
 * character art has to be counted by hand on every row, and an off-by-one is
 * invisible in the source and obvious on the page.
 */
export function box(
  grid: Grid,
  x0: number,
  y0: number,
  w: number,
  h: number,
  line: string,
  fill: string,
): void {
  fillRect(grid, x0, y0, w, h, fill);
  for (let x = x0; x < x0 + w; x++) {
    setPx(grid, x, y0, line);
    setPx(grid, x, y0 + h - 1, line);
  }
  for (let y = y0; y < y0 + h; y++) {
    setPx(grid, x0, y, line);
    setPx(grid, x0 + w - 1, y, line);
  }
}

/** Filled raster circle. `squash` < 1 flattens it into an ellipse. */
export function disc(
  grid: Grid,
  cx: number,
  cy: number,
  r: number,
  key: string,
  squash = 1,
  clipBelow?: number,
): void {
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
    if (clipBelow !== undefined && y > clipBelow) continue;
    for (let x = Math.floor(cx - r / squash); x <= Math.ceil(cx + r / squash); x++) {
      const dx = (x - cx) * squash;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r * r) setPx(grid, x, y, key);
    }
  }
}

/**
 * Ordered 4×4 Bayer dither. Returns true when a cell should take the *second*
 * colour of a pair, given a blend amount 0–1. Using a fixed matrix rather than
 * randomness keeps the build byte-identical every time — a random scene would
 * churn the diff on every deploy.
 */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export function dither(x: number, y: number, amount: number): boolean {
  return amount > (BAYER[y & 3][x & 3] + 0.5) / 16;
}

export interface Run {
  x: number;
  y: number;
  w: number;
  key: string;
}

/**
 * Collapse a grid to one `<path>` per palette key.
 *
 * Prefer this over `rects()` for anything dithered. A stippled row breaks into
 * single-cell runs, and one `<rect>` element each cost ~60 bytes of markup and a
 * DOM node — a dithered 192×46 scene came out at 340 kB of HTML. As path
 * subpaths the same runs cost ~14 bytes and collapse to a handful of elements.
 */
export function paths(grid: Grid): { key: string; d: string }[] {
  const byKey = new Map<string, string[]>();
  for (const r of rects(grid)) {
    const list = byKey.get(r.key) ?? [];
    list.push(`M${r.x} ${r.y}h${r.w}v1h-${r.w}z`);
    byKey.set(r.key, list);
  }
  return [...byKey].map(([key, parts]) => ({ key, d: parts.join("") }));
}

/** Merge each row into horizontal runs of a single palette key. */
export function rects(grid: Grid): Run[] {
  const out: Run[] = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const key = row[x];
      if (!key) {
        x++;
        continue;
      }
      let w = 1;
      while (x + w < row.length && row[x + w] === key) w++;
      out.push({ x, y, w, key });
      x += w;
    }
  });
  return out;
}

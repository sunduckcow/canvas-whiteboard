import { Point } from "./machine";

export const len2 = (p1: Point, p2: Point) =>
  Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
export const lenM = (p1: Point, p2: Point) =>
  Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);

export const near = (p1: Point, p2: Point, d = 20) => lenM(p1, p2) < d;
export const nearTo = (p1: Point) => (p2: Point) => near(p1, p2);

export const hasNear = (ps: Point[], p: Point) => Boolean(ps.find(nearTo(p)));
export const findNearIndex = (ps: Point[], p: Point) => {
  return ps.findIndex(nearTo(p));
};

export const findNear = (ps: Point[], p: Point) => {
  const idx = findNearIndex(ps, p);
  return [idx, idx >= 0 ? ps[idx] : null] as const;
};

export const inReact = (p: Point, r1: Point, r2: Point) => {
  const x1 = Math.min(r1.x, r2.x);
  const x2 = Math.max(r1.x, r2.x);
  const y1 = Math.min(r1.y, r2.y);
  const y2 = Math.max(r1.y, r2.y);
  return p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2;
};

export const pointToString = (p: Point) =>
  `(${Math.round(p.x)}, ${Math.round(p.y)})`;

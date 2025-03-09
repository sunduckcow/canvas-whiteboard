import { minmax } from "./minmax";
import { Position } from "@/hooks/useGestures";

function* interval(base: number, step: number, begin: number, end: number) {
  const start = base + step * Math.ceil((begin - base) / step);
  for (let i = start; i < end; i += step) yield i;
}

export interface XoyProps extends Position {
  width: number;
  height: number;
  step?: number;
  offset?: number;
}

export function getTools(ctx: CanvasRenderingContext2D) {
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
  };

  const cross = (x: number, y: number, r = 10) => {
    line(x - r, y - r, x + r, y + r);
    line(x - r, y + r, x + r, y - r);
  };

  const circle = (x: number, y: number, radius = 10) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
  };

  const rect = (x1: number, y1: number, x2: number, y2: number) => {
    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.closePath();
    ctx.stroke();
  };

  const grid = (
    startX: number,
    startY: number,
    width: number,
    height: number,
    cellSize: number
  ) => {
    const endX = startX + width;
    const endY = startY + height;

    for (let x = startX; x <= endX; x += cellSize) {
      line(x, startY, x, endY);
    }

    for (let y = startY; y <= endY; y += cellSize) {
      line(startX, y, endX, y);
    }
  };

  const arrow = function (x0: number, y0: number, x1: number, y1: number) {
    const headLength = 10;
    const offsetAngle = Math.PI / 6;

    const angle = Math.atan2(y1 - y0, x1 - x0);

    const x2 = x1 - headLength * Math.cos(angle - offsetAngle);
    const y2 = y1 - headLength * Math.sin(angle - offsetAngle);
    const x3 = x1 - headLength * Math.cos(angle + offsetAngle);
    const y3 = y1 - headLength * Math.sin(angle + offsetAngle);

    line(x0, y0, x1, y1);
    line(x1, y1, x2, y2);
    line(x1, y1, x3, y3);
  };

  const xoy = ({
    width,
    height,
    x,
    y,
    z,
    step = 10,
    offset = 20,
  }: XoyProps) => {
    const xAxisStart = offset;
    const xAxisEnd = width - offset;
    const yAxisStart = offset;
    const yAxisEnd = height - offset;

    const xAxisPos = minmax(yAxisStart, y, yAxisEnd);
    const yAxisPos = minmax(xAxisStart, x, xAxisEnd);

    arrow(xAxisStart, xAxisPos, xAxisEnd, xAxisPos);
    arrow(yAxisPos, yAxisStart, yAxisPos, yAxisEnd);
    // circle(x, y, ((size * z) / 5) * 2);

    for (const dashX of interval(x, step * z, xAxisStart, xAxisEnd))
      line(dashX, xAxisPos - 5, dashX, xAxisPos + 5);

    for (const dashY of interval(y, step * z, yAxisStart, yAxisEnd))
      line(yAxisPos - 5, dashY, yAxisPos + 5, dashY);
  };

  return {
    line,
    cross,
    circle,
    rect,
    grid,
    arrow,
    xoy,
  };
}

export type Tools = ReturnType<typeof getTools>;

export type LinearRepeat = [beg: number, step: number, end: number];
export function doGrid(
  [begX, stepX, endX]: LinearRepeat,
  [begY, stepY, endY]: LinearRepeat,
  cb: (x: number, y: number) => void
) {
  for (let x = begX; x <= endX; x += stepX) {
    for (let y = begY; y <= endY; y += stepY) {
      cb(x, y);
    }
  }
}

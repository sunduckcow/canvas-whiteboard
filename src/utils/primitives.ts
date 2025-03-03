export function getPrimitives(ctx: CanvasRenderingContext2D) {
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

  const filledCircle = (x: number, y: number, radius = 10) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  };

  const rectangle = (x: number, y: number, width: number, height: number) => {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();
    ctx.stroke();
  };

  const filledRectangle = (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();
    ctx.fill();
  };

  const triangle = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.stroke();
  };

  const filledTriangle = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
  };

  const arc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
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

  return {
    line,
    cross,
    circle,
    filledCircle,
    rectangle,
    filledRectangle,
    triangle,
    filledTriangle,
    arc,
    grid,
  };
}

type LinearRepeat = [beg: number, step: number, end: number];
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

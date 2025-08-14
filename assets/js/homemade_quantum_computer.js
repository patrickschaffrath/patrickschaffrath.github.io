import {
  pairwise,
  reduce,
} from "https://cdn.jsdelivr.net/npm/itertools@2.4.1/+esm";

document.addEventListener("DOMContentLoaded", () => {
  const worker = new Worker("/assets/js/convex_hulls_worker.js", {
    type: "module",
  });

  const vertices = Array.from({ length: 50 }, () => {
    const xs = Array.from({ length: 2 }, () => {
      return Math.random();
    });
    const ys = Array.from({ length: 3 }, () => {
      return Math.random();
    });
    const x = closestToCenter(xs);
    const y = closestToCenter(ys);

    return [x, y];
  });

  const canvas = document.getElementById("plot-convex-hulls");
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  // Set the canvas internal pixel buffer to match CSS * DPR
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  // Reset transform then scale so we can keep drawing in CSS pixels
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  worker.onmessage = (e) => {
    const { hulls } = e.data;

    drawHullsWithEdgesByCount(ctx, hulls, rect.width, rect.height);
  };

  worker.postMessage({ vertices });
});

function closestToCenter(vertices) {
  return reduce(
    vertices,
    (acc, cur) => {
      const a = Math.abs(acc - 0.5);
      const b = Math.abs(cur - 0.5);
      if (a < b) {
        return acc;
      }
      return cur;
    },
    1
  );
}

function drawHullsWithEdgesByCount(ctx, hulls, width, height) {
  const counts = new Map();
  let maxCount = 0;

  hulls.forEach((vertices) => {
    if (vertices.length === 0) return;
    const edges = pairwise(vertices.concat([vertices[0]]));
    edges.forEach(([v1, v2]) => {
      // normalize edge direction so (A,B) == (B,A)
      const key = JSON.stringify(
        v1[0] < v2[0] || (v1[0] === v2[0] && v1[1] <= v2[1])
          ? [v1, v2]
          : [v2, v1]
      );
      const count = (counts.get(key) || 0) + 1;
      counts.set(key, count);
      if (count > maxCount) {
        maxCount = count;
      }
    });
  });

  ctx.lineWidth = 1;
  counts.forEach((count, key) => {
    const [v1, v2] = JSON.parse(key);
    const alpha = alphaFromCount(count, maxCount);
    ctx.strokeStyle = `rgba(${192 * alpha}, 64, 255, ${alpha})`;

    ctx.beginPath();
    ctx.moveTo(v1[0] * width, v1[1] * height);
    ctx.lineTo(v2[0] * width, v2[1] * height);
    ctx.stroke();
  });
}

function alphaFromCount(count, maxCount) {
  if (count === maxCount) {
    return 1;
  }
  const base = 0.9;
  const floor = 0.02;
  // max -> 1, (max-1) -> base, (max-20) -> base^2
  const stepsBelow = Math.max(0, maxCount - count);
  const a = Math.pow(base, Math.max(1, stepsBelow / 10));
  return Math.max(floor, Math.min(1, a));
}

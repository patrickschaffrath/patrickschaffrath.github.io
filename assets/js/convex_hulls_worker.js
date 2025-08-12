import G from "https://cdn.jsdelivr.net/npm/generatorics@1.1.0/+esm";
import { map, sum } from "https://cdn.jsdelivr.net/npm/itertools@2.4.1/+esm";

self.onmessage = (e) => {
  const { vertices } = e.data;

  const hulls = convexHulls(vertices);

  self.postMessage({ hulls });
};

function convexHulls(vertices) {
  return map(G.combination(vertices, 4), convexHull);
}

function convexHull([a, b, c, d]) {
  let crossProductSigns = map(
    [
      [a, b, c],
      [b, c, d],
      [c, d, a],
      [d, a, b],
    ],
    crossProductSign
  );
  if (Math.abs(sum(crossProductSigns)) === 4) {
    return [a, b, c, d];
  }
  if (
    Math.abs(
      crossProductSigns[0] + crossProductSigns[1] + crossProductSigns[2]
    ) === 3
  ) {
    return [b, c, d];
  }
  if (
    Math.abs(
      crossProductSigns[1] + crossProductSigns[2] + crossProductSigns[3]
    ) === 3
  ) {
    return [c, d, a];
  }
  if (
    Math.abs(
      crossProductSigns[2] + crossProductSigns[3] + crossProductSigns[0]
    ) === 3
  ) {
    return [d, a, b];
  }
  if (
    Math.abs(
      crossProductSigns[3] + crossProductSigns[0] + crossProductSigns[1]
    ) === 3
  ) {
    return [a, b, c];
  }

  crossProductSigns = map(
    [
      [a, b, d],
      [b, d, c],
      [d, c, a],
      [c, a, b],
    ],
    crossProductSign
  );
  if (Math.abs(sum(crossProductSigns)) === 4) {
    return [a, b, d, c];
  }
  if (
    Math.abs(
      crossProductSigns[0] + crossProductSigns[1] + crossProductSigns[2]
    ) === 3
  ) {
    return [b, d, c];
  }
  if (
    Math.abs(
      crossProductSigns[1] + crossProductSigns[2] + crossProductSigns[3]
    ) === 3
  ) {
    return [d, c, a];
  }
  if (
    Math.abs(
      crossProductSigns[2] + crossProductSigns[3] + crossProductSigns[0]
    ) === 3
  ) {
    return [c, a, b];
  }
  if (
    Math.abs(
      crossProductSigns[3] + crossProductSigns[0] + crossProductSigns[1]
    ) === 3
  ) {
    return [a, b, d];
  }

  crossProductSigns = map(
    [
      [a, c, b],
      [c, b, d],
      [b, d, a],
      [d, a, c],
    ],
    crossProductSign
  );
  if (Math.abs(sum(crossProductSigns)) === 4) {
    return [a, c, b, d];
  }
  if (
    Math.abs(
      crossProductSigns[0] + crossProductSigns[1] + crossProductSigns[2]
    ) === 3
  ) {
    return [c, b, d];
  }
  if (
    Math.abs(
      crossProductSigns[1] + crossProductSigns[2] + crossProductSigns[3]
    ) === 3
  ) {
    return [b, d, a];
  }
  if (
    Math.abs(
      crossProductSigns[2] + crossProductSigns[3] + crossProductSigns[0]
    ) === 3
  ) {
    return [d, a, c];
  }
  if (
    Math.abs(
      crossProductSigns[3] + crossProductSigns[0] + crossProductSigns[1]
    ) === 3
  ) {
    return [a, c, b];
  }

  return [];
}

function crossProductSign([p, q, r]) {
  const crossProduct =
    (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  if (crossProduct > 0) {
    return 1;
  }
  if (crossProduct < 0) {
    return -1;
  }
  return 0;
}

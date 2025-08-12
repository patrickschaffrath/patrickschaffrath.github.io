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
  const orientations = [
    [
      [a, b, c],
      [b, c, d],
      [c, d, a],
      [d, a, b],
    ],
    [
      [a, b, d],
      [b, d, c],
      [d, c, a],
      [c, a, b],
    ],
    [
      [a, c, b],
      [c, b, d],
      [b, d, a],
      [d, a, c],
    ],
  ];

  const crossProductSignsByOrientations = map(orientations, (orientation) => {
    return map(orientation, crossProductSign);
  });

  // Check for four vertex convex hull.
  for (let i = 0; i < 3; i++) {
    if (Math.abs(sum(crossProductSignsByOrientations[i])) === 4) {
      // Hull of four vertices, for example [...[a, b, c], d].
      return [...orientations[i][0], orientations[i][3][0]];
    }
  }

  // Check for three vertex convex hull.
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (
        Math.abs(
          crossProductSignsByOrientations[i][j] +
            crossProductSignsByOrientations[i][(j + 1) % 4] +
            crossProductSignsByOrientations[i][(j + 2) % 4]
        ) === 3
      ) {
        // Hull of three vertices, for example [d, a, c].
        return orientations[i][(j + 1) % 4];
      }
    }
  }

  // Default for degenerate hull.
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

/**
 * @file Seeded pseudo-random numbers.
 *
 * Simulated run scripts are built from a seed so the builders stay pure and a
 * stored run can always be explained by its seed.
 */

/**
 * Creates a deterministic random generator (mulberry32).
 *
 * @param {number} seed 32-bit integer seed.
 * @returns {{ next: () => number, int: (min: number, max: number) => number, pick: <T>(items: T[]) => T }}
 *   `next` returns [0, 1); `int` an integer in [min, max]; `pick` a random element.
 */
export function createRandom(seed) {
  let value = seed >>> 0;
  const next = () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (items) => items[Math.floor(next() * items.length)]
  };
}

/**
 * A fresh random seed for a new run.
 *
 * @returns {number}
 */
export function createSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}

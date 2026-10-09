import { buildIntervals, keepLocksThatFit, locksFit } from "./pacecalc";
import type { Units } from "./models";
import { distances, metersPerMile } from "./models";

const marathon = distances["Marathon"];
const THREE_HOURS = 3 * 60 * 60;

const sum = (values: number[]) => values.reduce((l, r) => l + r, 0);

describe("buildIntervals", () => {
  describe("with no locked splits", () => {
    test("a marathon in miles has 26 full splits and a short last one", () => {
      const result = buildIntervals(marathon, THREE_HOURS, "mi", new Map());

      expect(result.intervals).toHaveLength(27);
      result.intervals
        .slice(0, 26)
        .forEach((i) => expect(i.distance).toBeCloseTo(metersPerMile, 1));
      expect(result.intervals[26].distance).toBeCloseTo(
        42195 - 26 * metersPerMile,
        1,
      );
    });

    test("a marathon in km has 42 full splits and a 195 m last one", () => {
      const result = buildIntervals(marathon, THREE_HOURS, "km", new Map());

      expect(result.intervals).toHaveLength(43);
      result.intervals
        .slice(0, 42)
        .forEach((i) => expect(i.distance).toBe(1000));
      expect(result.intervals[42].distance).toBe(195);
    });

    test("every full split takes the same time", () => {
      const result = buildIntervals(marathon, THREE_HOURS, "mi", new Map());

      // 3:00:00 for 42.195 km is 6:51.9 per mile
      result.intervals
        .slice(0, 26)
        .forEach((i) => expect(i.time).toBeCloseTo(411.9, 1));
      expect(result.intervals.every((i) => !i.locked)).toBe(true);
    });

    test("split times add up to the goal time", () => {
      const result = buildIntervals(marathon, THREE_HOURS, "mi", new Map());

      // each split is rounded to a tenth of a second, so the sum can drift by a second or so
      expect(
        Math.abs(sum(result.intervals.map((i) => i.time)) - THREE_HOURS),
      ).toBeLessThan(1.5);
      expect(result.intervals[26].cumulativeTime).toBeCloseTo(THREE_HOURS, 0);
      expect(result.intervals[26].cumulativeDistance).toBeCloseTo(42195, 0);
    });

    test("splits are numbered from zero and accumulate", () => {
      const result = buildIntervals(distances["5K"], 1200, "km", new Map());

      expect(result.intervals.map((i) => i.num)).toEqual([0, 1, 2, 3, 4]);
      expect(result.intervals.map((i) => i.cumulativeDistance)).toEqual([
        1000, 2000, 3000, 4000, 5000,
      ]);
      expect(result.intervals.map((i) => i.cumulativeTime)).toEqual([
        240, 480, 720, 960, 1200,
      ]);
    });

    test("remembers what it was built from", () => {
      const result = buildIntervals(marathon, THREE_HOURS, "km", new Map());

      expect(result.distance).toBe(marathon);
      expect(result.totalTime).toBe(THREE_HOURS);
      expect(result.units).toBe("km");
    });
  });

  describe("with locked splits", () => {
    test("a locked split keeps its time and the others share what is left", () => {
      // 5K in 20:00 is 4:00 per km. Lock the first km at 5:00.
      const result = buildIntervals(
        distances["5K"],
        1200,
        "km",
        new Map([[0, 300]]),
      );

      expect(result.intervals[0].time).toBe(300);
      expect(result.intervals[0].locked).toBe(true);
      // the remaining 15:00 is spread over the other four
      result.intervals.slice(1).forEach((i) => {
        expect(i.time).toBe(225);
        expect(i.locked).toBe(false);
      });
      expect(sum(result.intervals.map((i) => i.time))).toBe(1200);
    });

    test("several splits can be locked", () => {
      const result = buildIntervals(
        distances["5K"],
        1200,
        "km",
        new Map([
          [0, 300],
          [4, 200],
        ]),
      );

      expect(result.intervals.map((i) => i.time)).toEqual([
        300, 233.3, 233.3, 233.3, 200,
      ]);
      expect(result.intervals.map((i) => i.locked)).toEqual([
        true,
        false,
        false,
        false,
        true,
      ]);
    });

    test("the slowest split is found", () => {
      const result = buildIntervals(
        distances["5K"],
        1200,
        "km",
        new Map([[2, 400]]),
      );

      expect(result.slowest.num).toBe(2);
      expect(result.slowest.time).toBe(400);
    });

    test("a lock on a split that does not exist is dropped", () => {
      const fixed = new Map([
        [0, 300],
        [99, 100],
      ]);
      const result = buildIntervals(distances["5K"], 1200, "km", fixed);

      expect(result.intervals).toHaveLength(5);
      expect(Array.from(result.fixed.keys())).toEqual([0]);
    });
  });

  describe("for every distance, in both units", () => {
    const cases = Object.values(distances).flatMap((d) =>
      (["mi", "km"] as Units[]).flatMap((units) =>
        [d.worldRecord, d.defaultTime, d.defaultTime * 2].map((totalTime) => ({
          name: d.name,
          d,
          units,
          totalTime,
        })),
      ),
    );

    test.each(cases)(
      "$name in $units in $totalTime s is split cleanly",
      ({ d, units, totalTime }) => {
        const result = buildIntervals(d, totalTime, units, new Map());
        const splitLength = units === "mi" ? metersPerMile : 1000;

        // One split per full unit, plus one for any remainder, and nothing extra. A remainder
        // under a metre is not a split: 5M and 10M are defined a fraction of a metre over.
        expect(result.intervals).toHaveLength(
          Math.ceil((d.distance - 1) / splitLength),
        );
        result.intervals.forEach((i) => {
          expect(Number.isFinite(i.time)).toBe(true);
          expect(Number.isFinite(i.distance)).toBe(true);
          expect(i.time).toBeGreaterThan(0);
        });
        // each split is rounded to a tenth of a metre and a tenth of a second, so allow that much drift per split
        const rounding = 0.05 * result.intervals.length + 0.1;
        expect(
          Math.abs(sum(result.intervals.map((i) => i.distance)) - d.distance),
        ).toBeLessThan(rounding + 1);
        expect(
          Math.abs(sum(result.intervals.map((i) => i.time)) - totalTime),
        ).toBeLessThan(rounding);
      },
    );
  });
});

describe("locksFit", () => {
  // 5K in 20:00 averages 4:00 per km, so no split may be faster than 2:00 (120 s).
  const fiveK = distances["5K"];
  const fits = (locks: [number, number][]) =>
    locksFit(fiveK, 1200, "km", new Map(locks));

  test("no locks fit", () => {
    expect(fits([])).toBe(true);
  });

  test("an ordinary lock fits", () => {
    expect(fits([[0, 300]])).toBe(true);
  });

  test("a lock may slow a split until the others are twice as fast as average", () => {
    // the other four need at least 4 x 120 = 480 s, leaving 720 s
    expect(fits([[0, 720]])).toBe(true);
    expect(fits([[0, 721]])).toBe(false);
  });

  test("a lock may not be more than twice as fast as average", () => {
    expect(fits([[0, 120]])).toBe(true);
    expect(fits([[0, 119]])).toBe(false);
    expect(fits([[0, 0]])).toBe(false);
    expect(fits([[0, -10]])).toBe(false);
  });

  test("a lock longer than the whole race does not fit", () => {
    expect(fits([[0, 1300]])).toBe(false);
  });

  test("at least one split has to stay unlocked", () => {
    expect(
      fits([
        [0, 240],
        [1, 240],
        [2, 240],
        [3, 240],
      ]),
    ).toBe(true);
    expect(
      fits([
        [0, 240],
        [1, 240],
        [2, 240],
        [3, 240],
        [4, 240],
      ]),
    ).toBe(false);
  });

  test("a lock on a split that does not exist does not fit", () => {
    expect(fits([[5, 240]])).toBe(false);
    expect(fits([[-1, 240]])).toBe(false);
    expect(fits([[1.5, 240]])).toBe(false);
  });

  test("a lock that is not a number does not fit", () => {
    expect(fits([[0, NaN]])).toBe(false);
    expect(fits([[0, Infinity]])).toBe(false);
  });

  test("the leftover fraction of a metre in 5M does not count as an unlocked split", () => {
    // 5M is defined as 8047 m, a fraction over five miles
    const allFive: [number, number][] = [0, 1, 2, 3, 4].map((n) => [n, 420]);
    expect(locksFit(distances["5M"], 2100, "mi", new Map(allFive))).toBe(false);
    expect(
      locksFit(distances["5M"], 2100, "mi", new Map(allFive.slice(1))),
    ).toBe(true);
  });

  test.each([
    ["faster than the world record", 600],
    ["the world record itself", distances["5K"].worldRecord],
    ["very slow", 3600],
  ])("the limits scale with the goal: %s", (_name, totalTime) => {
    const even = totalTime / 5;
    const fitsGoal = (locks: [number, number][]) =>
      locksFit(fiveK, totalTime, "km", new Map(locks));

    // a split can always be moved a little either way
    expect(fitsGoal([[0, Math.round(even * 1.2)]])).toBe(true);
    expect(fitsGoal([[0, Math.round(even * 0.8)]])).toBe(true);
    // and never to less than half the average
    expect(fitsGoal([[0, Math.floor(even * 0.5) - 1]])).toBe(false);
  });

  test("a goal of no time at all accepts no locks", () => {
    expect(locksFit(fiveK, 0, "km", new Map())).toBe(true);
    expect(locksFit(fiveK, 0, "km", new Map([[0, 10]]))).toBe(false);
  });
});

describe("keepLocksThatFit", () => {
  const fiveK = distances["5K"];
  const keep = (locks: [number, number][]) =>
    Array.from(keepLocksThatFit(fiveK, 1200, "km", new Map(locks)));

  test("keeps locks that fit", () => {
    expect(
      keep([
        [0, 300],
        [4, 200],
      ]),
    ).toEqual([
      [0, 300],
      [4, 200],
    ]);
  });

  test("drops a lock that cannot be run", () => {
    expect(keep([[0, 1300]])).toEqual([]);
    expect(keep([[0, 0]])).toEqual([]);
    expect(keep([[9, 240]])).toEqual([]);
  });

  test("drops only the locks that do not fit alongside the earlier ones", () => {
    // after the first lock, a second 500 would leave 200 s for three km: too fast
    expect(
      keep([
        [0, 500],
        [1, 500],
        [2, 150],
      ]),
    ).toEqual([
      [0, 500],
      [2, 150],
    ]);
  });

  test("leaves one split unlocked when every split is locked", () => {
    const all: [number, number][] = [0, 1, 2, 3, 4].map((n) => [n, 240]);
    expect(keep(all)).toEqual(all.slice(0, 4));
  });

  test("what it keeps can always be built without losing a split", () => {
    const awkward: [number, number][][] = [
      [[0, 1300]],
      [
        [0, 200],
        [1, 200],
        [2, 200],
        [3, 200],
        [4, 200],
      ],
      [
        [0, 300],
        [1, 300],
        [2, 300],
        [3, 300],
      ],
      [[0, 0]],
    ];
    for (const locks of awkward) {
      const result = buildIntervals(fiveK, 1200, "km", new Map(keep(locks)));
      expect(result.intervals).toHaveLength(5);
      result.intervals.forEach((i) =>
        expect(i.time).toBeGreaterThanOrEqual(120),
      );
      expect(sum(result.intervals.map((i) => i.time))).toBeCloseTo(1200, 0);
    }
  });
});

describe("buildIntervals with locks that do not fit", () => {
  test("does not fail, even though the result is not meaningful", () => {
    const all = new Map([0, 1, 2, 3, 4].map((n) => [n, 200]));
    expect(() =>
      buildIntervals(distances["5K"], 1200, "km", all),
    ).not.toThrow();
  });
});

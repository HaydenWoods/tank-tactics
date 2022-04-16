import { DateTime } from "luxon";

export const factors = (number: number) => {
  const isEven = number % 2 === 0;
  const max = Math.sqrt(number);
  const inc = isEven ? 1 : 2;

  let factors = [1, number];
  for (let curFactor = isEven ? 2 : 3; curFactor <= max; curFactor += inc) {
    if (number % curFactor !== 0) continue;
    factors.push(curFactor);
    let compliment = number / curFactor;
    if (compliment !== curFactor) factors.push(compliment);
  }

  return factors;
};

export const randomDate = (start: DateTime, end: DateTime) => {
  return DateTime.fromJSDate(
    new Date(
      start.toJSDate().getTime() +
        Math.random() * (end.toJSDate().getTime() - start.toJSDate().getTime())
    )
  );
};

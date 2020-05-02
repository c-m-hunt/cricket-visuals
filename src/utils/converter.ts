import { BatsmanInnings } from './../cricketTypes';

export const convertInningsToRunsAndNOs = (data: (string | number)[]): BatsmanInnings[] => {
  return data.map((d) => {
    const notOut = d.toString().endsWith('*');
    const runs = parseInt(d.toString().replace('*', ''), 10);
    return [runs, notOut];
  });
};

export const convertBallsToProgressiveRunRate = (data: number[]): number[] => {
  let runningTotal = 0;
  return data.map((b, i) => {
    runningTotal += b;
    return (runningTotal / (i + 1)) * 100;
  });
};

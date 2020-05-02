import { BatsmanInnings } from './../cricketTypes';

export const convertInningsToRunsAndNOs = (data: (string | number)[]): BatsmanInnings[] => {
  return data.map((d) => {
    const notOut = d.toString().endsWith('*');
    const runs = parseInt(d.toString().replace('*', ''), 10);
    return [runs, notOut];
  });
};

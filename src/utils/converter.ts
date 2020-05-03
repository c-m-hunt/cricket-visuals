import { BatsmanInnings } from './../cricketTypes';
import { InningsContributionData } from './../charts/inningsContrubition';

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

export const convertInningsContributionToHierarchy = (data: InningsContributionData) => {
  let hierachyData: any = { name: data.teamName, children: [] };

  for (const batName in data.batsmen) {
    let batData: any = {
      name: batName,
      children: [],
    };
    for (const bowlerName in data.batsmen[batName].bowlers) {
      batData.children.push({
        name: bowlerName,
        value: data.batsmen[batName].bowlers[bowlerName],
      });
    }
    hierachyData.children.push(batData);
  }
  return hierachyData;
};

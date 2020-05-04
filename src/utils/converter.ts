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
  const hierachyData: any = { name: data.teamName, children: [] };

  for (const batName of Object.keys(data.batsmen)) {
    const batData: any = {
      name: batName,
      children: [],
    };
    if (data.batsmen[batName].bowlers) {
      // @ts-ignore
      for (const bowlerName of Object.keys(data.batsmen[batName].bowlers)) {
        batData.children.push({
          name: bowlerName,
          // @ts-ignore
          value: data.batsmen[batName].bowlers[bowlerName],
        });
      }
    } else {
      delete batData.children;
      batData.value = data.batsmen[batName].score ? data.batsmen[batName].score : 0
    }
    hierachyData.children.push(batData);
  }
  return hierachyData;
};

export const convertRequiredRunsAndBallsToRequiredStrikeRate = (data: [number, number][]): number[] => {
  return data.map(b => (b[0] / b[1]) * 100)
}
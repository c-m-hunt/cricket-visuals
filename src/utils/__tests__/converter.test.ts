import {
  convertInningsToRunsAndNOs,
  convertBallsToProgressiveRunRate,
  convertInningsContributionToHierarchy,
  convertRequiredRunsAndBallsToRequiredStrikeRate,
} from '../converter';
import { InningsContributionData } from '../../charts/inningsContrubition';

describe('converts stuff', () => {
  test('it converts innings to runs and not outs', () => {
    const data = [1, 50, '33*', '33', '0*', 0, '0'];
    const expectedOut = [
      [1, false],
      [50, false],
      [33, true],
      [33, false],
      [0, true],
      [0, false],
      [0, false],
    ];
    expect(convertInningsToRunsAndNOs(data)).toEqual(expectedOut);
  });

  test('it calculates rolling run rate', () => {
    const data = [0, 1, 0, 0, 4, 1];
    const actualOut = convertBallsToProgressiveRunRate(data); //[0, 0.5, 0.3333]
    expect(actualOut.length).toEqual(6);
    expect(actualOut[0]).toEqual(0);
    expect(actualOut[1]).toEqual(50);
    expect(actualOut[5]).toEqual(100);
  });

  test('it converts runs required and balls to required strike rate', () => {
    const data = [[5, 10], [4, 8]]
    const expectedOut = [50, 50]
    // @ts-ignore
    expect(convertRequiredRunsAndBallsToRequiredStrikeRate(data)).toEqual(expectedOut)
  })
});

describe('object to hierarchy', () => {
  test('it converts innings contribution to hierarchy', () => {
    const inData: InningsContributionData = {
      teamName: 'England',
      score: '213/5',
      batsmen: {
        'A Cook': {
          notOut: true,
          bowlers: {
            'A Bowler': 33,
            'B Bowler': 21,
          },
        },
        'A Strauss': {
          notOut: false,
          bowlers: {
            'A Bowler': 12,
            'B Bowler': 11,
          },
        },
        'N Hussain': {
          notOut: false,
          score: 20
        }
      },
    };

    const expectedOut = {
      name: 'England',
      children: [
        {
          name: 'A Cook',
          children: [
            {
              name: 'A Bowler',
              value: 33,
            },
            {
              name: 'B Bowler',
              value: 21,
            },
          ],
        },
        {
          name: 'A Strauss',
          children: [
            {
              name: 'A Bowler',
              value: 12,
            },
            {
              name: 'B Bowler',
              value: 11,
            },
          ],
        },
        {
          name: 'N Hussain',
          value: 20
        }
      ],
    };

    const actualOut = convertInningsContributionToHierarchy(inData);

    expect(expectedOut).toEqual(actualOut);
  });
});

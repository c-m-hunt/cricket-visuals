import { convertInningsToRunsAndNOs, convertBallsToProgressiveRunRate } from '../converter';

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

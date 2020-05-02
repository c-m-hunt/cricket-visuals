import { convertInningsToRunsAndNOs } from '../converter';

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

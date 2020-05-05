# Cricket Visuals

An effort to come up with some more innovative and interesting visualisations of cricket game data.

## Chart demos
Check out https://github.com/c-m-hunt/cricket-visuals-demos

## Install
```
npm install cricket-visuals
```
or
```
yarn add cricket-visuals
```

## Usage
More simple charts can contain their data in the `data` attribute of the html element. This will parse the string. Pass `null` as data to the chart to use this.

More complex charts require data to be passed to them as a javascript object.

## Charts

### Batsman Form Spark Chart
Simple bar chart of last innings of a batsman.

#### Attribute data
```html
<div class='form_spark' data="5,22,29*,55,170,22" style="width:80px;" ></div>
```

```javascript
import { FormSpark } from 'cricket-visuals'
FormSpark.formSpark(".form_spark", null, { foregroundColor: "red", height: 100, width: 400 })
```

#### Supplied data
```javascript
import { FormSpark } from 'cricket-visuals'
const data = [1,50,"33*",33,"25*",140,0,4]
FormSpark.formSpark("#form_spark", data, { foregroundColor: "green" })
```

### Innings Progressive Run Rate
Shows the progression of a batsman's run rate through their innings
#### Attribute data
Only basic run rate chart available through attribute data.
```html
<div class='progress_rr' data="1,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,1,0,0,1,2,0,0,0,1,0,0,0,0,0,0,0,4,0,1,0,1,1,0,1,0,0,1,1,1,0,1,2,2,2,1,0,1,0,1,0,1,0,1,0,2,1,0,4,0,1,0,0,1,1,0,0,0,0,1,0,2,0,0,1,1,0,1,1,1,0,0,1,4,1,4,1,1,6,1,0,0,6,6,1,1" style="width: 500px;" ></div>
```
```javascript
import { InningsRunRate } from 'cricket-visuals'
InningsRunRate.progressiveRunRate(
  "#progress_rr",
  null,
  {showGrid: true}
)
```
#### Supplied data
```javascript
import { InningsRunRate } from 'cricket-visuals'
const data2 = {
  balls: [1,0,0,0,0,0,0,0,4,0,0,0,0,0,0,1,0,0,1,2,0,0,0,1,0,0,0,0,0,0,0,4,1,0,1,1,0,1,0,0,1,1,1,0,1,2,2,2,1,0,1,0,1,0,1,0,1,0,2,1,0,4,0,1,0,0,1,1,0,0,0,1,0,2,0,0,1,1,0,1,1,1,0,0,1,4,1,4,1,1,6,1,0,0,6,6,1,1],
  inningsRunRateRequired: 80.66666666,
  batsmanName: "Ben Stokes"
}
InningsRunRate.progressiveRunRate(
  "#progress_rr",
  data,
  {showGrid: true}
)
```

### Innings Contribution
Shows what each batsman contributed to the innings and how many they scored off each bowler
#### Attribute data
There is no attribute data version of this chart
#### Supplied data
```javascript
const inData = {
  teamName: "England",
  score: "213/5",
  batsmen: {
      "A Cook": {
          notOut: true,
          bowlers:
            {
              "A Bowler": 33,
              "B Bowler":21
            }
        },
      "A Strauss": {
          notOut: false,
          bowlers:
            {
              "A Bowler": 12,
              "B Bowler": 11
            }
        },
        "A Flintoff": {
          notOut: false,
          bowlers:
            {
              "A Bowler": 33,
              "B Bowler": 55,
              "C Bowler": 5
            }
        },
  }
}

InningsContribution.inningsContribution("#innings_contribution", inData);
```

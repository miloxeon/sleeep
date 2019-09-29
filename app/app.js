import {
  tomorrow, dateToHHMM, calculateBedTimeByCycles, renderTemplate
} from './lib.js';

// generated content goes there
const root = document.getElementById('root');

const performCalculation = ({
  coords: { latitude, longitude }
}) => {
  // calculate full sunrise time (bottom of the sun touches horizon)
  const { sunriseEnd: sunriseDate } = SunCalc.getTimes(tomorrow(), latitude, longitude)

  // some constants
  const timeToFallAsleep = 14

  // calculate the time to go to sleep to rest for four cycles
  const timeToFour = calculateBedTimeByCycles({
    sleepTime: 4 * 90,
    sunriseDate, timeToFallAsleep
  })

  // calculate the time to go to sleep to rest for five cycles
  const timeToFive = calculateBedTimeByCycles({
    sleepTime: 5 * 90,
    sunriseDate, timeToFallAsleep
  })

  // calculate the time to go to sleep to rest for six cycles
  const timeToSix = calculateBedTimeByCycles({
    sleepTime: 6 * 90,
    sunriseDate, timeToFallAsleep
  })

  // convert sunrise date to HH:mm
  const timeSunrise = dateToHHMM(sunriseDate)

  renderTemplate('success', {
    timeToFour,
    timeToFive,
    timeToSix,
    timeSunrise
  })
}

// get current latitude and longitude
navigator.geolocation.getCurrentPosition(geoData => {
  performCalculation(geoData)
}, err => {
  console.error(err.message)
  renderTemplate('failure')
}, {
  timeout: 10000
})

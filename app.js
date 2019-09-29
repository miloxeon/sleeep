// generated content goes there
const root = document.getElementById('root');

// preloader template
const preloader = () => `
  <div class="preloader"></div>
`

// template if calculations were successful. Accepts { timeToFour, timeToFive, sunrise }, all strings
const template = times => `
  <p>
    Go to bed at
    <div class='times'>
      <div class='time-container'>
        <strong class='time'>${times.timeToSix}</strong>
      </div>
      <div class='time-container'>
        <strong class='time'>${times.timeToFive}</strong>
      </div>
      <div class='time-container'>
        <strong class='time'>${times.timeToFour}</strong>
      </div>
    </div>
    to wake up with the sunrise (${times.sunrise}) and feel well-rested.
  </p>
`
// template if calculations were unsuccessful
const failure = () => `
  <p>
    An error occured. This may be because you haven't allowed the location access.<br>
    We need your location to calculate the sunrise time.<br>
    Please reload page and allow location.
  </p>
`
// get tomorrow date by current date
const tomorrow = () => {
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  return tomorrow
}

// convert anything js Date constructor can accept to local HH:mm
const dateToHHMM = date => new Date(date).toTimeString().slice(0,5)

// enable preloader
root.innerHTML = preloader()

const calculateBedTimeByCycles = ({ sleepTime, sunriseDate, timeToFallAsleep }) => {
  let result = new Date(sunriseDate)
  result.setMinutes(result.getMinutes() - sleepTime - timeToFallAsleep)
  return dateToHHMM(result)
}

const performCalculation = ({ coords: { latitude, longitude }}) => {
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
  sunrise = dateToHHMM(sunriseDate)

  // display times
  root.innerHTML = template({ sunrise, timeToFour, timeToFive, timeToSix })

  VanillaTilt.init(document.querySelectorAll('.time'), {
    perspective: 300,
    gyroscopeMinAngleX: -10,
    gyroscopeMaxAngleX: 10,
    gyroscopeMinAngleY: -10,
    gyroscopeMaxAngleY: 10
  })
}

// get current latitude and longitude
navigator.geolocation.getCurrentPosition(geoData => {
  performCalculation(geoData)
}, () => {
  root.innerHTML = failure()
}, { timeout: 10000 })

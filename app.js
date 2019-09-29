// generated content goes there
const root = document.getElementById('root');

// get tomorrow date by current date
const tomorrow = () => {
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  return tomorrow
}

// convert anything js Date constructor can accept to local HH:mm
const dateToHHMM = date => new Date(date).toTimeString().slice(0,5)

const calculateBedTimeByCycles = ({
  sleepTime, sunriseDate, timeToFallAsleep
}) => {
  let result = new Date(sunriseDate)
  result.setMinutes(result.getMinutes() - sleepTime - timeToFallAsleep)
  return dateToHHMM(result)
}

const renderTemplate = (id, data) => {
  const clone = document.getElementById(id).content.cloneNode(true)

  if (data) {
    Array.prototype.slice.call(
      clone.querySelectorAll('[data-template]')
    ).forEach(node => {
      const { template: key } = node.dataset;
      node.innerHTML = data[key]
    })
  }

  root.innerHTML = ''
  root.appendChild(clone)
}

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
  timeSunrise = dateToHHMM(sunriseDate)

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

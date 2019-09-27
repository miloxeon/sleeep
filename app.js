// generated content goes there
const root = document.getElementById('root');

// template if calculations were successful. Accepts { timeToFour, timeToFive, sunrise }, all strings
const template = times => `
  <p>
    Go to bed at <strong>${times.timeToFive}</strong> or <strong>${times.timeToFour}</strong>
    to wake up with the sunrise (${times.sunrise}) and feel well-rested.
  </p>
`
// template if calculations were unsuccessful
const failure = () => `
  <p>
    An error occured. This may be because you haven't allowed the location access.<br>
    We need your location to calculate the sunrise time.<br>
    We don't collect any data.<br>
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

// get current latitude and longitude
navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude }}, err) => {

  // if error, display error
  if (err) {
    root.innerHTML = failure()
  } else {

    // calculate full sunrise time (bottom of the sun touches horizon)
    const { sunriseEnd: sunriseDate } = SunCalc.getTimes(tomorrow(), latitude, longitude)

    // some constants
    const timeToFallAsleep = 14
    const fourCycles = 4 * 90
    const fiveCycles = 5 * 90

    // calculate the time to go to sleep to rest for four cycles
    const dateToFour = new Date(sunriseDate)
    dateToFour.setMinutes(dateToFour.getMinutes() - fourCycles - timeToFallAsleep)
    timeToFour = dateToHHMM(dateToFour)

    // calculate the time to go to sleep to rest for five cycles
    const dateToFive = new Date(sunriseDate)
    dateToFive.setMinutes(dateToFive.getMinutes() - fiveCycles - timeToFallAsleep)
    timeToFive = dateToHHMM(dateToFive)

    // convert sunrise date to HH:mm
    sunrise = dateToHHMM(sunriseDate)

    // display times
    root.innerHTML = template({
      sunrise,
      timeToFour,
      timeToFive
    })
  }
})

// get tomorrow date by current date
export const tomorrow = () => {
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  return tomorrow
}

// convert anything js Date constructor can accept to local HH:mm
export const dateToHHMM = date => new Date(date).toTimeString().slice(0,5)

export const calculateBedTimeByCycles = ({
  sleepTime, sunriseDate, timeToFallAsleep
}) => {
  let result = new Date(sunriseDate)
  result.setMinutes(result.getMinutes() - sleepTime - timeToFallAsleep)
  return dateToHHMM(result)
}

export const renderTemplate = (id, data) => {
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

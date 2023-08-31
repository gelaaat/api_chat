export const dateFormatter = () => {
  const date = new Date()

  let dateHours = date.getHours().toString()
  let dateMinutes = date.getMinutes().toString()
  let dateSeconds = date.getSeconds().toString()

  if (dateHours.length === 1) {
    dateHours = '01'
  }
  if (dateMinutes.length === 1) {
    dateMinutes = '0' + dateMinutes
  }
  if (dateSeconds.length === 1) {
    dateSeconds = '0' + dateSeconds
  }

  const dateFormatted = `${dateHours}:${dateMinutes}:${dateSeconds}`
  return dateFormatted
}

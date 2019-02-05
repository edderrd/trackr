import moment from 'moment'

export default (value) => {
  if (!value) return value
  moment.locale('en')
  const date = moment(value)
  if (date.year() > moment().year()) {
    return date.format('dddd D MMMM YYYY')
  }

  return date.format('dddd D MMMM')
}

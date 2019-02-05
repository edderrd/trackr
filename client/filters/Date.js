import moment from 'moment'

export default (value) => {
  if (!value) return value
  moment.locale('en')
  const date = moment(value)
  if (date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
    return 'Today'
  }

  if (date.format('YYYY-MM-DD') === moment().add(1, 'days').format('YYYY-MM-DD')) {
    return 'Tomorrow'
  }

  if (date.format('YYYY-MM-DD') === moment().subtract(1, 'days').format('YYYY-MM-DD')) {
    return 'Yesterday'
  }

  if (date.year() > moment().year() || date.year() < moment().year()) {
    return date.format('D MMMM YYYY')
  }

  return date.format('D MMMM')
}

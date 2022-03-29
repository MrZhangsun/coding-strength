/**
 *
 * @param dateNow :Date类
 * @param intervalDays ：间隔天数
 * @param bolPastTime  ：Boolean,判断在参数date之前，还是之后，
 */
export function getDateRange (dateNow, intervalDays, bolPastTime) {
  const oneDayTime = 24 * 60 * 60 * 1000
  const list = []
  let lastDay
  if (bolPastTime === true) {
    lastDay = new Date(dateNow.getTime() - intervalDays * oneDayTime)
    list.push(formateDate(lastDay))
    list.push(formateDate(dateNow))
  } else {
    lastDay = new Date(dateNow.getTime() + intervalDays * oneDayTime)
    list.push(formateDate(dateNow))
    list.push(formateDate(lastDay))
  }
  return list
}

export function formateDate (time) {
  const year = time.getFullYear()
  let month = time.getMonth() + 1
  let day = time.getDate()

  if (month < 10) {
    month = '0' + month
  }

  if (day < 10) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day + ''
}

const MIN_AGE = 1
const MAX_AGE = 120

export function splitBirthDate(value = '') {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  return match
    ? { year: match[1], month: match[2], day: match[3] }
    : { year: '', month: '', day: '' }
}

export function joinBirthDate({ year, month, day }) {
  if (!year || !month || !day) return ''
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export function getDaysInMonth(month, year) {
  if (!month) return 31
  return new Date(Number(year) || 2000, Number(month), 0).getDate()
}

export function getBirthYearBounds(today = new Date()) {
  return {
    min: today.getFullYear() - MAX_AGE - 1,
    max: today.getFullYear() - MIN_AGE,
  }
}

function getAge(year, month, day, today = new Date()) {
  let age = today.getFullYear() - year
  const birthdayPassed = today.getMonth() + 1 > month
    || (today.getMonth() + 1 === month && today.getDate() >= day)
  if (!birthdayPassed) age -= 1
  return age
}

export function validateBirthDate(value, today = new Date()) {
  if (!value) return 'Add your birthday.'
  const { year, month, day } = splitBirthDate(value)
  const numbers = [year, month, day].map(Number)
  const parsed = new Date(numbers[0], numbers[1] - 1, numbers[2])
  const isRealDate = year && parsed.getFullYear() === numbers[0]
    && parsed.getMonth() === numbers[1] - 1 && parsed.getDate() === numbers[2]
  if (!isRealDate) return 'That date does not exist.'
  if (parsed > today) return 'That birthday is still buffering.'
  const age = getAge(...numbers, today)
  if (age < MIN_AGE || age > MAX_AGE) return 'The oracle reads ages 1–120.'
  return ''
}

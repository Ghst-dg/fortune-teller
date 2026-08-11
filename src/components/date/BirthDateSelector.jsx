import { useState } from 'react'
import {
  getBirthYearBounds,
  getDaysInMonth,
  joinBirthDate,
  splitBirthDate,
} from '../../utils/date'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function options(count, start = 1) {
  return Array.from({ length: count }, (_, index) => String(index + start))
}

function DatePart({ label, value, values, onChange, invalid, autoComplete }) {
  return (
    <label className="date-part">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid} autoComplete={autoComplete} required>
        <option value="">{label}</option>
        {values.map((item) => {
          const optionValue = typeof item === 'string' ? item : item.value
          const optionLabel = typeof item === 'string' ? item : item.label
          return <option value={optionValue} key={optionValue}>{optionLabel}</option>
        })}
      </select>
    </label>
  )
}

export default function BirthDateSelector({ value, onChange, invalid, describedBy }) {
  const [parts, setParts] = useState(() => splitBirthDate(value))
  const dayCount = getDaysInMonth(parts.month, parts.year)
  const yearBounds = getBirthYearBounds()
  const years = options(yearBounds.max - yearBounds.min + 1, yearBounds.min).reverse()
  const months = MONTHS.map((label, index) => ({
    label,
    value: String(index + 1).padStart(2, '0'),
  }))
  const days = options(dayCount).map((day) => day.padStart(2, '0'))

  function update(part, nextValue) {
    const next = { ...parts, [part]: nextValue }
    if (part !== 'day' && Number(next.day) > getDaysInMonth(next.month, next.year)) {
      next.day = ''
    }
    setParts(next)
    onChange(joinBirthDate(next))
  }

  return (
    <fieldset className={`date-selector ${invalid ? 'is-invalid' : ''}`}
      aria-describedby={describedBy}>
      <legend>Date of birth</legend>
      <div className="date-selects">
        <DatePart label="Day" value={parts.day} values={days}
          onChange={(next) => update('day', next)} invalid={invalid} autoComplete="bday-day" />
        <DatePart label="Month" value={parts.month} values={months}
          onChange={(next) => update('month', next)} invalid={invalid} autoComplete="bday-month" />
        <DatePart label="Year" value={parts.year} values={years}
          onChange={(next) => update('year', next)} invalid={invalid} autoComplete="bday-year" />
      </div>
    </fieldset>
  )
}

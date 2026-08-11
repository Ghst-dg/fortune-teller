import { useState } from 'react'
import { useFortuneStore } from '../../store/useFortuneStore'
import { validateBirthDate } from '../../utils/date'
import { useStableStageCopy } from '../../utils/stageCopy'
import BirthDateSelector from '../date/BirthDateSelector'
import BrutalButton from '../ui/BrutalButton'
import StageShell from '../ui/StageShell'

export default function ProfileStage() {
  const submitIdentity = useFortuneStore((state) => state.submitIdentity)
  const copy = useStableStageCopy('identity')
  const [name, setName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    if (!name.trim()) return setError('The legend needs a name.')
    const dateError = validateBirthDate(dateOfBirth)
    if (dateError) return setError(dateError)
    submitIdentity({ name, dateOfBirth })
  }

  return (
    <StageShell
      className="profile-stage"
      eyebrow={copy.eyebrow}
      title={copy.title}
    >
      <form className="identity-form" onSubmit={submit} noValidate>
        <label>
          <span>Name</span>
          <input autoFocus autoComplete="name" maxLength="24" value={name}
            onChange={(event) => { setName(event.target.value); setError('') }}
            aria-invalid={Boolean(error) && !name.trim()} aria-describedby="identity-message"
            placeholder="Heroic name" />
        </label>
        <BirthDateSelector value={dateOfBirth} invalid={Boolean(error) && Boolean(name.trim())}
          describedBy="identity-message"
          onChange={(value) => { setDateOfBirth(value); setError('') }} />
        <p className="form-error" id="identity-message" aria-live="polite">
          {error || copy.caption}
        </p>
        <BrutalButton type="submit" tone="pink">Continue</BrutalButton>
      </form>
    </StageShell>
  )
}

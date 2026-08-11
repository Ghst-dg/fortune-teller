export default function BrutalButton({
  children,
  tone = 'sun',
  className = '',
  ...props
}) {
  return (
    <button className={`brutal-button brutal-button--${tone} ${className}`} {...props}>
      <span>{children}</span>
      <span className="button-arrow" aria-hidden="true">↗</span>
    </button>
  )
}

export default function StageShell({
  children,
  className = '',
  eyebrow,
  title,
  align = 'left',
}) {
  return (
    <section className={`stage stage--${align} ${className}`} aria-labelledby="stage-title">
      <div className="stage-copy">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h1 id="stage-title">{title}</h1>}
        {children}
      </div>
    </section>
  )
}

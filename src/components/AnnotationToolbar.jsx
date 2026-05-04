import './AnnotationToolbar.css'

const TOOL_ICONS = {
  draw: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19l7-7 3 3-7 7-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 2l7.586 7.586" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="11" cy="11" r="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  highlight: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
      <line x1="7" y1="20" x2="17" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  text: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polyline points="4,7 4,4 20,4 20,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="9" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  eraser: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 17.5l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
}

function AnnotationToolbar({
  activeTool,
  activeColor,
  strokeWidth,
  annotationsOn,
  TOOLS,
  COLORS,
  onToolChange,
  onColorChange,
  onStrokeChange,
  onToggle,
  onClear,
}) {
  return (
    <div className={`ann-toolbar ${annotationsOn ? 'ann-toolbar--on' : ''}`}>
      {/* Toggle annotations on/off */}
      <button
        className={`btn btn-sm ${annotationsOn ? 'btn-primary' : 'btn-outline'} ann-toggle`}
        onClick={onToggle}
        title={annotationsOn ? 'Disable annotations' : 'Enable annotations'}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Annotate
      </button>

      {annotationsOn && (
        <>
          <div className="ann-divider" />

          {/* Tool buttons */}
          <div className="ann-tools">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                className={`ann-tool-btn ${activeTool === t.id ? 'active' : ''}`}
                onClick={() => onToolChange(t.id)}
                title={t.label}
              >
                {TOOL_ICONS[t.id]}
              </button>
            ))}
          </div>

          <div className="ann-divider" />

          {/* Color swatches */}
          <div className="ann-colors">
            {COLORS.map((c) => (
              <button
                key={c}
                className={`ann-color-swatch ${activeColor === c ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => onColorChange(c)}
                title={c}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>

          <div className="ann-divider" />

          {/* Stroke width */}
          {activeTool === 'draw' && (
            <div className="ann-stroke">
              <span className="ann-stroke-label">Size</span>
              <input
                type="range"
                min={1}
                max={12}
                value={strokeWidth}
                onChange={(e) => onStrokeChange(Number(e.target.value))}
                className="ann-stroke-slider"
              />
            </div>
          )}

          <div className="ann-divider" />

          <button className="btn btn-sm btn-ghost" onClick={onClear} title="Clear all annotations on this page">
            Clear page
          </button>
        </>
      )}
    </div>
  )
}

export default AnnotationToolbar

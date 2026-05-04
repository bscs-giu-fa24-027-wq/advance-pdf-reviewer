import './AnnotationToolbar.css'

const TOOLS = [
  { id: 'draw', label: 'Draw', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19l7-7 3 3-7 7-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 2l7.586 7.586" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="11" cy="11" r="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )},
  { id: 'highlight', label: 'Highlight', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )},
  { id: 'text', label: 'Text', icon: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polyline points="4,7 4,4 20,4 20,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="9" y1="20" x2="15" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )},
]

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#000000']

function AnnotationToolbar({ activeTool, activeColor, activeWidth, onToolChange, onColorChange, onWidthChange, onClear }) {
  return (
    <div className="ann-toolbar">
      <div className="ann-tools">
        {TOOLS.map(t => (
          <button
            key={t.id}
            className={`ann-tool-btn${activeTool === t.id ? ' active' : ''}`}
            onClick={() => onToolChange(activeTool === t.id ? null : t.id)}
            title={t.label}
            aria-label={t.label}
            aria-pressed={activeTool === t.id}
          >
            {t.icon}
          </button>
        ))}
      </div>

      <div className="ann-colors">
        {COLORS.map(c => (
          <button
            key={c}
            className={`ann-color-btn${activeColor === c ? ' active' : ''}`}
            style={{ background: c }}
            onClick={() => onColorChange(c)}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>

      <div className="ann-width-group">
        <label className="ann-width-label">Size</label>
        <input
          type="range"
          min={1}
          max={12}
          value={activeWidth}
          onChange={e => onWidthChange(Number(e.target.value))}
          className="ann-width-slider"
          aria-label="Stroke width"
        />
        <span className="ann-width-val">{activeWidth}</span>
      </div>

      <button className="ann-clear-btn" onClick={onClear} title="Clear annotations on this page">
        Clear
      </button>
    </div>
  )
}

export default AnnotationToolbar

import { PROMPT_STACK_DISPLAY } from '../lib/prompts'

interface PromptPanelProps {
  visible: boolean
}

export function PromptPanel({ visible }: PromptPanelProps) {
  if (!visible) return null

  return (
    <section
      id="prompt-panel"
      aria-label="Prompt engineering stack"
      style={{ marginBottom: '24px' }}
    >
      <p className="label" style={{ marginBottom: '10px' }}>
        Master Prompt Engineering Stack · Hybrid Framework
      </p>
      <pre
        style={{
          background: '#050510',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10.5px',
          color: 'rgba(255,255,255,0.55)',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.75,
          overflowX: 'auto',
        }}
      >
        {PROMPT_STACK_DISPLAY}
      </pre>
    </section>
  )
}

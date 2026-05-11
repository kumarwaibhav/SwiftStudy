export function PromptStack() {
  return (
    <section className="prompt-stack" aria-label="Prompt engineering framework">
      <p className="section-label">MASTER PROMPT ENGINEERING STACK · HYBRID FRAMEWORK</p>
      <pre className="prompt-box">{`╔════ FRAMEWORK ARCHITECTURE ════════════════════════════════════╗
║  Layer 1 ▸ RISEN     System role + scope + search mandate        ║
║  Layer 2 ▸ ReAct     Think → Act → Observe search loop           ║
║  Layer 3 ▸ L2M       Least-to-Most topic decomposition           ║
║  Layer 4 ▸ CO-STAR   Output spec: audience, format, response     ║
╚════════════════════════════════════════════════════════╝`}</pre>
    </section>
  );
}

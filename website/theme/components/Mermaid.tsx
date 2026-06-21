import './mermaid.css';
import { useEffect, useId, useRef, useState } from 'react';
import type { MermaidConfig } from 'mermaid';

interface MermaidProps {
  chart: string;
}

const config: MermaidConfig = {
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'default',
};

export function Mermaid({ chart }: MermaidProps) {
  const id = useId().replace(/:/g, '-');
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize(config);
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    }

    void renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div className="mermaid-wrapper">
      <div ref={containerRef} />
      {error ? <pre className="mermaid-error">图表渲染失败：{error}</pre> : null}
      <noscript>
        <pre>{chart}</pre>
      </noscript>
    </div>
  );
}

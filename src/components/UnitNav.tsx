import { UNITS } from '@/data/syllabus';

interface UnitNavProps {
  activeUnit: number;
  onSelect: (unit: number) => void;
}

export function UnitNav({ activeUnit, onSelect }: UnitNavProps) {
  return (
    <nav className="unit-nav" aria-label="Syllabus units">
      {Object.entries(UNITS).map(([n, u]) => {
        const num = parseInt(n, 10);
        const isActive = activeUnit === num;
        return (
          <button
            key={n}
            className={`unit-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(num)}
            aria-current={isActive ? 'true' : undefined}
            style={isActive ? { borderLeftColor: u.accent, background: u.glow } : undefined}
          >
            <span className="unit-tab-icon" style={{ color: u.accent }}>{u.icon}</span>
            <span className="unit-tab-body">
              <span className="unit-tab-num">Unit {n}</span>
              <span className="unit-tab-title">{u.title}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

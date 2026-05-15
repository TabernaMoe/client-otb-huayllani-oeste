import { useState } from 'react';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Tabs({ tabs, onChange }) {
  const [active, setActive] = useState(tabs[0]?.key);

  const handleChange = (key) => {
    setActive(key);
    onChange?.(key);
  };

  return (
    <div className="w-full">
      {/* Tabs header tipo página */}
      <div className="flex w-full gap-1 border-b border-slate-200 bg-white px-1">
        {tabs.map((tab) => {
          const isActive = active === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => handleChange(tab.key)}
              className={cx(
                'relative px-5 py-3 text-sm font-semibold transition-colors',
                'focus:outline-none',
                isActive
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-800',
              )}
            >
              {tab.label}

              {/* Indicador inferior */}
              {isActive && (
                <span className="absolute inset-x-2 bottom-0 h-0.75 rounded-full bg-sky-800" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { pdfChapters, pdfTotalRows, type PdfSection } from '../data/pdfShortcuts';

type Platform = 'mac' | 'win';

function sectionMatches(sec: PdfSection, q: string): { matched: string[][]; titleHit: boolean } {
  if (!q) return { matched: sec.rows, titleHit: false };
  const ql = q.toLowerCase();
  const titleHit =
    sec.section.toLowerCase().includes(ql) ||
    sec.cols.some(c => c.toLowerCase().includes(ql));
  if (titleHit) return { matched: sec.rows, titleHit: true };
  const matched = sec.rows.filter(r => r.some(c => c.toLowerCase().includes(ql)));
  return { matched, titleHit: false };
}

export default function GuideView({ searchQuery, platform, onClearSearch }: {
  searchQuery: string;
  platform: Platform;
  onClearSearch: () => void;
}) {
  const q = searchQuery.trim();
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const chapters = useMemo(() => {
    return pdfChapters.map(ch => {
      const sections = ch.sections
        .map(sec => ({ sec, ...sectionMatches(sec, q) }))
        .filter(x => x.matched.length > 0 || x.titleHit);
      const rows = sections.reduce((n, s) => n + s.matched.length, 0);
      return { ch, sections, rows };
    }).filter(ch => ch.sections.length > 0);
  }, [q]);

  const totalMatched = chapters.reduce((n, c) => n + c.rows, 0);

  const toggle = (num: number) => setCollapsed(c => ({ ...c, [num]: !c[num] }));

  const jump = (num: number) => {
    if (collapsed[num]) toggle(num);
    requestAnimationFrame(() => {
      document.getElementById(`guide-ch-${num}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div>
      {/* Intro */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">The Complete Shortcuts Guide</h2>
          <p className="text-sm text-gray-400 mt-1">
            Every shortcut from the Avid Pro Tools Shortcuts Guide, in the guide's order — {pdfTotalRows} entries across {pdfChapters.length} chapters.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>
            {q ? `${totalMatched} of ${pdfTotalRows} entries match` : `${pdfTotalRows} entries`}
          </span>
          {q && (
            <button onClick={onClearSearch} className="text-blue-400 hover:text-blue-300">
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Chapter jump chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-gray-800/40">
        {pdfChapters.map(ch => (
          <button
            key={ch.num}
            onClick={() => jump(ch.num)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
            title={ch.title}
          >
            {ch.num}. {ch.title.replace(' Keyboard Shortcuts', '').replace(' Shortcuts', '')}
          </button>
        ))}
      </div>

      {chapters.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-400">No guide entries match "{searchQuery}".</p>
          <button onClick={onClearSearch} className="mt-3 text-blue-400 hover:text-blue-300 text-sm">
            Clear search
          </button>
        </div>
      )}

      <div className="space-y-6">
        {chapters.map(({ ch, sections, rows }) => {
          const isCollapsed = !q && collapsed[ch.num];
          return (
            <section key={ch.num} id={`guide-ch-${ch.num}`} className="scroll-mt-32">
              {/* Chapter header */}
              <button
                onClick={() => toggle(ch.num)}
                className="w-full flex items-center justify-between gap-3 bg-gray-800/70 border border-gray-700/60 rounded-t-xl px-4 py-3 text-left hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {ch.num}
                  </span>
                  <h3 className="font-semibold text-white truncate">{ch.title}</h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-500">{rows} entries</span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {!isCollapsed && (
                <div className="border border-t-0 border-gray-700/60 rounded-b-xl overflow-hidden">
                  {sections.map(({ sec, matched, titleHit }) => (
                    <div key={`${ch.num}-${sec.section}-${sec.page}`}>
                      {/* Section header */}
                      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2 bg-gray-900/60">
                        <h4 className="text-sm font-semibold text-blue-300">
                          {sec.section}
                          {q && titleHit && matched.length === sec.rows.length && (
                            <span className="text-gray-500 font-normal"> · all {sec.rows.length} entries match the title</span>
                          )}
                        </h4>
                        <span className="text-[10px] text-gray-600 font-mono shrink-0">guide p.{sec.page}</span>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <div className="min-w-[640px] mx-4 mb-4 border border-gray-700/40 rounded-lg overflow-hidden">
                          {/* Header row */}
                          <div
                            className="grid text-[11px] uppercase tracking-wider font-semibold text-gray-400 bg-gray-800/80 border-b border-gray-700/60"
                            style={{ gridTemplateColumns: sec.cols.length === 3 ? 'minmax(0,1fr) minmax(0,230px) minmax(0,230px)' : 'minmax(0,1fr) minmax(0,320px)' }}
                          >
                            {sec.cols.map((c, i) => (
                              <div
                                key={i}
                                className={`px-3 py-2 ${i > 0 ? 'border-l border-gray-700/40' : ''} ${
                                  (i === 1 && platform === 'mac') || (i === 2 && platform === 'win')
                                    ? 'text-blue-300 bg-blue-500/5'
                                    : ''
                                }`}
                              >
                                {c}
                              </div>
                            ))}
                          </div>

                          {/* Data rows */}
                          {matched.map((r, ri) => (
                            <div
                              key={ri}
                              className={`grid text-sm ${ri % 2 === 1 ? 'bg-white/[0.025]' : ''} hover:bg-blue-500/5 transition-colors`}
                              style={{ gridTemplateColumns: sec.cols.length === 3 ? 'minmax(0,1fr) minmax(0,230px) minmax(0,230px)' : 'minmax(0,1fr) minmax(0,320px)' }}
                            >
                              {sec.cols.map((c, ci) => {
                                const val = r[ci] ?? '';
                                const isKey = ci > 0 && (c === 'Mac' || c === 'Windows' || c === 'Commands Focus Shortcut' || c === 'Shortcut');
                                const dimmed = (ci === 1 && platform === 'win' && c === 'Mac') || (ci === 2 && platform === 'mac' && c === 'Windows');
                                return (
                                  <div
                                    key={ci}
                                    className={`px-3 py-2 leading-snug ${ci > 0 ? 'border-l border-gray-700/30' : ''} ${
                                      isKey ? 'font-mono text-[13px]' : 'text-gray-200'
                                    } ${isKey && ((ci === 1 && platform === 'mac') || (ci === 2 && platform === 'win')) ? 'text-blue-200 font-semibold' : ''} ${
                                      dimmed ? 'text-gray-500' : ''
                                    }`}
                                  >
                                    {val || <span className="text-gray-700">—</span>}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

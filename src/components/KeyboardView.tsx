import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { pdfChapters } from '../data/pdfShortcuts';

interface KeyDef {
  id: string;
  label: string;
  w?: number; // width in units (flex rows)
  small?: boolean; // render label smaller (words like "caps lock")
}

interface PadKey extends KeyDef {
  r: number;
  c: number;
  rs?: number; // row span
  cs?: number; // column span
}

interface Entry {
  ch: number;
  chTitle: string;
  sec: string;
  page: number;
  action: string;
  combo: string;
}

const U = 60; // key unit in px
const GAP = 5;
// natural footprint of the keyboard: widest row (15 units) + block gap + keypad
const NATURAL_W = 19 * U + 6;

// ---------------------------------------------------------------------------
// Full-size Mac keyboard layout (US ANSI): function row, main block with
// arrow cluster, and numeric keypad.
// ---------------------------------------------------------------------------
const MAIN_ROWS: KeyDef[][] = [
  [
    { id: 'esc', label: 'esc', w: 1.3, small: true },
    ...Array.from({ length: 12 }, (_, i) => ({ id: `f${i + 1}`, label: `F${i + 1}` })),
  ],
  [
    { id: '`', label: '`' },
    ...'1234567890'.split('').map(d => ({ id: d, label: d })),
    { id: '-', label: '-' },
    { id: '=', label: '=' },
    { id: 'backspace', label: '⌫ delete', w: 2, small: true },
  ],
  [
    { id: 'tab', label: 'tab', w: 1.5, small: true },
    ...'qwertyuiop'.split('').map(l => ({ id: l, label: l.toUpperCase() })),
    { id: '[', label: '[' },
    { id: ']', label: ']' },
    { id: '\\', label: '\\', w: 1.5 },
  ],
  [
    { id: 'caps', label: 'caps lock', w: 1.75, small: true },
    ...'asdfghjkl'.split('').map(l => ({ id: l, label: l.toUpperCase() })),
    { id: ';', label: ';' },
    { id: "'", label: "'" },
    { id: 'return', label: 'return', w: 2.25, small: true },
  ],
  [
    { id: 'shift', label: '⇧ shift', w: 2.25, small: true },
    ...'zxcvbnm'.split('').map(l => ({ id: l, label: l.toUpperCase() })),
    { id: ',', label: ',' },
    { id: '.', label: '.' },
    { id: '/', label: '/' },
    { id: 'shift', label: '⇧ shift', w: 1.75, small: true },
    { id: 'up', label: '▲' },
  ],
  [
    { id: 'fn', label: 'fn' },
    { id: 'ctrl', label: '⌃ ctrl', small: true },
    { id: 'opt', label: '⌥ opt', small: true },
    { id: 'cmd', label: '⌘', small: true },
    { id: 'space', label: 'space', w: 6, small: true },
    { id: 'cmd', label: '⌘', small: true },
    { id: 'opt', label: '⌥ opt', small: true },
    { id: 'left', label: '◀' },
    { id: 'down', label: '▼' },
    { id: 'right', label: '▶' },
  ],
];

const KEYPAD: PadKey[] = [
  { id: 'kp-clear', label: 'clear', small: true, r: 0, c: 0 },
  { id: 'kp-divide', label: '÷', r: 0, c: 1 },
  { id: 'kp-multiply', label: '×', r: 0, c: 2 },
  { id: 'kp-subtract', label: '−', r: 0, c: 3 },
  { id: 'kp-7', label: '7', r: 1, c: 0 },
  { id: 'kp-8', label: '8', r: 1, c: 1 },
  { id: 'kp-9', label: '9', r: 1, c: 2 },
  { id: 'kp-add', label: '+', r: 1, c: 3, rs: 2 },
  { id: 'kp-4', label: '4', r: 2, c: 0 },
  { id: 'kp-5', label: '5', r: 2, c: 1 },
  { id: 'kp-6', label: '6', r: 2, c: 2 },
  { id: 'kp-1', label: '1', r: 3, c: 0 },
  { id: 'kp-2', label: '2', r: 3, c: 1 },
  { id: 'kp-3', label: '3', r: 3, c: 2 },
  { id: 'kp-enter', label: 'enter', small: true, r: 3, c: 3, rs: 2 },
  { id: 'kp-0', label: '0', r: 4, c: 0, cs: 2 },
  { id: 'kp-dot', label: '.', r: 4, c: 2 },
];

// ---------------------------------------------------------------------------
// Trigger-key parsing: last key of a Mac key combination -> physical key id
// ---------------------------------------------------------------------------
const NAME_TO_ID: Record<string, string> = {
  'space': 'space', 'spacebar': 'space',
  'return': 'return', 'enter': 'return',
  'tab': 'tab', 'delete': 'backspace', 'backspace': 'backspace',
  'esc': 'esc', 'escape': 'esc',
  'up arrow': 'up', 'down arrow': 'down', 'left arrow': 'left', 'right arrow': 'right',
  'arrow up': 'up', 'arrow down': 'down', 'arrow left': 'left', 'arrow right': 'right',
  'up': 'up', 'down': 'down', 'left': 'left', 'right': 'right',
  'comma': ',', 'period': '.', 'slash': '/', 'hyphen': '-', 'minus': '-',
  'semicolon': ';', 'single quote': "'", 'quote': "'", 'apostrophe': "'",
  'plus': '=', 'equal': '=', 'equals': '=', 'equals sign': '=',
  'backslash': '\\', 'left bracket': '[', 'right bracket': ']', 'tilde': '`',
  'forward slash': '/', 'question mark': '/', 'bracket left': '[', 'bracket right': ']',
};

const KEY_IDS = new Set<string>([
  ...MAIN_ROWS.flat().map(k => k.id),
  ...KEYPAD.map(k => k.id),
]);

function normTrigger(raw: string): string | null {
  let t = raw.trim().replace(/[’‘]/g, "'").replace(/[–—]/g, '-');
  if (!t) return null;

  // trailing parenthetical note, e.g. "(on numeric keypad)", "(hyphen)"
  const paren = t.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
  if (paren) {
    const inner = paren[2].toLowerCase();
    const base = paren[1].trim();
    if (inner.includes('numeric keypad')) {
      if (/^[0-9]$/.test(base)) return `kp-${base}`;
      if (/^enter$/i.test(base)) return 'kp-enter';
      return null;
    }
    if (['hyphen', 'semicolon', 'comma', 'period', 'single quote', 'minus', 'plus', 'slash', 'equals', 'question mark'].includes(inner)) {
      t = base;
    } else {
      return null; // compound variants like "… (in Commands Keyboard Focus)"
    }
  }

  const token = t.includes('+') ? t.split('+').pop()!.trim() : t;
  if (!token) return null;
  const lower = token.toLowerCase();

  if (NAME_TO_ID[lower]) return NAME_TO_ID[lower];
  if (/^f([1-9]|1[0-2])$/.test(lower)) return lower;
  if (token.length === 1) {
    const id = /[A-Za-z]/.test(token) ? token.toLowerCase() : token;
    if (KEY_IDS.has(id)) return id;
  }
  // variants like "Up/Down Arrows", "Home/End", "Click" -> not a single key
  return null;
}

const MOD_WORDS: Record<string, RegExp> = {
  cmd: /\bCommand\b/,
  opt: /\bOption\b/,
  ctrl: /\bControl\b/,
  shift: /\bShift\b/,
};

// ---------------------------------------------------------------------------
export default function KeyboardView() {
  const [selected, setSelected] = useState<string | null>(null);
  const [pressed, setPressed] = useState<Set<string>>(new Set());

  // Scale the keyboard down to fit narrow viewports instead of scrolling.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const avail = el.clientWidth - 32; // p-4 padding
      if (avail > 0) setScale(Math.min(1, avail / NATURAL_W));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { focus, byKey, byMod } = useMemo(() => {
    const focus = new Map<string, string>();
    const byKey = new Map<string, Entry[]>();
    const byMod = new Map<string, Entry[]>();

    const push = (map: Map<string, Entry[]>, key: string, e: Entry) => {
      const arr = map.get(key);
      if (arr) arr.push(e);
      else map.set(key, [e]);
    };

    for (const ch of pdfChapters) {
      for (const sec of ch.sections) {
        const isThreeCol = sec.cols[1] === 'Mac';
        const isFocus = sec.cols[1] === 'Commands Focus Shortcut';
        if (!isThreeCol && !isFocus) continue;
        for (const row of sec.rows) {
          const action = row[0];
          const combo = row[1];
          if (!action || !combo) continue;
          const entry: Entry = { ch: ch.num, chTitle: ch.title, sec: sec.section, page: sec.page, action, combo };
          const id = normTrigger(combo);
          if (id) {
            push(byKey, id, entry);
            if (isFocus && ch.num === 3 && !focus.has(id)) focus.set(id, action);
          }
        }
        if (isThreeCol) {
          for (const row of sec.rows) {
            if (!row[0] || !row[1]) continue;
            const entry: Entry = { ch: ch.num, chTitle: ch.title, sec: sec.section, page: sec.page, action: row[0], combo: row[1] };
            for (const [mod, re] of Object.entries(MOD_WORDS)) {
              if (re.test(row[1])) push(byMod, mod, entry);
            }
          }
        }
      }
    }
    return { focus, byKey, byMod };
  }, []);

  // physical key press feedback (ignore typing in inputs)
  useEffect(() => {
    const toId = (e: KeyboardEvent): string | null => {
      const k = e.key;
      if (k === 'Meta') return 'cmd';
      if (k === 'Shift') return 'shift';
      if (k === 'Alt') return 'opt';
      if (k === 'Control') return 'ctrl';
      if (k === 'Escape') return 'esc';
      if (k === 'Backspace') return 'backspace';
      if (k === 'Enter') return e.code === 'NumpadEnter' ? 'kp-enter' : 'return';
      if (k === 'ArrowUp') return 'up';
      if (k === 'ArrowDown') return 'down';
      if (k === 'ArrowLeft') return 'left';
      if (k === 'ArrowRight') return 'right';
      if (k === ' ') return 'space';
      if (k.length === 1) {
        const id = /[A-Za-z]/.test(k) ? k.toLowerCase() : k;
        if (KEY_IDS.has(id)) return id;
      }
      if (/^F([1-9]|1[0-2])$/.test(k)) return k.toLowerCase();
      return null;
    };
    const down = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      const id = toId(e);
      if (id) setPressed(prev => new Set(prev).add(id));
    };
    const up = (e: KeyboardEvent) => {
      const id = toId(e);
      if (id) setPressed(prev => { const n = new Set(prev); n.delete(id); return n; });
    };
    const blur = () => setPressed(new Set());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, []);

  const entriesFor = (id: string): Entry[] => {
    if (id === 'fn') return [];
    return byMod.get(id) ?? byKey.get(id) ?? [];
  };

  const selectedEntries = selected ? entriesFor(selected) : [];
  const grouped = new Map<number, { title: string; items: Entry[] }>();
  for (const e of selectedEntries) {
    const g = grouped.get(e.ch);
    if (g) g.items.push(e);
    else grouped.set(e.ch, { title: e.chTitle, items: [e] });
  }
  const groupedSorted = [...grouped.entries()].sort((a, b) => a[0] - b[0]);

  const keyClass = (hasFocus: boolean, count: number, isSelected: boolean, isPressed: boolean) => {
    let cls = 'bg-gray-800/80 border-gray-600/60';
    if (hasFocus) cls = 'bg-blue-500/15 border-blue-400/60';
    else if (count > 0) cls = 'bg-gray-800/80 border-emerald-500/40';
    if (isSelected) cls = 'bg-blue-500/30 border-blue-300';
    else if (isPressed) cls = 'bg-gray-600/80 border-gray-400';
    return cls;
  };

  const renderKey = (k: KeyDef, keyIdx: string) => {
    const focusLabel = focus.get(k.id);
    const count = entriesFor(k.id).length;
    const isSelected = selected === k.id;
    const isPressed = pressed.has(k.id);

    return (
      <button
        key={keyIdx}
        onClick={() => setSelected(isSelected ? null : k.id)}
        title={focusLabel ? `${k.label} — ${focusLabel} (${count} shortcuts)` : count > 0 ? `${k.label} — ${count} shortcuts` : k.label}
        className={`relative shrink-0 rounded-[6px] border transition-colors overflow-hidden group flex flex-col gap-0.5 p-1 text-left ${keyClass(!!focusLabel, count, isSelected, isPressed)}`}
        style={{ width: (k.w ?? 1) * U - GAP, height: U - GAP }}
      >
        <span className="flex items-start justify-between gap-1 w-full min-w-0">
          <span className={`truncate ${k.small ? 'text-[9px]' : 'text-[10px]'} leading-tight font-semibold text-gray-400 group-hover:text-gray-200`}>
            {k.label}
          </span>
          {count > 0 && (
            <span className={`shrink-0 leading-none text-[8px] font-mono px-1 py-0.5 rounded ${focusLabel ? 'bg-blue-400/20 text-blue-200' : 'bg-emerald-400/15 text-emerald-300'}`}>
              {count}
            </span>
          )}
        </span>
        {focusLabel && (
          <span className="line-clamp-3 text-[9px] leading-[1.15] font-medium text-blue-200/85 overflow-hidden">
            {focusLabel}
          </span>
        )}
      </button>
    );
  };

  const renderPadKey = (k: PadKey, keyIdx: string) => {
    const focusLabel = focus.get(k.id);
    const count = entriesFor(k.id).length;
    const isSelected = selected === k.id;
    const isPressed = pressed.has(k.id);

    return (
      <button
        key={keyIdx}
        onClick={() => setSelected(isSelected ? null : k.id)}
        title={count > 0 ? `${k.label} — ${count} shortcuts` : k.label}
        className={`relative rounded-[6px] border transition-colors overflow-hidden group h-full w-full flex flex-col gap-0.5 p-1 text-left ${keyClass(!!focusLabel, count, isSelected, isPressed)}`}
        style={{ gridColumn: `${k.c + 1} / span ${k.cs ?? 1}`, gridRow: `${k.r + 1} / span ${k.rs ?? 1}` }}
      >
        <span className="flex items-start justify-between gap-1 w-full min-w-0">
          <span className={`truncate ${k.small ? 'text-[9px]' : 'text-[10px]'} leading-tight font-semibold text-gray-400 group-hover:text-gray-200`}>
            {k.label}
          </span>
          {count > 0 && (
            <span className={`shrink-0 leading-none text-[8px] font-mono px-1 py-0.5 rounded ${focusLabel ? 'bg-blue-400/20 text-blue-200' : 'bg-emerald-400/15 text-emerald-300'}`}>
              {count}
            </span>
          )}
        </span>
        {focusLabel && (
          <span className="line-clamp-3 text-[9px] leading-[1.15] font-medium text-blue-200/85 overflow-hidden">
            {focusLabel}
          </span>
        )}
      </button>
    );
  };

  const allKeys = [...MAIN_ROWS.flat(), ...KEYPAD];
  const selectedLabel = selected ? (allKeys.find(k => k.id === selected)?.label ?? selected) : '';

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Full-Size Mac Keyboard</h2>
          <p className="text-sm text-gray-400 mt-1">
            Every key labeled with its Commands Focus command (as in the guide's custom keyboard figure) — click any key to see all shortcuts that use it.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500/30 border border-blue-400/60 inline-block" /> Commands Focus</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-800 border border-emerald-500/40 inline-block" /> has shortcuts</span>
          <span>Press a key on your keyboard to light it up</span>
        </div>
      </div>

      {/* Keyboard */}
      <div ref={wrapRef} className="bg-gray-900/70 border border-gray-700/60 rounded-2xl p-4 overflow-x-auto">
        <div className="inline-flex items-start gap-4" style={{ zoom: scale }}>
          {/* Main block + function row */}
          <div className="inline-flex flex-col" style={{ gap: GAP }}>
            {MAIN_ROWS.map((row, ri) => (
              <div key={ri} className="flex" style={{ gap: GAP }}>
                {row.map((k, i) => renderKey(k, `m-${ri}-${i}`))}
              </div>
            ))}
          </div>

          {/* Numeric keypad, aligned below the function row */}
          <div
            className="grid"
            style={{
              marginTop: U - GAP + GAP,
              gridTemplateColumns: `repeat(4, ${U - GAP}px)`,
              gridTemplateRows: `repeat(5, ${U - GAP}px)`,
              gap: GAP,
            }}
          >
            {KEYPAD.map((k, i) => renderPadKey(k, `k-${i}`))}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <div className="mt-4 bg-gray-800/60 border border-gray-700/60 rounded-xl overflow-hidden">
        {!selected ? (
          <div className="p-6 text-center text-sm text-gray-500">
            👆 Click any key — letter, modifier, or keypad — to list every shortcut in the guide that uses it.
            <span className="block mt-1 text-gray-600">{focus.size} keys carry a Commands Focus command.</span>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between gap-3 px-5 py-3 bg-gray-900/60 border-b border-gray-700/50">
              <div className="flex items-center gap-3 min-w-0">
                <kbd className="px-2.5 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm font-mono font-bold text-white shrink-0">
                  {selectedLabel}
                </kbd>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">
                    {selectedEntries.length} shortcut{selectedEntries.length !== 1 ? 's' : ''}
                    {focus.get(selected!) && <span className="text-blue-300 font-normal"> · Commands Focus</span>}
                  </div>
                  {focus.get(selected!) && <div className="text-xs text-blue-300/80 truncate">{focus.get(selected!)}</div>}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-300 text-xl leading-none px-2" aria-label="Close">×</button>
            </div>

            {focus.get(selected!) && (
              <div className="px-5 py-3 border-b border-gray-700/40 bg-blue-500/5">
                <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Commands Focus (press key alone)</div>
                <div className="text-sm text-gray-200">{focus.get(selected!)}</div>
              </div>
            )}

            <div className="max-h-[440px] overflow-y-auto divide-y divide-gray-700/30">
              {groupedSorted.length === 0 && (
                <div className="p-5 text-sm text-gray-500">No guide shortcuts use this key.</div>
              )}
              {groupedSorted.map(([num, g]) => (
                <div key={num}>
                  <div className="px-5 py-2 bg-gray-900/40 text-xs font-semibold text-purple-300 sticky top-0">
                    {num}. {g.title} <span className="text-gray-600 font-normal">({g.items.length})</span>
                  </div>
                  {g.items.map((e, i) => (
                    <div key={i} className="flex items-start gap-4 px-5 py-2 hover:bg-gray-700/20">
                      <span className="font-mono text-[13px] text-blue-200 w-44 shrink-0">{e.combo}</span>
                      <span className="text-sm text-gray-200 flex-1">{e.action}</span>
                      <span className="text-[10px] text-gray-600 shrink-0 pt-0.5">{e.sec} · p.{e.page}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

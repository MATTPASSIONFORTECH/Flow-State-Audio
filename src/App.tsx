import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { shortcuts, scenarios, categories, subcategories, type Shortcut, type Scenario } from './data/shortcuts';
import { pdfTotalRows } from './data/pdfShortcuts';
import GuideView from './components/GuideView';
import KeyboardView from './components/KeyboardView';

type ViewMode = 'browse' | 'guide' | 'keyboard' | 'quiz' | 'scenarios' | 'favorites';
type Platform = 'mac' | 'win';

function KeyBadge({ keys }: { keys: string }) {
  const displayKeys = keys.split('+').map(k => k.trim());
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {displayKeys.map((key, i) => (
        <span key={i} className="inline-flex items-center">
          {i > 0 && <span className="text-gray-500 text-xs mr-0.5">+</span>}
          <kbd className={`inline-flex items-center justify-center min-w-[28px] px-2 py-1 text-xs font-mono font-bold rounded
            ${key === 'Cmd' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
              key === 'Option' || key === 'Alt' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
              key === 'Shift' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              key === 'Ctrl' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
              key === 'Space' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4' :
              'bg-gray-600/40 text-gray-200 border border-gray-500/30'}`}>
            {key}
          </kbd>
        </span>
      ))}
    </div>
  );
}

function DifficultyBadge({ level }: { level: string }) {
  const colors = {
    basic: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${colors[level as keyof typeof colors] || colors.basic}`}>
      {level}
    </span>
  );
}

function ShortcutCard({ shortcut, platform, isFavorite, onToggleFavorite, showCategory }: {
  shortcut: Shortcut;
  platform: Platform;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  showCategory?: boolean;
}) {
  const keys = platform === 'mac' ? shortcut.keysMac : shortcut.keysWin;
  const cat = categories.find(c => c.id === shortcut.category);

  return (
    <div className="group relative bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-750 hover:border-gray-600/60 transition-all duration-200 hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start justify-between gap-3 mb-2">
        <KeyBadge keys={keys} />
        <div className="flex items-center gap-2 shrink-0">
          <DifficultyBadge level={shortcut.difficulty} />
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(shortcut.id); }}
            className={`p-1 rounded transition-colors ${isFavorite ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-gray-400 opacity-0 group-hover:opacity-100'}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674h4.88c.96 0 1.364 1.108.58 1.563l-3.952 2.461 1.519 4.674c.3.921-.755 1.688-1.54 1.118l-3.95-2.461-3.95 2.461c-.785.57-1.84-.197-1.54-1.118l1.519-4.674-3.952-2.461c-.784-.455-.38-1.563.58-1.563h4.88l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-200 font-medium leading-snug">{shortcut.description}</p>
      <div className="flex items-center gap-2 mt-2">
        {showCategory && cat && (
          <span className="text-[10px] text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">
            {cat.icon} {cat.label}
          </span>
        )}
        <span className="text-[10px] text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">
          {shortcut.subcategory}
        </span>
      </div>
    </div>
  );
}

function QuizMode({ shortcutsPool, platform, onComplete }: {
  shortcutsPool: Shortcut[];
  platform: Platform;
  onComplete: (score: number, total: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [answered, setAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const shuffled = useMemo(() => {
    const arr = [...shortcutsPool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, Math.min(20, arr.length));
  }, [shortcutsPool]);

  const current = shuffled[currentIndex];
  const isLast = currentIndex >= shuffled.length - 1;

  const checkAnswer = useCallback(() => {
    if (!current || answered) return;
    setAnswered(true);
    const keys = platform === 'mac' ? current.keysMac : current.keysWin;
    const normalizedGuess = userGuess.toLowerCase().replace(/\s/g, '');
    const normalizedAnswer = keys.toLowerCase().replace(/\s/g, '');
    const isCorrect = normalizedGuess === normalizedAnswer || normalizedGuess.includes(normalizedAnswer) || normalizedAnswer.includes(normalizedGuess);
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => {
        const newStreak = s + 1;
        setBestStreak(b => Math.max(b, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
    setShowAnswer(true);
  }, [current, userGuess, answered, platform]);

  const nextQuestion = useCallback(() => {
    if (isLast) {
      onComplete(score + (showAnswer ? 0 : 0), shuffled.length);
      return;
    }
    setCurrentIndex(i => i + 1);
    setShowAnswer(false);
    setAnswered(false);
    setUserGuess('');
    inputRef.current?.focus();
  }, [isLast, score, shuffled.length, showAnswer, onComplete]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !answered) { checkAnswer(); }
      else if (e.key === 'Enter' && answered) { nextQuestion(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [answered, checkAnswer, nextQuestion]);

  if (!current) return <div className="text-center text-gray-400 py-12">No shortcuts available for this quiz!</div>;

  const progress = ((currentIndex + (showAnswer ? 1 : 0)) / shuffled.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Question {currentIndex + 1} of {shuffled.length}</span>
          <div className="flex items-center gap-4">
            {streak > 1 && <span className="text-sm text-orange-400 font-bold">🔥 {streak} streak!</span>}
            <span className="text-sm text-emerald-400 font-semibold">Score: {score}/{currentIndex + (showAnswer ? 1 : 0)}</span>
          </div>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-8 mb-6">
        <div className="text-center mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-widest">What is the shortcut for...</span>
        </div>
        <h3 className="text-2xl font-bold text-white text-center mb-4">{current.description}</h3>
        <div className="flex items-center justify-center gap-2 mb-6">
          <DifficultyBadge level={current.difficulty} />
          <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded-full">{current.subcategory}</span>
        </div>

        {!showAnswer ? (
          <div className="space-y-4">
            <input
              ref={inputRef}
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') checkAnswer(); }}
              placeholder="Type the shortcut (e.g., Cmd+S)..."
              className="w-full px-4 py-3 bg-gray-900/80 border border-gray-600/50 rounded-xl text-center text-lg font-mono text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              autoFocus
            />
            <button
              onClick={checkAnswer}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Check Answer
            </button>
            <button
              onClick={() => { setShowAnswer(true); setAnswered(true); setStreak(0); }}
              className="w-full py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Skip / Show Answer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-4 bg-gray-900/80 border border-gray-600/50 rounded-xl">
                <KeyBadge keys={platform === 'mac' ? current.keysMac : current.keysWin} />
              </div>
            </div>
            {userGuess && (
              <p className={`text-center text-sm ${userGuess.toLowerCase().replace(/\s/g, '').includes((platform === 'mac' ? current.keysMac : current.keysWin).toLowerCase().replace(/\s/g, '')) ? 'text-emerald-400' : 'text-red-400'}`}>
                Your answer: <span className="font-mono">{userGuess}</span>
              </p>
            )}
            <button
              onClick={nextQuestion}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              {isLast ? 'Finish Quiz' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>

      {bestStreak > 2 && (
        <div className="text-center text-sm text-gray-500">
          Best streak: {bestStreak} 🔥
        </div>
      )}
    </div>
  );
}

function QuizResults({ score, total, onRestart, onBack }: {
  score: number;
  total: number;
  onRestart: () => void;
  onBack: () => void;
}) {
  const percentage = Math.round((score / total) * 100);
  const emoji = percentage >= 90 ? '🏆' : percentage >= 70 ? '🌟' : percentage >= 50 ? '👍' : '📚';
  const message = percentage >= 90 ? 'Pro Tools Master!' : percentage >= 70 ? 'Great Knowledge!' : percentage >= 50 ? 'Good Progress!' : 'Keep Practicing!';

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-3xl font-bold text-white mb-2">{message}</h3>
      <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
        {percentage}%
      </div>
      <p className="text-gray-400 mb-8">You got {score} out of {total} correct</p>
      <div className="flex gap-4 justify-center">
        <button onClick={onBack} className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors">
          Back to Browse
        </button>
        <button onClick={onRestart} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all">
          Try Again
        </button>
      </div>
    </div>
  );
}

function ScenarioDetail({ scenario, platform, onBack }: {
  scenario: Scenario;
  platform: Platform;
  onBack: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const getShortcut = (id: string) => shortcuts.find(s => s.id === id);

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to Scenarios
      </button>

      <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{scenario.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{scenario.title}</h3>
            <p className="text-sm text-gray-400">{scenario.description}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-700/50 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${((currentStep + 1) / scenario.steps.length) * 100}%` }} />
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Step {currentStep + 1} of {scenario.steps.length}</span>
        </div>
      </div>

      <div className="space-y-4">
        {scenario.steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <div
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`rounded-xl p-5 border transition-all duration-300 cursor-pointer
                ${isActive ? 'bg-gray-800/90 border-blue-500/50 shadow-lg shadow-blue-500/10' :
                  isCompleted ? 'bg-gray-800/40 border-gray-700/30 opacity-70' :
                  'bg-gray-800/40 border-gray-700/30 hover:bg-gray-800/60'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold
                  ${isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    isActive ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-gray-700/50 text-gray-500 border border-gray-600/30'}`}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold mb-2 ${isActive ? 'text-white' : 'text-gray-300'}`}>{step.action}</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {step.shortcutIds.map(sid => {
                      const s = getShortcut(sid);
                      if (!s) return null;
                      return (
                        <div key={sid} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                          ${isActive ? 'bg-gray-900/80 border border-gray-600/50' : 'bg-gray-700/30 border border-gray-600/30'}`}>
                          <KeyBadge keys={platform === 'mac' ? s.keysMac : s.keysWin} />
                          <span className="text-gray-400 hidden sm:inline">{s.description}</span>
                        </div>
                      );
                    })}
                  </div>
                  {step.tip && isActive && (
                    <div className="mt-3 flex items-start gap-2 text-sm text-amber-400/80 bg-amber-500/5 border border-amber-500/10 rounded-lg p-3">
                      <span className="shrink-0">💡</span>
                      <span>{step.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={() => setCurrentStep(s => Math.min(scenario.steps.length - 1, s + 1))}
          disabled={currentStep >= scenario.steps.length - 1}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [platform, setPlatform] = useState<Platform>(() => {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 'mac' : 'win';
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('pt-favorites') || '[]'); } catch { return []; }
  });
  const [quizCategory, setQuizCategory] = useState('all');
  const [quizActive, setQuizActive] = useState(false);
  const [quizResults, setQuizResults] = useState<{ score: number; total: number } | null>(null);
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [stats, setStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pt-stats') || '{"quizzes":0,"correct":0,"total":0}'); } catch { return { quizzes: 0, correct: 0, total: 0 }; }
  });
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('pt-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  }, []);

  const filteredShortcuts = useMemo(() => {
    let result = shortcuts;
    if (viewMode === 'favorites') {
      result = result.filter(s => favorites.includes(s.id));
    }
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }
    if (selectedSubcategory !== 'all') {
      result = result.filter(s => s.subcategory === selectedSubcategory);
    }
    if (difficultyFilter !== 'all') {
      result = result.filter(s => s.difficulty === difficultyFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.description.toLowerCase().includes(q) ||
        s.keysMac.toLowerCase().includes(q) ||
        s.keysWin.toLowerCase().includes(q) ||
        s.subcategory.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [selectedCategory, selectedSubcategory, searchQuery, viewMode, favorites, difficultyFilter]);

  const quizPool = useMemo(() => {
    if (quizCategory === 'all') return [...shortcuts];
    if (quizCategory === 'favorites') return shortcuts.filter(s => favorites.includes(s.id));
    return shortcuts.filter(s => s.category === quizCategory);
  }, [quizCategory, favorites]);

  const filteredScenarios = useMemo(() => {
    if (selectedCategory === 'all') return scenarios;
    return scenarios.filter(s => s.category === selectedCategory);
  }, [selectedCategory]);

  const handleQuizComplete = useCallback((score: number, total: number) => {
    setQuizResults({ score, total });
    setQuizActive(false);
    const newStats = { quizzes: stats.quizzes + 1, correct: stats.correct + score, total: stats.total + total };
    setStats(newStats);
    localStorage.setItem('pt-stats', JSON.stringify(newStats));
  }, [stats]);

  const startQuiz = useCallback(() => {
    setQuizActive(true);
    setQuizResults(null);
  }, []);

  const activeSubcategories = useMemo(() => {
    if (selectedCategory === 'all' || !subcategories[selectedCategory]) return [];
    return subcategories[selectedCategory];
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedSubcategory('all');
  }, [selectedCategory]);

  // Keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const activeScenario = expandedScenario ? scenarios.find(s => s.id === expandedScenario) : null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7B5CFF] to-[#5B21B6] flex items-center justify-center shadow-lg" title="Pro Tools">
                <svg role="img" viewBox="0 0 24 24" aria-label="Pro Tools" className="w-6 h-6 fill-white">
                  <path d="M.505 15.452Q.27 14.63.14 13.762.01 12.891.01 12q0-2.49.94-4.673.94-2.184 2.572-3.804Q5.155 1.902 7.339.938 9.523 0 12.012 0q2.465 0 4.65.94 2.183.962 3.815 2.583 1.633 1.62 2.572 3.804.94 2.184.94 4.673 0 .869-.118 1.714-.118.846-.352 1.644.21.047.34.07l.13.024-1.363 3.429-.188-.012-.54-.106Q21.1 19.937 20.02 20.9q-1.057.987-2.325 1.668-1.268.68-2.724 1.056-1.433.376-2.96.376-1.55 0-3.005-.376-1.433-.375-2.7-1.068-1.269-.693-2.35-1.656-1.08-.963-1.878-2.16-.282.094-.434.117l-.153.024-1.48-3.382.118.012.376-.059zM22.744 12q0-2.23-.846-4.18-.845-1.95-2.301-3.405-1.456-1.456-3.429-2.301-1.949-.846-4.156-.846-2.231 0-4.18.846-1.973.845-3.429 2.3Q2.947 5.872 2.102 7.82 1.256 9.77 1.256 12q0 .751.106 1.491.106.74.317 1.444.892-.516 2.02-1.972 1.127-1.456 1.808-2.912.352-.728.916-1.597.54-.869 1.338-1.632.799-.763 1.855-1.256 1.057-.517 2.396-.517 1.315 0 2.419.587 1.103.587 1.913 1.35.81.764 1.304 1.492.516.727.657.986.165.282.47.94.329.633.728 1.361.4.728.822 1.433.423.68.798 1.033.259.258.564.446.305.188.61.329.212-.728.33-1.48.117-.751.117-1.526zM12.012 22.732q1.338 0 2.583-.305 1.268-.33 2.383-.916 1.116-.587 2.055-1.41.94-.821 1.668-1.83-.94-.494-2.173-1.645-1.233-1.15-2.5-3.358-.142-.235-.494-.94-.352-.704-.857-1.455-.505-.752-1.115-1.339t-1.268-.587q-.681 0-1.386.634-.704.61-1.303 1.386-.6.775-1.022 1.503-.423.704-.54.916-1.174 2.066-2.477 3.205-1.304 1.139-2.29 1.656.728 1.01 1.667 1.831.963.846 2.079 1.433 1.115.587 2.36.892 1.268.329 2.63.329z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white leading-tight">Pro Tools Shortcuts</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Learn • Practice • Master</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Platform Toggle */}
              <div className="flex bg-gray-800/80 rounded-lg p-0.5 border border-gray-700/50">
                <button
                  onClick={() => setPlatform('mac')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${platform === 'mac' ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  ⌘ Mac
                </button>
                <button
                  onClick={() => setPlatform('win')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${platform === 'win' ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  ⊞ Win
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shortcuts..."
                  className="w-40 sm:w-56 pl-9 pr-8 py-2 bg-gray-800/80 border border-gray-700/50 rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30"
                />
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 bg-gray-700/50 px-1.5 py-0.5 rounded hidden sm:inline">⌘K</kbd>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800/50 bg-gray-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2 -mb-px">
            {([
              { mode: 'browse' as ViewMode, label: 'Browse', icon: '📖' },
              { mode: 'guide' as ViewMode, label: 'All Shortcuts', icon: '📚' },
              { mode: 'keyboard' as ViewMode, label: 'Keyboard', icon: '⌨️' },
              { mode: 'quiz' as ViewMode, label: 'Test Yourself', icon: '🧠' },
              { mode: 'scenarios' as ViewMode, label: 'Scenarios', icon: '🎬' },
              { mode: 'favorites' as ViewMode, label: 'Favorites', icon: '⭐' },
            ]).map(tab => (
              <button
                key={tab.mode}
                onClick={() => {
                  setViewMode(tab.mode);
                  if (tab.mode !== 'quiz') { setQuizActive(false); setQuizResults(null); }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${viewMode === tab.mode ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/40'}`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.mode === 'favorites' && favorites.length > 0 && (
                  <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-1.5 py-0.5 rounded-full">{favorites.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ALL SHORTCUTS (GUIDE) MODE */}
        {viewMode === 'guide' && (
          <GuideView
            searchQuery={searchQuery}
            platform={platform}
            onClearSearch={() => setSearchQuery('')}
          />
        )}

        {/* KEYBOARD MODE */}
        {viewMode === 'keyboard' && <KeyboardView />}

        {/* BROWSE MODE */}
        {viewMode === 'browse' && (
          <div>
            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 border-b border-gray-800/30 -mx-1 px-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${selectedCategory === cat.id
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-black/20`
                      : 'bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-70">
                    {cat.id === 'all' ? shortcuts.length : shortcuts.filter(s => s.category === cat.id).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Subcategory & Difficulty Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {activeSubcategories.length > 0 && (
                <div className="flex items-center gap-1.5 mr-4">
                  <span className="text-xs text-gray-500">Subcategory:</span>
                  <button
                    onClick={() => setSelectedSubcategory('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedSubcategory === 'all' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800/60 text-gray-500 hover:text-gray-300'}`}
                  >
                    All
                  </button>
                  {activeSubcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedSubcategory === sub ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800/60 text-gray-500 hover:text-gray-300'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">Difficulty:</span>
                {['all', 'basic', 'intermediate', 'advanced'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${difficultyFilter === d ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800/60 text-gray-500 hover:text-gray-300'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {filteredShortcuts.length} shortcut{filteredShortcuts.length !== 1 ? 's' : ''} found
                {searchQuery && <span> for "<span className="text-gray-300">{searchQuery}</span>"</span>}
              </p>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-blue-400 hover:text-blue-300">Clear search</button>
              )}
            </div>

            {/* Shortcuts Grid */}
            {filteredShortcuts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredShortcuts.map(s => (
                  <ShortcutCard
                    key={s.id}
                    shortcut={s}
                    platform={platform}
                    isFavorite={favorites.includes(s.id)}
                    onToggleFavorite={toggleFavorite}
                    showCategory={selectedCategory === 'all'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-400">No shortcuts found matching your filters.</p>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setDifficultyFilter('all'); }} className="mt-3 text-blue-400 hover:text-blue-300 text-sm">
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* QUIZ MODE */}
        {viewMode === 'quiz' && (
          <div>
            {!quizActive && !quizResults && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🧠</div>
                  <h2 className="text-3xl font-bold text-white mb-2">Test Your Knowledge</h2>
                  <p className="text-gray-400">See how well you know your Pro Tools shortcuts. Type the shortcut key combination for each prompt!</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <StatCard icon="📝" label="Quizzes Taken" value={stats.quizzes} />
                  <StatCard icon="✅" label="Correct Answers" value={stats.correct} />
                  <StatCard icon="📊" label="Accuracy" value={stats.total > 0 ? `${Math.round((stats.correct / stats.total) * 100)}%` : '—'} />
                </div>

                {/* Category Selection for Quiz */}
                <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 mb-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Choose category to quiz on:</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'All Shortcuts', icon: '⚡' },
                      { id: 'favorites', label: 'Favorites Only', icon: '⭐' },
                      ...categories.filter(c => c.id !== 'all')
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setQuizCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
                          ${quizCategory === cat.id ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-700/50 text-gray-400 hover:text-gray-200 border border-transparent'}`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                        <span className="text-[10px] opacity-60">
                          {cat.id === 'all' ? shortcuts.length : cat.id === 'favorites' ? favorites.length : shortcuts.filter(s => s.category === cat.id).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {(quizCategory === 'favorites' && favorites.length < 3) && (
                  <div className="text-center text-amber-400/80 text-sm mb-4 bg-amber-500/5 border border-amber-500/10 rounded-lg p-3">
                    ⚠️ You need at least 3 favorites to start a quiz. Browse shortcuts and star your favorites!
                  </div>
                )}

                <button
                  onClick={startQuiz}
                  disabled={quizPool.length < 3}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                >
                  Start Quiz → ({Math.min(20, quizPool.length)} questions)
                </button>
              </div>
            )}

            {quizActive && !quizResults && (
              <QuizMode
                shortcutsPool={quizPool}
                platform={platform}
                onComplete={handleQuizComplete}
              />
            )}

            {quizResults && (
              <QuizResults
                score={quizResults.score}
                total={quizResults.total}
                onRestart={startQuiz}
                onBack={() => { setQuizResults(null); setViewMode('browse'); }}
              />
            )}
          </div>
        )}

        {/* SCENARIOS MODE */}
        {viewMode === 'scenarios' && (
          <div>
            {activeScenario ? (
              <ScenarioDetail
                scenario={activeScenario}
                platform={platform}
                onBack={() => setExpandedScenario(null)}
              />
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🎬</div>
                  <h2 className="text-3xl font-bold text-white mb-2">Workflow Scenarios</h2>
                  <p className="text-gray-400">Follow step-by-step workflows for common Pro Tools tasks</p>
                </div>

                {/* Category filter for scenarios */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
                  {categories.filter(c => c.id === 'all' || scenarios.some(s => s.category === c.id)).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                        ${selectedCategory === cat.id
                          ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-black/20`
                          : 'bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredScenarios.map(scenario => (
                    <button
                      key={scenario.id}
                      onClick={() => setExpandedScenario(scenario.id)}
                      className="text-left bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/80 hover:border-gray-600/50 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{scenario.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{scenario.title}</h3>
                          <p className="text-sm text-gray-400 mb-3">{scenario.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2" /></svg>
                              {scenario.steps.length} steps
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                              {scenario.steps.reduce((acc, s) => acc + s.shortcutIds.length, 0)} shortcuts
                            </span>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* FAVORITES MODE */}
        {viewMode === 'favorites' && (
          <div>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">⭐</div>
              <h2 className="text-3xl font-bold text-white mb-2">Your Favorites</h2>
              <p className="text-gray-400">
                {favorites.length > 0
                  ? `${favorites.length} shortcut${favorites.length !== 1 ? 's' : ''} saved for quick reference`
                  : 'Star shortcuts while browsing to add them here!'}
              </p>
            </div>

            {favorites.length > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setFavorites([])}
                  className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                >
                  Clear all favorites
                </button>
              </div>
            )}

            {filteredShortcuts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredShortcuts.map(s => (
                  <ShortcutCard
                    key={s.id}
                    shortcut={s}
                    platform={platform}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                    showCategory
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">⭐</div>
                <p className="text-gray-400 mb-4">No favorites yet.</p>
                <button onClick={() => setViewMode('browse')} className="text-blue-400 hover:text-blue-300 text-sm">
                  Browse shortcuts →
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-gray-600">
            Pro Tools Shortcut Master — {pdfTotalRows} shortcuts from the Avid guide + {shortcuts.length} practice shortcuts across {categories.length - 1} categories
          </p>
          <p className="text-xs text-gray-700 mt-1">
            Shortcuts reference for Avid Pro Tools. Not affiliated with Avid Technology, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}

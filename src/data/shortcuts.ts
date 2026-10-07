export interface Shortcut {
  id: string;
  keys: string; // Display format like "Cmd+S"
  keysMac: string;
  keysWin: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: ScenarioStep[];
  icon: string;
}

export interface ScenarioStep {
  action: string;
  shortcutIds: string[];
  tip?: string;
}

export const categories = [
  { id: 'all', label: 'All', icon: '⚡', color: 'from-gray-500 to-gray-600' },
  { id: 'transport', label: 'Transport', icon: '▶️', color: 'from-green-500 to-emerald-600' },
  { id: 'recording', label: 'Recording', icon: '🔴', color: 'from-red-500 to-rose-600' },
  { id: 'editing', label: 'Editing', icon: '✂️', color: 'from-blue-500 to-indigo-600' },
  { id: 'mixing', label: 'Mixing', icon: '🎛️', color: 'from-purple-500 to-violet-600' },
  { id: 'mastering', label: 'Mastering', icon: '💿', color: 'from-amber-500 to-orange-600' },
  { id: 'navigation', label: 'Navigation', icon: '🧭', color: 'from-cyan-500 to-teal-600' },
  { id: 'midi', label: 'MIDI', icon: '🎹', color: 'from-pink-500 to-fuchsia-600' },
  { id: 'workflow', label: 'Workflow', icon: '🔄', color: 'from-lime-500 to-green-600' },
];

export const subcategories: Record<string, string[]> = {
  transport: ['Playback', 'Looping', 'Markers'],
  recording: ['Track Setup', 'Punch In/Out', 'Loop Recording', 'Input Monitoring'],
  editing: ['Selection', 'Clip Editing', 'Nudge', 'Trim', 'Fade', 'Time Operations', 'Elastic Audio'],
  mixing: ['Faders & Panning', 'Sends & Inserts', 'Automation', 'Groups', 'Busing'],
  mastering: ['Bounce & Export', 'Metering', 'Processing', 'Dithering'],
  navigation: ['Zoom', 'Scroll', 'Window Switching', 'Track Selection'],
  midi: ['Input & Quantize', 'Velocity & Duration', 'MIDI Editing', 'Virtual Instruments'],
  workflow: ['File & Session', 'Undo & History', 'Window Layouts', 'Custom'],
};

export const shortcuts: Shortcut[] = [
  // === TRANSPORT ===
  { id: 't1', keys: 'Space', keysMac: 'Space', keysWin: 'Space', description: 'Play / Stop', category: 'transport', subcategory: 'Playback', tags: ['play', 'stop', 'toggle'], difficulty: 'basic' },
  { id: 't2', keys: 'Cmd+Space', keysMac: 'Cmd+Space', keysWin: 'Ctrl+Space', description: 'Record', category: 'transport', subcategory: 'Playback', tags: ['record', 'transport'], difficulty: 'basic' },
  { id: 't3', keys: 'Return', keysMac: 'Return', keysWin: 'Enter', description: 'Go to start / Stop playback', category: 'transport', subcategory: 'Playback', tags: ['start', 'beginning'], difficulty: 'basic' },
  { id: 't4', keys: 'Cmd+Shift+Space', keysMac: 'Cmd+Shift+Space', keysWin: 'Ctrl+Shift+Space', description: 'Half-speed playback', category: 'transport', subcategory: 'Playback', tags: ['half', 'speed', 'slow'], difficulty: 'advanced' },
  { id: 't5', keys: 'L', keysMac: 'L', keysWin: 'L', description: 'Loop playback toggle', category: 'transport', subcategory: 'Looping', tags: ['loop', 'repeat'], difficulty: 'basic' },
  { id: 't6', keys: 'Shift+L', keysMac: 'Shift+L', keysWin: 'Shift+L', description: 'Loop recording toggle', category: 'transport', subcategory: 'Looping', tags: ['loop', 'record'], difficulty: 'intermediate' },
  { id: 't7', keys: 'I', keysMac: 'I', keysWin: 'I', description: 'Insert marker at cursor', category: 'transport', subcategory: 'Markers', tags: ['marker', 'insert', 'location'], difficulty: 'basic' },
  { id: 't8', keys: '1-9', keysMac: '1-9 (on numeric keypad)', keysWin: '1-9 (on numeric keypad)', description: 'Recall memory location 1-9', category: 'transport', subcategory: 'Markers', tags: ['memory', 'location', 'recall'], difficulty: 'intermediate' },
  { id: 't9', keys: '.', keysMac: '.', keysWin: '.', description: 'Toggle click / metronome', category: 'transport', subcategory: 'Playback', tags: ['click', 'metronome'], difficulty: 'basic' },
  { id: 't10', keys: 'F1-F4', keysMac: 'F1-F4', keysWin: 'F1-F4', description: 'Smart tool modes (Trimmer / Selector / Grabber / Smart)', category: 'transport', subcategory: 'Playback', tags: ['smart', 'tool', 'mode'], difficulty: 'basic' },
  { id: 't11', keys: 'Cmd+M', keysMac: 'Cmd+M', keysWin: 'Ctrl+M', description: 'Toggle metronome click', category: 'transport', subcategory: 'Playback', tags: ['click', 'metronome'], difficulty: 'intermediate' },
  { id: 't12', keys: 'J', keysMac: 'J', keysWin: 'J', description: 'Toggle pre-roll', category: 'transport', subcategory: 'Playback', tags: ['pre-roll'], difficulty: 'intermediate' },
  { id: 't13', keys: 'K', keysMac: 'K', keysWin: 'K', description: 'Toggle post-roll', category: 'transport', subcategory: 'Playback', tags: ['post-roll'], difficulty: 'intermediate' },

  // === RECORDING ===
  { id: 'r1', keys: 'F5', keysMac: 'F5', keysWin: 'F5', description: 'Toggle record enable on selected track', category: 'recording', subcategory: 'Track Setup', tags: ['arm', 'record enable'], difficulty: 'basic' },
  { id: 'r2', keys: 'Cmd+Shift+F5', keysMac: 'Cmd+Shift+F5', keysWin: 'Ctrl+Shift+F5', description: 'Safe record enable (prevent accidental recording)', category: 'recording', subcategory: 'Track Setup', tags: ['safe', 'record'], difficulty: 'intermediate' },
  { id: 'r3', keys: 'F6', keysMac: 'F6', keysWin: 'F6', description: 'Toggle input monitoring on selected track', category: 'recording', subcategory: 'Input Monitoring', tags: ['input', 'monitor'], difficulty: 'basic' },
  { id: 'r4', keys: 'Cmd+Shift+N', keysMac: 'Cmd+Shift+N', keysWin: 'Ctrl+Shift+N', description: 'New track dialog', category: 'recording', subcategory: 'Track Setup', tags: ['new', 'track', 'create'], difficulty: 'basic' },
  { id: 'r5', keys: 'P', keysMac: 'P', keysWin: 'P', description: 'Punch in at selection start', category: 'recording', subcategory: 'Punch In/Out', tags: ['punch', 'in'], difficulty: 'intermediate' },
  { id: 'r6', keys: ';', keysMac: ';', keysWin: ';', description: 'Punch out at selection end', category: 'recording', subcategory: 'Punch In/Out', tags: ['punch', 'out'], difficulty: 'intermediate' },
  { id: 'r7', keys: 'Cmd+Shift+P', keysMac: 'Cmd+Shift+P', keysWin: 'Ctrl+Shift+P', description: 'Punch pass (auto punch in/out)', category: 'recording', subcategory: 'Punch In/Out', tags: ['punch', 'auto', 'pass'], difficulty: 'advanced' },
  { id: 'r8', keys: 'Cmd+Option+Space', keysMac: 'Cmd+Option+Space', keysWin: 'Ctrl+Alt+Space', description: 'Start recording from selection', category: 'recording', subcategory: 'Punch In/Out', tags: ['record', 'selection'], difficulty: 'intermediate' },
  { id: 'r9', keys: 'Option+K', keysMac: 'Option+K', keysWin: 'Alt+K', description: 'Toggle input only mode', category: 'recording', subcategory: 'Input Monitoring', tags: ['input', 'only'], difficulty: 'intermediate' },
  { id: 'r10', keys: 'Cmd+Shift+R', keysMac: 'Cmd+Shift+R', keysWin: 'Ctrl+Shift+R', description: 'Toggle record safety', category: 'recording', subcategory: 'Track Setup', tags: ['safety', 'record'], difficulty: 'intermediate' },
  { id: 'r11', keys: 'Shift+R', keysMac: 'Shift+R', keysWin: 'Shift+R', description: 'Repeat recording / duplicate', category: 'recording', subcategory: 'Loop Recording', tags: ['repeat', 'duplicate'], difficulty: 'intermediate' },

  // === EDITING ===
  { id: 'e1', keys: 'Cmd+A', keysMac: 'Cmd+A', keysWin: 'Ctrl+A', description: 'Select all in track', category: 'editing', subcategory: 'Selection', tags: ['select', 'all'], difficulty: 'basic' },
  { id: 'e2', keys: 'Cmd+Shift+A', keysMac: 'Cmd+Shift+A', keysWin: 'Ctrl+Shift+A', description: 'Select all clips in session', category: 'editing', subcategory: 'Selection', tags: ['select', 'all', 'session'], difficulty: 'intermediate' },
  { id: 'e3', keys: 'Cmd+C', keysMac: 'Cmd+C', keysWin: 'Ctrl+C', description: 'Copy', category: 'editing', subcategory: 'Clip Editing', tags: ['copy'], difficulty: 'basic' },
  { id: 'e4', keys: 'Cmd+X', keysMac: 'Cmd+X', keysWin: 'Ctrl+X', description: 'Cut', category: 'editing', subcategory: 'Clip Editing', tags: ['cut'], difficulty: 'basic' },
  { id: 'e5', keys: 'Cmd+V', keysMac: 'Cmd+V', keysWin: 'Ctrl+V', description: 'Paste', category: 'editing', subcategory: 'Clip Editing', tags: ['paste'], difficulty: 'basic' },
  { id: 'e6', keys: 'B', keysMac: 'B', keysWin: 'B', description: 'Separate clip at cursor', category: 'editing', subcategory: 'Clip Editing', tags: ['separate', 'split', 'clip'], difficulty: 'basic' },
  { id: 'e7', keys: 'Cmd+E', keysMac: 'Cmd+E', keysWin: 'Ctrl+E', description: 'Consolidate clip', category: 'editing', subcategory: 'Clip Editing', tags: ['consolidate', 'render'], difficulty: 'intermediate' },
  { id: 'e8', keys: 'Cmd+D', keysMac: 'Cmd+D', keysWin: 'Ctrl+D', description: 'Duplicate selection', category: 'editing', subcategory: 'Clip Editing', tags: ['duplicate'], difficulty: 'basic' },
  { id: 'e9', keys: 'Option+Drag', keysMac: 'Option+Drag', keysWin: 'Alt+Drag', description: 'Copy clip by dragging', category: 'editing', subcategory: 'Clip Editing', tags: ['copy', 'drag'], difficulty: 'basic' },
  { id: 'e10', keys: 'Cmd+Z', keysMac: 'Cmd+Z', keysWin: 'Ctrl+Z', description: 'Undo', category: 'editing', subcategory: 'Clip Editing', tags: ['undo'], difficulty: 'basic' },
  { id: 'e11', keys: 'Cmd+Shift+Z', keysMac: 'Cmd+Shift+Z', keysWin: 'Ctrl+Shift+Z', description: 'Redo', category: 'editing', subcategory: 'Clip Editing', tags: ['redo'], difficulty: 'basic' },
  { id: 'e12', keys: '+', keysMac: '+', keysWin: '+', description: 'Nudge forward', category: 'editing', subcategory: 'Nudge', tags: ['nudge', 'forward'], difficulty: 'basic' },
  { id: 'e13', keys: '-', keysMac: '-', keysWin: '-', description: 'Nudge backward', category: 'editing', subcategory: 'Nudge', tags: ['nudge', 'backward'], difficulty: 'basic' },
  { id: 'e14', keys: 'Cmd+[', keysMac: 'Cmd+[', keysWin: 'Ctrl+[', description: 'Nudge selection earlier', category: 'editing', subcategory: 'Nudge', tags: ['nudge', 'earlier'], difficulty: 'intermediate' },
  { id: 'e15', keys: 'Cmd+]', keysMac: 'Cmd+]', keysWin: 'Ctrl+]', description: 'Nudge selection later', category: 'editing', subcategory: 'Nudge', tags: ['nudge', 'later'], difficulty: 'intermediate' },
  { id: 'e16', keys: 'T', keysMac: 'T', keysWin: 'T', description: 'Trim to selection (front)', category: 'editing', subcategory: 'Trim', tags: ['trim', 'front'], difficulty: 'intermediate' },
  { id: 'e17', keys: 'Shift+T', keysMac: 'Shift+T', keysWin: 'Shift+T', description: 'Trim to selection (back)', category: 'editing', subcategory: 'Trim', tags: ['trim', 'back', 'tail'], difficulty: 'intermediate' },
  { id: 'e18', keys: 'F', keysMac: 'F', keysWin: 'F', description: 'Create fade on selection', category: 'editing', subcategory: 'Fade', tags: ['fade', 'create'], difficulty: 'basic' },
  { id: 'e19', keys: 'Cmd+F', keysMac: 'Cmd+F', keysWin: 'Ctrl+F', description: 'Fade dialog (fine control)', category: 'editing', subcategory: 'Fade', tags: ['fade', 'dialog'], difficulty: 'intermediate' },
  { id: 'e20', keys: 'D', keysMac: 'D', keysWin: 'D', description: 'Default fade in/out', category: 'editing', subcategory: 'Fade', tags: ['fade', 'default'], difficulty: 'intermediate' },
  { id: 'e21', keys: 'Delete', keysMac: 'Delete', keysWin: 'Delete', description: 'Delete selection / remove clip', category: 'editing', subcategory: 'Clip Editing', tags: ['delete', 'remove'], difficulty: 'basic' },
  { id: 'e22', keys: 'Cmd+Delete', keysMac: 'Cmd+Delete', keysWin: 'Ctrl+Delete', description: 'Delete and close gap (ripple delete)', category: 'editing', subcategory: 'Clip Editing', tags: ['ripple', 'delete', 'close gap'], difficulty: 'intermediate' },
  { id: 'e23', keys: 'A', keysMac: 'A', keysWin: 'A', description: 'Trim region to selection', category: 'editing', subcategory: 'Trim', tags: ['trim', 'region'], difficulty: 'basic' },
  { id: 'e24', keys: 'S', keysMac: 'S', keysWin: 'S', description: 'Separate at selection', category: 'editing', subcategory: 'Clip Editing', tags: ['separate', 'split'], difficulty: 'basic' },
  { id: 'e25', keys: 'Cmd+Shift+H', keysMac: 'Cmd+Shift+H', keysWin: 'Ctrl+Shift+H', description: 'Shrink selection edges by nudge value', category: 'editing', subcategory: 'Selection', tags: ['shrink', 'selection'], difficulty: 'advanced' },
  { id: 'e26', keys: 'Cmd+Shift+E', keysMac: 'Cmd+Shift+E', keysWin: 'Ctrl+Shift+E', description: 'Expand selection edges by nudge value', category: 'editing', subcategory: 'Selection', tags: ['expand', 'selection'], difficulty: 'advanced' },
  { id: 'e27', keys: 'R', keysMac: 'R', keysWin: 'R', description: 'Capture region', category: 'editing', subcategory: 'Selection', tags: ['capture', 'region'], difficulty: 'intermediate' },
  { id: 'e28', keys: 'Cmd+Option+C', keysMac: 'Cmd+Option+C', keysWin: 'Ctrl+Alt+C', description: 'Clear clip list', category: 'editing', subcategory: 'Clip Editing', tags: ['clear', 'clip list'], difficulty: 'advanced' },
  { id: 'e29', keys: 'Option+H', keysMac: 'Option+H', keysWin: 'Alt+H', description: 'Toggle elastic audio on selected track', category: 'editing', subcategory: 'Elastic Audio', tags: ['elastic', 'time stretch'], difficulty: 'advanced' },

  // === MIXING ===
  { id: 'm1', keys: 'Cmd+Option+Up', keysMac: 'Cmd+Option+↑', keysWin: 'Ctrl+Alt+↑', description: 'Raise fader by 1dB', category: 'mixing', subcategory: 'Faders & Panning', tags: ['fader', 'volume', 'raise'], difficulty: 'intermediate' },
  { id: 'm2', keys: 'Cmd+Option+Down', keysMac: 'Cmd+Option+↓', keysWin: 'Ctrl+Alt+↓', description: 'Lower fader by 1dB', category: 'mixing', subcategory: 'Faders & Panning', tags: ['fader', 'volume', 'lower'], difficulty: 'intermediate' },
  { id: 'm3', keys: 'Option+Shift+Click', keysMac: 'Option+Shift+Click', keysWin: 'Alt+Shift+Click', description: 'Set fader to unity (0 dB)', category: 'mixing', subcategory: 'Faders & Panning', tags: ['unity', 'fader', 'reset'], difficulty: 'intermediate' },
  { id: 'm4', keys: 'Cmd+G', keysMac: 'Cmd+G', keysWin: 'Ctrl+G', description: 'Create group', category: 'mixing', subcategory: 'Groups', tags: ['group', 'create'], difficulty: 'basic' },
  { id: 'm5', keys: 'Cmd+Shift+G', keysMac: 'Cmd+Shift+G', keysWin: 'Ctrl+Shift+G', description: 'Suspend all groups', category: 'mixing', subcategory: 'Groups', tags: ['group', 'suspend'], difficulty: 'intermediate' },
  { id: 'm6', keys: 'Cmd+Option+0', keysMac: 'Cmd+Option+0', keysWin: 'Ctrl+Alt+0', description: 'Toggle automation preview', category: 'mixing', subcategory: 'Automation', tags: ['automation', 'preview'], difficulty: 'intermediate' },
  { id: 'm7', keys: 'Cmd+Option+H', keysMac: 'Cmd+Option+H', keysWin: 'Ctrl+Alt+H', description: 'Switch to hybrid automation', category: 'mixing', subcategory: 'Automation', tags: ['automation', 'hybrid'], difficulty: 'advanced' },
  { id: 'm8', keys: 'N', keysMac: 'N', keysWin: 'N', description: 'Toggle volume / pan / send view on selected track', category: 'mixing', subcategory: 'Faders & Panning', tags: ['view', 'pan', 'volume'], difficulty: 'basic' },
  { id: 'm9', keys: 'Cmd+Option+M', keysMac: 'Cmd+Option+M', keysWin: 'Ctrl+Alt+M', description: 'Mute all tracks', category: 'mixing', subcategory: 'Faders & Panning', tags: ['mute', 'all'], difficulty: 'intermediate' },
  { id: 'm10', keys: 'Option+Click', keysMac: 'Option+Click', keysWin: 'Alt+Click', description: 'Delete send / insert', category: 'mixing', subcategory: 'Sends & Inserts', tags: ['delete', 'send', 'insert'], difficulty: 'intermediate' },
  { id: 'm11', keys: 'Cmd+Option+S', keysMac: 'Cmd+Option+S', keysWin: 'Ctrl+Alt+S', description: 'Solo all tracks', category: 'mixing', subcategory: 'Faders & Panning', tags: ['solo', 'all'], difficulty: 'intermediate' },
  { id: 'm12', keys: 'Cmd+Shift+M', keysMac: 'Cmd+Shift+M', keysWin: 'Ctrl+Shift+M', description: 'Mute selected track', category: 'mixing', subcategory: 'Faders & Panning', tags: ['mute', 'track'], difficulty: 'basic' },
  { id: 'm13', keys: 'Cmd+Shift+S', keysMac: 'Cmd+Shift+S', keysWin: 'Ctrl+Shift+S', description: 'Solo selected track', category: 'mixing', subcategory: 'Faders & Panning', tags: ['solo', 'track'], difficulty: 'basic' },
  { id: 'm14', keys: 'Cmd+Option+J', keysMac: 'Cmd+Option+J', keysWin: 'Ctrl+Alt+J', description: 'Toggle mix view', category: 'mixing', subcategory: 'Faders & Panning', tags: ['mix', 'view'], difficulty: 'basic' },
  { id: 'm15', keys: 'Cmd+Option+L', keysMac: 'Cmd+Option+L', keysWin: 'Ctrl+Alt+L', description: 'Toggle latch automation write', category: 'mixing', subcategory: 'Automation', tags: ['automation', 'latch', 'write'], difficulty: 'advanced' },

  // === MASTERING ===
  { id: 'mas1', keys: 'Cmd+Option+B', keysMac: 'Cmd+Option+B', keysWin: 'Ctrl+Alt+B', description: 'Bounce mix', category: 'mastering', subcategory: 'Bounce & Export', tags: ['bounce', 'mix', 'export'], difficulty: 'basic' },
  { id: 'mas2', keys: 'Cmd+Shift+K', keysMac: 'Cmd+Shift+K', keysWin: 'Ctrl+Shift+K', description: 'Bounce to disk', category: 'mastering', subcategory: 'Bounce & Export', tags: ['bounce', 'disk'], difficulty: 'intermediate' },
  { id: 'mas3', keys: 'Cmd+Shift+E', keysMac: 'Cmd+Shift+E', keysWin: 'Ctrl+Shift+E', description: 'Export selected tracks as new session', category: 'mastering', subcategory: 'Bounce & Export', tags: ['export', 'session'], difficulty: 'advanced' },
  { id: 'mas4', keys: 'Cmd+Option+Y', keysMac: 'Cmd+Option+Y', keysWin: 'Ctrl+Alt+Y', description: 'Toggle track meter view', category: 'mastering', subcategory: 'Metering', tags: ['meter', 'view'], difficulty: 'intermediate' },
  { id: 'mas5', keys: 'Cmd+Shift+I', keysMac: 'Cmd+Shift+I', keysWin: 'Ctrl+Shift+I', description: 'Insert master fader track', category: 'mastering', subcategory: 'Processing', tags: ['master', 'fader', 'insert'], difficulty: 'intermediate' },
  { id: 'mas6', keys: 'Option+Shift+M', keysMac: 'Option+Shift+M', keysWin: 'Alt+Shift+M', description: 'Switch meter to peak hold', category: 'mastering', subcategory: 'Metering', tags: ['meter', 'peak'], difficulty: 'intermediate' },
  { id: 'mas7', keys: 'Cmd+Option+W', keysMac: 'Cmd+Option+W', keysWin: 'Ctrl+Alt+W', description: 'Offline bounce (faster render)', category: 'mastering', subcategory: 'Bounce & Export', tags: ['bounce', 'offline', 'fast'], difficulty: 'advanced' },
  { id: 'mas8', keys: 'Cmd+Option+R', keysMac: 'Cmd+Option+R', keysWin: 'Ctrl+Alt+R', description: 'Real-time bounce', category: 'mastering', subcategory: 'Bounce & Export', tags: ['bounce', 'realtime'], difficulty: 'advanced' },
  { id: 'mas9', keys: 'Cmd+Shift+9', keysMac: 'Cmd+Shift+9', keysWin: 'Ctrl+Shift+9', description: 'Apply dither', category: 'mastering', subcategory: 'Dithering', tags: ['dither'], difficulty: 'advanced' },

  // === NAVIGATION ===
  { id: 'n1', keys: 'Cmd+Option+]', keysMac: 'Cmd+Option+]', keysWin: 'Ctrl+Alt+]', description: 'Zoom in horizontal', category: 'navigation', subcategory: 'Zoom', tags: ['zoom', 'in', 'horizontal'], difficulty: 'basic' },
  { id: 'n2', keys: 'Cmd+Option+[', keysMac: 'Cmd+Option+[', keysWin: 'Ctrl+Alt+[', description: 'Zoom out horizontal', category: 'navigation', subcategory: 'Zoom', tags: ['zoom', 'out', 'horizontal'], difficulty: 'basic' },
  { id: 'n3', keys: 'Cmd+Option+\\', keysMac: 'Cmd+Option+\\', keysWin: 'Ctrl+Alt+\\', description: 'Zoom to fit entire session', category: 'navigation', subcategory: 'Zoom', tags: ['zoom', 'fit', 'session'], difficulty: 'intermediate' },
  { id: 'n4', keys: 'Cmd+Shift+]', keysMac: 'Cmd+Shift+]', keysWin: 'Ctrl+Shift+]', description: 'Zoom in vertical (tracks)', category: 'navigation', subcategory: 'Zoom', tags: ['zoom', 'vertical', 'tracks'], difficulty: 'intermediate' },
  { id: 'n5', keys: 'Cmd+Shift+[', keysMac: 'Cmd+Shift+[', keysWin: 'Ctrl+Shift+[', description: 'Zoom out vertical (tracks)', category: 'navigation', subcategory: 'Zoom', tags: ['zoom', 'vertical', 'tracks'], difficulty: 'intermediate' },
  { id: 'n6', keys: 'Cmd+=', keysMac: 'Cmd+=', keysWin: 'Ctrl+=', description: 'Zoom in', category: 'navigation', subcategory: 'Zoom', tags: ['zoom', 'in'], difficulty: 'basic' },
  { id: 'n7', keys: 'Cmd+-', keysMac: 'Cmd+-', keysWin: 'Ctrl+-', description: 'Zoom out', category: 'navigation', subcategory: 'Zoom', tags: ['zoom', 'out'], difficulty: 'basic' },
  { id: 'n8', keys: 'Option+Scroll', keysMac: 'Option+Scroll', keysWin: 'Alt+Scroll', description: 'Zoom with scroll wheel', category: 'navigation', subcategory: 'Zoom', tags: ['zoom', 'scroll'], difficulty: 'basic' },
  { id: 'n9', keys: 'Cmd+1', keysMac: 'Cmd+1', keysWin: 'Ctrl+1', description: 'Show/hide Mix window', category: 'navigation', subcategory: 'Window Switching', tags: ['mix', 'window'], difficulty: 'basic' },
  { id: 'n10', keys: 'Cmd+2', keysMac: 'Cmd+2', keysWin: 'Ctrl+2', description: 'Show/hide Edit window', category: 'navigation', subcategory: 'Window Switching', tags: ['edit', 'window'], difficulty: 'basic' },
  { id: 'n11', keys: 'Cmd+3', keysMac: 'Cmd+3', keysWin: 'Ctrl+3', description: 'Toggle Edit & Mix windows', category: 'navigation', subcategory: 'Window Switching', tags: ['toggle', 'edit', 'mix'], difficulty: 'basic' },
  { id: 'n12', keys: 'Cmd+4', keysMac: 'Cmd+4', keysWin: 'Ctrl+4', description: 'Show/hide Transport window', category: 'navigation', subcategory: 'Window Switching', tags: ['transport', 'window'], difficulty: 'basic' },
  { id: 'n13', keys: 'Up/Down', keysMac: '↑/↓', keysWin: '↑/↓', description: 'Move selection to next/prev track', category: 'navigation', subcategory: 'Track Selection', tags: ['track', 'next', 'previous'], difficulty: 'basic' },
  { id: 'n14', keys: 'Left/Right', keysMac: '←/→', keysWin: '←/→', description: 'Move cursor by nudge value', category: 'navigation', subcategory: 'Scroll', tags: ['cursor', 'nudge'], difficulty: 'basic' },
  { id: 'n15', keys: 'Tab', keysMac: 'Tab', keysWin: 'Tab', description: 'Move cursor to next region boundary', category: 'navigation', subcategory: 'Scroll', tags: ['tab', 'boundary', 'next'], difficulty: 'intermediate' },
  { id: 'n16', keys: 'Option+Tab', keysMac: 'Option+Tab', keysWin: 'Alt+Tab', description: 'Move cursor to previous region boundary', category: 'navigation', subcategory: 'Scroll', tags: ['tab', 'boundary', 'previous'], difficulty: 'intermediate' },
  { id: 'n17', keys: 'Home/End', keysMac: 'Home/End', keysWin: 'Home/End', description: 'Go to session start/end', category: 'navigation', subcategory: 'Scroll', tags: ['start', 'end', 'session'], difficulty: 'basic' },

  // === MIDI ===
  { id: 'mid1', keys: 'Cmd+0', keysMac: 'Cmd+0', keysWin: 'Ctrl+0', description: 'Quantize to grid', category: 'midi', subcategory: 'Input & Quantize', tags: ['quantize', 'grid'], difficulty: 'basic' },
  { id: 'mid2', keys: 'Cmd+Option+0', keysMac: 'Cmd+Option+0', keysWin: 'Ctrl+Alt+0', description: 'Quantize options dialog', category: 'midi', subcategory: 'Input & Quantize', tags: ['quantize', 'options'], difficulty: 'intermediate' },
  { id: 'mid3', keys: 'Option+H', keysMac: 'Option+H', keysWin: 'Alt+H', description: 'Half-grid resolution', category: 'midi', subcategory: 'Input & Quantize', tags: ['grid', 'half', 'resolution'], difficulty: 'intermediate' },
  { id: 'mid4', keys: 'Option+D', keysMac: 'Option+D', keysWin: 'Alt+D', description: 'Double-grid resolution', category: 'midi', subcategory: 'Input & Quantize', tags: ['grid', 'double', 'resolution'], difficulty: 'intermediate' },
  { id: 'mid5', keys: 'Cmd+Shift+Up', keysMac: 'Cmd+Shift+↑', keysWin: 'Ctrl+Shift+↑', description: 'Transpose up semitone', category: 'midi', subcategory: 'Velocity & Duration', tags: ['transpose', 'pitch'], difficulty: 'intermediate' },
  { id: 'mid6', keys: 'Cmd+Shift+Down', keysMac: 'Cmd+Shift+↓', keysWin: 'Ctrl+Shift+↓', description: 'Transpose down semitone', category: 'midi', subcategory: 'Velocity & Duration', tags: ['transpose', 'pitch'], difficulty: 'intermediate' },
  { id: 'mid7', keys: 'Option+Shift+Up', keysMac: 'Option+Shift+↑', keysWin: 'Alt+Shift+↑', description: 'Increase velocity by 1', category: 'midi', subcategory: 'Velocity & Duration', tags: ['velocity', 'increase'], difficulty: 'intermediate' },
  { id: 'mid8', keys: 'Option+Shift+Down', keysMac: 'Option+Shift+↓', keysWin: 'Alt+Shift+↓', description: 'Decrease velocity by 1', category: 'midi', subcategory: 'Velocity & Duration', tags: ['velocity', 'decrease'], difficulty: 'intermediate' },
  { id: 'mid9', keys: 'Cmd+Shift+V', keysMac: 'Cmd+Shift+V', keysWin: 'Ctrl+Shift+V', description: 'Paste with velocity adjustment', category: 'midi', subcategory: 'MIDI Editing', tags: ['paste', 'velocity'], difficulty: 'advanced' },
  { id: 'mid10', keys: 'Cmd+Option+I', keysMac: 'Cmd+Option+I', keysWin: 'Ctrl+Alt+I', description: 'Insert MIDI event', category: 'midi', subcategory: 'MIDI Editing', tags: ['insert', 'midi', 'event'], difficulty: 'intermediate' },
  { id: 'mid11', keys: 'Cmd+Shift+M', keysMac: 'Cmd+Shift+M', keysWin: 'Ctrl+Shift+M', description: 'MIDI merge mode toggle', category: 'midi', subcategory: 'Input & Quantize', tags: ['midi', 'merge'], difficulty: 'intermediate' },
  { id: 'mid12', keys: 'Cmd+Option+U', keysMac: 'Cmd+Option+U', keysWin: 'Ctrl+Alt+U', description: 'MIDI Input filter dialog', category: 'midi', subcategory: 'Input & Quantize', tags: ['midi', 'input', 'filter'], difficulty: 'advanced' },
  { id: 'mid13', keys: 'Cmd+L', keysMac: 'Cmd+L', keysWin: 'Ctrl+L', description: 'Select/link MIDI controller', category: 'midi', subcategory: 'Virtual Instruments', tags: ['midi', 'controller', 'link'], difficulty: 'advanced' },
  { id: 'mid14', keys: 'Cmd+7', keysMac: 'Cmd+7', keysWin: 'Ctrl+7', description: 'Show MIDI editor', category: 'midi', subcategory: 'MIDI Editing', tags: ['midi', 'editor', 'piano roll'], difficulty: 'basic' },

  // === WORKFLOW ===
  { id: 'w1', keys: 'Cmd+S', keysMac: 'Cmd+S', keysWin: 'Ctrl+S', description: 'Save session', category: 'workflow', subcategory: 'File & Session', tags: ['save', 'session'], difficulty: 'basic' },
  { id: 'w2', keys: 'Cmd+Shift+S', keysMac: 'Cmd+Shift+S', keysWin: 'Ctrl+Shift+S', description: 'Save session as...', category: 'workflow', subcategory: 'File & Session', tags: ['save', 'as'], difficulty: 'basic' },
  { id: 'w3', keys: 'Cmd+O', keysMac: 'Cmd+O', keysWin: 'Ctrl+O', description: 'Open session', category: 'workflow', subcategory: 'File & Session', tags: ['open', 'session'], difficulty: 'basic' },
  { id: 'w4', keys: 'Cmd+N', keysMac: 'Cmd+N', keysWin: 'Ctrl+N', description: 'New session', category: 'workflow', subcategory: 'File & Session', tags: ['new', 'session'], difficulty: 'basic' },
  { id: 'w5', keys: 'Cmd+I', keysMac: 'Cmd+I', keysWin: 'Ctrl+I', description: 'Import audio/MIDI', category: 'workflow', subcategory: 'File & Session', tags: ['import', 'audio'], difficulty: 'basic' },
  { id: 'w6', keys: 'Cmd+Option+U', keysMac: 'Cmd+Option+U', keysWin: 'Ctrl+Alt+U', description: 'Undo history', category: 'workflow', subcategory: 'Undo & History', tags: ['undo', 'history'], difficulty: 'intermediate' },
  { id: 'w7', keys: 'Cmd+Option+W', keysMac: 'Cmd+Option+W', keysWin: 'Ctrl+Alt+W', description: 'Window config recall', category: 'workflow', subcategory: 'Window Layouts', tags: ['window', 'config', 'layout'], difficulty: 'intermediate' },
  { id: 'w8', keys: 'Cmd+Option+Num', keysMac: 'Cmd+Option+0-9', keysWin: 'Ctrl+Alt+0-9', description: 'Recall window configuration 0-9', category: 'workflow', subcategory: 'Window Layouts', tags: ['window', 'recall'], difficulty: 'intermediate' },
  { id: 'w9', keys: 'Cmd+Shift+Num', keysMac: 'Cmd+Shift+0-9', keysWin: 'Ctrl+Shift+0-9', description: 'Save window configuration 0-9', category: 'workflow', subcategory: 'Window Layouts', tags: ['window', 'save'], difficulty: 'intermediate' },
  { id: 'w10', keys: 'Cmd+;', keysMac: 'Cmd+;', keysWin: 'Ctrl+;', description: 'Open preferences', category: 'workflow', subcategory: 'Custom', tags: ['preferences', 'settings'], difficulty: 'basic' },
  { id: 'w11', keys: 'Cmd+Option+;', keysMac: 'Cmd+Option+;', keysWin: 'Ctrl+Alt+;', description: 'Open setup dialog', category: 'workflow', subcategory: 'Custom', tags: ['setup'], difficulty: 'intermediate' },
  { id: 'w12', keys: 'H', keysMac: 'H', keysWin: 'H', description: 'Hand tool (grabber)', category: 'workflow', subcategory: 'Custom', tags: ['hand', 'grabber', 'tool'], difficulty: 'basic' },
  { id: 'w13', keys: 'V', keysMac: 'V', keysWin: 'V', description: 'Selector tool', category: 'workflow', subcategory: 'Custom', tags: ['selector', 'tool'], difficulty: 'basic' },
  { id: 'w14', keys: 'X', keysMac: 'X', keysWin: 'X', description: 'Scrubber tool', category: 'workflow', subcategory: 'Custom', tags: ['scrubber', 'tool'], difficulty: 'intermediate' },
  { id: 'w15', keys: 'Cmd+Shift+P', keysMac: 'Cmd+Shift+P', keysWin: 'Ctrl+Shift+P', description: 'Change playback engine', category: 'workflow', subcategory: 'Custom', tags: ['playback', 'engine', 'hardware'], difficulty: 'advanced' },
  { id: 'w16', keys: 'Option+X', keysMac: 'Option+X', keysWin: 'Alt+X', description: 'Crossfade selection', category: 'workflow', subcategory: 'Custom', tags: ['crossfade'], difficulty: 'intermediate' },
  { id: 'w17', keys: 'Cmd+Shift+F', keysMac: 'Cmd+Shift+F', keysWin: 'Ctrl+Shift+F', description: 'Find / search clips', category: 'workflow', subcategory: 'File & Session', tags: ['find', 'search', 'clips'], difficulty: 'intermediate' },
  { id: 'w18', keys: 'Cmd+Option+A', keysMac: 'Cmd+Option+A', keysWin: 'Ctrl+Alt+A', description: 'Select all tracks', category: 'workflow', subcategory: 'Custom', tags: ['select', 'all', 'tracks'], difficulty: 'basic' },
];

export const scenarios: Scenario[] = [
  {
    id: 's1',
    title: 'Basic Recording Session',
    description: 'Set up and record a basic audio take from start to finish',
    category: 'recording',
    icon: '🎙️',
    steps: [
      { action: 'Create a new track for recording', shortcutIds: ['r4'], tip: 'Choose audio track and set input source' },
      { action: 'Arm the track for recording', shortcutIds: ['r5'], tip: 'Make sure your input is coming through' },
      { action: 'Toggle input monitoring to hear the source', shortcutIds: ['r3'], tip: 'Essential for live monitoring while recording' },
      { action: 'Set your pre-roll for a count-in', shortcutIds: ['t12'], tip: 'Gives you a few bars before punch-in' },
      { action: 'Start recording', shortcutIds: ['t2'], tip: 'Or press Cmd+Space on Mac' },
      { action: 'Stop playback and return to start', shortcutIds: ['t3'], tip: 'Review your take from the beginning' },
    ]
  },
  {
    id: 's2',
    title: 'Punch-In Recording',
    description: 'Fix a specific section of a take by punching in and out',
    category: 'recording',
    icon: '🎯',
    steps: [
      { action: 'Select the region you want to re-record', shortcutIds: ['e1'], tip: 'Use the selector tool to highlight the bad section' },
      { action: 'Set punch-in point at selection start', shortcutIds: ['r5'], tip: 'This marks where recording will begin' },
      { action: 'Set punch-out point at selection end', shortcutIds: ['r6'], tip: 'This marks where recording will stop' },
      { action: 'Enable loop playback for multiple attempts', shortcutIds: ['t5'], tip: 'Practice the passage before committing' },
      { action: 'Start recording the punch', shortcutIds: ['r7'], tip: 'Pro Tools will auto-punch in and out' },
      { action: 'Toggle post-roll to hear after punch-out', shortcutIds: ['t13'], tip: 'Verify the transition is seamless' },
    ]
  },
  {
    id: 's3',
    title: 'Quick Edit Workflow',
    description: 'Perform common editing tasks efficiently on recorded audio',
    category: 'editing',
    icon: '✂️',
    steps: [
      { action: 'Switch to Smart tool for flexible editing', shortcutIds: ['t10'], tip: 'Smart tool adapts based on cursor position' },
      { action: 'Separate a clip at the cursor point', shortcutIds: ['e6'], tip: 'Quick way to split a region in two' },
      { action: 'Trim clip to selection boundaries', shortcutIds: ['e16', 'e17'], tip: 'Trim from front with T, from back with Shift+T' },
      { action: 'Add fades to prevent clicks', shortcutIds: ['e18'], tip: 'Always fade at edit points!' },
      { action: 'Delete a bad section and close the gap', shortcutIds: ['e22'], tip: 'Ripple delete keeps everything in time' },
      { action: 'Consolidate your edits into a new clip', shortcutIds: ['e7'], tip: 'Creates a single continuous audio file' },
    ]
  },
  {
    id: 's4',
    title: 'Comp Editing (Best Takes)',
    description: 'Build the perfect take by combining the best parts of multiple takes',
    category: 'editing',
    icon: '🏆',
    steps: [
      { action: 'Record multiple takes with loop recording', shortcutIds: ['t6', 't2'], tip: 'Loop record gives you separate takes per pass' },
      { action: 'Expand takes lane to see all takes', shortcutIds: ['n4'], tip: 'Zoom in vertically to see take lanes' },
      { action: 'Select the best section from each take', shortcutIds: ['w13'], tip: 'Use the selector to highlight the best part' },
      { action: 'Separate and promote the best take up', shortcutIds: ['e6'], tip: 'The top lane becomes your comp' },
      { action: 'Add crossfades at transition points', shortcutIds: ['w16'], tip: 'Smooth transitions between different takes' },
      { action: 'Consolidate the final comp', shortcutIds: ['e7'], tip: 'Render the comp to a single clip' },
    ]
  },
  {
    id: 's5',
    title: 'Mix Setup & Organization',
    description: 'Prepare your session for mixing by organizing tracks and groups',
    category: 'mixing',
    icon: '🎛️',
    steps: [
      { action: 'Switch to Mix window view', shortcutIds: ['n9'], tip: 'The Mix window shows faders and inserts' },
      { action: 'Select related tracks and create a group', shortcutIds: ['m4'], tip: 'Group drums, vocals, guitars etc.' },
      { action: 'Color-code your groups for visual clarity', shortcutIds: ['n13'], tip: 'Navigate to the track to color it' },
      { action: 'Set fader levels to unity before mixing', shortcutIds: ['m3'], tip: 'Start your mix from a neutral position' },
      { action: 'Mute tracks you want to temporarily hide', shortcutIds: ['m12'], tip: 'Focus on one group at a time' },
      { action: 'Save your window layout for recall', shortcutIds: ['w9'], tip: 'Save different layouts for editing vs mixing' },
    ]
  },
  {
    id: 's6',
    title: 'Automation Workflow',
    description: 'Write and edit automation for volume, panning, and plugin parameters',
    category: 'mixing',
    icon: '〰️',
    steps: [
      { action: 'Set automation mode to Touch', shortcutIds: ['m15'], tip: 'Touch mode writes only while you adjust' },
      { action: 'Play the session and ride the fader', shortcutIds: ['t1'], tip: 'Your moves will be captured as automation' },
      { action: 'Toggle automation preview to audition changes', shortcutIds: ['m6'], tip: 'Preview without writing to the timeline' },
      { action: 'Suspend groups to edit individual tracks', shortcutIds: ['m5'], tip: 'Groups can interfere with automation editing' },
      { action: 'View automation lanes for fine editing', shortcutIds: ['m8'], tip: 'Draw and edit automation data precisely' },
      { action: 'Switch to Hybrid automation mode', shortcutIds: ['m7'], tip: 'Combines the best of latch and touch modes' },
    ]
  },
  {
    id: 's7',
    title: 'Bounce & Master Prep',
    description: 'Prepare your final mix for bouncing and mastering',
    category: 'mastering',
    icon: '💿',
    steps: [
      { action: 'Insert a master fader track', shortcutIds: ['mas5'], tip: 'This is your final output bus' },
      { action: 'Check your metering levels', shortcutIds: ['mas4'], tip: 'Watch for clipping on the master bus' },
      { action: 'Switch to peak hold metering', shortcutIds: ['mas6'], tip: 'Shows your highest peak levels' },
      { action: 'Bounce the mix offline for speed', shortcutIds: ['mas7'], tip: 'Offline bounce is much faster than real-time' },
      { action: 'Or do a real-time bounce for accuracy', shortcutIds: ['mas8'], tip: 'Some plugins require real-time processing' },
      { action: 'Apply dither as the final step', shortcutIds: ['mas9'], tip: 'Only dither when reducing bit depth' },
    ]
  },
  {
    id: 's8',
    title: 'MIDI Production Flow',
    description: 'Write and edit MIDI parts for virtual instruments',
    category: 'midi',
    icon: '🎹',
    steps: [
      { action: 'Create a new instrument track', shortcutIds: ['r4'], tip: 'Choose Instrument track and load a VI' },
      { action: 'Record-enable the MIDI track', shortcutIds: ['r5'], tip: 'Make sure your MIDI controller is recognized' },
      { action: 'Record a MIDI performance', shortcutIds: ['t2'], tip: 'Play your part in real-time' },
      { action: 'Quantize the performance to the grid', shortcutIds: ['mid1'], tip: 'Tightens up timing to the nearest grid value' },
      { action: 'Adjust note velocities for dynamics', shortcutIds: ['mid7', 'mid8'], tip: 'Use Option+Shift+Up/Down to fine-tune' },
      { action: 'Open the MIDI editor for detailed editing', shortcutIds: ['mid14'], tip: 'Piano roll view for precise note editing' },
    ]
  },
  {
    id: 's9',
    title: 'Navigation & Zoom Mastery',
    description: 'Navigate your session quickly with zoom and scroll shortcuts',
    category: 'navigation',
    icon: '🔍',
    steps: [
      { action: 'Zoom in for detailed editing', shortcutIds: ['n6', 'n1'], tip: 'Cmd+= or Cmd+Option+] for horizontal zoom' },
      { action: 'Zoom out for overview', shortcutIds: ['n7', 'n2'], tip: 'See the big picture of your arrangement' },
      { action: 'Zoom to fit entire session', shortcutIds: ['n3'], tip: 'See everything at once' },
      { action: 'Zoom tracks vertically', shortcutIds: ['n4', 'n5'], tip: 'Make tracks taller for easier editing' },
      { action: 'Jump between region boundaries', shortcutIds: ['n15'], tip: 'Tab navigation is essential for fast editing' },
      { action: 'Switch between Edit and Mix views', shortcutIds: ['n11'], tip: 'Cmd+3 toggles between both windows' },
    ]
  },
  {
    id: 's10',
    title: 'Podcast / Voiceover Session',
    description: 'Complete workflow for recording and editing spoken word content',
    category: 'recording',
    icon: '🎙️',
    steps: [
      { action: 'Create a new session', shortcutIds: ['w4'], tip: 'Set sample rate to 48kHz for broadcast standard' },
      { action: 'Create and arm your voice track', shortcutIds: ['r4', 'r5'], tip: 'Mono track is fine for single voice' },
      { action: 'Record the full take', shortcutIds: ['t2'], tip: 'Do a complete read-through' },
      { action: 'Remove mistakes with ripple delete', shortcutIds: ['e22'], tip: 'Closes gaps automatically when you delete' },
      { action: 'Add fades to all edit points', shortcutIds: ['e18'], tip: 'Prevents clicks and pops at cut points' },
      { action: 'Bounce the final result', shortcutIds: ['mas1'], tip: 'Export as MP3 or WAV for distribution' },
    ]
  },
];

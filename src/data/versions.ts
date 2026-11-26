export type VersionId = 'original' | 'v1' | 'v2';

export interface BuildVersion {
  id: VersionId;
  stageLabel: string;
  title: string;
  subtitle: string;
  url: string;
  methodology: string;
  summary: string;
  focusAreas: string[];
  tradeoffs: string;
}

export interface HeuristicItem {
  number: string;
  name: string;
  principle: string;
  originalState: string;
  v1State: string;
  v2State: string;
}

export const BUILD_VERSIONS: BuildVersion[] = [
  {
    id: 'original',
    stageLabel: 'Baseline',
    title: 'Original Replica',
    subtitle: 'Unmodified Reference Build',
    url: 'https://amazon-not-enhanced-group-5-ownh7t1a9-ac-8835.vercel.app/',
    methodology: 'Faithful baseline replication',
    summary:
      'Preserves the standard multi-row navigation density, legacy account menu hierarchy, and baseline storefront interaction patterns prior to usability intervention.',
    focusAreas: [
      'Dense multi-tier top navigation and category menus',
      'Standard account sign-in and profile entry points',
      'Baseline product discovery and cart interaction flows',
    ],
    tradeoffs: 'High visual density and steeper cognitive load during account and checkout transitions.',
  },
  {
    id: 'v1',
    stageLabel: 'Iteration 01',
    title: 'Version 1',
    subtitle: 'Built Using Intuitive Accounts',
    url: 'https://uiux-first-build-7c8q-one.vercel.app/',
    methodology: 'Intuitive Account Architecture',
    summary:
      'Reimagines the storefront around clearer user account mental models, streamlined profile access, and intuitive order/saved-state visibility across the shopping journey.',
    focusAreas: [
      'Simplified account onboarding, switching, and profile clarity',
      'Direct visibility into saved lists, orders, and preferences',
      'Reduced friction between browsing and personalized account actions',
    ],
    tradeoffs: 'Strong improvement on identity and account clarity; broader system-wide heuristics remain secondary.',
  },
  {
    id: 'v2',
    stageLabel: 'Iteration 02',
    title: 'Version 2',
    subtitle: "Built Using Nielsen's 10 Heuristics",
    url: 'https://amazon-version-2-group-5.vercel.app/',
    methodology: "Jakob Nielsen's 10 Usability Heuristics",
    summary:
      'Systematically applies all ten usability heuristics—clear system status feedback, real-world mental models, error prevention, recognition over recall, and disciplined aesthetic restraint.',
    focusAreas: [
      'Explicit system status feedback across cart, search, and checkout',
      'Error prevention, clear undo paths, and user control',
      'Clean visual hierarchy prioritizing recognition over recall',
    ],
    tradeoffs: 'Balances discoverability and restraint across the entire storefront lifecycle.',
  },
];

export interface ComparisonRow {
  dimension: string;
  original: string;
  v1: string;
  v2: string;
}

export const COMPARISON_MATRIX: ComparisonRow[] = [
  {
    dimension: 'Primary Design Driver',
    original: 'Faithful replication of baseline storefront layout',
    v1: 'Intuitive account workflows and user identity clarity',
    v2: 'Systematic compliance with Nielsen’s 10 usability heuristics',
  },
  {
    dimension: 'Navigation & Information Scent',
    original: 'High-density legacy links and multi-layer dropdowns',
    v1: 'Account-centric shortcuts surfaced alongside shopping categories',
    v2: 'Streamlined hierarchy grouped by user task and mental model',
  },
  {
    dimension: 'Account & Profile Experience',
    original: 'Nested account links dispersed across utility menus',
    v1: 'Unified intuitive account hub with clear state and controls',
    v2: 'Predictable account controls paired with confirmation feedback',
  },
  {
    dimension: 'System Status & Feedback',
    original: 'Minimal inline cues after cart or filter interactions',
    v1: 'Clear state reflection for signed-in user preferences',
    v2: 'Immediate visual feedback for loading, cart updates, and errors',
  },
  {
    dimension: 'Error Prevention & Recovery',
    original: 'Relies on user vigilance during form and cart actions',
    v1: 'Guided account flows reduce profile and address missteps',
    v2: 'Proactive guardrails, clear validation, and reversible actions',
  },
];

export const NIELSEN_HEURISTICS: HeuristicItem[] = [
  {
    number: '01',
    name: 'Visibility of System Status',
    principle: 'Keep users informed about what is going on through timely feedback.',
    originalState: 'Subtle cart/filter transitions with limited confirmation.',
    v1State: 'Clear signed-in account context and active profile indicators.',
    v2State: 'Explicit loading, cart quantity, and action confirmation states.',
  },
  {
    number: '02',
    name: 'Match Between System & Real World',
    principle: 'Speak the users’ language with familiar concepts and natural order.',
    originalState: 'Dense marketplace terminology and packed promotional labels.',
    v1State: 'Human-centered account labels for orders, lists, and settings.',
    v2State: 'Natural shopping vocabulary and logical category progression.',
  },
  {
    number: '03',
    name: 'User Control and Freedom',
    principle: 'Support clearly marked exits, undo, and effortless state reversal.',
    originalState: 'Multi-step back navigation to reverse cart or modal states.',
    v1State: 'Quick exit and switching within account workflows.',
    v2State: 'Direct undo, clear dismiss controls, and reversible selections.',
  },
  {
    number: '04',
    name: 'Consistency and Standards',
    principle: 'Follow platform conventions so users never wonder what actions mean.',
    originalState: 'Mixed legacy UI patterns across header and cards.',
    v1State: 'Consistent account controls and profile action placement.',
    v2State: 'Unified spacing, button hierarchy, and interaction conventions.',
  },
  {
    number: '05',
    name: 'Error Prevention',
    principle: 'Eliminate error-prone conditions or ask for confirmation first.',
    originalState: 'Minimal guardrails prior to destructive or checkout actions.',
    v1State: 'Structured account inputs that prevent invalid profile states.',
    v2State: 'Inline constraints, clear defaults, and protective confirmations.',
  },
  {
    number: '06',
    name: 'Recognition Rather Than Recall',
    principle: 'Minimize memory load by keeping options and context visible.',
    originalState: 'Deep sub-menus force users to remember link locations.',
    v1State: 'Visible account summary keeps order and saved context handy.',
    v2State: 'Persistent breadcrumbs, scannable filters, and clear product cues.',
  },
  {
    number: '07',
    name: 'Flexibility and Efficiency of Use',
    principle: 'Provide accelerators for repeat shoppers without cluttering novices.',
    originalState: 'Uniform path length for first-time and repeat visitors.',
    v1State: 'One-click access to repeat account actions and saved items.',
    v2State: 'Fast search, keyboard-friendly navigation, and quick cart controls.',
  },
  {
    number: '08',
    name: 'Aesthetic and Minimalist Design',
    principle: 'Remove irrelevant noise that competes with primary user goals.',
    originalState: 'High visual competition across banners and dense grids.',
    v1State: 'Cleaner account screens with reduced peripheral distractions.',
    v2State: 'Focused whitespace, restrained color accents, and clear focal points.',
  },
  {
    number: '09',
    name: 'Help Users Recognize, Diagnose, and Recover from Errors',
    principle: 'Express errors in plain language and suggest constructive solutions.',
    originalState: 'Generic or understated error messaging.',
    v1State: 'Contextual guidance on account sign-in and form validation.',
    v2State: 'Actionable recovery prompts with specific next-step remedies.',
  },
  {
    number: '10',
    name: 'Help and Documentation',
    principle: 'Provide concise, searchable, task-focused help when needed.',
    originalState: 'Buried support links inside deep footer directories.',
    v1State: 'Accessible account support and order help entry points.',
    v2State: 'Contextual support cues surfaced right where questions arise.',
  },
];

import {useMemo, useState} from 'react';
import {Columns2, Columns3, ExternalLink, Monitor, RotateCw, Smartphone, Square, Tablet} from 'lucide-react';
import {ComparisonMatrix} from './components/ComparisonMatrix';
import {LiveViewportPane, ViewportPreset} from './components/LiveViewportPane';
import {BUILD_VERSIONS, VersionId} from './data/versions';

type LayoutMode = 'three-up' | 'two-up' | 'focus';
type TwoUpPair = 'original-v1' | 'original-v2' | 'v1-v2';

const TWO_UP_PAIRS: Record<TwoUpPair, [VersionId, VersionId]> = {
  'original-v1': ['original', 'v1'],
  'original-v2': ['original', 'v2'],
  'v1-v2': ['v1', 'v2'],
};

const CUSTOM_URLS_STORAGE_KEY = 'group5_uiux_custom_urls_v1';

export default function App() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('three-up');
  const [twoUpPair, setTwoUpPair] = useState<TwoUpPair>('original-v2');
  const [focusedId, setFocusedId] = useState<VersionId>('v2');
  const [viewportPreset, setViewportPreset] = useState<ViewportPreset>('desktop');
  const [frameHeight, setFrameHeight] = useState<number>(680);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [reloadSignal, setReloadSignal] = useState<number>(0);
  const [customUrls, setCustomUrls] = useState<Partial<Record<VersionId, string>>>(() => {
    try {
      const saved = window.localStorage.getItem(CUSTOM_URLS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Partial<Record<VersionId, string>>) : {};
    } catch {
      return {};
    }
  });

  const handleUpdateUrl = (id: VersionId, nextUrl: string) => {
    setCustomUrls((prev) => {
      const updated = {...prev, [id]: nextUrl};
      try {
        window.localStorage.setItem(CUSTOM_URLS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const handleResetUrl = (id: VersionId) => {
    setCustomUrls((prev) => {
      const updated = {...prev};
      delete updated[id];
      try {
        window.localStorage.setItem(CUSTOM_URLS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const visibleVersions = useMemo(() => {
    if (layoutMode === 'three-up') {
      return BUILD_VERSIONS;
    }
    if (layoutMode === 'two-up') {
      const pairIds = TWO_UP_PAIRS[twoUpPair];
      return BUILD_VERSIONS.filter((v) => pairIds.includes(v.id));
    }
    return BUILD_VERSIONS.filter((v) => v.id === focusedId);
  }, [layoutMode, twoUpPair, focusedId]);

  const handleToggleFocus = (id: VersionId) => {
    if (layoutMode === 'focus' && focusedId === id) {
      setLayoutMode('three-up');
      return;
    }
    setFocusedId(id);
    setLayoutMode('focus');
  };

  const gridClassName =
    layoutMode === 'three-up'
      ? 'grid grid-cols-1 xl:grid-cols-3 gap-5 items-stretch'
      : layoutMode === 'two-up'
        ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch'
        : 'grid grid-cols-1 gap-6';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar: Strictly 3 Zones */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#comparison"
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Group 5 Studio
          </a>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <a
              href="#comparison"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Comparison
            </a>
            <a
              href="#methodology"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Methodology
            </a>
            <a
              href="#heuristics"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Heuristics
            </a>
            <a
              href="#deployments"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Deployments
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setReloadSignal((n) => n + 1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reload All Frames</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-12">
        {/* Intro Section */}
        <section id="comparison" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Live Comparative Evaluation</span>
                <span aria-hidden="true">·</span>
                <span>3 Hosted Builds</span>
                <span aria-hidden="true">·</span>
                <span>Amazon Storefront Redesign</span>
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
                Side-by-side UI/UX progression across three live iterations
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Compare the unmodified Original Replica alongside Version 1 (built using intuitive
                accounts) and Version 2 (built using Nielsen’s 10 usability heuristics) in live
                synchronized viewports.
              </p>
            </div>
          </div>

          {/* Workspace Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl">
            {/* Layout Mode Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label="Comparison layout mode"
                className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
              >
                <button
                  type="button"
                  onClick={() => setLayoutMode('three-up')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    layoutMode === 'three-up'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  <span>3-Up Side-by-Side</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode('two-up')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    layoutMode === 'two-up'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns2 className="w-3.5 h-3.5" />
                  <span>2-Up Diff</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode('focus')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    layoutMode === 'focus'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Single Focus</span>
                </button>
              </div>

              {layoutMode === 'two-up' && (
                <select
                  aria-label="Select two versions to compare"
                  value={twoUpPair}
                  onChange={(e) => setTwoUpPair(e.target.value as TwoUpPair)}
                  className="h-9 px-3 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="original-v1">Original vs. Version 1</option>
                  <option value="original-v2">Original vs. Version 2</option>
                  <option value="v1-v2">Version 1 vs. Version 2</option>
                </select>
              )}

              {layoutMode === 'focus' && (
                <select
                  aria-label="Select version to focus"
                  value={focusedId}
                  onChange={(e) => setFocusedId(e.target.value as VersionId)}
                  className="h-9 px-3 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  {BUILD_VERSIONS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title} — {v.subtitle}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Viewport & Height Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label="Simulated viewport width"
                className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
              >
                <button
                  type="button"
                  onClick={() => setViewportPreset('desktop')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    viewportPreset === 'desktop'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportPreset('tablet')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    viewportPreset === 'tablet'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportPreset('mobile')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    viewportPreset === 'mobile'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportPreset('fluid')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    viewportPreset === 'fluid'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Fluid</span>
                </button>
              </div>

              <select
                aria-label="Viewport frame height"
                value={frameHeight}
                onChange={(e) => setFrameHeight(Number(e.target.value))}
                className="h-9 px-2.5 text-xs font-medium font-mono tabular-nums bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-600"
              >
                <option value={560}>560px height</option>
                <option value={680}>680px height</option>
                <option value={840}>840px height</option>
              </select>

              <button
                type="button"
                onClick={() => setShowDetails((s) => !s)}
                aria-pressed={showDetails}
                className={`h-9 px-3 text-xs font-medium border rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  showDetails
                    ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {showDetails ? 'Hide Notes' : 'Show Notes'}
              </button>
            </div>
          </div>

          {/* Live Side-by-Side Comparison Grid */}
          <div className={gridClassName}>
            {visibleVersions.map((version) => (
              <LiveViewportPane
                key={version.id}
                version={version}
                customUrl={customUrls[version.id]}
                onUpdateUrl={(nextUrl) => handleUpdateUrl(version.id, nextUrl)}
                onResetUrl={() => handleResetUrl(version.id)}
                viewportPreset={viewportPreset}
                frameHeight={frameHeight}
                reloadSignal={reloadSignal}
                isFocused={layoutMode === 'focus' && focusedId === version.id}
                onToggleFocus={() => handleToggleFocus(version.id)}
                showDetails={showDetails}
              />
            ))}
          </div>
        </section>

        {/* Methodology & Heuristics Sections */}
        <ComparisonMatrix />

        {/* Direct Deployment Directory */}
        <section
          id="deployments"
          aria-labelledby="deployments-heading"
          className="scroll-mt-24 pt-4 border-t border-slate-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h2
                id="deployments-heading"
                className="text-lg font-semibold tracking-tight text-slate-900"
              >
                Direct Deployment Links
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Open any build in a dedicated browser tab for full-screen testing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BUILD_VERSIONS.map((version) => {
              const targetUrl = customUrls[version.id] || version.url;
              return (
                <a
                  key={version.id}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-600 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">
                      {version.stageLabel} · {version.methodology}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {version.title} — {version.subtitle}
                    </div>
                    <div className="mt-1 font-mono text-xs text-slate-500 truncate">
                      {targetUrl}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 mt-1 transition-colors" />
                </a>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <span>Group 5 Studio · UI/UX Comparative Hosting Showcase</span>
          <span>Original Replica · Intuitive Accounts · Nielsen’s 10 Heuristics</span>
        </div>
      </footer>
    </div>
  );
}

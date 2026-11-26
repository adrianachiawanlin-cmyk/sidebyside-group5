import {useEffect, useRef, useState} from 'react';
import {Check, Copy, ExternalLink, Maximize2, Minimize2, RotateCw} from 'lucide-react';
import {BuildVersion} from '../data/versions';

export type ViewportPreset = 'desktop' | 'tablet' | 'mobile' | 'fluid';

interface LiveViewportPaneProps {
  version: BuildVersion;
  viewportPreset: ViewportPreset;
  frameHeight: number;
  reloadSignal: number;
  isFocused: boolean;
  onToggleFocus: () => void;
  showDetails: boolean;
}

const VIRTUAL_WIDTHS: Record<Exclude<ViewportPreset, 'fluid'>, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 390,
};

export function LiveViewportPane({
  version,
  viewportPreset,
  frameHeight,
  reloadSignal,
  isFocused,
  onToggleFocus,
  showDetails,
}: LiveViewportPaneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(420);
  const [localReloadCount, setLocalReloadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateWidth = () => {
      setContainerWidth(node.clientWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setHasTimedOut(false);
  }, [reloadSignal, localReloadCount, version.url]);

  useEffect(() => {
    if (!isLoading) return;
    const timer = window.setTimeout(() => {
      setHasTimedOut(true);
    }, 8500);
    return () => window.clearTimeout(timer);
  }, [isLoading, reloadSignal, localReloadCount]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(version.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const isFluid = viewportPreset === 'fluid';
  const targetVirtualWidth = isFluid ? containerWidth : VIRTUAL_WIDTHS[viewportPreset];
  const scale = isFluid ? 1 : Math.min(1, Math.max(0.2, containerWidth / targetVirtualWidth));
  const scaledIframeHeight = Math.round(frameHeight / scale);
  const renderedWidth = Math.round(targetVirtualWidth * scale);

  return (
    <article className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden transition-colors duration-150">
      {/* Pane Header */}
      <div className="flex items-start justify-between gap-3 px-4 py-3.5 border-b border-slate-200 bg-white">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">{version.stageLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{version.methodology}</span>
          </div>
          <h2 className="mt-0.5 text-base font-semibold tracking-tight text-slate-900 truncate">
            {version.title} — {version.subtitle}
          </h2>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setLocalReloadCount((c) => c + 1)}
            title={`Reload ${version.title}`}
            aria-label={`Reload ${version.title}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleFocus}
            title={isFocused ? 'Exit focus view' : `Focus ${version.title}`}
            aria-label={isFocused ? 'Exit focus view' : `Focus ${version.title}`}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-blue-600 ${
              isFocused
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {isFocused ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <a
            href={version.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open ${version.title} in new tab`}
            aria-label={`Open ${version.title} in new tab`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* URL / Viewport Address Strip */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs">
        <a
          href={version.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-slate-600 hover:text-blue-600 truncate transition-colors"
          title={version.url}
        >
          {version.url.replace(/^https?:\/\//, '')}
        </a>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono tabular-nums text-[11px] text-slate-500">
            {isFluid ? `${Math.round(containerWidth)}px` : `${targetVirtualWidth}px`}
            {!isFluid && scale < 0.99 ? ` (${Math.round(scale * 100)}%)` : ''}
          </span>
          <button
            type="button"
            onClick={handleCopyUrl}
            aria-label={`Copy URL for ${version.title}`}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Live Embedded Iframe Stage */}
      <div
        ref={containerRef}
        style={{height: `${frameHeight}px`}}
        className="relative w-full bg-slate-100 overflow-hidden flex justify-center"
      >
        {isLoading && (
          <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-slate-200 overflow-hidden">
            <div className="h-full w-1/3 bg-blue-600 animate-[pulse_1.2s_ease-in-out_infinite]" />
          </div>
        )}

        <div
          style={{
            width: `${renderedWidth}px`,
            height: `${frameHeight}px`,
          }}
          className="relative h-full bg-white overflow-hidden"
        >
          <iframe
            key={`${version.id}-${reloadSignal}-${localReloadCount}`}
            src={version.url}
            title={`${version.title} — ${version.subtitle}`}
            onLoad={() => {
              setIsLoading(false);
              setHasTimedOut(false);
            }}
            style={{
              width: `${targetVirtualWidth}px`,
              height: `${scaledIframeHeight}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
            className="border-0 bg-white block"
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {hasTimedOut && isLoading && (
          <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between gap-3 px-3.5 py-2.5 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg text-xs text-slate-700 shadow-sm">
            <span>Taking longer than expected to render in frame.</span>
            <a
              href={version.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline whitespace-nowrap shrink-0"
            >
              Open directly
            </a>
          </div>
        )}
      </div>

      {/* Concise Context Notes Footer */}
      {showDetails && (
        <div className="px-4 py-4 bg-white border-t border-slate-200 flex-1 flex flex-col justify-between gap-3">
          <p className="text-sm text-slate-600 leading-relaxed">{version.summary}</p>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {version.focusAreas.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-slate-400 select-none" aria-hidden="true">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

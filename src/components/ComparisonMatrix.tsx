import {useEffect, useMemo, useState} from 'react';
import {Search} from 'lucide-react';
import {COMPARISON_MATRIX, NIELSEN_HEURISTICS} from '../data/versions';

const NOTES_STORAGE_KEY = 'group5_uiux_heuristic_notes_v1';

export function ComparisonMatrix() {
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = window.localStorage.getItem(NOTES_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Record<string, string>) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Ignore storage quota errors
    }
  }, [notes]);

  const filteredHeuristics = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return NIELSEN_HEURISTICS;
    return NIELSEN_HEURISTICS.filter(
      (item) =>
        item.name.toLowerCase().includes(trimmed) ||
        item.principle.toLowerCase().includes(trimmed) ||
        item.v1State.toLowerCase().includes(trimmed) ||
        item.v2State.toLowerCase().includes(trimmed)
    );
  }, [query]);

  const handleNoteChange = (heuristicNumber: string, value: string) => {
    setNotes((prev) => ({
      ...prev,
      [heuristicNumber]: value,
    }));
  };

  return (
    <div className="space-y-16">
      {/* Side-by-Side Methodology Matrix */}
      <section id="methodology" aria-labelledby="methodology-heading" className="scroll-mt-24">
        <div className="max-w-2xl mb-6">
          <p className="text-xs font-medium text-slate-500">Comparative Breakdown</p>
          <h2
            id="methodology-heading"
            className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900"
          >
            Three stages of UX progression
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Inspect how each build approaches core shopping tasks—moving from an unmodified replica,
            to account-centric clarity, to full heuristic alignment.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                <th className="py-3.5 px-4 w-[22%]">UX Dimension</th>
                <th className="py-3.5 px-4 w-[26%]">Original Replica</th>
                <th className="py-3.5 px-4 w-[26%]">Version 1 (Intuitive Accounts)</th>
                <th className="py-3.5 px-4 w-[26%]">Version 2 (Nielsen’s 10 Heuristics)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {COMPARISON_MATRIX.map((row) => (
                <tr key={row.dimension} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-900 align-top">
                    {row.dimension}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 align-top leading-relaxed">
                    {row.original}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 align-top leading-relaxed">
                    {row.v1}
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 align-top leading-relaxed">
                    {row.v2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Nielsen's 10 Heuristics Inspection Matrix */}
      <section id="heuristics" aria-labelledby="heuristics-heading" className="scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-slate-500">Evaluation Reference</p>
            <h2
              id="heuristics-heading"
              className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900"
            >
              Nielsen’s 10 Usability Heuristics
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Use this side-by-side audit table while testing the live frames above. Reviewer notes
              save locally in your browser.
            </p>
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter heuristics..."
              aria-label="Filter Nielsen heuristics"
              className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {filteredHeuristics.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <p className="text-sm font-medium text-slate-900">No heuristics match “{query}”</p>
            <p className="mt-1 text-xs text-slate-500">
              Clear the search filter to view all 10 usability heuristics.
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-4 px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full min-w-[920px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                  <th className="py-3.5 px-4 w-[24%]">Heuristic</th>
                  <th className="py-3.5 px-4 w-[19%]">Original Replica</th>
                  <th className="py-3.5 px-4 w-[19%]">Version 1</th>
                  <th className="py-3.5 px-4 w-[20%]">Version 2</th>
                  <th className="py-3.5 px-4 w-[18%]">Reviewer Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {filteredHeuristics.map((item) => (
                  <tr key={item.number} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-medium text-slate-900">
                        <span className="font-mono tabular-nums text-slate-400 mr-2">
                          {item.number}.
                        </span>
                        {item.name}
                      </div>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        {item.principle}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 align-top leading-relaxed">
                      {item.originalState}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 align-top leading-relaxed">
                      {item.v1State}
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 align-top leading-relaxed">
                      {item.v2State}
                    </td>
                    <td className="py-3 px-4 align-top">
                      <input
                        type="text"
                        value={notes[item.number] ?? ''}
                        onChange={(e) => handleNoteChange(item.number, e.target.value)}
                        placeholder="Add observation..."
                        aria-label={`Reviewer note for ${item.name}`}
                        className="w-full h-9 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

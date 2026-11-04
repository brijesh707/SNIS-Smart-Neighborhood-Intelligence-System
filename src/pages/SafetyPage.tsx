import { useState, useMemo } from 'react';
import { Shield, AlertTriangle, Award, Info } from 'lucide-react';
import { neighbourhoods, type Neighbourhood } from '@/data/neighbourhoods';
import { computeCrimeScore } from '@/lib/clustering';

const crimeTypes = [
  { key: 'theft' as const, label: 'Theft', color: 'bg-amber-300' },
  { key: 'assault' as const, label: 'Assault', color: 'bg-rose-400' },
  { key: 'burglary' as const, label: 'Burglary', color: 'bg-peach-400' },
  { key: 'vandalism' as const, label: 'Vandalism', color: 'bg-amber-400' },
];

function safetyColor(score: number): { text: string; bg: string; bar: string; label: string } {
  if (score >= 80) return { text: 'text-mint-600', bg: 'bg-mint-50', bar: 'bg-mint-400', label: 'Very Safe' };
  if (score >= 65) return { text: 'text-sky-600', bg: 'bg-sky-50', bar: 'bg-sky-400', label: 'Safe' };
  if (score >= 50) return { text: 'text-amber-500', bg: 'bg-amber-50', bar: 'bg-amber-400', label: 'Moderate' };
  if (score >= 40) return { text: 'text-peach-500', bg: 'bg-peach-50', bar: 'bg-peach-400', label: 'Caution' };
  return { text: 'text-rose-500', bg: 'bg-rose-50', bar: 'bg-rose-400', label: 'High Risk' };
}

export default function SafetyPage() {
  const [selected, setSelected] = useState<Neighbourhood | null>(null);

  const ranked = useMemo(() => {
    return [...neighbourhoods]
      .map((n) => ({ ...n, crimeScore: computeCrimeScore(n) }))
      .sort((a, b) => b.crimeScore - a.crimeScore);
  }, []);

  const maxTotalCrime = useMemo(() => {
    return Math.max(
      ...neighbourhoods.map((n) =>
        n.crime.reduce((s, c) => s + c.theft + c.assault + c.burglary + c.vandalism, 0)
      )
    );
  }, []);

  return (
    <div className="pt-16 bg-pastel-50 min-h-screen">
      {/* Header */}
      <div className="bg-pastel-100 border-b border-pastel-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-7 h-7 text-mint-500" />
            <h1 className="text-2xl font-bold text-pastel-500">Safety Ranking</h1>
          </div>
          <p className="text-pastel-400 max-w-2xl">
            Borough-level safety ranking derived from crime statistics. As the ScienceDirect
            study [7] argues, crime predictions can directly inform relocation and urban-planning
            decisions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Ranking list */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-pastel-500 mb-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-mint-500" />
              Borough Safety Ranking
            </h2>
            {ranked.map((n, i) => {
              const s = safetyColor(n.crimeScore);
              const isActive = selected?.id === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setSelected(n)}
                  className={`w-full text-left bg-white rounded-xl border-2 p-4 transition-all ${
                    isActive
                      ? 'border-mint-400'
                      : 'border-pastel-200 hover:border-pastel-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        i === 0
                          ? 'bg-amber-100 text-amber-500'
                          : i === 1
                          ? 'bg-pastel-100 text-pastel-400'
                          : i === 2
                          ? 'bg-peach-100 text-peach-500'
                          : 'bg-pastel-50 text-pastel-400'
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-pastel-500 text-sm">{n.name}</div>
                      <div className="text-xs text-pastel-400">{n.city}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${s.text}`}>{n.crimeScore}</div>
                      <div className={`text-xs ${s.text}`}>{s.label}</div>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-pastel-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.bar} transition-all duration-700`}
                      style={{ width: `${n.crimeScore}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:sticky lg:top-24 self-start">
            {selected ? (
              <div className="bg-white rounded-2xl border border-pastel-200 p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-pastel-500">{selected.name}</h3>
                  <span className="text-xs text-pastel-400">{selected.city}</span>
                </div>
                <p className="text-sm text-pastel-400 mb-5">6-month crime breakdown</p>

                {/* Total crime bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-pastel-400">Total Crime (6 months)</span>
                    {(() => {
                      const total = selected.crime.reduce(
                        (s, c) => s + c.theft + c.assault + c.burglary + c.vandalism,
                        0
                      );
                      return <span className="text-xs font-bold text-pastel-500">{total}</span>;
                    })()}
                  </div>
                  <div className="w-full h-3 rounded-full bg-pastel-100 overflow-hidden">
                    {(() => {
                      const total = selected.crime.reduce(
                        (s, c) => s + c.theft + c.assault + c.burglary + c.vandalism,
                        0
                      );
                      const pct = (total / maxTotalCrime) * 100;
                      return (
                        <div
                          className="h-full rounded-full bg-rose-400 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      );
                    })()}
                  </div>
                </div>

                {/* Crime type breakdown */}
                <div className="space-y-3 mb-6">
                  {crimeTypes.map((ct) => {
                    const total = selected.crime.reduce((s, c) => s + c[ct.key], 0);
                    const maxType = Math.max(
                      ...crimeTypes.map((t) =>
                        selected.crime.reduce((s, c) => s + c[t.key], 0)
                      )
                    );
                    return (
                      <div key={ct.key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-pastel-400">{ct.label}</span>
                          <span className="text-xs font-bold text-pastel-500">{total}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-pastel-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${ct.color} transition-all duration-500`}
                            style={{ width: `${(total / maxType) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Monthly trend */}
                <div className="border-t border-pastel-100 pt-5">
                  <h4 className="text-sm font-semibold text-pastel-500 mb-3">Monthly Trend</h4>
                  <div className="flex items-end justify-between gap-1 h-32">
                    {selected.crime.map((c) => {
                      const total = c.theft + c.assault + c.burglary + c.vandalism;
                      const maxMonthly = Math.max(
                        ...selected.crime.map(
                          (m) => m.theft + m.assault + m.burglary + m.vandalism
                        )
                      );
                      return (
                        <div key={c.month} className="flex-1 flex flex-col items-center gap-1.5">
                          <div className="text-[10px] text-pastel-400 font-medium">{total}</div>
                          <div className="w-full flex-1 flex items-end">
                            <div
                              className="w-full rounded-t bg-mint-300 transition-all duration-500"
                              style={{ height: `${(total / maxMonthly) * 100}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-pastel-400">{c.month}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-pastel-200 p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-pastel-300 mx-auto mb-4" />
                <h3 className="font-semibold text-pastel-500 mb-1">Select a Neighbourhood</h3>
                <p className="text-sm text-pastel-400">
                  Click any neighbourhood from the ranking to view detailed crime statistics and
                  monthly trends.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Research note */}
        <div className="mt-6 bg-mint-50 border border-mint-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-mint-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-pastel-500 text-sm mb-1">
                Research Context
              </h3>
              <p className="text-sm text-pastel-400 leading-relaxed">
                Nandini [6] catalogued 150+ articles on ML/DL crime prediction, noting that
                spatiotemporal crime modelling remains an active research problem. Fu et al. [8]
                showed that safety can also be estimated from satellite and Street View imagery -
                a promising extension beyond the official crime statistics used here. The safety
                score is computed as an inverse of total crime incidents relative to the highest
                in the dataset.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

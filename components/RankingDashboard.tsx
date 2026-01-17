
import React, { useEffect, useMemo, useState } from 'react';
import { Scores } from '../types';
import { ParticipationDoc, subscribeToParticipations } from '../services/participationService';
import { trackEvent } from '../utils/analytics';
import { UF_OPTIONS } from '../constants';

interface RankingDashboardProps {
  onBack: () => void;
  onTakeQuiz: () => void;
}

type TimeRange = '7d' | '30d' | 'all';

const RankingDashboard: React.FC<RankingDashboardProps> = ({ onBack, onTakeQuiz }) => {
  const [rankingData, setRankingData] = useState<ParticipationDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  useEffect(() => {
    const unsubscribe = subscribeToParticipations(
      (items) => {
        setRankingData(items);
        setIsLoading(false);
      },
      (error) => {
        console.error("Falha ao carregar ranking do Firestore", error);
        setErrorMessage("Não foi possível carregar o ranking agora.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredRanking = useMemo(() => {
    if (timeRange === 'all') return rankingData;
    const now = Date.now();
    const rangeMs = timeRange === '7d' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
    return rankingData.filter((item) => {
      const createdAt = Number.isFinite(item.createdAtMs) ? item.createdAtMs : 0;
      return createdAt >= now - rangeMs;
    });
  }, [rankingData, timeRange]);

  const stats = useMemo(() => {
    if (filteredRanking.length === 0) return null;
    
    const avgScores: Scores = {
      economico: filteredRanking.reduce((acc, curr) => acc + curr.scores.economico, 0) / filteredRanking.length,
      social: filteredRanking.reduce((acc, curr) => acc + curr.scores.social, 0) / filteredRanking.length,
      cultural: filteredRanking.reduce((acc, curr) => acc + curr.scores.cultural, 0) / filteredRanking.length,
      nacional: filteredRanking.reduce((acc, curr) => acc + curr.scores.nacional, 0) / filteredRanking.length,
    };

    const distributions: Record<string, number> = {};
    filteredRanking.forEach(r => {
      distributions[r.classificacao_principal] = (distributions[r.classificacao_principal] || 0) + 1;
    });

    return { avgScores, distributions };
  }, [filteredRanking]);

  const rangeLabel = useMemo(() => {
    if (timeRange === '7d') return 'Últimos 7 dias';
    if (timeRange === '30d') return 'Últimos 30 dias';
    return 'Total acumulado';
  }, [timeRange]);

  const ufStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredRanking.forEach((item) => {
      if (item.uf && item.ufOptIn) {
        counts[item.uf] = (counts[item.uf] || 0) + 1;
      }
    });
    const values = Object.values(counts);
    const maxCount = values.length ? Math.max(...values) : 0;
    const getIntensityClass = (count: number) => {
      if (maxCount === 0 || count === 0) return 'bg-slate-100';
      const ratio = count / maxCount;
      if (ratio > 0.66) return 'bg-indigo-600';
      if (ratio > 0.33) return 'bg-indigo-400';
      return 'bg-indigo-200';
    };

    const heatmap = UF_OPTIONS.map((option) => ({
      uf: option.value,
      label: option.label,
      count: counts[option.value] || 0,
      color: getIntensityClass(counts[option.value] || 0),
    }));

    return {
      heatmap,
      total: values.reduce((acc, curr) => acc + curr, 0),
      maxCount,
    };
  }, [filteredRanking]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-12">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2" type="button">
          ← Voltar ao Início
        </button>
        <button onClick={onTakeQuiz} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all" type="button">
          Participar agora
        </button>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Dashboard de Rankings</h1>
      <p className="text-slate-500">Dados coletados de forma anônima entre todos os participantes.</p>
      <div className="mt-6 mb-10 flex flex-wrap items-center gap-3">
        {[
          { id: '7d', label: '7 dias' },
          { id: '30d', label: '30 dias' },
          { id: 'all', label: 'Total' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setTimeRange(item.id as TimeRange);
              trackEvent('ranking_range_changed', { range: item.id });
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
              timeRange === item.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
            }`}
            type="button"
          >
            {item.label}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-auto">{rangeLabel}</span>
      </div>

      {isLoading ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200" role="status" aria-live="polite" aria-busy="true">
          <p className="text-slate-400 text-lg">Carregando dados do ranking...</p>
        </div>
      ) : errorMessage ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-lg mb-4">{errorMessage}</p>
          <button onClick={onTakeQuiz} className="text-indigo-600 font-bold underline decoration-2" type="button">
            Participar mesmo assim
          </button>
        </div>
      ) : filteredRanking.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-lg mb-4">Ainda não temos dados suficientes para este recorte.</p>
          <button onClick={onTakeQuiz} className="text-indigo-600 font-bold underline decoration-2" type="button">
            Seja o primeiro a participar!
          </button>
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chart Distro */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Distribuição Ideológica</h3>
            <div className="space-y-4">
              {/* Cast Object.entries to ensure count is treated as number to fix arithmetic errors */}
              {(Object.entries(stats.distributions) as [string, number][]).sort((a,b) => b[1] - a[1]).map(([name, count]) => {
                const percentage = (count / filteredRanking.length) * 100;
                return (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-slate-700">{name}</span>
                      <span className="text-slate-500">{percentage.toFixed(1)}% ({count})</span>
                    </div>
                    <div
                      className="h-2 w-full bg-slate-50 rounded-full overflow-hidden"
                      role="img"
                      aria-label={`${name}: ${percentage.toFixed(1)}% (${count})`}
                    >
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Average Scores */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold mb-6">Média Global por Eixo</h3>
            <div className="space-y-8">
              {/* Cast Object.entries to ensure val is treated as number to fix toFixed and arithmetic errors */}
              {(Object.entries(stats.avgScores) as [string, number][]).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold capitalize">{key}</span>
                    <span className="font-bold">{val.toFixed(1)}/10</span>
                  </div>
                  <div
                    className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700"
                    role="img"
                    aria-label={`${key}: ${val.toFixed(1)} de 10`}
                  >
                    <div className="h-full bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]" style={{ width: `${val * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs text-slate-500 italic text-center">
              Participações no período: {filteredRanking.length}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !errorMessage && filteredRanking.length > 0 && (
        <div className="mt-10 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Mapa do Brasil</p>
              <h3 className="text-xl font-bold text-slate-800">Distribuição por UF (opt-in)</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Dados agregados</span>
          </div>
          {ufStats.total === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-500">
              Ainda não há UFs suficientes para exibir o mapa. Assim que houver opt-ins, o mapa será preenchido.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2" role="img" aria-label="Mapa ilustrativo por unidade federativa">
                {ufStats.heatmap.map((item) => (
                  <div
                    key={item.uf}
                    className={`rounded-xl px-2 py-3 text-xs font-semibold text-slate-700 text-center ${item.color}`}
                    title={`${item.label}: ${item.count}`}
                  >
                    {item.uf}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-5">
                <span>Baixa</span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-8 rounded-full bg-indigo-200" aria-hidden="true"></span>
                  <span className="h-2 w-8 rounded-full bg-indigo-400" aria-hidden="true"></span>
                  <span className="h-2 w-8 rounded-full bg-indigo-600" aria-hidden="true"></span>
                </span>
                <span>Alta</span>
              </div>
              <p className="text-xs text-slate-400 mt-4">
                O mapa aparece apenas quando o usuario permite compartilhar a UF. Sem dados pessoais.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RankingDashboard;

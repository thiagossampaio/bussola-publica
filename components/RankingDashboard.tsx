
import React, { useEffect, useMemo, useState } from 'react';
import { PoliticalResult, Scores } from '../types';
import { subscribeToParticipations } from '../services/participationService';

interface RankingDashboardProps {
  onBack: () => void;
  onTakeQuiz: () => void;
}

const RankingDashboard: React.FC<RankingDashboardProps> = ({ onBack, onTakeQuiz }) => {
  const [rankingData, setRankingData] = useState<PoliticalResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const stats = useMemo(() => {
    if (rankingData.length === 0) return null;
    
    const avgScores: Scores = {
      economico: rankingData.reduce((acc, curr) => acc + curr.scores.economico, 0) / rankingData.length,
      social: rankingData.reduce((acc, curr) => acc + curr.scores.social, 0) / rankingData.length,
      cultural: rankingData.reduce((acc, curr) => acc + curr.scores.cultural, 0) / rankingData.length,
      nacional: rankingData.reduce((acc, curr) => acc + curr.scores.nacional, 0) / rankingData.length,
    };

    const distributions: Record<string, number> = {};
    rankingData.forEach(r => {
      distributions[r.classificacao_principal] = (distributions[r.classificacao_principal] || 0) + 1;
    });

    return { avgScores, distributions };
  }, [rankingData]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-12">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-2">
          ← Voltar ao Início
        </button>
        <button onClick={onTakeQuiz} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all">
          Participar agora
        </button>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Dashboard de Rankings</h1>
      <p className="text-slate-500 mb-12">Dados coletados de forma anônima entre todos os participantes.</p>

      {isLoading ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-lg">Carregando dados do ranking...</p>
        </div>
      ) : errorMessage ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-lg mb-4">{errorMessage}</p>
          <button onClick={onTakeQuiz} className="text-indigo-600 font-bold underline decoration-2">
            Participar mesmo assim
          </button>
        </div>
      ) : rankingData.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-lg mb-4">Ainda não temos dados suficientes no ranking.</p>
          <button onClick={onTakeQuiz} className="text-indigo-600 font-bold underline decoration-2">
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
                const percentage = (count / rankingData.length) * 100;
                return (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-slate-700">{name}</span>
                      <span className="text-slate-500">{percentage.toFixed(1)}% ({count})</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
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
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div className="h-full bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]" style={{ width: `${val * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs text-slate-500 italic text-center">
              Total de participações: {rankingData.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingDashboard;

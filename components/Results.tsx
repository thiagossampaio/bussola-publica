
import React, { useState } from 'react';
import { PoliticalResult, Scores } from '../types';
import RadarVisualization from './RadarChart';
import { saveParticipation } from '../services/participationService';

interface ResultsProps {
  result: PoliticalResult;
  onRestart: () => void;
  onViewRanking: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onRestart, onViewRanking }) => {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modal, setModal] = useState<{
    title: string;
    message: string;
    variant: 'success' | 'error';
  } | null>(null);

  const getScoreColor = (val: number) => {
    if (val < 4) return "bg-red-500";
    if (val > 6) return "bg-emerald-500";
    return "bg-slate-500";
  };

  const saveToRanking = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await saveParticipation(result);
      setModal({
        title: "Participação registrada!",
        message: "Resultados salvos anonimamente no ranking global.",
        variant: 'success'
      });
    } catch (error) {
      console.error("Falha ao salvar participação no Firestore", error);
      setModal({
        title: "Não foi possível salvar",
        message: "Tente novamente em instantes.",
        variant: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => setModal(null);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-1000">
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 p-8">
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${modal.variant === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {modal.variant === 'success' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414L8.5 12.086l6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 112 0 1 1 0 01-2 0zm0-7a1 1 0 112 0v4a1 1 0 11-2 0V6z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{modal.title}</h3>
                <p className="text-slate-600 mt-1">{modal.message}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {modal.variant === 'success' ? (
                <button
                  onClick={() => {
                    closeModal();
                    onViewRanking();
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl shadow-md transition-all"
                >
                  Ver ranking
                </button>
              ) : (
                <button
                  onClick={closeModal}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl shadow-md transition-all"
                >
                  Entendi
                </button>
              )}
              <button
                onClick={closeModal}
                className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl shadow-sm transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="text-center mb-12">
        <h1 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Seu Perfil Político</h1>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{result.classificacao_principal}</h2>
        <div className="flex justify-center items-center gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
            Confiança da IA: {result.confianca_classificacao}%
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Chart Card */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Gráfico de Posicionamento
          </h3>
          <RadarVisualization scores={result.scores} />
          <p className="text-xs text-slate-400 text-center mt-4 italic">
            0: Esquerda/Autoritário/Conservador/Nacionalista <br/>
            10: Direita/Libertário/Progressista/Globalista
          </p>
        </div>

        {/* Scores Card */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Pontuações por Eixo
          </h3>
          
          <div className="space-y-6">
            {/* Cast Object.entries to ensure val is treated as number to fix toFixed and arithmetic errors */}
            {(Object.entries(result.scores) as [string, number][]).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-slate-700 capitalize">{key}</span>
                  <span className="text-sm font-bold text-slate-900">{val.toFixed(1)}/10</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getScoreColor(val)} transition-all duration-1000`}
                    style={{ width: `${val * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-2xl mb-12">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Análise do Especialista AI
        </h3>
        <p className={`text-indigo-100 leading-relaxed ${showFullAnalysis ? '' : 'line-clamp-4'}`}>
          {result.analise_detalhada}
        </p>
        <button 
          onClick={() => setShowFullAnalysis(!showFullAnalysis)}
          className="mt-4 text-indigo-400 font-bold hover:text-white transition-colors underline decoration-2 underline-offset-4"
        >
          {showFullAnalysis ? "Ver menos" : "Ler análise completa"}
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Figuras Alinhadas</h3>
        <div className="flex flex-wrap gap-3">
          {result.figuras_similares.map((fig, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-medium border border-slate-200">
              {fig}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={saveToRanking}
          disabled={isSaving}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg transition-all"
        >
          {isSaving ? "Salvando..." : "Salvar no Ranking Público"}
        </button>
        <button 
          onClick={onRestart}
          className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl shadow-sm transition-all"
        >
          Refazer Questionário
        </button>
      </div>
    </div>
  );
};

export default Results;

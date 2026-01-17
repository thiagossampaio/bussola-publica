
import React, { useEffect, useMemo, useState } from 'react';
import { getParticipationCount } from '../services/participationService';

interface LandingPageProps {
  onStart: () => void;
  onViewRanking: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onViewRanking }) => {
  const [participationCount, setParticipationCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    getParticipationCount()
      .then((count) => {
        if (isMounted) setParticipationCount(count);
      })
      .catch((error) => {
        console.error("Falha ao carregar contagem do Firestore", error);
        if (isMounted) setParticipationCount(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const countLabel = useMemo(() => {
    if (participationCount === null) return "Muitas pessoas já responderam";
    const formatted = new Intl.NumberFormat('pt-BR').format(participationCount);
    return `${formatted} pessoas já responderam`;
  }, [participationCount]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="bg-indigo-600 p-4 rounded-2xl mb-8 shadow-xl shadow-indigo-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.488V5.83a2 2 0 011.161-1.812l6.839-3.42a2 2 0 011.999 0l6.839 3.42A2 2 0 0121 5.83v9.658a2 2 0 01-1.161 1.812L15 20m-6 0l6-3m-6 3V7m6 10V7" />
        </svg>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
        Bússola <span className="text-indigo-600">Política AI</span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed">
        Descubra seu real posicionamento político através de um questionário multidimensional analisado por Inteligência Artificial avançada.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button 
          onClick={onStart}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-indigo-300 transform hover:-translate-y-1 active:translate-y-0"
        >
          Iniciar Questionário
        </button>
        <button 
          onClick={onViewRanking}
          className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-8 rounded-xl border-2 border-slate-200 transition-all shadow-sm"
        >
          Ver Ranking Global
        </button>
      </div>
      
      <div className="mt-16 flex items-center gap-2 text-slate-400 font-medium">
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <img key={i} src={`https://picsum.photos/32/32?random=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
          ))}
        </div>
        <span>+{countLabel}</span>
      </div>
    </div>
  );
};

export default LandingPage;

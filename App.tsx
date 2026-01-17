
import React, { useState } from 'react';
import { AppState, UserAnswer, PoliticalResult, Question } from './types';
import { QUESTIONS, buildQuestionnaireQuestions } from './constants';
import LandingPage from './components/LandingPage';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import RankingDashboard from './components/RankingDashboard';
import { analyzePoliticalPosition } from './services/geminiService';
import { generateBackupResult } from './utils/calculations';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [result, setResult] = useState<PoliticalResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionSet, setQuestionSet] = useState<Question[]>([]);

  const startQuiz = () => {
    setState(AppState.CONSENT);
  };

  const handleConsent = () => {
    setQuestionSet(buildQuestionnaireQuestions());
    setState(AppState.QUESTIONNAIRE);
  };

  const handleComplete = async (answers: UserAnswer[]) => {
    setIsLoading(true);
    try {
      const activeQuestions = questionSet.length ? questionSet : QUESTIONS;
      // Try Gemini Analysis
      const analysis = await analyzePoliticalPosition(answers, activeQuestions);
      setResult(analysis);
      setState(AppState.RESULTS);
    } catch (err) {
      console.error("Gemini failed, using backup calculation", err);
      const backup = generateBackupResult(answers, questionSet.length ? questionSet : QUESTIONS);
      setResult(backup);
      setState(AppState.RESULTS);
    } finally {
      setIsLoading(false);
    }
  };

  const viewRanking = () => setState(AppState.RANKING);
  const goHome = () => setState(AppState.LANDING);

  return (
    <div className="min-h-screen selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-500">
      {/* Navigation / Brand Header */}
      <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center">
        <div 
          onClick={goHome} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-indigo-600 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-md shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-800">Bússola Política</span>
        </div>
      </nav>

      <main className="container mx-auto pb-20">
        {isLoading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Analisando sua Ideologia...</h3>
            <p className="text-slate-500 max-w-sm">Nossa IA está processando suas respostas para identificar nuances sutis em seu posicionamento.</p>
          </div>
        )}

        {state === AppState.LANDING && (
          <LandingPage onStart={startQuiz} onViewRanking={viewRanking} />
        )}

        {state === AppState.CONSENT && (
          <div className="max-w-xl mx-auto py-12 px-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Antes de começar</h2>
            <div className="space-y-4 text-slate-600 mb-8">
              <p>Este questionário utiliza Inteligência Artificial avançada para analisar seu posicionamento. Responda com honestidade para obter o melhor resultado.</p>
              <div className="bg-slate-50 p-4 rounded-xl flex gap-3 items-start border border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-sm">Seus dados são processados de forma anônima. Não coletamos nomes ou informações identificáveis.</p>
              </div>
              <p>O resultado é um indicativo educacional e não um rótulo definitivo. Use-o para auto-reflexão e estudo.</p>
            </div>
            <button 
              onClick={handleConsent}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
            >
              Eu concordo e quero começar
            </button>
            <button onClick={goHome} className="w-full mt-4 text-slate-400 font-medium hover:text-slate-600 transition-colors">
              Voltar
            </button>
          </div>
        )}

        {state === AppState.QUESTIONNAIRE && (
          <Questionnaire
            questions={questionSet}
            onComplete={handleComplete}
            onCancel={goHome}
          />
        )}

        {state === AppState.RESULTS && result && (
          <Results result={result} onRestart={() => setState(AppState.LANDING)} onViewRanking={viewRanking} />
        )}

        {state === AppState.RANKING && (
          <RankingDashboard onBack={goHome} onTakeQuiz={startQuiz} />
        )}
      </main>

      <footer className="text-center py-12 text-slate-400 text-sm border-t border-slate-100">
        <p>© 2025 Bússola Política AI — Tecnologia Gemini 3 Pro & Flash</p>
        <p className="mt-1">Ciência Política baseada nos modelos Political Compass & 8values.</p>
      </footer>
    </div>
  );
};

export default App;

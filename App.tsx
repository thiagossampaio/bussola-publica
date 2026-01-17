
import React, { useEffect, useMemo, useState } from 'react';
import { AppState, UserAnswer, PoliticalResult, Question, SelfPositioningSelection } from './types';
import { QUESTIONS, buildQuestionnaireQuestions, SELF_POSITIONING_OPTIONS } from './constants';
import LandingPage from './components/LandingPage';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import RankingDashboard from './components/RankingDashboard';
import SelfAssessment from './components/SelfAssessment';
import { analyzePoliticalPosition } from './services/geminiService';
import { generateBackupResult } from './utils/calculations';

const PROGRESS_STORAGE_KEY = 'bp_questionnaire_progress_v1';

type SavedProgress = {
  version: 1;
  questionSet: Question[];
  answers: UserAnswer[];
  currentIndex: number;
  selfPositioning: SelfPositioningSelection | null;
  savedAt: number;
};

const parseSavedProgress = (raw: string | null): SavedProgress | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SavedProgress;
    if (
      parsed?.version === 1 &&
      Array.isArray(parsed.questionSet) &&
      Array.isArray(parsed.answers) &&
      typeof parsed.currentIndex === 'number'
    ) {
      return parsed;
    }
  } catch (error) {
    console.warn('Falha ao ler progresso salvo', error);
  }
  return null;
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [result, setResult] = useState<PoliticalResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionSet, setQuestionSet] = useState<Question[]>([]);
  const [selfPositioning, setSelfPositioning] = useState<SelfPositioningSelection | null>(null);
  const [savedProgress, setSavedProgress] = useState<SavedProgress | null>(null);
  const [resumeAnswers, setResumeAnswers] = useState<UserAnswer[] | null>(null);
  const [resumeIndex, setResumeIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = parseSavedProgress(localStorage.getItem(PROGRESS_STORAGE_KEY));
    if (saved) {
      setSavedProgress(saved);
    }
  }, []);

  const clearProgress = () => {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    setSavedProgress(null);
    setResumeAnswers(null);
    setResumeIndex(null);
  };

  const startQuiz = () => {
    clearProgress();
    setSelfPositioning(null);
    setQuestionSet([]);
    setResult(null);
    setState(AppState.CONSENT);
  };

  const resumeQuiz = () => {
    if (!savedProgress) return;
    setResult(null);
    setQuestionSet(savedProgress.questionSet);
    setSelfPositioning(savedProgress.selfPositioning);
    setResumeAnswers(savedProgress.answers);
    setResumeIndex(savedProgress.currentIndex);
    setState(AppState.QUESTIONNAIRE);
  };

  const handleConsent = () => {
    setState(AppState.SELF_ASSESSMENT);
  };

  const handleSelfAssessment = (selection: SelfPositioningSelection) => {
    setSelfPositioning(selection);
    setQuestionSet(buildQuestionnaireQuestions());
    setResumeAnswers(null);
    setResumeIndex(null);
    setState(AppState.QUESTIONNAIRE);
  };

  const handleComplete = async (answers: UserAnswer[]) => {
    clearProgress();
    setIsLoading(true);
    try {
      const activeQuestions = questionSet.length ? questionSet : QUESTIONS;
      // Try Gemini Analysis
      const analysis = await analyzePoliticalPosition(answers, activeQuestions, selfPositioning);
      setResult({ ...analysis, autoavaliacao: selfPositioning, timestamp: Date.now() });
      setState(AppState.RESULTS);
    } catch (err) {
      console.error("Gemini failed, using backup calculation", err);
      const backup = generateBackupResult(answers, questionSet.length ? questionSet : QUESTIONS, selfPositioning);
      setResult({ ...backup, autoavaliacao: selfPositioning, timestamp: Date.now() });
      setState(AppState.RESULTS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgress = (payload: { answers: UserAnswer[]; currentIndex: number }) => {
    if (!questionSet.length) return;
    const progress: SavedProgress = {
      version: 1,
      questionSet,
      answers: payload.answers,
      currentIndex: payload.currentIndex,
      selfPositioning,
      savedAt: Date.now()
    };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    setSavedProgress(progress);
  };

  const viewRanking = () => setState(AppState.RANKING);
  const goHome = () => {
    setState(AppState.LANDING);
    setResult(null);
    setQuestionSet([]);
    setSelfPositioning(null);
  };

  const resumeLabel = useMemo(() => {
    if (!savedProgress) return null;
    const answered = savedProgress.answers.length;
    const total = savedProgress.questionSet.length;
    return `Você respondeu ${answered} de ${total} perguntas`;
  }, [savedProgress]);

  const isLanding = state === AppState.LANDING;

  return (
    <div
      className={`min-h-screen selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-500 ${
        isLanding ? "bg-gradient-to-b from-indigo-50 via-white to-white" : "bg-white"
      }`}
    >
      <a href="#conteudo" className="skip-link">Pular para o conteúdo principal</a>
      {/* Navigation / Brand Header */}
      <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center" aria-label="Navegação principal">
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-2 cursor-pointer group"
          aria-label="Voltar para o início"
        >
          <div className="bg-indigo-600 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-md shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-800">Bússola Política</span>
        </button>
        <a
          href="https://github.com/thiagossampaio/bussola-publica"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
          aria-label="Ver o código no GitHub"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 0 0-3.162 19.49c.5.093.687-.217.687-.48 0-.237-.009-.866-.013-1.7-2.797.608-3.386-1.348-3.386-1.348-.457-1.16-1.116-1.47-1.116-1.47-.913-.624.069-.611.069-.611 1.01.071 1.542 1.037 1.542 1.037.897 1.538 2.355 1.093 2.93.836.092-.65.351-1.094.638-1.345-2.233-.254-4.584-1.116-4.584-4.966 0-1.096.392-1.993 1.037-2.695-.104-.255-.45-1.279.099-2.665 0 0 .844-.27 2.767 1.03A9.64 9.64 0 0 1 12 6.844a9.64 9.64 0 0 1 2.522.34c1.923-1.3 2.766-1.03 2.766-1.03.55 1.386.204 2.41.1 2.665.646.702 1.036 1.6 1.036 2.695 0 3.86-2.353 4.708-4.59 4.957.36.31.681.92.681 1.854 0 1.337-.012 2.415-.012 2.743 0 .266.186.577.693.48A10 10 0 0 0 12 2Z"
            />
          </svg>
        </a>
      </nav>

      <main id="conteudo" className="container mx-auto pb-20" role="main">
        {isLoading && (
          <div
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" aria-hidden="true"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Analisando sua Ideologia...</h3>
            <p className="text-slate-500 max-w-sm">Nossa IA está processando suas respostas para identificar nuances sutis em seu posicionamento.</p>
          </div>
        )}

        {state === AppState.LANDING && (
          <LandingPage
            onStart={startQuiz}
            onViewRanking={viewRanking}
            hasSavedProgress={Boolean(savedProgress)}
            onResume={resumeQuiz}
            resumeLabel={resumeLabel ?? undefined}
          />
        )}

        {state === AppState.CONSENT && (
          <div className="max-w-xl mx-auto py-12 px-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Antes de começar</h2>
            <div className="space-y-4 text-slate-600 mb-8">
              <p>Este questionário utiliza Inteligência Artificial avançada para analisar seu posicionamento. Responda com honestidade para obter o melhor resultado.</p>
              <p>Leva em média 4 minutos, não exige cadastro e você pode retomar depois se precisar.</p>
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
              type="button"
            >
              Eu concordo e quero começar
            </button>
            <button onClick={goHome} className="w-full mt-4 text-slate-400 font-medium hover:text-slate-600 transition-colors" type="button">
              Voltar
            </button>
          </div>
        )}

        {state === AppState.SELF_ASSESSMENT && (
          <SelfAssessment
            options={SELF_POSITIONING_OPTIONS}
            onSelect={handleSelfAssessment}
            onBack={() => setState(AppState.CONSENT)}
          />
        )}

        {state === AppState.QUESTIONNAIRE && (
          <Questionnaire
            questions={questionSet}
            onComplete={handleComplete}
            onCancel={() => {
              clearProgress();
              goHome();
            }}
            initialAnswers={resumeAnswers ?? undefined}
            initialIndex={resumeIndex ?? undefined}
            onProgress={handleProgress}
          />
        )}

        {state === AppState.RESULTS && result && (
          <Results result={result} onRestart={goHome} onViewRanking={viewRanking} />
        )}

        {state === AppState.RANKING && (
          <RankingDashboard onBack={goHome} onTakeQuiz={startQuiz} />
        )}
      </main>

      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-md shadow-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-800">Bússola Política AI</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Uma experiência de auto-conhecimento político que combina ciência política e IA para entregar um retrato multidimensional claro e explicável.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={startQuiz}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm"
                type="button"
              >
                Iniciar Questionário
              </button>
              <button
                onClick={viewRanking}
                className="text-slate-500 hover:text-slate-700 text-sm font-semibold"
                type="button"
              >
                Ver Ranking
              </button>
            </div>
          <a
            href="https://github.com/thiagossampaio/bussola-publica"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Ver o código no GitHub"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-3.162 19.49c.5.093.687-.217.687-.48 0-.237-.009-.866-.013-1.7-2.797.608-3.386-1.348-3.386-1.348-.457-1.16-1.116-1.47-1.116-1.47-.913-.624.069-.611.069-.611 1.01.071 1.542 1.037 1.542 1.037.897 1.538 2.355 1.093 2.93.836.092-.65.351-1.094.638-1.345-2.233-.254-4.584-1.116-4.584-4.966 0-1.096.392-1.993 1.037-2.695-.104-.255-.45-1.279.099-2.665 0 0 .844-.27 2.767 1.03A9.64 9.64 0 0 1 12 6.844a9.64 9.64 0 0 1 2.522.34c1.923-1.3 2.766-1.03 2.766-1.03.55 1.386.204 2.41.1 2.665.646.702 1.036 1.6 1.036 2.695 0 3.86-2.353 4.708-4.59 4.957.36.31.681.92.681 1.854 0 1.337-.012 2.415-.012 2.743 0 .266.186.577.693.48A10 10 0 0 0 12 2Z"
              />
            </svg>
            <span>GitHub</span>
          </a>
          </div>

          <div className="space-y-3 text-sm">
            <p className="font-semibold text-slate-800">Navegação</p>
            <a className="block text-slate-500 hover:text-slate-700" href="#inicio">Início</a>
            <a className="block text-slate-500 hover:text-slate-700" href="#como-funciona">Como funciona</a>
            <a className="block text-slate-500 hover:text-slate-700" href="#metodologia">Metodologia</a>
            <a className="block text-slate-500 hover:text-slate-700" href="#graficos">Gráficos</a>
            <a className="block text-slate-500 hover:text-slate-700" href="#faq">FAQ</a>
          </div>

          <div className="space-y-3 text-sm">
            <p className="font-semibold text-slate-800">Sobre</p>
            <p className="text-slate-500">Tecnologia Gemini 3 Pro & Flash</p>
            <p className="text-slate-500">Modelos Political Compass & 8values</p>
            <p className="text-slate-400">Dados tratados de forma anônima</p>
          </div>
        </div>
        <div className="border-t border-slate-100 py-6">
          <p className="text-center text-slate-400 text-xs">
            © 2025 Bússola Política AI — Ciência Política explicável para todas as pessoas.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

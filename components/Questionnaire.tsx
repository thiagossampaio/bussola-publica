
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { LIKERT_OPTIONS } from '../constants';
import { UserAnswer, Question } from '../types';
import { getQuestionExplanation } from '../services/geminiService';
import { trackEvent } from '../utils/analytics';

interface QuestionnaireProps {
  questions: Question[];
  onComplete: (answers: UserAnswer[]) => void;
  onCancel: () => void;
  initialAnswers?: UserAnswer[];
  initialIndex?: number;
  onProgress?: (payload: { answers: UserAnswer[]; currentIndex: number }) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
  questions,
  onComplete,
  onCancel,
  initialAnswers,
  initialIndex,
  onProgress
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex ?? 0);
  const [answers, setAnswers] = useState<UserAnswer[]>(initialAnswers ?? []);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExpl, setLoadingExpl] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  useEffect(() => {
    const safeIndex = Math.min(initialIndex ?? 0, Math.max(questions.length - 1, 0));
    setCurrentIndex(safeIndex);
    setAnswers(initialAnswers ?? []);
  }, [initialAnswers, initialIndex, questions]);

  useEffect(() => {
    onProgress?.({ answers, currentIndex });
  }, [answers, currentIndex, onProgress]);

  if (!questions.length) {
    return null;
  }

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === currentQuestion.id);
    
    if (existingIndex > -1) {
      newAnswers[existingIndex] = { questionId: currentQuestion.id, value };
    } else {
      newAnswers.push({ questionId: currentQuestion.id, value });
    }
    
    setAnswers(newAnswers);
    setExplanation(null);
    trackEvent('question_answered', {
      questionId: currentQuestion.id,
      index: currentIndex,
      value
    });

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setExplanation(null);
      trackEvent('question_back_clicked', { index: currentIndex });
    }
  };

  const handleHelp = async () => {
    if (loadingExpl) return;
    setLoadingExpl(true);
    try {
      const expl = await getQuestionExplanation(currentQuestion.text);
      setExplanation(expl);
      trackEvent('question_help_clicked', { questionId: currentQuestion.id });
    } catch (err) {
      setExplanation("Ocorreu um erro ao buscar a explicação. Tente novamente.");
    } finally {
      setLoadingExpl(false);
    }
  };

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id)?.value;
  const answeredCount = answers.length;
  const remainingQuestions = Math.max(0, questions.length - (currentIndex + 1));
  const remainingSeconds = remainingQuestions * 15;
  const remainingMinutes = remainingSeconds <= 30 ? 0 : Math.round(remainingSeconds / 60);
  const remainingLabel = remainingMinutes === 0 ? 'menos de 1 min' : `~${remainingMinutes} min`;

  const handleCancel = () => {
    if (answeredCount === 0 && currentIndex === 0) {
      trackEvent('quiz_cancelled', { answered: answeredCount, index: currentIndex });
      onCancel();
      return;
    }
    const shouldExit = window.confirm("Tem certeza que deseja sair e reiniciar? Seu progresso atual será descartado.");
    if (shouldExit) {
      trackEvent('quiz_cancelled', { answered: answeredCount, index: currentIndex });
      onCancel();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header / Progress */}
      <div className="mb-8 animate-fade-in">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Pergunta {currentIndex + 1} de {questions.length}
          </span>
          <span className="text-sm font-bold text-indigo-600">{Math.round(progress)}%</span>
        </div>
        <div
          className="h-2 w-full bg-slate-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Progresso do questionário"
        >
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out progress-shimmer"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span>{answeredCount} de {questions.length} respondidas</span>
          <span>Tempo restante: {remainingLabel}</span>
          <span>Progresso salvo automaticamente</span>
        </div>
      </div>

      {/* Question Card */}
      <div
        key={currentQuestion.id}
        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 min-h-[400px] flex flex-col animate-fade-in-up"
      >
        <div className="flex justify-between items-start mb-6">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase">
            {currentQuestion.category}
          </span>
          <button 
            onClick={handleHelp}
            disabled={loadingExpl}
            className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium pressable"
            type="button"
            aria-busy={loadingExpl}
            aria-controls="explicacao-pergunta"
          >
            {loadingExpl ? (
              <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            Não entendi
          </button>
        </div>

        <h2 id="pergunta-atual" className="text-2xl md:text-3xl font-semibold text-slate-800 leading-snug mb-12">
          "{currentQuestion.text}"
        </h2>

        {explanation && (
          <div
            id="explicacao-pergunta"
            className="mb-8 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 text-sm leading-relaxed animate-fade-in"
            aria-live="polite"
          >
            <h4 className="font-bold mb-2">Explicação do Cientista Político AI:</h4>
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-lg font-bold text-amber-900 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold text-amber-900 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold text-amber-900 mb-2">{children}</h3>,
                p: ({ children }) => <p className="text-amber-900 mb-3 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-3 text-amber-900">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 text-amber-900">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-amber-900">{children}</strong>,
                em: ({ children }) => <em className="italic text-amber-900">{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-amber-300 pl-3 italic text-amber-900/90 mb-3">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-mono">
                    {children}
                  </code>
                )
              }}
            >
              {explanation}
            </ReactMarkdown>
          </div>
        )}

        <div className="mt-auto space-y-3" role="radiogroup" aria-labelledby="pergunta-atual">
          {LIKERT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className={`w-full py-4 px-6 rounded-xl border-2 transition-all text-left flex items-center justify-between group pressable hover:-translate-y-0.5
                ${currentAnswer === opt.value 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-indigo-200 hover:bg-white'}
              `}
              type="button"
              role="radio"
              aria-checked={currentAnswer === opt.value}
            >
              <span className="font-semibold">{opt.label}</span>
              <div className={`w-3 h-3 rounded-full ${opt.color} group-hover:scale-125 transition-transform`} aria-hidden="true"></div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center animate-fade-in">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-2 text-slate-400 hover:text-slate-600 disabled:opacity-30 font-semibold pressable"
          type="button"
        >
          ← Voltar
        </button>
        <button 
          onClick={handleCancel}
          className="text-slate-400 hover:text-red-500 font-semibold transition-colors pressable"
          type="button"
        >
          Sair e Reiniciar
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;

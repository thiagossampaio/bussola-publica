
import React, { useState, useEffect } from 'react';
import { QUESTIONS, LIKERT_OPTIONS } from '../constants';
import { UserAnswer, Question } from '../types';
import { getQuestionExplanation } from '../services/geminiService';

interface QuestionnaireProps {
  onComplete: (answers: UserAnswer[]) => void;
  onCancel: () => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExpl, setLoadingExpl] = useState(false);

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

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

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setExplanation(null);
    }
  };

  const handleHelp = async () => {
    if (loadingExpl) return;
    setLoadingExpl(true);
    try {
      const expl = await getQuestionExplanation(currentQuestion.text);
      setExplanation(expl);
    } catch (err) {
      setExplanation("Ocorreu um erro ao buscar a explicação. Tente novamente.");
    } finally {
      setLoadingExpl(false);
    }
  };

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id)?.value;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header / Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Pergunta {currentIndex + 1} de {QUESTIONS.length}
          </span>
          <span className="text-sm font-bold text-indigo-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 min-h-[400px] flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase">
            {currentQuestion.category}
          </span>
          <button 
            onClick={handleHelp}
            disabled={loadingExpl}
            className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            {loadingExpl ? (
              <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            Não entendi
          </button>
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 leading-snug mb-12">
          "{currentQuestion.text}"
        </h2>

        {explanation && (
          <div className="mb-8 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 text-sm leading-relaxed whitespace-pre-wrap">
            <h4 className="font-bold mb-1">Explicação do Cientista Político AI:</h4>
            {explanation}
          </div>
        )}

        <div className="mt-auto space-y-3">
          {LIKERT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className={`w-full py-4 px-6 rounded-xl border-2 transition-all text-left flex items-center justify-between group
                ${currentAnswer === opt.value 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-indigo-200 hover:bg-white'}
              `}
            >
              <span className="font-semibold">{opt.label}</span>
              <div className={`w-3 h-3 rounded-full ${opt.color} group-hover:scale-125 transition-transform`}></div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-6 py-2 text-slate-400 hover:text-slate-600 disabled:opacity-30 font-semibold"
        >
          ← Voltar
        </button>
        <button 
          onClick={onCancel}
          className="text-slate-400 hover:text-red-500 font-semibold transition-colors"
        >
          Sair e Reiniciar
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;

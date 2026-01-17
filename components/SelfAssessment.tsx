import React from 'react';
import { SelfPositioningOption, SelfPositioningSelection } from '../types';

interface SelfAssessmentProps {
  options: SelfPositioningOption[];
  onSelect: (selection: SelfPositioningSelection) => void;
  onBack: () => void;
}

const SelfAssessment: React.FC<SelfAssessmentProps> = ({ options, onSelect, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-in slide-in-from-bottom-8 duration-500">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Antes do questionário</h2>
        <p className="text-slate-600 mb-8">
          Como você se posiciona politicamente hoje? Essa é uma autoavaliação rápida para
          compararmos com o resultado da IA no final.
        </p>

        <div className="grid gap-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect({ id: option.id, label: option.label, scores: option.scores })}
              className="w-full text-left border-2 border-slate-100 rounded-2xl p-5 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all pressable"
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-800">{option.label}</p>
                  <p className="text-sm text-slate-500 mt-1">{option.description}</p>
                </div>
                <span className="h-3 w-3 rounded-full bg-indigo-500/80" aria-hidden="true"></span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-slate-600 font-semibold transition-colors pressable"
            type="button"
          >
            ← Voltar
          </button>
          <span className="text-xs text-slate-400">
            Você poderá revisar essa etapa ao refazer o teste.
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelfAssessment;

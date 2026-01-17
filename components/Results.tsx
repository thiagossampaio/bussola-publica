
import React, { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PoliticalResult, Scores } from '../types';
import RadarVisualization from './RadarChart';
import { saveParticipation } from '../services/participationService';
import { getFigureComparison } from '../services/geminiService';
import { trackEvent } from '../utils/analytics';
import { buildShareCardSvg } from '../utils/shareCard';
import { UF_OPTIONS } from '../constants';

interface ResultsProps {
  result: PoliticalResult;
  onRestart: () => void;
  onViewRanking: () => void;
}

const PRIORITIES_STORAGE_KEY = 'bp_priority_scores_v1';
const UF_STORAGE_KEY = 'bp_uf_selected_v1';
const UF_OPTIN_STORAGE_KEY = 'bp_uf_optin_v1';
const HISTORY_STORAGE_KEY = 'bp_results_history_v1';

const Results: React.FC<ResultsProps> = ({ result, onRestart, onViewRanking }) => {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisTarget, setAnalysisTarget] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const autoavaliacao = result.autoavaliacao ?? null;
  const autoScores = autoavaliacao?.scores ?? null;
  const defaultPriorityScores: Scores = {
    economico: 5,
    social: 5,
    cultural: 5,
    nacional: 5,
  };
  const [priorityScores, setPriorityScores] = useState<Scores>(defaultPriorityScores);
  const [prioritiesSaved, setPrioritiesSaved] = useState(false);
  const [ufOptIn, setUfOptIn] = useState(false);
  const [ufSelected, setUfSelected] = useState('');
  const [debateOpen, setDebateOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [history, setHistory] = useState<Array<{ timestamp: number; scores: Scores }>>([]);
  const [modal, setModal] = useState<{
    title: string;
    message: string;
    variant: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    trackEvent('results_viewed', { classification: result.classificacao_principal });
  }, [result.classificacao_principal]);

  useEffect(() => {
    trackEvent('theme_comparator_viewed');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedPriorities = localStorage.getItem(PRIORITIES_STORAGE_KEY);
    if (storedPriorities) {
      try {
        const parsed = JSON.parse(storedPriorities) as Scores;
        setPriorityScores({
          economico: Number.isFinite(parsed.economico) ? parsed.economico : 5,
          social: Number.isFinite(parsed.social) ? parsed.social : 5,
          cultural: Number.isFinite(parsed.cultural) ? parsed.cultural : 5,
          nacional: Number.isFinite(parsed.nacional) ? parsed.nacional : 5,
        });
        setPrioritiesSaved(true);
      } catch {
        setPrioritiesSaved(false);
      }
    }
    const storedUf = localStorage.getItem(UF_STORAGE_KEY);
    const storedOptIn = localStorage.getItem(UF_OPTIN_STORAGE_KEY);
    if (storedUf) setUfSelected(storedUf);
    if (storedOptIn) setUfOptIn(storedOptIn === 'true');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const entry = {
      timestamp: result.timestamp ?? Date.now(),
      scores: result.scores,
    };
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Array<{ timestamp: number; scores: Scores }>) : [];
    const last = parsed[parsed.length - 1];
    const isDuplicate =
      last &&
      Math.abs(entry.timestamp - last.timestamp) < 60000 &&
      Object.keys(entry.scores).every((key) => entry.scores[key as keyof Scores] === last.scores[key as keyof Scores]);
    const next = isDuplicate ? parsed : [...parsed, entry].slice(-6);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
    setHistory(next);
  }, [result]);

  const axisLabels: Record<keyof Scores, string> = {
    economico: 'Econômico',
    social: 'Social',
    cultural: 'Cultural',
    nacional: 'Nacional'
  };

  const axisInsights = useMemo(() => {
    const axisMap: Array<{
      key: keyof Scores;
      label: string;
      value: number;
      insight: string;
      strength: number;
    }> = [
      {
        key: 'economico',
        label: 'Economia',
        value: result.scores.economico,
        insight:
          result.scores.economico >= 6.5
            ? 'Preferência por mercado com menor intervenção estatal.'
            : result.scores.economico <= 3.5
              ? 'Preferência por Estado mais presente e políticas redistributivas.'
              : 'Equilíbrio entre mercado e proteção social.',
        strength: Math.abs(result.scores.economico - 5)
      },
      {
        key: 'social',
        label: 'Sociedade',
        value: result.scores.social,
        insight:
          result.scores.social >= 6.5
            ? 'Costumes mais conservadores e foco em estabilidade social.'
            : result.scores.social <= 3.5
              ? 'Valores progressistas e abertura a mudanças sociais.'
              : 'Postura moderada em temas de costumes.',
        strength: Math.abs(result.scores.social - 5)
      },
      {
        key: 'cultural',
        label: 'Cultura',
        value: result.scores.cultural,
        insight:
          result.scores.cultural >= 6.5
            ? 'Valoriza tradição, ordem e continuidade cultural.'
            : result.scores.cultural <= 3.5
              ? 'Apoia inovação cultural e pluralidade de estilos de vida.'
              : 'Transita entre tradição e inovação com pragmatismo.',
        strength: Math.abs(result.scores.cultural - 5)
      },
      {
        key: 'nacional',
        label: 'Nação',
        value: result.scores.nacional,
        insight:
          result.scores.nacional >= 6.5
            ? 'Prioriza soberania nacional e decisões internas.'
            : result.scores.nacional <= 3.5
              ? 'Abertura maior a cooperação e visão global.'
              : 'Equilíbrio entre interesses nacionais e globais.',
        strength: Math.abs(result.scores.nacional - 5)
      }
    ];

    return axisMap.sort((a, b) => b.strength - a.strength).slice(0, 3);
  }, [result.scores]);

  const consistencyLabel = useMemo(() => {
    if (result.confianca_classificacao >= 80) return 'Consistência alta';
    if (result.confianca_classificacao >= 60) return 'Consistência moderada';
    return 'Consistência baixa';
  }, [result.confianca_classificacao]);

  const rarityLabel = useMemo(() => {
    if (result.intensidade_geral >= 7) return 'Perfil raro';
    if (result.intensidade_geral >= 5) return 'Perfil distinto';
    return 'Perfil moderado';
  }, [result.intensidade_geral]);

  const shareSummary = useMemo(() => {
    const bullets = axisInsights.map((item) => `• ${item.insight}`).join('\n');
    return [
      `Meu perfil na Bússola Política AI: ${result.classificacao_principal}.`,
      bullets,
      'Descubra o seu e compare no ranking global.'
    ].join('\n');
  }, [axisInsights, result.classificacao_principal]);

  const cardSvg = useMemo(() => {
    const originLabel = typeof window === 'undefined' ? 'bussolapolitica.ai' : window.location.origin;
    return buildShareCardSvg(result, originLabel);
  }, [result]);

  const cardDataUrl = useMemo(() => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(cardSvg)}`;
  }, [cardSvg]);

  const handleDownloadCard = async () => {
    trackEvent('share_card_download', { source: 'results' });
    const image = new Image();
    image.src = cardDataUrl;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bussola-politica-card.png';
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const comparisonNote = useMemo(() => {
    if (!autoavaliacao) {
      return "Você optou por não informar sua autoavaliação política.";
    }
    const label = autoavaliacao.label;
    return `Você se declarou "${label}". A IA analisou suas respostas e apontou "${result.classificacao_principal}".`;
  }, [autoavaliacao, result.classificacao_principal]);

  const themeComparatorData = useMemo(() => {
    const toPercent = (value: number) => Math.round(Math.min(10, Math.max(0, value)) * 10);
    const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
    const profile = {
      economico: toPercent(result.scores.economico),
      social: toPercent(result.scores.social),
      cultural: toPercent(result.scores.cultural),
      nacional: toPercent(result.scores.nacional),
    };
    const priorities = {
      economico: toPercent(priorityScores.economico),
      social: toPercent(priorityScores.social),
      cultural: toPercent(priorityScores.cultural),
      nacional: toPercent(priorityScores.nacional),
    };

    return [
      {
        tema: 'Saúde',
        perfil: clampPercent((100 - profile.economico + profile.social) / 2),
        prioridade: clampPercent((priorities.economico + priorities.social) / 2),
      },
      {
        tema: 'Economia',
        perfil: clampPercent(profile.economico),
        prioridade: clampPercent(priorities.economico),
      },
      {
        tema: 'Educação',
        perfil: clampPercent((profile.cultural + profile.social) / 2),
        prioridade: clampPercent((priorities.cultural + priorities.social) / 2),
      },
      {
        tema: 'Segurança',
        perfil: clampPercent((profile.social + profile.nacional) / 2),
        prioridade: clampPercent((priorities.social + priorities.nacional) / 2),
      },
    ];
  }, [priorityScores, result.scores]);

  const timelineData = useMemo(() => {
    const entries = history.length
      ? history
      : [{ timestamp: result.timestamp ?? Date.now(), scores: result.scores }];
    return entries.slice(-5).map((entry) => ({
      label: new Date(entry.timestamp).toLocaleDateString('pt-BR', {
        month: 'short',
        day: '2-digit',
      }),
      score: entry.scores.economico,
    }));
  }, [history, result.scores, result.timestamp]);

  const hasTimeline = history.length > 1;

  const debateHighlights = useMemo(() => {
    const strongest = axisInsights[0];
    const secondary = axisInsights[1];
    return [
      strongest
        ? `Seu maior contraste aparece em ${strongest.label.toLowerCase()}, o que indica espaço para conversas mais detalhadas.`
        : 'Seu perfil mostra equilibrio entre eixos, o que favorece conversas construtivas.',
      secondary
        ? `Em ${secondary.label.toLowerCase()}, ha nuances que podem gerar boas perguntas para o debate.`
        : 'As variacoes entre eixos sugerem que seu perfil nao segue um unico bloco ideologico.',
      'Use explicacoes neutras para comparar argumentos sem reduzir pessoas a rotulos.',
    ];
  }, [axisInsights]);

  const resultPayload = useMemo(() => {
    return {
      ...result,
      prioridades: prioritiesSaved ? priorityScores : null,
      uf: ufOptIn && ufSelected ? ufSelected : null,
      ufOptIn,
    };
  }, [result, prioritiesSaved, priorityScores, ufOptIn, ufSelected]);

  const saveToRanking = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await saveParticipation(resultPayload);
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
  const closeAnalysisModal = () => {
    setAnalysisTarget(null);
    setAnalysisText(null);
    setAnalysisLoading(false);
  };

  const handlePriorityChange = (key: keyof Scores, value: number) => {
    setPriorityScores((prev) => ({ ...prev, [key]: value }));
  };

  const handleSavePriorities = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PRIORITIES_STORAGE_KEY, JSON.stringify(priorityScores));
    setPrioritiesSaved(true);
    trackEvent('priority_radar_completed');
    setModal({
      title: 'Prioridades salvas',
      message: 'Atualizamos seu radar de prioridades para comparar com o perfil.',
      variant: 'success',
    });
  };

  const handleToggleDebate = () => {
    const next = !debateOpen;
    setDebateOpen(next);
    if (next) {
      trackEvent('debate_mode_opened');
    }
  };

  const handleToggleTimeline = () => {
    const next = !timelineOpen;
    setTimelineOpen(next);
    if (next) {
      trackEvent('retake_timeline_viewed');
    }
  };

  const handleConfirmUfOptIn = () => {
    if (!ufSelected) {
      setModal({
        title: 'Selecione sua UF',
        message: 'Escolha uma UF para contribuir com o mapa agregado.',
        variant: 'error',
      });
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(UF_STORAGE_KEY, ufSelected);
      localStorage.setItem(UF_OPTIN_STORAGE_KEY, 'true');
    }
    setUfOptIn(true);
    trackEvent('region_opt_in_confirmed', { uf: ufSelected });
    setModal({
      title: 'Obrigado pelo opt-in',
      message: 'Sua UF será registrada de forma agregada e anonima.',
      variant: 'success',
    });
  };

  const handleFigureAnalysis = async (figure: string) => {
    if (analysisLoading) return;
    setAnalysisTarget(figure);
    setAnalysisText(null);
    setAnalysisLoading(true);
    try {
      const text = await getFigureComparison(result, figure);
      setAnalysisText(text);
    } catch (error) {
      console.error("Falha ao gerar comparação com Gemini", error);
      setAnalysisText("Não foi possível gerar a explicação agora. Tente novamente.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleShare = async () => {
    const shareText = `Meu perfil na Bússola Política AI: ${result.classificacao_principal}. Faça o teste e compare seu resultado!`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Bússola Política AI',
          text: shareText,
          url: window.location.href
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
      } else {
        throw new Error('Compartilhamento indisponível');
      }
      setModal({
        title: "Link pronto para compartilhar",
        message: "Copiamos seu resultado. Convide mais pessoas para responder.",
        variant: 'success'
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      console.error("Falha ao compartilhar resultado", error);
      setModal({
        title: "Não foi possível compartilhar",
        message: "Tente novamente ou copie o link manualmente.",
        variant: 'error'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-1000">
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} aria-hidden="true" />
          <div
            className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-feedback-titulo"
            aria-describedby="modal-feedback-mensagem"
          >
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${modal.variant === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {modal.variant === 'success' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414L8.5 12.086l6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 112 0 1 1 0 01-2 0zm0-7a1 1 0 112 0v4a1 1 0 11-2 0V6z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 id="modal-feedback-titulo" className="text-xl font-bold text-slate-900">{modal.title}</h3>
                <p id="modal-feedback-mensagem" className="text-slate-600 mt-1">{modal.message}</p>
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
                  type="button"
                >
                  Ver ranking
                </button>
              ) : (
                <button
                  onClick={closeModal}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl shadow-md transition-all"
                  type="button"
                >
                  Entendi
                </button>
              )}
              <button
                onClick={closeModal}
                className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl shadow-sm transition-all"
                type="button"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      {analysisTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeAnalysisModal} aria-hidden="true" />
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-100 p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-analise-titulo"
            aria-describedby="modal-analise-descricao"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-fuchsia-500 text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l1.9 4.2L18 8.1l-4.1 1.1L12 14l-1.9-4.8L6 8.1l4.1-1.9L12 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 id="modal-analise-titulo" className="text-xl font-bold text-slate-900">Gemini: comparação com {analysisTarget}</h3>
                <p id="modal-analise-descricao" className="text-slate-600 mt-1">
                  {analysisLoading ? "Analisando..." : "Explicação gerada com base no seu resultado."}
                </p>
              </div>
            </div>
            <div className="mt-6">
              {analysisLoading ? (
                <div className="flex items-center gap-3 text-indigo-600">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-semibold">Gerando comparação...</span>
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {analysisText}
                </p>
              )}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeAnalysisModal}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl shadow-md transition-all"
                type="button"
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
        <div className="flex flex-wrap justify-center items-center gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
            Confiança da IA: {result.confianca_classificacao}%
          </span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
            {consistencyLabel}
          </span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
            {rarityLabel}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Chart Card */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Gráfico de Posicionamento
          </h3>
          <RadarVisualization
            scores={result.scores}
            comparisonScores={autoScores}
            comparisonLabel="Autoavaliação"
            ariaLabel="Radar do seu perfil político por eixo"
          />
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-4">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600" aria-hidden="true"></span>
              IA
            </span>
            {autoScores && (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true"></span>
                Autoavaliação
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 text-center mt-3 italic">
            0: Esquerda/Autoritário/Conservador/Nacionalista <br/>
            10: Direita/Libertário/Progressista/Globalista
          </p>
        </div>

        {/* Scores Card */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Pontuações por Eixo
          </h3>
          
          <div className="space-y-6">
            {(Object.entries(result.scores) as [keyof Scores, number][]).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">{axisLabels[key]}</span>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-indigo-700">IA {val.toFixed(1)}/10</span>
                    {autoScores && (
                      <span className="text-amber-700">Auto {autoScores[key].toFixed(1)}/10</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-1000"
                      style={{ width: `${val * 10}%` }}
                    />
                  </div>
                  {autoScores && (
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-1000"
                        style={{ width: `${autoScores[key] * 10}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 mb-12">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Autoavaliação vs IA</h3>
        <p className="text-slate-600">{comparisonNote}</p>
        {autoScores && (
          <p className="text-xs text-slate-400 mt-3">
            A autoavaliação é uma referência declarada. A IA considera todas as respostas para estimar os eixos.
          </p>
        )}
      </div>

      <section id="prioridades" className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Radar de prioridades</p>
            <h3 className="text-2xl font-bold text-slate-800">Defina o que pesa mais para voce</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Fase 2</span>
        </div>
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
          <div className="space-y-5">
            <p className="text-sm text-slate-600">
              Ajuste sua importancia por eixo. Isso alimenta o comparador de temas e o radar de prioridades.
            </p>
            {([
              { key: 'economico', label: 'Economia', desc: 'Estado x mercado' },
              { key: 'social', label: 'Sociedade', desc: 'Liberdades e ordem' },
              { key: 'cultural', label: 'Cultura', desc: 'Tradicao e inovacao' },
              { key: 'nacional', label: 'Nacao', desc: 'Soberania e cooperacao' },
            ] as Array<{ key: keyof Scores; label: string; desc: string }>).map((item) => (
              <div key={item.key} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                  <span>{item.label}</span>
                  <span className="text-indigo-600">{priorityScores[item.key].toFixed(0)}/10</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={priorityScores[item.key]}
                  onChange={(event) => handlePriorityChange(item.key, Number(event.target.value))}
                  className="w-full mt-3 accent-indigo-600"
                  aria-label={`Prioridade em ${item.label}`}
                />
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSavePriorities}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl shadow-sm transition-all"
                type="button"
              >
                Salvar prioridades
              </button>
              <span className="text-xs text-slate-400">
                {prioritiesSaved ? 'Prioridades atualizadas.' : 'Salve para usar no comparador.'}
              </span>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Comparacao</p>
                <h4 className="text-lg font-bold text-slate-800">Perfil x prioridades</h4>
              </div>
              <span className="text-xs text-slate-400">Radar</span>
            </div>
            <RadarVisualization
              scores={result.scores}
              comparisonScores={priorityScores}
              comparisonLabel="Prioridades"
              ariaLabel="Radar com perfil politico e prioridades pessoais"
            />
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-3">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-600" aria-hidden="true"></span>
                Perfil
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true"></span>
                Prioridades
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="comparador" className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Comparador de temas</p>
            <h3 className="text-2xl font-bold text-slate-800">Prioridades vs perfil nos temas da campanha</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Saude, economia, educacao, seguranca</span>
        </div>
        <div className="h-72" role="img" aria-label="Gráfico de barras com comparador de temas">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={themeComparatorData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="tema" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} />
              <Bar dataKey="perfil" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="prioridade" fill="#fbbf24" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 mt-4">
          {prioritiesSaved
            ? 'Comparacao atualizada com suas prioridades salvas.'
            : 'Defina suas prioridades para um comparador mais fiel ao que voce valoriza.'}
        </p>
      </section>

      <section id="debate" className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Modo debate saudavel</p>
            <h3 className="text-2xl font-bold text-slate-800">Transforme divergencias em conversa</h3>
          </div>
          <button
            onClick={handleToggleDebate}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            type="button"
          >
            {debateOpen ? 'Fechar modo debate' : 'Abrir modo debate'}
          </button>
        </div>
        {debateOpen && (
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            {debateHighlights.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" aria-hidden="true"></span>
                <span>{item}</span>
              </div>
            ))}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-indigo-700 text-sm">
              Use perguntas abertas e escuta ativa. Foque no que cada tema significa para a vida cotidiana.
            </div>
          </div>
        )}
      </section>

      <section id="timeline" className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Timeline de mudanca</p>
            <h3 className="text-2xl font-bold text-slate-800">Evolucao do perfil ao refazer o teste</h3>
          </div>
          <button
            onClick={handleToggleTimeline}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            type="button"
          >
            {timelineOpen ? 'Ocultar timeline' : 'Ver timeline'}
          </button>
        </div>
        {timelineOpen && (
          <div className="mt-6">
            {hasTimeline ? (
              <div className="h-64" role="img" aria-label="Gráfico de linha com evolução do eixo economico">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-500">
                Refaça o teste para visualizar sua evolucao ao longo do tempo.
              </div>
            )}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={onRestart}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                type="button"
              >
                Refazer questionario
              </button>
              <span className="text-xs text-slate-400">Cada refacao adiciona um novo ponto na linha.</span>
            </div>
          </div>
        )}
      </section>

      <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-2xl mb-12">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
          type="button"
          aria-expanded={showFullAnalysis}
        >
          {showFullAnalysis ? "Ver menos" : "Ler análise completa"}
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Figuras Alinhadas</h3>
        <div className="flex flex-wrap gap-3">
          {result.figuras_similares.map((fig, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-xl font-medium border border-slate-200">
              <span>{fig}</span>
              <button
                onClick={() => handleFigureAnalysis(fig)}
                disabled={analysisLoading}
                className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-fuchsia-500 text-white flex items-center justify-center shadow-sm hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label={`Comparar com Gemini: ${fig}`}
                title="Comparar com Gemini"
                type="button"
              >
                {analysisLoading && analysisTarget === fig ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l1.9 4.2L18 8.1l-4.1 1.1L12 14l-1.9-4.8L6 8.1l4.1-1.9L12 2z" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12">
        <h3 className="text-xl font-bold text-slate-800 mb-3">Compartilhe sua bússola</h3>
        <p className="text-slate-600 mb-6">
          Convide amigos para comparar resultados e enriquecer o ranking global. Leva poucos minutos.
        </p>
        <button
          onClick={async () => {
            trackEvent('result_share_clicked', { source: 'share_section' });
            await handleShare();
          }}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl shadow-md transition-all"
          type="button"
        >
          Compartilhar resultado
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Card social</p>
            <h3 className="text-xl font-bold text-slate-800">Imagem pronta para postar</h3>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">1200 x 630</span>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <img src={cardDataUrl} alt="Preview do card social do seu perfil" className="w-full rounded-xl shadow-sm" />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadCard}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl shadow-md transition-all"
            type="button"
          >
            Baixar card em PNG
          </button>
          <button
            onClick={async () => {
              trackEvent('share_card_copy_link', { source: 'results' });
              if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(window.location.href);
                setModal({
                  title: "Link copiado",
                  message: "Envie o link junto com seu card para mais conversoes.",
                  variant: 'success'
                });
              }
            }}
            className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl shadow-sm transition-all"
            type="button"
          >
            Copiar link
          </button>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wide">Resumo compartilhável</p>
            <h3 className="text-2xl font-bold">Seu perfil em 3 insights</h3>
          </div>
          <span className="px-3 py-1 bg-white/10 text-indigo-100 rounded-full text-xs font-semibold">
            Pronto para copiar
          </span>
        </div>
        <div className="space-y-3 text-indigo-100">
          {axisInsights.map((item) => (
            <div key={item.key} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-indigo-300" aria-hidden="true"></span>
              <p>
                <span className="font-semibold">{item.label}:</span> {item.insight}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={async () => {
              trackEvent('summary_copy_clicked', { source: 'results' });
              if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareSummary);
                setModal({
                  title: "Resumo copiado",
                  message: "Cole onde quiser e convide mais pessoas para responder.",
                  variant: 'success'
                });
              } else {
                setModal({
                  title: "Não foi possível copiar",
                  message: "Seu navegador não permite copiar automaticamente.",
                  variant: 'error'
                });
              }
            }}
            className="flex-1 bg-white text-slate-900 font-bold py-3 rounded-2xl shadow-md transition-all hover:bg-slate-100"
            type="button"
          >
            Copiar resumo
          </button>
          <button
            onClick={handleShare}
            className="flex-1 border border-white/40 text-white font-bold py-3 rounded-2xl hover:bg-white/10 transition-all"
            type="button"
          >
            Compartilhar agora
          </button>
        </div>
      </div>

      <section id="mapa-optin" className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Mapa do Brasil (opt-in)</p>
            <h3 className="text-2xl font-bold text-slate-800">Compartilhe sua UF de forma anonima</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Opcional</span>
        </div>
        <div className="space-y-4">
          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={ufOptIn}
              onChange={(event) => setUfOptIn(event.target.checked)}
              className="mt-1 accent-indigo-600"
            />
            <span>
              Quero contribuir com o mapa agregado por UF. Nenhum dado pessoal e coletado.
            </span>
          </label>
          <div className="grid md:grid-cols-[1fr_auto] gap-3">
            <select
              value={ufSelected}
              onChange={(event) => setUfSelected(event.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700"
              disabled={!ufOptIn}
              aria-label="Selecione sua UF"
            >
              <option value="">Selecione sua UF</option>
              {UF_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleConfirmUfOptIn}
              disabled={!ufOptIn || !ufSelected}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-5 py-3 rounded-xl transition-all"
              type="button"
            >
              Confirmar opt-in
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Ao salvar no ranking, sua UF aparecera somente em dados agregados.
          </p>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={saveToRanking}
          disabled={isSaving}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg transition-all"
          type="button"
          aria-busy={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar no Ranking Público"}
        </button>
        <button 
          onClick={onRestart}
          className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl shadow-sm transition-all"
          type="button"
        >
          Refazer Questionário
        </button>
      </div>
    </div>
  );
};

export default Results;

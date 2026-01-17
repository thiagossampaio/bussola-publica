
import React, { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getParticipationCount } from '../services/participationService';
import RadarVisualization from './RadarChart';

interface LandingPageProps {
  onStart: () => void;
  onViewRanking: () => void;
  hasSavedProgress?: boolean;
  onResume?: () => void;
  resumeLabel?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onViewRanking,
  hasSavedProgress = false,
  onResume,
  resumeLabel
}) => {
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

  const sampleScores = {
    economico: 6.8,
    social: 3.2,
    cultural: 7.1,
    nacional: 4.6,
  };

  const sampleSelfScores = {
    economico: 6,
    social: 5,
    cultural: 5,
    nacional: 5,
  };

  const sampleDistribution = [
    { label: 'Discordo', value: 22 },
    { label: 'Neutro', value: 31 },
    { label: 'Concordo', value: 47 },
  ];

  const showResume = hasSavedProgress && onResume;

  return (
    <div className="flex flex-col gap-24 pb-24">
      <section id="inicio" className="relative overflow-hidden" aria-labelledby="inicio-titulo">
        <div className="absolute -top-24 right-0 h-72 w-72 bg-indigo-200/60 blur-[120px] rounded-full animate-pulse-soft"></div>
        <div className="absolute -bottom-24 left-0 h-72 w-72 bg-sky-200/60 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '400ms' }}></div>

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 grid gap-12 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="text-left">
            <div
              className="inline-flex items-center gap-2 bg-white/80 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm animate-fade-in"
              style={{ animationDelay: '80ms' }}
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
              IA aplicada à ciência política
            </div>

            <h1 id="inicio-titulo" className="text-4xl md:text-6xl font-bold text-slate-900 mt-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '140ms' }}>
              Bússola <span className="text-indigo-600">Política AI</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mt-6 leading-relaxed animate-fade-in-up" style={{ animationDelay: '220ms' }}>
              Descubra seu real posicionamento político através de um questionário multidimensional analisado por Inteligência Artificial avançada.
            </p>

            <div className="mt-10 flex flex-col gap-3 w-full max-w-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {showResume ? (
                  <>
                    <button
                      onClick={onResume}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-indigo-300 transform hover:-translate-y-1 active:translate-y-0 pressable focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                      type="button"
                    >
                      Continuar questionário
                    </button>
                    <button
                      onClick={onStart}
                      className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-8 rounded-xl border-2 border-slate-200 transition-all shadow-sm pressable focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                      type="button"
                    >
                      Recomeçar do zero
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={onStart}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-indigo-300 transform hover:-translate-y-1 active:translate-y-0 pressable focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                      type="button"
                    >
                      Iniciar Questionário
                    </button>
                    <button
                      onClick={onViewRanking}
                      className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-8 rounded-xl border-2 border-slate-200 transition-all shadow-sm pressable focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                      type="button"
                    >
                      Ver Ranking Global
                    </button>
                  </>
                )}
              </div>
              {showResume ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">{resumeLabel ?? 'Você tem um questionário em andamento.'}</span>
                  <button
                    onClick={onViewRanking}
                    className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                    type="button"
                  >
                    Ver Ranking Global →
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-slate-500 animate-fade-in-up" style={{ animationDelay: '380ms' }}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://picsum.photos/32/32?random=${i}`}
                    className="w-8 h-8 rounded-full border-2 border-white transition-transform hover:-translate-y-0.5"
                    alt={`Participante ${i}`}
                    loading="lazy"
                    decoding="async"
                    width={32}
                    height={32}
                  />
                ))}
              </div>
              <div className="text-sm font-semibold text-slate-600" aria-live="polite">{countLabel}</div>
              <div className="text-sm text-slate-400">Tempo médio: 4 minutos</div>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-500">
              {[
                { label: 'Sem cadastro', value: 'Acesso imediato' },
                { label: '100% gratuito', value: 'Sem paywall' },
                { label: 'Anônimo', value: 'Dados agregados' },
                { label: 'Resultado claro', value: 'Comparação IA' }
              ].map((item) => (
                <div key={item.label} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm">
                  <p className="text-slate-700 font-semibold">{item.label}</p>
                  <p className="text-slate-400 mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-3xl shadow-xl p-6 hover-lift animate-fade-in-up" style={{ animationDelay: '240ms' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold text-indigo-600">Prévia do resultado</p>
                  <h3 className="text-lg font-bold text-slate-900">Perfil multidimensional</h3>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Exemplo
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Autoavaliação', value: 'Centro-direita', color: 'bg-amber-500' },
                  { label: 'IA', value: 'Liberal moderado', color: 'bg-indigo-500' },
                  { label: 'Convergência', value: 'Parcial', color: 'bg-emerald-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                    <span className={`h-2 w-2 rounded-full ${item.color}`}></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Dimensões', value: '4 eixos' },
                { label: 'Perguntas', value: '48 itens' },
                { label: 'Precisão', value: 'IA + modelos' },
                { label: 'Anonimato', value: '100%' },
              ].map((item) => (
                <div key={item.label} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover-lift animate-fade-in-up">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{item.label}</p>
                  <p className="text-lg font-bold text-slate-800 mt-2">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="max-w-6xl mx-auto px-6" aria-labelledby="como-funciona-titulo">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Como funciona</p>
          <h2 id="como-funciona-titulo" className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Uma jornada clara em três etapas</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Você responde perguntas situacionais, a IA identifica padrões e sua bússola política é apresentada com explicações claras.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Autoavaliação rápida',
              description: 'Você declara sua posição política inicial para compararmos com a análise final.',
            },
            {
              title: 'Questionário multidimensional',
              description: 'Avalia economia, sociedade, cultura e visão nacional com perguntas equilibradas.',
            },
            {
              title: 'Resultado comparativo',
              description: 'Veja a diferença entre sua percepção e a classificação gerada pela IA.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 hover-lift">
              <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="metodologia" className="max-w-6xl mx-auto px-6" aria-labelledby="metodologia-titulo">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <div className="space-y-5">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Metodologia</p>
            <h2 id="metodologia-titulo" className="text-3xl md:text-4xl font-bold text-slate-900">Base científica com leitura moderna</h2>
            <p className="text-slate-600 leading-relaxed">
              A Bússola Política AI combina conceitos de Political Compass e 8values com ajuste de pesos por IA.
              Cada pergunta mede intensidade e direção, evitando respostas simplistas.
            </p>
            <div className="space-y-4">
              {[
                'Eixos quantitativos: economia, sociedade, cultura e identidade nacional.',
                'Calibração com base em pesquisas públicas e literatura de ciência política.',
                'IA explica o resultado em linguagem acessível, com nuances e ressalvas.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-indigo-600" aria-hidden="true"></div>
                  <p className="text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-600">Metodologia aplicada</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Mapa de dimensões</h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-500">Resumo</div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Economia', detail: 'Estado x Mercado' },
                { label: 'Sociedade', detail: 'Liberdades civis' },
                { label: 'Cultura', detail: 'Tradição x Inovação' },
                { label: 'Nação', detail: 'Globalismo x Nacionalismo' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="text-slate-400">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="motivacoes" className="max-w-6xl mx-auto px-6" aria-labelledby="motivacoes-titulo">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Por que fazer</p>
          <h2 id="motivacoes-titulo" className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Entenda suas escolhas com clareza</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Auto-conhecimento',
              description: 'Descubra padrões que influenciam suas opiniões e decisões políticas.',
            },
            {
              title: 'Comparação saudável',
              description: 'Compare seu perfil com tendências globais sem rótulos simplistas.',
            },
            {
              title: 'Debate mais qualificado',
              description: 'Use linguagem precisa para discutir ideias com mais empatia.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 rounded-3xl p-6 hover-lift transition-all hover:-translate-y-1">
              <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="graficos" className="max-w-6xl mx-auto px-6" aria-labelledby="graficos-titulo">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Exemplo de respostas</p>
          <h2 id="graficos-titulo" className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Visualize padrões reais</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Veja como uma resposta randômica pode ser interpretada e como o perfil geral se distribui nos eixos principais.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-lg p-6 hover-lift">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-semibold text-indigo-600">Perfil amostral</p>
                <h3 className="text-xl font-bold text-slate-900">Radar multidimensional</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">Dados simulados</span>
            </div>
            <RadarVisualization
              scores={sampleScores}
              comparisonScores={sampleSelfScores}
              comparisonLabel="Autoavaliação"
              ariaLabel="Radar com perfil amostral por eixo político"
            />
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-3">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-600" aria-hidden="true"></span>
                IA
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true"></span>
                Autoavaliação
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-lg p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-indigo-600">Resposta randômica</p>
                <h3 className="text-xl font-bold text-slate-900">Papel do Estado na economia</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">Distribuição</span>
            </div>
            <div className="h-64" role="img" aria-label="Gráfico de barras com distribuição de respostas">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              A distribuição acima é um exemplo ilustrativo baseado em respostas agregadas.
            </p>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto px-6" aria-labelledby="faq-titulo">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Dúvidas frequentes</p>
          <h2 id="faq-titulo" className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Respostas rápidas antes de começar</h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Removemos as principais barreiras para você iniciar o questionário agora mesmo.
          </p>
        </div>
        <div className="grid gap-4">
          {[
            {
              title: 'Preciso criar conta?',
              description: 'Não. O teste é instantâneo e não solicita dados pessoais.'
            },
            {
              title: 'Quanto tempo leva?',
              description: 'Em média 4 minutos. Mostramos o progresso e você pode retomar depois.'
            },
            {
              title: 'Meus dados são públicos?',
              description: 'Somente o resultado agregado aparece no ranking, sem identificação.'
            },
            {
              title: 'Posso comparar com minha autoavaliação?',
              description: 'Sim. O resultado final mostra a diferença entre sua percepção e a análise da IA.'
            }
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6" aria-labelledby="cta-titulo">
        <div className="bg-slate-900 text-white rounded-3xl px-8 py-12 flex flex-col lg:flex-row items-center justify-between gap-8 animate-fade-in-up">
          <div>
            <p className="text-sm font-semibold text-indigo-200 uppercase tracking-wide">Pronto para começar?</p>
            <h2 id="cta-titulo" className="text-3xl font-bold mt-2">Descubra sua bússola política agora</h2>
            <p className="text-slate-300 mt-3 max-w-xl">
              Faça o teste, entenda suas prioridades e compare seu perfil com milhares de participantes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={onStart}
              className="bg-white text-slate-900 font-bold py-3 px-6 rounded-xl shadow-md hover:bg-slate-100 transition pressable focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              type="button"
            >
              Iniciar Questionário
            </button>
            <button
              onClick={onViewRanking}
              className="border border-white/40 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/10 transition pressable focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              type="button"
            >
              Ver Ranking Global
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

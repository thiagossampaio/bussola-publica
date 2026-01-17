
import React, { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getParticipationCount } from '../services/participationService';
import RadarVisualization from './RadarChart';
import { trackEvent } from '../utils/analytics';
import { getCopyVariant } from '../utils/experiments';

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
  const copyVariant = useMemo(() => getCopyVariant(), []);

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

  const sampleProfileScores = {
    economico: 6.8,
    social: 3.2,
    cultural: 7.1,
    nacional: 4.6,
  };

  const samplePriorityScores = {
    economico: 7.2,
    social: 4.1,
    cultural: 6.4,
    nacional: 3.7,
  };

  const themeComparatorData = [
    { tema: 'Saúde', perfil: 62, prioridade: 78 },
    { tema: 'Economia', perfil: 71, prioridade: 64 },
    { tema: 'Educação', perfil: 58, prioridade: 82 },
    { tema: 'Segurança', perfil: 66, prioridade: 70 },
  ];

  const timelineData = [
    { mes: 'Ago', atual: 5.2, anterior: 4.6 },
    { mes: 'Set', atual: 5.5, anterior: 4.9 },
    { mes: 'Out', atual: 5.8, anterior: 5.1 },
    { mes: 'Nov', atual: 6.1, anterior: 5.4 },
    { mes: 'Dez', atual: 6.4, anterior: 5.6 },
  ];

  const ufHeatmap = [
    { uf: 'AC', color: 'bg-indigo-100' },
    { uf: 'AM', color: 'bg-indigo-200' },
    { uf: 'PA', color: 'bg-indigo-300' },
    { uf: 'CE', color: 'bg-indigo-200' },
    { uf: 'PE', color: 'bg-indigo-300' },
    { uf: 'BA', color: 'bg-indigo-400' },
    { uf: 'DF', color: 'bg-indigo-300' },
    { uf: 'GO', color: 'bg-indigo-200' },
    { uf: 'MG', color: 'bg-indigo-500' },
    { uf: 'RJ', color: 'bg-indigo-500' },
    { uf: 'SP', color: 'bg-indigo-600' },
    { uf: 'RS', color: 'bg-indigo-400' },
  ];

  const showResume = hasSavedProgress && onResume;

  const heroCopy = useMemo(() => {
    if (copyVariant === 'B') {
      return {
        headline: 'Compare suas prioridades com o Brasil em campanha',
        subline: 'Descubra seu perfil politico, contraste com temas eleitorais e veja como suas prioridades se alinham ao debate nacional.',
        cta: 'Quero meu comparador'
      };
    }
    return {
      headline: 'Sua bussola politica com comparador de temas',
      subline: 'Prioridades pessoais, radar inteligente e mapa opt-in para entender seu lugar no debate nacional.',
      cta: 'Iniciar comparador'
    };
  }, [copyVariant]);

  useEffect(() => {
    trackEvent('landing_viewed', { resume: showResume }, copyVariant);
  }, [copyVariant, showResume]);

  const handleStart = () => {
    trackEvent('landing_start_clicked', { resume: false }, copyVariant);
    onStart();
  };

  const handleResume = () => {
    trackEvent('landing_resume_clicked', { resume: true }, copyVariant);
    onResume?.();
  };

  const handleViewRanking = () => {
    trackEvent('landing_ranking_clicked', undefined, copyVariant);
    onViewRanking();
  };

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
              Fase 2 ativa: temporada de campanha
            </div>

            <h1 id="inicio-titulo" className="text-4xl md:text-6xl font-bold text-slate-900 mt-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '140ms' }}>
              {heroCopy.headline}
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mt-6 leading-relaxed animate-fade-in-up" style={{ animationDelay: '220ms' }}>
              {heroCopy.subline}
            </p>

            <div className="mt-10 flex flex-col gap-3 w-full max-w-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {showResume ? (
                  <>
                    <button
                      onClick={handleResume}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-indigo-300 transform hover:-translate-y-1 active:translate-y-0 pressable focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                      type="button"
                    >
                      Continuar questionário
                    </button>
                    <button
                      onClick={handleStart}
                      className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-8 rounded-xl border-2 border-slate-200 transition-all shadow-sm pressable focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                      type="button"
                    >
                      Recomeçar do zero
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleStart}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-indigo-300 transform hover:-translate-y-1 active:translate-y-0 pressable focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                      type="button"
                    >
                      {heroCopy.cta}
                    </button>
                    <button
                      onClick={handleViewRanking}
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
                    onClick={handleViewRanking}
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
                { label: 'Mapa opt-in', value: 'Você escolhe' },
                { label: 'Modo debate', value: 'Neutro e claro' },
                { label: 'Timeline', value: 'Evolução do perfil' }
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
          <h2 id="como-funciona-titulo" className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Uma jornada clara com novos fluxos</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Você responde perguntas situacionais, a IA identifica padrões e a fase 2 adiciona comparadores e contexto para o debate.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
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
              title: 'Comparador de temas',
              description: 'Contraste suas prioridades com saúde, economia, educação e segurança.',
            },
            {
              title: 'Modo debate + timeline',
              description: 'Explicações neutras e evolução do perfil para quem refaz o teste.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 hover-lift">
              <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="eixos" className="max-w-6xl mx-auto px-6" aria-labelledby="eixos-titulo">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Entenda os eixos</p>
          <h2 id="eixos-titulo" className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">O que cada dimensão revela</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Micro-conteúdos neutros para ajudar você a interpretar seu resultado com clareza e responsabilidade.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Economia', desc: 'Estado x Mercado: impostos, regulação e bem-estar social.' },
            { title: 'Sociedade', desc: 'Liberdades civis, diversidade e valores sociais.' },
            { title: 'Cultura', desc: 'Tradição x inovação: normas, mudanças e identidade.' },
            { title: 'Nação', desc: 'Soberania x cooperação: visão nacional e global.' },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 hover-lift">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="novidades" className="max-w-6xl mx-auto px-6" aria-labelledby="novidades-titulo">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Fase 2 em destaque</p>
          <h2 id="novidades-titulo" className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Novos fluxos para uma campanha mais consciente</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Compare prioridades, visualize tendências regionais e transforme diferenças em conversa saudável.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Comparador de temas', desc: 'Veja como suas prioridades se alinham às agendas em pauta.' },
            { title: 'Radar de prioridades', desc: 'Contraste o que você valoriza com seu perfil político real.' },
            { title: 'Mapa do Brasil (opt-in)', desc: 'Distribuição agregada por UF com controle total do usuário.' },
            { title: 'Modo debate saudável', desc: 'Explicações neutras para divergências sem polarizar.' },
            { title: 'Timeline de mudança', desc: 'Acompanhe a evolução do seu perfil ao refazer o teste.' },
          ].map((item) => (
            <div key={item.title} className="bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 rounded-3xl p-6 hover-lift transition-all hover:-translate-y-1">
              <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
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
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Novos insights</p>
          <h2 id="graficos-titulo" className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Prioridades, temas e contexto regional</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Combine seu perfil com comparadores e visualize tendências agregadas de forma clara e neutra.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-lg p-6 hover-lift">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-semibold text-indigo-600">Radar de prioridades</p>
                <h3 className="text-xl font-bold text-slate-900">Perfil vs prioridades</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">Dados simulados</span>
            </div>
            <RadarVisualization
              scores={sampleProfileScores}
              comparisonScores={samplePriorityScores}
              comparisonLabel="Prioridades"
              ariaLabel="Radar com perfil e prioridades pessoais"
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

          <div className="bg-white border border-slate-100 rounded-3xl shadow-lg p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-indigo-600">Comparador de temas</p>
                <h3 className="text-xl font-bold text-slate-900">Prioridades x perfil</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">Temas eleitorais</span>
            </div>
            <div className="h-64" role="img" aria-label="Gráfico de barras com comparador de temas">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={themeComparatorData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="tema" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} />
                  <Legend verticalAlign="top" height={24} wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
                  <Bar dataKey="perfil" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="prioridade" fill="#fbbf24" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Exemplo ilustrativo para comparar sua leitura pessoal com os temas do momento.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-lg p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-indigo-600">Mapa do Brasil</p>
                <h3 className="text-xl font-bold text-slate-900">Distribuição por UF</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">Opt-in</span>
            </div>
            <div className="grid grid-cols-4 gap-2" role="img" aria-label="Mapa ilustrativo por unidade federativa">
              {ufHeatmap.map((item) => (
                <div key={item.uf} className={`rounded-xl px-2 py-3 text-xs font-semibold text-slate-700 text-center ${item.color}`}>
                  {item.uf}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
              <span>Baixa</span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-8 rounded-full bg-indigo-200" aria-hidden="true"></span>
                <span className="h-2 w-8 rounded-full bg-indigo-400" aria-hidden="true"></span>
                <span className="h-2 w-8 rounded-full bg-indigo-600" aria-hidden="true"></span>
              </span>
              <span>Alta</span>
            </div>
          </div>
        </div>
      </section>

      <section id="timeline" className="max-w-6xl mx-auto px-6" aria-labelledby="timeline-titulo">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Timeline de mudança</p>
            <h2 id="timeline-titulo" className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Evolucao do perfil ao refazer o teste</h2>
            <p className="text-slate-600 mt-4">
              Quem volta ao questionario visualiza como suas prioridades evoluem ao longo da campanha, com comparacoes neutras.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              {[
                'Linha atual mostra seu perfil mais recente.',
                'Linha anterior destaca sua ultima resposta completa.',
                'Explicacoes ajudam a contextualizar cada variacao.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-600" aria-hidden="true"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl shadow-lg p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-indigo-600">Timeline</p>
                <h3 className="text-xl font-bold text-slate-900">Mudanca no eixo economico</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">Exemplo</span>
            </div>
            <div className="h-56" role="img" aria-label="Gráfico de linha mostrando evolução do perfil">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }} />
                  <Legend verticalAlign="top" height={24} wrapperStyle={{ fontSize: 12, color: '#64748b' }} />
                  <Line type="monotone" dataKey="atual" stroke="#6366f1" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="anterior" stroke="#fbbf24" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
            <h2 id="cta-titulo" className="text-3xl font-bold mt-2">Compare suas prioridades agora</h2>
            <p className="text-slate-300 mt-3 max-w-xl">
              Faça o teste, veja o comparador de temas e acompanhe sua evolucao durante a campanha.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={handleStart}
              className="bg-white text-slate-900 font-bold py-3 px-6 rounded-xl shadow-md hover:bg-slate-100 transition pressable focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              type="button"
            >
              {heroCopy.cta}
            </button>
            <button
              onClick={handleViewRanking}
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

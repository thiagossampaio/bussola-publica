import { PoliticalResult } from '../types';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const formatScore = (value: number) => value.toFixed(1);

export const buildShareCardSvg = (result: PoliticalResult, originLabel: string) => {
  const title = escapeXml(result.classificacao_principal);
  const scores = [
    { label: 'Economia', value: result.scores.economico },
    { label: 'Sociedade', value: result.scores.social },
    { label: 'Cultura', value: result.scores.cultural },
    { label: 'Nacao', value: result.scores.nacional }
  ];

  const bars = scores
    .map((item, index) => {
      const y = 300 + index * 60;
      const width = Math.round((item.value / 10) * 420);
      return `
        <text x="120" y="${y}" font-size="22" fill="#1e293b" font-family="Arial, sans-serif">${item.label}</text>
        <rect x="260" y="${y - 18}" width="420" height="20" rx="10" fill="#e2e8f0"></rect>
        <rect x="260" y="${y - 18}" width="${width}" height="20" rx="10" fill="#6366f1"></rect>
        <text x="700" y="${y}" font-size="20" fill="#475569" font-family="Arial, sans-serif">${formatScore(item.value)}</text>
      `;
    })
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#eef2ff" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)" />
      <rect x="80" y="70" width="1040" height="490" rx="36" fill="#ffffff" stroke="#e2e8f0" />
      <text x="120" y="140" font-size="20" fill="#6366f1" font-family="Arial, sans-serif">Bussola Politica AI</text>
      <text x="120" y="200" font-size="42" fill="#0f172a" font-weight="700" font-family="Arial, sans-serif">${title}</text>
      <text x="120" y="240" font-size="18" fill="#64748b" font-family="Arial, sans-serif">Perfil multidimensional com IA. Compartilhe e compare.</text>
      ${bars}
      <text x="120" y="560" font-size="16" fill="#94a3b8" font-family="Arial, sans-serif">Descubra o seu em ${escapeXml(originLabel)}</text>
      <text x="920" y="560" font-size="16" fill="#94a3b8" font-family="Arial, sans-serif">2026</text>
    </svg>
  `;
};

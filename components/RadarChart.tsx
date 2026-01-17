
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Scores } from '../types';

interface RadarVisualizationProps {
  scores: Scores;
}

const RadarVisualization: React.FC<RadarVisualizationProps> = ({ scores }) => {
  const data = [
    { subject: 'Econômico', A: scores.economico, fullMark: 10 },
    { subject: 'Social', A: scores.social, fullMark: 10 },
    { subject: 'Cultural', A: scores.cultural, fullMark: 10 },
    { subject: 'Nacional', A: scores.nacional, fullMark: 10 },
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} axisLine={false} tick={false} />
          <Radar
            name="Seu Perfil"
            dataKey="A"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarVisualization;

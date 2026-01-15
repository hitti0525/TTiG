'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TrafficSourceChartProps {
  trafficSources: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
  };
  dailyVisitors: number;
}

export default function TrafficSourceChart({ trafficSources, dailyVisitors }: TrafficSourceChartProps) {
  if (!trafficSources) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-[#111111]/40">
        데이터를 불러오는 중...
      </div>
    );
  }

  const chartData = [
    { name: '검색', value: Number(trafficSources?.organic) || 0, label: '검색 엔진' },
    { name: '직접', value: Number(trafficSources?.direct) || 0, label: '직접 접속' },
    { name: '외부', value: Number(trafficSources?.referral) || 0, label: '외부 링크' },
    { name: '소셜', value: Number(trafficSources?.social) || 0, label: '소셜 미디어' },
  ].filter(item => item.value >= 0 && !isNaN(item.value));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-[#111111]/40">
        데이터가 없습니다.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
      >
        <CartesianGrid 
          strokeDasharray="0" 
          stroke="#e5e5e5" 
          vertical={false}
          strokeWidth={0.5}
        />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 11, fill: '#666', fontFamily: 'sans-serif' }}
          stroke="#999"
          strokeWidth={0.5}
        />
        <YAxis 
          tick={{ fontSize: 11, fill: '#666', fontFamily: 'sans-serif' }}
          stroke="#999"
          strokeWidth={0.5}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#F5F5F3', 
            border: '1px solid #111111',
            borderRadius: '0',
            fontSize: '11px',
            fontFamily: 'sans-serif',
            padding: '8px 12px'
          }}
          formatter={(value: any) => {
            try {
              const val = Number(value) || 0;
              const percent = dailyVisitors > 0 ? Math.round((val / dailyVisitors) * 100) : 0;
              return `${val}명 (${percent}%)`;
            } catch {
              return '0명 (0%)';
            }
          }}
        />
        <Bar 
          dataKey="value" 
          fill="#111111"
          radius={[0, 0, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface VisitorTrendChartProps {
  data: Array<{
    day: string;
    visitors: number;
  }>;
}

export default function VisitorTrendChart({ data }: VisitorTrendChartProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-[#111111]/40">
        데이터가 없습니다.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={data} 
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
      >
        <CartesianGrid 
          strokeDasharray="0" 
          stroke="#e5e5e5" 
          vertical={false}
          strokeWidth={0.5}
        />
        <XAxis 
          dataKey="day" 
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
          cursor={{ stroke: '#111111', strokeWidth: 0.5, strokeDasharray: '2 2' }}
        />
        <Line 
          type="monotone" 
          dataKey="visitors" 
          stroke="#111111" 
          strokeWidth={2}
          dot={{ fill: '#111111', r: 3 }}
          activeDot={{ r: 5, stroke: '#111111', strokeWidth: 1 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

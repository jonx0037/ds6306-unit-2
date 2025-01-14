import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PlayerData {
  position: string;
}

interface Props {
  data: PlayerData[];
}

const PositionDistribution: React.FC<Props> = ({ data }) => {
  // Process data to count players by position
  const positionCounts = data.reduce((acc: { [key: string]: number }, player) => {
    const position = player.position || 'Unknown';
    acc[position] = (acc[position] || 0) + 1;
    return acc;
  }, {});

  // Convert to array format for Recharts
  const chartData = Object.entries(positionCounts)
    .map(([position, count]) => ({
      position,
      count
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  // Define position colors
  const positionColors = {
    'C': '#ff7f0e',
    'F': '#2ca02c',
    'G': '#1f77b4',
    'F-C': '#9467bd',
    'C-F': '#8c564b',
    'G-F': '#e377c2',
    'F-G': '#7f7f7f',
    'Unknown': '#bcbd22'
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-dark-text">
        Distribution of NBA Players by Position
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
            <XAxis
              type="number"
              label={{ value: 'Number of Players', position: 'bottom', fill: '#e0e0e0' }}
              tick={{ fill: '#e0e0e0' }}
            />
            <YAxis
              dataKey="position"
              type="category"
              tick={{ fill: '#e0e0e0' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#262626',
                border: '1px solid #333333',
                color: '#e0e0e0'
              }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Legend wrapperStyle={{ color: '#e0e0e0' }} />
            <Bar
              dataKey="count"
              name="Number of Players"
              fill="#1f77b4"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-center text-dark-text opacity-80">
        <p>Total Players: {Object.values(positionCounts).reduce((a, b) => a + b, 0)}</p>
        <p>Guards (G) and Forwards (F) are the most common positions.</p>
        <p>Hybrid positions like F-C and G-F show the versatility in modern basketball.</p>
      </div>
    </div>
  );
};

export default PositionDistribution;
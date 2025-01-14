import React from 'react';
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';

interface PlayerData {
  position: string;
  height: string;
}

interface Props {
  data: PlayerData[];
}

const HeightDistribution: React.FC<Props> = ({ data }) => {
  // Convert height to inches
  const processedData = data.map(player => {
    const [feet, inches] = player.height.split('-').map(Number);
    return {
      position: player.position || 'Unknown',
      heightInches: feet * 12 + inches
    };
  }).filter(player => !isNaN(player.heightInches));

  // Calculate statistics for each position
  const positionStats = processedData.reduce((acc: { [key: string]: number[] }, player) => {
    if (!acc[player.position]) {
      acc[player.position] = [];
    }
    acc[player.position].push(player.heightInches);
    return acc;
  }, {});

  // Calculate distribution data for visualization
  const distributionData = Object.entries(positionStats).map(([position, heights]) => {
    const sortedHeights = heights.sort((a, b) => a - b);
    const q1 = sortedHeights[Math.floor(heights.length * 0.25)];
    const median = sortedHeights[Math.floor(heights.length * 0.5)];
    const q3 = sortedHeights[Math.floor(heights.length * 0.75)];
    const min = sortedHeights[0];
    const max = sortedHeights[heights.length - 1];
    
    // Calculate average for the position
    const avg = heights.reduce((sum, h) => sum + h, 0) / heights.length;
    
    return {
      position,
      min,
      q1,
      median,
      q3,
      max,
      avg,
      count: heights.length
    };
  }).sort((a, b) => b.median - a.median); // Sort by median height

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
        Height Distribution Across All Positions
      </h2>
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={distributionData}
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
            <XAxis
              dataKey="position"
              label={{ value: 'Position', position: 'bottom', fill: '#e0e0e0' }}
              tick={{ fill: '#e0e0e0' }}
            />
            <YAxis
              label={{ value: 'Height (inches)', angle: -90, position: 'insideLeft', fill: '#e0e0e0' }}
              tick={{ fill: '#e0e0e0' }}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#262626',
                border: '1px solid #333333',
                color: '#e0e0e0'
              }}
              formatter={(value: number) => `${value.toFixed(1)} inches`}
            />
            <Legend wrapperStyle={{ color: '#e0e0e0' }} />
            {distributionData.map((item) => (
              <Area
                key={`area-${item.position}`}
                type="monotone"
                dataKey="avg"
                data={[item]}
                fill={positionColors[item.position as keyof typeof positionColors]}
                stroke="none"
                opacity={0.3}
              />
            ))}
            {/* Box plot representation */}
            {distributionData.map((item) => (
              <Bar
                key={`boxplot-${item.position}`}
                dataKey="median"
                data={[item]}
                fill={positionColors[item.position as keyof typeof positionColors]}
                opacity={0.7}
                barSize={20}
              >
                {/* Whiskers and box edges */}
                <rect
                  x={0}
                  y={item.q1}
                  width={20}
                  height={item.q3 - item.q1}
                  fill={positionColors[item.position as keyof typeof positionColors]}
                  opacity={0.5}
                />
                <line
                  x1={10}
                  y1={item.min}
                  x2={10}
                  y2={item.max}
                  stroke="#e0e0e0"
                  strokeWidth={2}
                />
              </Bar>
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-center text-dark-text opacity-80">
        <p>The box plots show the distribution of heights for each position.</p>
        <p>The middle line represents the median height, while the box shows the interquartile range.</p>
        <p>Centers (C) are typically the tallest, while Guards (G) are generally shorter.</p>
      </div>
    </div>
  );
};

export default HeightDistribution;
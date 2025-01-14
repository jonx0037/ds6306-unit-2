import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PlayerData {
  position: string;
  height: string;
  weight: number;
  year_start: number;
}

interface Props {
  data: PlayerData[];
}

const ThreeDVisualization: React.FC<Props> = ({ data }) => {
  // Process data
  const processedData = data.map(player => {
    const [feet, inches] = player.height.split('-').map(Number);
    return {
      position: player.position || 'Unknown',
      heightInches: feet * 12 + inches,
      weight: parseFloat(player.weight.toString()),
      year: player.year_start
    };
  }).filter(player => 
    !isNaN(player.heightInches) && 
    !isNaN(player.weight) &&
    !isNaN(player.year)
  );

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

  // Calculate ranges for proper scaling
  const yearRange = [
    Math.min(...processedData.map(d => d.year)),
    Math.max(...processedData.map(d => d.year))
  ];
  const heightRange = [
    Math.min(...processedData.map(d => d.heightInches)),
    Math.max(...processedData.map(d => d.heightInches))
  ];
  const weightRange = [
    Math.min(...processedData.map(d => d.weight)),
    Math.max(...processedData.map(d => d.weight))
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-dark-text">
        3D View: Height, Weight, and Year by Position
      </h2>
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
            <XAxis
              type="number"
              dataKey="year"
              name="Year"
              domain={yearRange}
              label={{ value: 'Year', position: 'bottom', fill: '#e0e0e0' }}
              tick={{ fill: '#e0e0e0' }}
            />
            <YAxis
              type="number"
              dataKey="heightInches"
              name="Height"
              unit=" in"
              domain={heightRange}
              label={{ value: 'Height (inches)', angle: -90, position: 'insideLeft', fill: '#e0e0e0' }}
              tick={{ fill: '#e0e0e0' }}
            />
            <ZAxis
              type="number"
              dataKey="weight"
              name="Weight"
              unit=" lbs"
              domain={weightRange}
              range={[50, 400]}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#262626',
                border: '1px solid #333333',
                color: '#e0e0e0'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'Year') return value;
                if (name === 'Height') return `${value} inches`;
                if (name === 'Weight') return `${value} lbs`;
                return value;
              }}
            />
            <Legend wrapperStyle={{ color: '#e0e0e0' }} />
            {Object.entries(positionColors).map(([position, color]) => (
              <Scatter
                key={position}
                name={position}
                data={processedData.filter(d => d.position === position)}
                fill={color}
                opacity={0.6}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-center text-dark-text opacity-80">
        <p>Each point represents a player, with position indicated by color.</p>
        <p>The X-axis shows the year, Y-axis shows height, and point size represents weight.</p>
        <p>This visualization reveals how player physical attributes have evolved over time.</p>
        <p>Hover over points to see detailed information for each player.</p>
      </div>
    </div>
  );
};

export default ThreeDVisualization;
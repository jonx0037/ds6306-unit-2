import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PlayerData {
  position: string;
  height: string;
  weight: number;
}

interface Props {
  data: PlayerData[];
}

const HeightWeightRelationship: React.FC<Props> = ({ data }) => {
  // Convert height to inches and prepare data
  const processedData = data.map(row => {
    const [feet, inches] = row.height.split('-').map(Number);
    return {
      position: row.position || 'Unknown',
      heightInches: feet * 12 + inches,
      weight: parseFloat(row.weight.toString())
    };
  }).filter(row => !isNaN(row.heightInches) && !isNaN(row.weight));
  
  // Define colors for each position
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
        Height vs Weight Relationship by Position
      </h2>
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
            <XAxis 
              dataKey="heightInches" 
              type="number" 
              name="Height" 
              unit=" in"
              label={{ value: 'Height (inches)', position: 'bottom', fill: '#e0e0e0' }}
              tick={{ fill: '#e0e0e0' }}
            />
            <YAxis 
              dataKey="weight" 
              type="number" 
              name="Weight" 
              unit=" lbs"
              label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft', fill: '#e0e0e0' }}
              tick={{ fill: '#e0e0e0' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: '#262626',
                border: '1px solid #333333',
                color: '#e0e0e0'
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#e0e0e0' }}
            />
            {Object.keys(positionColors).map(position => (
              <Scatter
                key={position}
                name={position}
                data={processedData.filter(d => d.position === position)}
                fill={positionColors[position as keyof typeof positionColors]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-center text-dark-text opacity-80">
        <p>Each point represents a player, colored by their position.</p>
        <p>The pattern shows a clear positive relationship between height and weight across all positions.</p>
        <p>Centers (C) tend to be taller and heavier, while Guards (G) are typically shorter and lighter.</p>
      </div>
    </div>
  );
};

export default HeightWeightRelationship;
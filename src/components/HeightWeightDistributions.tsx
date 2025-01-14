import React from 'react';
import { ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';

interface PlayerData {
  position: string;
  height: string;
  weight: number;
}

interface Props {
  data: PlayerData[];
}

const HeightWeightDistributions: React.FC<Props> = ({ data }) => {
  // Convert height to inches and prepare data
  const processedData = data.map(player => {
    const [feet, inches] = player.height.split('-').map(Number);
    return {
      position: player.position || 'Unknown',
      heightInches: feet * 12 + inches,
      weight: parseFloat(player.weight.toString())
    };
  }).filter(player => !isNaN(player.heightInches) && !isNaN(player.weight));

  // Filter for Centers and Forwards only
  const cfData = processedData.filter(player => 
    player.position === 'C' || player.position === 'F'
  );

  // Calculate kernel density estimation (simplified)
  const calculateDensity = (values: number[], bandwidth: number) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const points = 50;
    const step = (max - min) / points;
    
    return Array.from({ length: points + 1 }, (_, i) => {
      const x = min + i * step;
      const density = values.reduce((sum, value) => {
        const distance = (x - value) / bandwidth;
        return sum + Math.exp(-0.5 * distance * distance) / (bandwidth * Math.sqrt(2 * Math.PI));
      }, 0) / values.length;
      
      return { x, density };
    });
  };

  // Calculate densities for height and weight
  const centerHeights = cfData.filter(p => p.position === 'C').map(p => p.heightInches);
  const forwardHeights = cfData.filter(p => p.position === 'F').map(p => p.heightInches);
  const centerWeights = cfData.filter(p => p.position === 'C').map(p => p.weight);
  const forwardWeights = cfData.filter(p => p.position === 'F').map(p => p.weight);

  const heightDensityC = calculateDensity(centerHeights, 2);
  const heightDensityF = calculateDensity(forwardHeights, 2);
  const weightDensityC = calculateDensity(centerWeights, 10);
  const weightDensityF = calculateDensity(forwardWeights, 10);

  // Define colors
  const colors = {
    'C': '#ff7f0e',
    'F': '#2ca02c'
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-dark-text">
        Height and Weight Distributions: Centers vs Forwards
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Height Distribution */}
        <div className="h-[400px]">
          <h3 className="text-lg font-semibold mb-2 text-center text-dark-text">Height Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis
                type="number"
                dataKey="x"
                name="Height"
                unit=" in"
                domain={['dataMin - 2', 'dataMax + 2']}
                label={{ value: 'Height (inches)', position: 'bottom', fill: '#e0e0e0' }}
                tick={{ fill: '#e0e0e0' }}
              />
              <YAxis
                type="number"
                dataKey="density"
                name="Density"
                label={{ value: 'Density', angle: -90, position: 'insideLeft', fill: '#e0e0e0' }}
                tick={{ fill: '#e0e0e0' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#262626',
                  border: '1px solid #333333',
                  color: '#e0e0e0'
                }}
              />
              <Legend wrapperStyle={{ color: '#e0e0e0' }} />
              <Area
                type="monotone"
                data={heightDensityC}
                dataKey="density"
                stroke={colors.C}
                fill={colors.C}
                name="Centers"
                opacity={0.5}
              />
              <Area
                type="monotone"
                data={heightDensityF}
                dataKey="density"
                stroke={colors.F}
                fill={colors.F}
                name="Forwards"
                opacity={0.5}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Weight Distribution */}
        <div className="h-[400px]">
          <h3 className="text-lg font-semibold mb-2 text-center text-dark-text">Weight Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis
                type="number"
                dataKey="x"
                name="Weight"
                unit=" lbs"
                domain={['dataMin - 10', 'dataMax + 10']}
                label={{ value: 'Weight (lbs)', position: 'bottom', fill: '#e0e0e0' }}
                tick={{ fill: '#e0e0e0' }}
              />
              <YAxis
                type="number"
                dataKey="density"
                name="Density"
                label={{ value: 'Density', angle: -90, position: 'insideLeft', fill: '#e0e0e0' }}
                tick={{ fill: '#e0e0e0' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#262626',
                  border: '1px solid #333333',
                  color: '#e0e0e0'
                }}
              />
              <Legend wrapperStyle={{ color: '#e0e0e0' }} />
              <Area
                type="monotone"
                data={weightDensityC}
                dataKey="density"
                stroke={colors.C}
                fill={colors.C}
                name="Centers"
                opacity={0.5}
              />
              <Area
                type="monotone"
                data={weightDensityF}
                dataKey="density"
                stroke={colors.F}
                fill={colors.F}
                name="Forwards"
                opacity={0.5}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-4 text-sm text-center text-dark-text opacity-80">
        <p>The density plots show the distribution of heights and weights for Centers and Forwards.</p>
        <p>Centers tend to be taller and heavier than Forwards, with less overlap in height than in weight.</p>
      </div>
    </div>
  );
};

export default HeightWeightDistributions;
import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Papa from 'papaparse';

const HeightWeightRelationship = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fs.readFile('PlayersBBall.csv', { encoding: 'utf8' });
      const parsed = Papa.parse(response, {
        header: true,
        skipEmptyLines: true
      });
      
      // Convert height to inches and prepare data
      const processedData = parsed.data.map(row => {
        const [feet, inches] = row.height.split('-').map(Number);
        return {
          position: row.position || 'Unknown',
          heightInches: feet * 12 + inches,
          weight: parseFloat(row.weight)
        };
      }).filter(row => !isNaN(row.heightInches) && !isNaN(row.weight));
      
      setData(processedData);
    };
    
    fetchData();
  }, []);
  
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
      <h2 className="text-xl font-bold mb-4 text-center">Height vs Weight Relationship by Position</h2>
      <ScatterChart width={800} height={600} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
        <CartesianGrid />
        <XAxis 
          dataKey="heightInches" 
          type="number" 
          name="Height" 
          unit=" in"
          label={{ value: 'Height (inches)', position: 'bottom' }}
        />
        <YAxis 
          dataKey="weight" 
          type="number" 
          name="Weight" 
          unit=" lbs"
          label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        {Object.keys(positionColors).map(position => (
          <Scatter
            key={position}
            name={position}
            data={data.filter(d => d.position === position)}
            fill={positionColors[position]}
          />
        ))}
      </ScatterChart>
      <div className="mt-4 text-sm text-center">
        <p>Each point represents a player, colored by their position.</p>
        <p>The pattern shows a clear positive relationship between height and weight across all positions.</p>
        <p>Centers (C) tend to be taller and heavier, while Guards (G) are typically shorter and lighter.</p>
      </div>
    </div>
  );
};

export default HeightWeightRelationship;
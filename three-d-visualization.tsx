import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Papa from 'papaparse';

const ThreeDVisualization = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fs.readFile('PlayersBBall.csv', { encoding: 'utf8' });
      const parsed = Papa.parse(response, {
        header: true,
        skipEmptyLines: true
      });
      
      // Process and clean data
      const processedData = parsed.data.map(row => {
        const [feet, inches] = row.height.split('-').map(Number);
        return {
          position: row.position || 'Unknown',
          heightInches: feet * 12 + inches,
          weight: parseFloat(row.weight),
          year: parseInt(row.year_start)
        };
      }).filter(row => 
        !isNaN(row.heightInches) && 
        !isNaN(row.weight) && 
        !isNaN(row.year)
      );
      
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
      <h2 className="text-xl font-bold mb-4 text-center">3D View: Height, Weight, and Year by Position</h2>
      <div className="flex justify-center">
        <ScatterChart
          width={800}
          height={600}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid />
          <XAxis 
            type="number" 
            dataKey="year"
            name="Year" 
            label={{ value: 'Year', position: 'bottom' }}
          />
          <YAxis 
            type="number" 
            dataKey="heightInches"
            name="Height"
            label={{ value: 'Height (inches)', angle: -90, position: 'insideLeft' }}
          />
          <ZAxis 
            type="number" 
            dataKey="weight" 
            range={[50, 800]} 
            name="Weight"
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ payload }) => {
              if (!payload || !payload[0]) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-white p-2 border border-gray-200 shadow-lg">
                  <p>Year: {data.year}</p>
                  <p>Height: {Math.floor(data.heightInches/12)}&apos;{data.heightInches % 12}&quot;</p>
                  <p>Weight: {data.weight} lbs</p>
                  <p>Position: {data.position}</p>
                </div>
              );
            }}
          />
          <Legend />
          {Object.entries(positionColors).map(([position, color]) => (
            <Scatter
              key={position}
              name={position}
              data={data.filter(d => d.position === position)}
              fill={color}
              shape="circle"
            />
          ))}
        </ScatterChart>
      </div>
      <div className="mt-4 text-sm text-center">
        <p>This 3D visualization shows the relationships between:</p>
        <ul className="list-disc list-inside">
          <li>Height (y-axis)</li>
          <li>Weight (z-axis, represented by point size)</li>
          <li>Year (x-axis)</li>
          <li>Position (color)</li>
        </ul>
        <p className="mt-2">The visualization reveals patterns in how player physical attributes have evolved over time across different positions.</p>
      </div>
    </div>
  );
};

export default ThreeDVisualization;
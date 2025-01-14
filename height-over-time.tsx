import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Papa from 'papaparse';

const HeightOverTime = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fs.readFile('PlayersBBall.csv', { encoding: 'utf8' });
      const parsed = Papa.parse(response, {
        header: true,
        skipEmptyLines: true
      });
      
      // Convert height to inches and group by year
      const heightsByYear = {};
      parsed.data.forEach(row => {
        const [feet, inches] = row.height.split('-').map(Number);
        const heightInches = feet * 12 + inches;
        const year = parseInt(row.year_start);
        
        if (!isNaN(year) && !isNaN(heightInches)) {
          if (!heightsByYear[year]) {
            heightsByYear[year] = [];
          }
          heightsByYear[year].push(heightInches);
        }
      });
      
      // Calculate average height for each year
      const yearlyAverages = Object.entries(heightsByYear)
        .map(([year, heights]) => ({
          year: parseInt(year),
          averageHeight: heights.reduce((sum, h) => sum + h, 0) / heights.length,
          minHeight: Math.min(...heights),
          maxHeight: Math.max(...heights)
        }))
        .sort((a, b) => a.year - b.year);
      
      setData(yearlyAverages);
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Evolution of NBA Player Heights (1950-Present)</h2>
      <LineChart width={800} height={400} data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="year" 
          label={{ value: 'Year', position: 'bottom' }}
        />
        <YAxis 
          domain={['auto', 'auto']}
          label={{ value: 'Height (inches)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="averageHeight" 
          stroke="#8884d8" 
          name="Average Height"
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="maxHeight" 
          stroke="#82ca9d" 
          name="Maximum Height"
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="minHeight" 
          stroke="#ff7f0e" 
          name="Minimum Height"
          dot={false}
        />
      </LineChart>
      <div className="mt-4 text-sm text-center">
        <p>The graph shows how NBA player heights have evolved from 1950 to present.</p>
        <p>The average height line shows the general trend, while max and min heights show the range of player sizes.</p>
        <p>Note: A gradual increase in average height is visible through the 1960s and 1970s, with relative stability in recent decades.</p>
      </div>
    </div>
  );
};

export default HeightOverTime;
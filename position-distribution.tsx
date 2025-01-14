import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Papa from 'papaparse';

const PositionDistribution = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fs.readFile('PlayersBBall.csv', { encoding: 'utf8' });
      const parsed = Papa.parse(response, {
        header: true,
        skipEmptyLines: true
      });
      
      // Count players by position
      const counts = {};
      parsed.data.forEach(row => {
        const pos = row.position || 'Unknown';
        counts[pos] = (counts[pos] || 0) + 1;
      });
      
      // Convert to array format for Recharts
      const chartData = Object.entries(counts).map(([position, count]) => ({
        position,
        count
      })).sort((a, b) => b.count - a.count); // Sort by count descending
      
      setData(chartData);
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Distribution of NBA Players by Position</h2>
      <BarChart width={800} height={400} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="position" />
        <YAxis label={{ value: 'Number of Players', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
      <div className="mt-4 text-center text-sm">
        <p>Position Legend:</p>
        <p>C: Center, F: Forward, G: Guard</p>
        <p>F-C/C-F: Forward-Center, G-F/F-G: Guard-Forward</p>
      </div>
    </div>
  );
};

export default PositionDistribution;
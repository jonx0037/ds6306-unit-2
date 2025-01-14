import React, { useState, useEffect } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Papa from 'papaparse';

const HeightWeightDistributions = () => {
  const [heightData, setHeightData] = useState([]);
  const [weightData, setWeightData] = useState([]);
  
  // Function to calculate quartiles and statistics
  const calculateStats = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const q1Idx = Math.floor(sorted.length * 0.25);
    const q2Idx = Math.floor(sorted.length * 0.5);
    const q3Idx = Math.floor(sorted.length * 0.75);
    
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const stdDev = Math.sqrt(
      arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length
    );
    
    return {
      min: sorted[0],
      q1: sorted[q1Idx],
      median: sorted[q2Idx],
      q3: sorted[q3Idx],
      max: sorted[sorted.length - 1],
      mean: mean,
      stdDev: stdDev,
      n: arr.length
    };
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fs.readFile('PlayersBBall.csv', { encoding: 'utf8' });
      const parsed = Papa.parse(response, {
        header: true,
        skipEmptyLines: true
      });
      
      // Process height and weight data
      const heightsByPosition = {};
      const weightsByPosition = {};
      
      parsed.data.forEach(row => {
        if (row.position === 'C' || row.position === 'F') {
          // Process height
          const [feet, inches] = row.height.split('-').map(Number);
          const heightInches = feet * 12 + inches;
          if (!heightsByPosition[row.position]) heightsByPosition[row.position] = [];
          heightsByPosition[row.position].push(heightInches);
          
          // Process weight
          const weight = parseFloat(row.weight);
          if (!weightsByPosition[row.position]) weightsByPosition[row.position] = [];
          weightsByPosition[row.position].push(weight);
        }
      });
      
      // Calculate statistics for both metrics
      const heightStats = Object.entries(heightsByPosition).map(([position, heights]) => ({
        position,
        ...calculateStats(heights.filter(h => !isNaN(h)))
      }));
      
      const weightStats = Object.entries(weightsByPosition).map(([position, weights]) => ({
        position,
        ...calculateStats(weights.filter(w => !isNaN(w)))
      }));
      
      setHeightData(heightStats);
      setWeightData(weightStats);
    };
    
    fetchData();
  }, []);
  
  const formatHeight = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };
  
  const CustomTooltip = ({ active, payload, label, metric }) => {
    if (active && payload && payload.length) {
      const stats = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-bold">{stats.position}</p>
          <p>Minimum: {metric === 'height' ? formatHeight(stats.min) : `${stats.min.toFixed(1)} lbs`}</p>
          <p>Q1: {metric === 'height' ? formatHeight(stats.q1) : `${stats.q1.toFixed(1)} lbs`}</p>
          <p>Median: {metric === 'height' ? formatHeight(stats.median) : `${stats.median.toFixed(1)} lbs`}</p>
          <p>Q3: {metric === 'height' ? formatHeight(stats.q3) : `${stats.q3.toFixed(1)} lbs`}</p>
          <p>Maximum: {metric === 'height' ? formatHeight(stats.max) : `${stats.max.toFixed(1)} lbs`}</p>
          <p>Mean: {metric === 'height' ? formatHeight(stats.mean) : `${stats.mean.toFixed(1)} lbs`}</p>
          <p>Std Dev: {stats.stdDev.toFixed(2)}</p>
          <p>Sample Size: {stats.n}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Height Distribution: Centers vs Forwards</h3>
          <ComposedChart width={800} height={400} data={heightData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="position" />
            <YAxis 
              label={{ value: 'Height (inches)', angle: -90, position: 'insideLeft' }}
              domain={['auto', 'auto']}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} metric="height" />} />
            <Bar dataKey="q3" fill="#8884d8" stackId="a" />
            <Bar dataKey="median" fill="#82ca9d" stackId="a" />
            <Bar dataKey="q1" fill="#ffc658" stackId="a" />
            <Line type="monotone" dataKey="mean" stroke="#ff7300" dot={true} />
          </ComposedChart>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Weight Distribution: Centers vs Forwards</h3>
          <ComposedChart width={800} height={400} data={weightData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="position" />
            <YAxis 
              label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft' }}
              domain={['auto', 'auto']}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} metric="weight" />} />
            <Bar dataKey="q3" fill="#8884d8" stackId="a" />
            <Bar dataKey="median" fill="#82ca9d" stackId="a" />
            <Bar dataKey="q1" fill="#ffc658" stackId="a" />
            <Line type="monotone" dataKey="mean" stroke="#ff7300" dot={true} />
          </ComposedChart>
        </div>
      </div>
      
      <div className="mt-6 text-sm">
        <h3 className="font-semibold mb-2">Key Findings:</h3>
        <ul className="space-y-2">
          <li>Centers tend to be notably taller than Forwards, with minimal overlap in their height distributions.</li>
          <li>The weight distributions show greater overlap between positions, though Centers generally weigh more.</li>
          <li>Both positions show relatively normal distributions for both height and weight.</li>
          <li>The spread (variability) in measurements is slightly larger for Centers than Forwards.</li>
        </ul>
      </div>
    </div>
  );
};

export default HeightWeightDistributions;
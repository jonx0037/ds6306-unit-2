import React, { useState, useEffect } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Papa from 'papaparse';
import _ from 'lodash';

const HeightDistributions = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState([]);
  
  const calculateStats = (heights) => {
    const sorted = [...heights].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const mean = _.mean(heights);
    const stdDev = Math.sqrt(_.meanBy(heights, x => Math.pow(x - mean, 2)));
    
    return {
      min: _.min(heights),
      q1,
      median,
      q3,
      max: _.max(heights),
      mean,
      stdDev,
      n: heights.length
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fs.readFile('PlayersBBall.csv', { encoding: 'utf8' });
      
      Papa.parse(response, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Group and process height data by position
          const heightsByPosition = {};
          
          results.data.forEach(row => {
            if (row.position && row.height) {
              const [feet, inches] = row.height.split('-').map(Number);
              const heightInches = feet * 12 + inches;
              
              if (!isNaN(heightInches)) {
                if (!heightsByPosition[row.position]) {
                  heightsByPosition[row.position] = [];
                }
                heightsByPosition[row.position].push(heightInches);
              }
            }
          });
          
          // Calculate statistics for each position
          const positionStats = Object.entries(heightsByPosition)
            .map(([position, heights]) => ({
              position,
              ...calculateStats(heights)
            }))
            .sort((a, b) => b.mean - a.mean);  // Sort by mean height
            
          setData(positionStats);
          
          // Calculate summary statistics for differences between positions
          const summaryStats = positionStats.map(pos => ({
            position: pos.position,
            meanHeight: `${Math.floor(pos.mean/12)}'${Math.round(pos.mean%12)}"`,
            count: pos.n,
            variability: pos.stdDev.toFixed(1)
          }));
          
          setSummary(summaryStats);
        }
      });
    };
    
    fetchData();
  }, []);
  
  const formatHeight = (inches) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const stats = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <h3 className="font-bold text-lg mb-2">{stats.position}</h3>
          <div className="space-y-1">
            <p>Minimum Height: {formatHeight(stats.min)}</p>
            <p>First Quartile: {formatHeight(stats.q1)}</p>
            <p>Median Height: {formatHeight(stats.median)}</p>
            <p>Third Quartile: {formatHeight(stats.q3)}</p>
            <p>Maximum Height: {formatHeight(stats.max)}</p>
            <p>Mean Height: {formatHeight(stats.mean)}</p>
            <p>Standard Deviation: {stats.stdDev.toFixed(1)} inches</p>
            <p>Sample Size: {stats.n} players</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-4">Height Distribution Across NBA Positions</h2>
        
        <div className="h-96 mb-8">
          <ComposedChart 
            width={800} 
            height={400} 
            data={data}
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="position" 
              label={{ value: 'Position', position: 'bottom' }}
            />
            <YAxis 
              label={{ 
                value: 'Height (inches)', 
                angle: -90, 
                position: 'insideLeft' 
              }}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="q3" fill="#8884d8" stackId="a" name="Q3" />
            <Bar dataKey="median" fill="#82ca9d" stackId="a" name="Median" />
            <Bar dataKey="q1" fill="#ffc658" stackId="a" name="Q1" />
            <Line 
              type="monotone" 
              dataKey="mean" 
              stroke="#ff7300" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Mean"
            />
          </ComposedChart>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {summary.map((pos) => (
            <div key={pos.position} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{pos.position}</h3>
              <p>Mean Height: {pos.meanHeight}</p>
              <p>Sample Size: {pos.count} players</p>
              <p>Height Variation: ±{pos.variability} inches</p>
            </div>
          ))}
        </div>

        <div className="text-sm space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Position Key:</h3>
            <ul className="grid grid-cols-2 gap-2">
              <li><span className="font-medium">C:</span> Center</li>
              <li><span className="font-medium">F:</span> Forward</li>
              <li><span className="font-medium">G:</span> Guard</li>
              <li><span className="font-medium">F-C:</span> Forward-Center</li>
              <li><span className="font-medium">G-F:</span> Guard-Forward</li>
              <li><span className="font-medium">F-G:</span> Forward-Guard</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Key Insights:</h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>Centers consistently show the highest average height among all positions.</li>
              <li>Guards demonstrate the lowest average height, with less variation than other positions.</li>
              <li>Hybrid positions (F-C, G-F) show height distributions that generally fall between their pure position counterparts.</li>
              <li>Forward positions show the most height variability, suggesting more flexibility in height requirements for this role.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeightDistributions;
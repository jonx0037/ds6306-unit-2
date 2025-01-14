import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Papa from 'papaparse';

const PositionDistribution = () => {
  const [data, setData] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fs.readFile('PlayersBBall.csv', { encoding: 'utf8' });
      
      Papa.parse(response, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Count players by position
          const positionCounts = {};
          results.data.forEach(row => {
            const pos = row.position || 'Unknown';
            positionCounts[pos] = (positionCounts[pos] || 0) + 1;
          });
          
          // Convert to array format for Recharts
          const chartData = Object.entries(positionCounts)
            .map(([position, count]) => ({
              position,
              count,
              percentage: 0 // Will be calculated below
            }))
            .sort((a, b) => b.count - a.count);
          
          // Calculate total and percentages
          const total = chartData.reduce((sum, item) => sum + item.count, 0);
          chartData.forEach(item => {
            item.percentage = ((item.count / total) * 100).toFixed(1);
          });
          
          setTotalPlayers(total);
          setData(chartData);
        }
      });
    };
    
    fetchData();
  }, []);
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">Count: {payload[0].value.toLocaleString()}</p>
          <p className="text-sm">Percentage: {payload[0].payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-2">Distribution of NBA Players by Position</h2>
        <p className="text-center text-gray-600 mb-4">Total Players: {totalPlayers.toLocaleString()}</p>
        
        <div className="h-96">
          <BarChart
            width={800}
            height={400}
            data={data}
            margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="position" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis 
              label={{ 
                value: 'Number of Players', 
                angle: -90, 
                position: 'insideLeft',
                offset: -10
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#3182ce"
              animationDuration={1500}
            />
          </BarChart>
        </div>
        
        <div className="mt-6 text-sm">
          <h3 className="font-semibold mb-2">Position Legend:</h3>
          <ul className="space-y-1">
            <li><span className="font-medium">F:</span> Forward</li>
            <li><span className="font-medium">C:</span> Center</li>
            <li><span className="font-medium">G:</span> Guard</li>
            <li><span className="font-medium">F-C/C-F:</span> Forward-Center hybrid position</li>
            <li><span className="font-medium">F-G/G-F:</span> Forward-Guard hybrid position</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PositionDistribution;
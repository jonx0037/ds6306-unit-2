import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';

interface PlayerData {
  position: string;
  height: string;
  year_start: number;
}

interface Props {
  data: PlayerData[];
}

const HeightOverTime: React.FC<Props> = ({ data }) => {
  // Convert height to inches and group by year
  const heightsByYear = data.reduce((acc: { [key: number]: number[] }, player) => {
    const [feet, inches] = player.height.split('-').map(Number);
    const heightInches = feet * 12 + inches;
    
    if (!isNaN(heightInches) && player.year_start) {
      if (!acc[player.year_start]) {
        acc[player.year_start] = [];
      }
      acc[player.year_start].push(heightInches);
    }
    return acc;
  }, {});

  // Calculate statistics for each year
  const yearlyStats = Object.entries(heightsByYear).map(([year, heights]) => {
    const avg = heights.reduce((sum, h) => sum + h, 0) / heights.length;
    const sd = Math.sqrt(
      heights.reduce((sum, h) => sum + Math.pow(h - avg, 2), 0) / heights.length
    );
    const se = sd / Math.sqrt(heights.length);

    return {
      year: parseInt(year),
      avgHeight: avg,
      upperBound: avg + se,
      lowerBound: avg - se,
      count: heights.length
    };
  }).sort((a, b) => a.year - b.year);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-dark-text">
        Average Player Height Over Time
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={yearlyStats}
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
            <XAxis
              dataKey="year"
              label={{ value: 'Year', position: 'bottom', fill: '#e0e0e0' }}
              tick={{ fill: '#e0e0e0' }}
            />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              label={{ value: 'Height (inches)', angle: -90, position: 'insideLeft', fill: '#e0e0e0' }}
              tick={{ fill: '#e0e0e0' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#262626',
                border: '1px solid #333333',
                color: '#e0e0e0'
              }}
              formatter={(value: number) => `${value.toFixed(1)} inches`}
            />
            <Legend wrapperStyle={{ color: '#e0e0e0' }} />
            
            {/* Standard error area */}
            <Area
              type="monotone"
              dataKey="upperBound"
              stroke="none"
              fill="#1f77b4"
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="lowerBound"
              stroke="none"
              fill="#1f77b4"
              fillOpacity={0.1}
            />
            
            {/* Average height line */}
            <Line
              type="monotone"
              dataKey="avgHeight"
              stroke="#1f77b4"
              strokeWidth={2}
              dot={{ fill: '#1f77b4', r: 4 }}
              name="Average Height"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-center text-dark-text opacity-80">
        <p>The line shows the average player height for each year.</p>
        <p>The shaded area represents the standard error of the mean.</p>
        <p>There has been a gradual increase in average player height over time.</p>
      </div>
    </div>
  );
};

export default HeightOverTime;
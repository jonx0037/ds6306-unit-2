import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';

interface EducationData {
  Educ: string;
  Income2005: number;
}

interface Props {
  data: EducationData[];
}

const EducationIncome: React.FC<Props> = ({ data }) => {
  // Group data by education level
  const groupedData = data.reduce((acc: { [key: string]: number[] }, item) => {
    if (!acc[item.Educ]) {
      acc[item.Educ] = [];
    }
    acc[item.Educ].push(item.Income2005);
    return acc;
  }, {});

  // Calculate statistics for each education level
  const processedData = Object.entries(groupedData).map(([educ, incomes]) => {
    const sortedIncomes = incomes.sort((a, b) => a - b);
    const q1 = sortedIncomes[Math.floor(incomes.length * 0.25)];
    const median = sortedIncomes[Math.floor(incomes.length * 0.5)];
    const q3 = sortedIncomes[Math.floor(incomes.length * 0.75)];
    const iqr = q3 - q1;
    const min = Math.max(q1 - 1.5 * iqr, sortedIncomes[0]);
    const max = Math.min(q3 + 1.5 * iqr, sortedIncomes[sortedIncomes.length - 1]);
    const mean = incomes.reduce((sum, val) => sum + val, 0) / incomes.length;

    return {
      education: educ,
      min,
      q1,
      median,
      q3,
      max,
      mean,
      count: incomes.length
    };
  }).sort((a, b) => a.median - b.median);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-dark-text">
        Income Distribution by Education Level
      </h2>
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
            <XAxis
              dataKey="education"
              label={{
                value: 'Education Level',
                position: 'bottom',
                fill: '#e0e0e0',
                offset: 40
              }}
              tick={{
                fill: '#e0e0e0',
                transform: 'rotate(-45)'
              }}
            />
            <YAxis
              label={{
                value: 'Income (USD)',
                angle: -90,
                position: 'insideLeft',
                fill: '#e0e0e0',
                offset: 10
              }}
              tick={{ fill: '#e0e0e0' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#262626',
                border: '1px solid #333333',
                color: '#e0e0e0'
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend wrapperStyle={{ color: '#e0e0e0' }} />
            
            {/* Box plot representation */}
            <Bar
              dataKey="median"
              fill="#1f77b4"
              opacity={0.7}
              name="Median Income"
            />
            
            {/* IQR boxes */}
            <Bar
              dataKey="q3"
              fill="#1f77b4"
              opacity={0.3}
              name="Upper Quartile"
              stackId="quartiles"
            />
            <Bar
              dataKey="q1"
              fill="#1f77b4"
              opacity={0.3}
              name="Lower Quartile"
              stackId="quartiles"
            />
            
            {/* Min-Max whiskers */}
            <Line
              type="monotone"
              dataKey="max"
              stroke="#e0e0e0"
              dot={false}
              name="Maximum"
            />
            <Line
              type="monotone"
              dataKey="min"
              stroke="#e0e0e0"
              dot={false}
              name="Minimum"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-center text-dark-text opacity-80">
        <p>The bars show the median income for each education level.</p>
        <p>The shaded areas represent the interquartile range (IQR).</p>
        <p>The lines extend to the minimum and maximum values.</p>
        <p>Higher education levels generally correspond to higher incomes.</p>
      </div>
    </div>
  );
};

export default EducationIncome;
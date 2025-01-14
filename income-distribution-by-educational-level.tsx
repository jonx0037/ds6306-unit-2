import React, { useState, useEffect } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Papa from 'papaparse';

const IncomeDistribution = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fs.readFile('Education_Income.csv', { encoding: 'utf8' });
      
      Papa.parse(response, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Group and process data by education level
          const processedData = _.chain(results.data)
            .groupBy('Educ')
            .map((group, educ) => {
              const incomes = _.map(group, 'Income2005');
              const sortedIncomes = _.sortBy(incomes);
              const q1 = sortedIncomes[Math.floor(sortedIncomes.length * 0.25)];
              const median = sortedIncomes[Math.floor(sortedIncomes.length * 0.5)];
              const q3 = sortedIncomes[Math.floor(sortedIncomes.length * 0.75)];
              return {
                education: educ,
                min: _.min(incomes),
                max: _.max(incomes),
                q1,
                median,
                q3,
                mean: _.mean(incomes)
              };
            })
            .value();

          setData(processedData);
        }
      });
    };

    fetchData();
  }, []);

  const formatIncome = (value) => {
    return `$${new Intl.NumberFormat('en-US').format(value)}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Income Distribution by Education Level</h2>
      <ComposedChart width={800} height={400} data={data} margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="education" 
          label={{ value: 'Education Level', position: 'bottom', offset: 10 }}
        />
        <YAxis 
          label={{ value: 'Income (2005 USD)', angle: -90, position: 'insideLeft', offset: -20 }}
          tickFormatter={formatIncome}
        />
        <Tooltip 
          formatter={(value) => formatIncome(value)}
          labelFormatter={(label) => `Education Level: ${label}`}
        />
        <Legend />
        <Bar dataKey="q3" fill="#8884d8" stackId="a" name="75th Percentile" />
        <Bar dataKey="median" fill="#82ca9d" stackId="a" name="Median" />
        <Bar dataKey="q1" fill="#ffc658" stackId="a" name="25th Percentile" />
      </ComposedChart>
      <div className="mt-4 text-sm">
        <p className="font-semibold mb-2">Key Observations:</p>
        <ul className="list-disc pl-4">
          <li>Income levels generally increase with higher education</li>
          <li>The spread of income (variation) tends to be larger at higher education levels</li>
          <li>The median income shows consistent growth across education levels</li>
        </ul>
      </div>
    </div>
  );
};

export default IncomeDistribution;
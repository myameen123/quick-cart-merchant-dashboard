"use client"
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Sample data based on the image
const data = [
  { date: '2024-10-15', cr: 38 },
  { date: '2024-10-18', cr: 40 },
  { date: '2024-10-21', cr: 37 },
  { date: '2024-10-24', cr: 38 },
  { date: '2024-10-27', cr: 38 },
  { date: '2024-10-30', cr: 38 },
  { date: '2024-11-02', cr: 39 },
  { date: '2024-11-05', cr: 38 },
  { date: '2024-11-08', cr: 40 },
  { date: '2024-11-12', cr: 43 },
  { date: '2024-11-15', cr: 42 },
  { date: '2024-11-18', cr: 39 },
  { date: '2024-11-21', cr: 37 },
  { date: '2024-11-24', cr: 40 },
  { date: '2024-11-27', cr: 40 },
  { date: '2024-11-30', cr: 38 },
  { date: '2024-12-03', cr: 37 },
  { date: '2024-12-06', cr: 38 },
  { date: '2024-12-09', cr: 37 },
  { date: '2024-12-12', cr: 35 },
  { date: '2024-12-15', cr: 34 },
  { date: '2024-12-18', cr: 32 },
  { date: '2024-12-21', cr: 31 },
  { date: '2024-12-24', cr: 31 },
  { date: '2024-12-27', cr: 31 },
  { date: '2024-12-30', cr: 34 },
  { date: '2025-01-02', cr: 33 },
  { date: '2025-01-05', cr: 35 },
  { date: '2025-01-08', cr: 33 },
  { date: '2025-01-11', cr: 31 },
  { date: '2025-01-14', cr: 36 },
  { date: '2025-01-17', cr: 37 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-100 px-3 py-2 rounded shadow">
        <p className="text-gray-700 font-medium">{new Date(label).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
        <p className="text-blue-900">CR % {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const CustomizedDot = (props) => {
  const { cx, cy, payload } = props;
  
  
  return <circle cx={cx} cy={cy} r={3} fill="#ffcc00" stroke="#000" strokeWidth={1} />;
};

export default function CheckoutCRChart() {
  const [activePoint, setActivePoint] = useState(null);
  
  return (
    <div className="w-full h-96 bg-white p-4">
        <h2 className="text-2xl font-bold text-center mb-6">Quick Cart Checkout CR</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 30, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            domain={[30, 45]} 
            ticks={[30, 33, 36, 39, 42, 45]} 
            axisLine={{ stroke: '#E5E7EB' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="cr" 
            stroke="#000000" 
            strokeWidth={1.5}
            dot={<CustomizedDot />}
            activeDot={{ r: 6, fill: "#ffcc00" }}
          />
          {/* Vertical reference line for 2024-11-12 */}
          <CartesianGrid 
            vertical 
            horizontalPoints={[]} 
            verticalPoints={[data.findIndex(d => d.date === '2024-11-12') * (100 / (data.length - 1)) + '%']} 
            stroke="#E5E7EB" 
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

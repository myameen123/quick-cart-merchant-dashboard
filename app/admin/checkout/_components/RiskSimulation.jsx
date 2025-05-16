/* eslint-disable import/order */
"use client"
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HelpCircle } from 'lucide-react';

export default function RiskSimulation() {
  // Dummy data for the line charts
  const chartData = [
    { time: '01:00 PM', value1: 30000, value2: 25000 },
    { time: '02:00 PM', value1: 27000, value2: 32000 },
    { time: '03:00 PM', value1: 33000, value2: 28000 },
    { time: '04:00 PM', value1: 32000, value2: 31000 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 max-w-full shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Risk Simulation</h1>
        <p className="text-gray-500">Visualise impact of Quick Carts risk intelligence on your past orders</p>
      </div>

      {/* KPI Cards */}
      <div className="flex flex-row gap-2 justify-between mb-6">
        <KpiCard 
          title="Current RTO Rate" 
          value="20%" 
        />
        <KpiCard 
          title="RTO Rate Reduction" 
          value="20%" 
        />
        <KpiCard 
          title="COD RTO Orders Identified" 
          value="5.4K" 
        />
        <KpiCard 
          title="Prepaid Uplift" 
          value="4%" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-700 mb-4">RTO (COD)%</h2>
          <div className="h-64">
            <ResponsiveContainer width={420} height={250}>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis 
                  tickFormatter={(value) => `${value/1000}K`}
                  domain={['dataMin - 2000', 'dataMax + 2000']}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value) => [`${value}`, 'Value']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value1" 
                  stroke="#F8C471" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value2" 
                  stroke="#2B5797" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
           <div className="flex flex-row gap-4 mt-2 items-center text-sm">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-yellow-400 mr-1"></div>
              <span className="text-gray-600">16 May 2025</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-blue-600 mr-1"></div>
              <span className="text-gray-600">15 May 2025</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Last updated 16 May 2025 at 8:00 AM</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Conversion Rate %</h2>
          <div className="h-64">
            <ResponsiveContainer width={420} height={250}>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis 
                  tickFormatter={(value) => `${value/1000}K`}
                  domain={['dataMin - 2000', 'dataMax + 2000']}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value) => [`${value}`, 'Value']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value1" 
                  stroke="#F8C471" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value2" 
                  stroke="#2B5797" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-row gap-4 mt-2 items-center text-sm">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-yellow-400 mr-1"></div>
              <span className="text-gray-600">16 May 2025</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-blue-600 mr-1"></div>
              <span className="text-gray-600">15 May 2025</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Last updated 16 May 2025 at 8:00 AM</p>
        </div>
      </div>
    </div>
  );
}

// KPI Card Component
function KpiCard({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center mb-2">
        <h3 className="text-gray-500 text-sm mr-1">{title}</h3>
        <HelpCircle size={16} className="text-gray-400" />
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
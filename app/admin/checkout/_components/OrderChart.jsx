/* eslint-disable import/order */

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { Button } from '@/components/ui/button';

// Generate dummy data for different time periods
const generateHourlyData = () => {
  const data = [];
  for (let hour = 0; hour < 24; hour++) {
    // Create a pattern similar to the image with higher values in peak hours
    let orders = Math.floor(Math.random() * 20) + 10;
    if (hour >= 6 && hour <= 20) {
      orders = Math.floor(Math.random() * 30) + 15;
    }
    if (hour >= 12 && hour <= 16) {
      orders = Math.floor(Math.random() * 20) + 25;
    }
    if ([3, 4, 5].includes(hour)) {
      orders = Math.floor(Math.random() * 8);
    }
    
    // Random average order value between 600 and 1000
    const avgOrderValue = Math.floor(Math.random() * 400) + 600;
    
    data.push({
      time: `${hour} hr`,
      orders,
      avgOrderValue
    });
  }
  return data;
};

const generateDailyData = () => {
  const data = [];
  for (let day = 1; day <= 30; day++) {
    const orders = Math.floor(Math.random() * 40) + 20;
    const avgOrderValue = Math.floor(Math.random() * 400) + 600;
    
    data.push({
      time: `${day} May`,
      orders,
      avgOrderValue
    });
  }
  return data;
};

const generateWeeklyData = () => {
  const data = [];
  for (let week = 1; week <= 12; week++) {
    const orders = Math.floor(Math.random() * 100) + 50;
    const avgOrderValue = Math.floor(Math.random() * 400) + 600;
    
    data.push({
      time: `Week ${week}`,
      orders,
      avgOrderValue
    });
  }
  return data;
};

const generateMonthlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = [];
  for (let i = 0; i < 12; i++) {
    const orders = Math.floor(Math.random() * 200) + 100;
    const avgOrderValue = Math.floor(Math.random() * 400) + 600;
    
    data.push({
      time: months[i],
      orders,
      avgOrderValue
    });
  }
  return data;
};

const OrdersChart = () => {
  const [timeRange, setTimeRange] = useState('hourly');
  const [chartData, setChartData] = useState([]);
  const [hoveredData, setHoveredData] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalGMV: '5.37 Lakhs',
    totalOrders: 653,
    averageOrderValue: 821.94
  });

  useEffect(() => {
    // Set data based on selected time range
    switch (timeRange) {
      case 'hourly':
        setChartData(generateHourlyData());
        break;
      case 'daily':
        setChartData(generateDailyData());
        break;
      case 'weekly':
        setChartData(generateWeeklyData());
        break;
      case 'monthly':
        setChartData(generateMonthlyData());
        break;
      default:
        setChartData(generateHourlyData());
    }
  }, [timeRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white border p-2 rounded shadow text-sm">
        <p className="label font-semibold">{label}</p>
        <p className="intro text-blue-800">Orders: {payload[0].value}</p>
        <p className="desc text-yellow-600">Avg Order Value: {payload[1].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

  
  // const CustomTooltip = ({ active, payload, label }) => {
  //   if (active && payload && payload.length) {
  //     setHoveredData({
  //       time: label,
  //       orders: payload[0].value,
  //       avgOrderValue: payload[1].value.toFixed(2)
  //     });
  //     return null;
  //   }
  //   setHoveredData(null);
  //   return null;
  // };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-white rounded-lg shadow-md mt-4">
      {/* Summary stats at the top */}
      <div className="flex justify-between mb-6 p-4 bg-gray-50 rounded-t-lg">
        <div className='bg-slate-50 rounded-md'>
          <h3 className="text-amber-400 font-semibold">Total GMV</h3>
          <p className="text-3xl font-bold text-blue-900">{summaryData.totalGMV}</p>
        </div>
        <div className='bg-slate-50 rounded-md'>
          <h3 className="text-amber-500 font-semibold">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-900">{summaryData.totalOrders}</p>
        </div>
        <div className='bg-slate-50 rounded-md'>
          <h3 className="text-amber-500 font-semibold">Average Order Value</h3>
          <p className="text-3xl font-bold text-blue-900">{summaryData.averageOrderValue}</p>
        </div>
      </div>
      
      {/* Chart Title and Time Range Selector */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Total Order vs. Average Order Value</h2>
        <div className="flex flex-row gap-2">
          <Button 
            variant={timeRange === 'hourly' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleTimeRangeChange('hourly')}
          >
            Hourly
          </Button>
          <Button 
            variant={timeRange === 'daily' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleTimeRangeChange('daily')}
          >
            Daily
          </Button>
          <Button 
            variant={timeRange === 'weekly' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleTimeRangeChange('weekly')}
          >
            Weekly
          </Button>
          <Button 
            variant={timeRange === 'monthly' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleTimeRangeChange('monthly')}
          >
            Monthly
          </Button>
        </div>
      </div>
      
      {/* Hover Data Display */}
      {/* {hoveredData && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="font-semibold">{hoveredData.time}</p>
          <div className="flex space-x-8 mt-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-800 mr-2"></div>
              <span>Order: {hoveredData.orders}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>Average Order Value: {hoveredData.avgOrderValue}</span>
            </div>
          </div>
        </div>
      )} */}
      
      {/* Main Chart */}
      <div className="w-full h-80 bg-white">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart
            data={chartData}
            onMouseMove={(e) => {
              if (e && e.activePayload && e.activePayload.length > 0) {
                const { payload } = e.activePayload[0];
                setHoveredData({
                  time: payload.time,
                  orders: payload.orders,
                  avgOrderValue: payload.avgOrderValue.toFixed(2),
                });
              }
            }}
            onMouseLeave={() => setHoveredData(null)}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
>

          {/* <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          > */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              tickLine={false} 
              axisLine={false}
              domain={[0, 'dataMax + 10']}
              label={{ value: '', angle: -90, position: 'insideLeft' }} 
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tickLine={false} 
              axisLine={false}
              domain={[0, 1200]}
              label={{ value: '', angle: 90, position: 'insideRight' }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="orders" 
              fill="#1e40af" 
              name="Order" 
              barSize={18}
              radius={[2, 2, 0, 0]} 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="avgOrderValue" 
              stroke="#f59e0b" 
              strokeWidth={3} 
              dot={{ fill: '#f59e0b', r: 6 }} 
              activeDot={{ r: 8 }}
              name="Average Order Value" 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersChart;
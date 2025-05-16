'use client';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

export default function PaymentMethodDistribution() {
  const gmvData = [
    { name: 'Wallet GMV', value: 19.33, color: '#2B5797' },
    { name: 'COD GMV', value: 80.76, color: '#F8C471' },
    { name: 'CC GMV', value: 0.00, color: '#58D68D' },
    { name: 'DC GMV', value: 0.00, color: '#F5B041' },
  ];

  const orderCountData = [
    { name: 'Wallet Orders', value: 20.37, color: '#2B5797' },
    { name: 'COD Orders', value: 79.63, color: '#F8C471' },
    { name: 'CC Orders', value: 0.00, color: '#58D68D' },
    { name: 'DC Orders', value: 0.00, color: '#F5B041' },
  ];

  const filteredGmvData = gmvData.filter(item => item.value > 0);
  const filteredOrderData = orderCountData.filter(item => item.value > 0);

  return (
    <div className="w-full my-10">
      <h2 className="text-2xl font-bold text-center mb-6">Payment Method-Wise Distribution</h2>
      
      <div className="flex flex-row gap-4">
        {/* GMV Pie Chart */}
        <div className="flex-1 border rounded-lg shadow p-6">
          <h3 className="text-lg text-center text-green-600 font-medium mb-4">Total GMV</h3>
          <div className="flex justify-center items-center h-full">
            <PieChart width={400} height={300}>
              <Pie
                data={filteredGmvData}
                cx={200}
                cy={140}
                innerRadius={70}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
              >
                {filteredGmvData.map((entry, index) => (
                  <Cell key={`cell-gmv-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  typeof value === 'number' ? `${value.toFixed(2)}%` : value
                }
              />
              <Legend
                layout="vertical"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                formatter={(value) => {
                  const item = filteredGmvData.find(d => d.name === value);
                  return `${value} - ${item?.value.toFixed(2) ?? 0}%`;
                }}
              />
            </PieChart>
          </div>
        </div>

        {/* Order Count Pie Chart */}
        <div className="flex-1 border rounded-lg shadow p-6">
          <h3 className="text-lg text-center text-green-600 font-medium mb-4">Total Order Count</h3>
          <div className="flex justify-center items-center h-full">
            <PieChart width={400} height={300}>
              <Pie
                data={filteredOrderData}
                cx={200}
                cy={140}
                innerRadius={70}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
              >
                {filteredOrderData.map((entry, index) => (
                  <Cell key={`cell-order-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  typeof value === 'number' ? `${value.toFixed(2)}%` : value
                }
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                formatter={(value) => {
                  const item = filteredOrderData.find(d => d.name === value);
                  return `${value} - ${item?.value.toFixed(2) ?? 0}%`;
                }}
              />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}

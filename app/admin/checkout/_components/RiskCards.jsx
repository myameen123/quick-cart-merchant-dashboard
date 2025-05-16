/* eslint-disable import/order */
"use client"
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

function RiskCards() {
  // State to track selected options for each risk level
  const [lowRiskSelection, setLowRiskSelection] = useState('');
  const [mediumRiskSelection, setMediumRiskSelection] = useState('');
  const [highRiskSelection, setHighRiskSelection] = useState('');

  // Options for each risk level
  const options = [
    'COD blocking',
    'COD Fees',
    'COD Prompt',
    'No Intervention'
  ];

  // Function to handle checkbox changes
  const handleSelectionChange = (riskLevel, option) => {
    switch (riskLevel) {
      case 'low':
        setLowRiskSelection(option);
        break;
      case 'medium':
        setMediumRiskSelection(option);
        break;
      case 'high':
        setHighRiskSelection(option);
        break;
      default:
        break;
    }
  };

  // Function to handle submit button click
  const handleSubmit = () => {
    console.log({
      lowRiskSelection,
      mediumRiskSelection,
      highRiskSelection
    });
    toast.success("Risk settings applied successfully!")
  };

  // Card component for each risk level
  const RiskCard = ({ title, riskLevel, selectedOption, titleColor }) => (
    <div className="w-full max-w-md mx-auto mb-6 rounded-3xl overflow-hidden shadow-md bg-slate-100">
      <div className="px-6 py-4 pb-6">
        <h3 className={`text-xl font-semibold mb-4 ${titleColor}`}>{title}</h3>
        {options.map((option) => (
          <div key={option} className="mb-4 border-b pb-3 last:border-b-0">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={selectedOption === option}
                onChange={() => handleSelectionChange(riskLevel, option)}
              />
              <span className="ml-4 text-gray-700 font-medium">{option}</span>
              {/* {(option === 'COD Captcha' || option === 'COD Prompt' || option === 'No Intervention') && (
                <span className="ml-2 text-gray-400 rounded-full border border-gray-300 w-5 h-5 flex items-center justify-center text-xs">i</span>
              )} */}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className='font-bold text-lg my-3'>Rules for COD</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl ">
        <RiskCard 
          title="Low Risk" 
          riskLevel="low" 
          selectedOption={lowRiskSelection} 
          titleColor="text-green-500"
        />
        
        <RiskCard 
          title="Medium Risk" 
          riskLevel="medium" 
          selectedOption={mediumRiskSelection} 
          titleColor="text-yellow-600"
        />
        
        <RiskCard 
          title="High Risk" 
          riskLevel="high" 
          selectedOption={highRiskSelection} 
          titleColor="text-red-500"
        />
      </div>
      
      <Button 
        className="mt-8 px-8 py-2"
        size="lg"
        onClick={handleSubmit}
        disabled={!lowRiskSelection || !mediumRiskSelection || !highRiskSelection}
      >
        Apply Risk Settings
      </Button>
    </div>
  );
}

export default RiskCards;
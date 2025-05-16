/* eslint-disable import/order */

import { Button } from '@/components/ui/button';
import axios from 'axios';
import React, { useEffect, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import ReactSlider from 'react-slider';

interface Threshold {
    _id: string;
    low: number;
    medium: number;
    high: number;
    createdAt: string;
  }
function Custom() {
          const [savedThr, setSaveThr] =  useState<Threshold[]|null>(null);
    const [thresholds, setThresholds] = useState<[number, number]>([savedThr?savedThr[0].low:0.3, savedThr?savedThr[0].medium:0.7]);
  const [isUpdating, startTransition] = useTransition();

  useEffect(()=>{
    const fetchThreshold = async ()=>{
        try{
            const res = await fetch("/api/admin/checkout");
            const json = await res.json()
            setSaveThr(json.data)
        }catch(err){
            toast.error("Failed to load thresholds")
            console.error(err)
        }
    }
    fetchThreshold()
  },[])

  useEffect(() => {
    if (savedThr && savedThr.length > 0) {
      setThresholds([savedThr[0].low, savedThr[0].medium]);
    }
  }, [savedThr]);

  const onSetRiskHandler = () => {

    console.log(savedThr && savedThr[0].low)
    startTransition(async()=>{
        if(savedThr){
            try{
            const low = thresholds[0];
            const medium = thresholds[1];
            await fetch(`/api/admin/checkout`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ low, medium, id:savedThr[0]._id}),
              });

              toast.success("successfully threshold sat.")
            }catch(err){
                toast.error("Failed to set thresholds")
                console.error(err)
            }

        }
       
    })
  };
  return (
     <div className="w-full  mx-auto px-6 py-4 bg-slate-100 mt-8 rounded-md">
      <h2 className="text-lg font-bold mb-4 text-center">Set Risk Thresholds</h2>

      <ReactSlider
        className="h-4 bg-gray-300 rounded-full relative"
        thumbClassName="h-5 w-5 bg-blue-600 rounded-full cursor-pointer border-2 border-white shadow"
        trackClassName="top-0 bottom-0"
        defaultValue={thresholds}
        value={thresholds}
        min={0}
        max={1}
        step={0.01}
        minDistance={0.01}
        onChange={(newValues: number[]) => setThresholds(newValues as [number, number])}
        renderTrack={(props, state) => {
          const colors = ['bg-green-400', 'bg-yellow-400', 'bg-red-400'];
          return (
            <div
              {...props}
              className={`absolute ${colors[state.index]} h-4 rounded-full`}
              style={{ ...props.style }}
            />
          );
        }}
      />

      {/* Labels */}
      <div className="mt-4 flex justify-between text-sm font-medium">
        <div>Low: 0 - {thresholds[0].toFixed(2)}</div>
        <div>Medium: {thresholds[0].toFixed(2)} - {thresholds[1].toFixed(2)}</div>
        <div>High: {thresholds[1].toFixed(2)} - 1</div>
      </div>
      <div className='w-full flex justify-center mt-6'>

      <Button className='text-right' size="lg" disabled = {isUpdating} onClick={onSetRiskHandler}>Set Risk</Button>
      </div>
    </div>
  )
}

export default Custom
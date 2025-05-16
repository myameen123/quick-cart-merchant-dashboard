/* eslint-disable import/order */
import {NextRequest, NextResponse} from "next/server"
import dbConnect from "@/lib/dbConnect"
import CheckoutModel from "@/lib/models/Checkout"

export async function POST(req:NextRequest){
    await dbConnect();

    const {low, medium, high} = await req.json();

    if (low>=medium||medium>=high||low<0||high>1){
        return NextResponse.json({error:"Invalid thresholds"},{status:400})
    }

    const response = await CheckoutModel.create({low,medium,high});
    return NextResponse.json({message:"Threshold saved", response})

}

export async function GET(){
    await dbConnect();
    try {
        
        const response = await CheckoutModel.find();
        return NextResponse.json({data:response})
    }catch (error) {
        return NextResponse.json({ error: 'Failed to fetch thresholds' }, { status: 500 });
    }

}
 

export async function PATCH(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const {
    id, // Required for targeting specific document
    low,
    medium,
    high,
    lowRiskSelection,
    mediumRiskSelection,
    highRiskSelection,
  } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
  }

  const updateData: any = {};

  // Conditionally include numeric thresholds
  if (typeof low === 'number') {
    if (low < 0) {
      return NextResponse.json({ error: 'Low must be >= 0' }, { status: 400 });
    }
    updateData.low = low;
  }

  if (typeof medium === 'number') {
    if (typeof low === 'number' && medium <= low) {
      return NextResponse.json({ error: 'Medium must be > low' }, { status: 400 });
    }
    updateData.medium = medium;
  }

  if (typeof high === 'number') {
    if (
      (typeof medium === 'number' && high <= medium) ||
      (typeof low === 'number' && typeof medium !== 'number' && high <= low)
    ) {
      return NextResponse.json({ error: 'High must be > medium or low' }, { status: 400 });
    }
    updateData.high = high;
  }

  // Conditionally include risk selection strings
  if (typeof lowRiskSelection === 'string') {
    updateData.lowRiskSelection = lowRiskSelection;
  }
  if (typeof mediumRiskSelection === 'string') {
    updateData.mediumRiskSelection = mediumRiskSelection;
  }
  if (typeof highRiskSelection === 'string') {
    updateData.highRiskSelection = highRiskSelection;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  try {
    const updated = await CheckoutModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Checkout config not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Checkout config updated', updated });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: error }, { status: 500 });
  }
}


// export async function PATCH(req: NextRequest) {
//     await dbConnect();
  

//     const body = await req.json();
//     const { low, medium,id } = body;
  
    
  
//     // Validate input
//     if (
//       typeof low !== 'number' ||
//       typeof medium !== 'number' ||
//        low < 0 ||
//       medium <= low
//     ) {
//       return NextResponse.json({ error: 'Invalid threshold values' }, { status: 400 });
//     }
  
//     try {
//       const updated = await CheckoutModel.findByIdAndUpdate(
//         id,
//         { low, medium },
//         { new: true }
//       );
  
//       if (!updated) {
//         return NextResponse.json({ error: 'Threshold not found' }, { status: 404 });
//       }
  
//       return NextResponse.json({ message: 'Threshold updated', updated });
//     } catch (error) {
//       return NextResponse.json({ error: 'Server error', details: error }, { status: 500 });
//     }
//   }
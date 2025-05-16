import mongoose, {Schema, Document, Model} from "mongoose";

export interface ICheckout extends Document {
  low: number;
  medium: number;
  high: number;
  lowRiskSelection: string;
  mediumRiskSelection: string;
  highRiskSelection: string;
  createdAt: Date;
}


const CheckoutSchema: Schema<ICheckout> = new Schema<ICheckout>(
  {
    low: { type: Number, required: true, min: 0, max: 1 },
    medium: { type: Number, required: true, min: 0, max: 1 },
    high: { type: Number, required: true, min: 0, max: 1 },
    lowRiskSelection: { type: String, default: 'No Intervention' },
    mediumRiskSelection: { type: String, default: 'Partial COD' },
    highRiskSelection: { type: String, default: 'COD Blocking' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);


const CheckoutModel: Model<ICheckout> = mongoose.models.Checkout || mongoose.model<ICheckout>("Checkout", CheckoutSchema)

export default CheckoutModel;
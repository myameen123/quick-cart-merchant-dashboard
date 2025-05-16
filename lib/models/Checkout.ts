import mongoose, {Schema, Document, Model} from "mongoose";

export interface ICheckout extends Document{
    low: number,
    medium: number,
    high: number,
    createdAt: Date
}

const CheckoutSchema: Schema = new Schema<ICheckout>(
    {
        low: {type: Number, required: true, min:0, max:1},
        medium: { type: Number, required: true, min:0, max:1},
        high: { type: Number, required: true, min:0, max:1},
    },
    {timestamps: {createdAt: true, updatedAt:false}}
)

const CheckoutModel: Model<ICheckout> = mongoose.models.Checkout || mongoose.model<ICheckout>("Checkout", CheckoutSchema)

export default CheckoutModel;
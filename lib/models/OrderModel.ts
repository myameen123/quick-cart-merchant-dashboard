import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      ref: 'Customer',
      required: true, // Linking via phoneNumber instead of ObjectId
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      state: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['debit/credit card', 'wallet', 'COD'], // Added COD as an option
      required: true,
    },
    paymentResult: {
      transactionId: { type: String }, // Stripe Payment Intent ID
      chargeId: { type: String }, // Latest Charge ID from Stripe
      status: { type: String }, // Payment status (e.g., succeeded, failed)
      amountReceived: { type: Number }, // Amount received
      currency: { type: String }, // Currency code
      stripeCustomerId: { type: String }, // Stripe Customer ID (if applicable)
      emailAddress: { type: String }, // Email linked to the payment
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

const OrderModel =
  mongoose.models.Order || mongoose.model('Order', orderSchema);

export default OrderModel;

export type Order = {
  _id: string;
  customer: string; // Now linked via phoneNumber
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'debit/credit card' | 'wallet' | 'COD';
  paymentResult?: {
    transactionId?: string;
    chargeId?: string;
    status?: string;
    amountReceived?: number;
    currency?: string;
    stripeCustomerId?: string;
    emailAddress?: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
};

export type OrderItem = {
  name: string;
  slug: string;
  qty: number;
  image: string;
  price: number;
  color?: string;
  size?: string;
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
};

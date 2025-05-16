import mongoose, { Schema, Document, Model } from 'mongoose';

// Address Info Schema
const AddressSchema = new Schema({
  postalCode: { type: String, required: true },
  fullName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  email: { type: String, required: true },
  fullAddress: { type: String, required: true },
  addressType: { type: String, enum: ['Work', 'Home'], required: true },
  isSelected: { type: Boolean, default: false },
});

// Payment Info Schema (Updated)
const PaymentSchema = new Schema({
  type: { type: String, enum: ['debit/credit card', 'wallet'], required: true },
  stripeCustomerId: { type: String, required: false }, // Stripe Customer ID
  stripePaymentMethodId: { type: String, required: false }, // Stripe Payment Method ID
  walletDetails: {
    phoneNumber: { type: String, required: false },
    franchise: { type: String, enum: ['JazzCash', 'EasyPaisa'], required: false },
  },
  isSelected: { type: Boolean, default: false },
});

// Customer Schema Interface
export interface ICustomer extends Document {
  phoneNumber: string;
  stripeCustomerId?: string;
  addresses: Array<{
    postalCode: string;
    fullName: string;
    city: string;
    state: string;
    email: string;
    fullAddress: string;
    addressType: 'Work' | 'Home';
    isSelected?: boolean;
  }>;
  paymentMethods: Array<{
    type: 'debit/credit card' | 'wallet';  //add COD
    stripeCustomerId?: string;
    stripePaymentMethodId?: string;
    walletDetails?: {
      phoneNumber: string;
      franchise: 'JazzCash' | 'EasyPaisa';
    };
    isSelected?: boolean;
  }>;
}

// Customer Schema
const CustomerSchema: Schema = new Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String, required: false }, // Stores Stripe Customer ID
    addresses: { type: [AddressSchema], default: [] },
    paymentMethods: { type: [PaymentSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

// Export Model
const CustomerModel: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>('Customer', CustomerSchema);

export default CustomerModel;



// import mongoose, { Schema, Document, Model } from 'mongoose';

// // Address Info Schema
// const AddressSchema = new Schema({
//   postalCode: { type: String, required: true },
//   fullName: { type: String, required: true },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   email: { type: String, required: true },
//   fullAddress: { type: String, required: true },
//   addressType: { type: String, enum: ['Work', 'Home'], required: true },
//   isSelected: { type: Boolean, default: false },
// });

// // Card Payment Schema (Updated)
// const CardPaymentSchema = new Schema({
//   fullName: { type: String, required: true },
//   cardNumber: { type: String, required: true },
//   expiryDate: { type: String, required: true }, // Format: MM/YY
//   cvc: { type: String, required: true },
//   cardType: { type: String, enum: ['Visa', 'MasterCard'], required: true }, // New field
// });

// // Wallet Payment Schema
// const WalletPaymentSchema = new Schema({
//   phoneNumber: { type: String, required: true },
//   franchise: { type: String, enum: ['JazzCash', 'EasyPaisa'], required: true },
// });

// // Payment Info Schema
// const PaymentSchema = new Schema({
//   type: { type: String, enum: ['debit/credit card', 'wallet'], required: true },
//   cardDetails: { type: CardPaymentSchema, required: false },
//   walletDetails: { type: WalletPaymentSchema, required: false },
//   isSelected: { type: Boolean, default: false },
// });

// // Customer Schema Interface
// export interface ICustomer extends Document {
//   phoneNumber: string;
//   addresses: Array<{
//     postalCode: string;
//     fullName: string;
//     city: string;
//     state: string;
//     email: string;
//     fullAddress: string;
//     addressType: 'Work' | 'Home';
//     isSelected?: boolean;
//   }>;
//   paymentMethods: Array<{
//     type: 'debit/credit card' | 'wallet';
//     cardDetails?: {
//       fullName: string;
//       cardNumber: string;
//       expiryDate: string;
//       cvc: string;
//       cardType: 'Visa' | 'MasterCard';
//     };
//     walletDetails?: {
//       phoneNumber: string;
//       franchise: 'JazzCash' | 'EasyPaisa';
//     };
//     isSelected?: boolean;
//   }>;
// }

// // Customer Schema
// const CustomerSchema: Schema = new Schema(
//   {
//     phoneNumber: { type: String, required: true },
//     addresses: { type: [AddressSchema], default: [] },
//     paymentMethods: { type: [PaymentSchema], default: [] },
//   },
//   {
//     timestamps: true,
//   },
// );

// // Export Model
// const CustomerModel: Model<ICustomer> =
//   mongoose.models.Customer ||
//   mongoose.model<ICustomer>('Customer', CustomerSchema);

// export default CustomerModel;

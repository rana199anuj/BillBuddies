import mongoose, { Schema, Document } from 'mongoose';

export interface ISplit {
  memberId: string;
  amount: number;
}

export interface IExpense extends Document {
  tripId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  category: string;
  paidBy: string; // member id
  splits: ISplit[];
  createdAt: Date;
}

const SplitSchema = new Schema<ISplit>({
  memberId: { type: String, required: true },
  amount: { type: Number, required: true },
});

const ExpenseSchema = new Schema<IExpense>({
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Other' },
  paidBy: { type: String, required: true },
  splits: [SplitSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

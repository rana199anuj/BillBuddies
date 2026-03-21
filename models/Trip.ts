import mongoose, { Schema, Document } from 'mongoose';

export interface IMember {
  id: string;
  name: string;
  whatsapp: string;
}

export interface ITrip extends Document {
  name: string;
  description: string;
  date: Date;
  creatorId: mongoose.Types.ObjectId;
  members: IMember[];
  createdAt: Date;
}

const MemberSchema = new Schema<IMember>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  whatsapp: { type: String, required: true },
});

const TripSchema = new Schema<ITrip>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [MemberSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);

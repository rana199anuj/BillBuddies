import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import Expense from '@/models/Expense';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const trip = await Trip.findById(params.id);
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    const expenses = await Expense.find({ tripId: params.id }).sort({ createdAt: -1 });
    return NextResponse.json({ trip, expenses });
  } catch (error) {
    console.error('Get trip error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Trip.findByIdAndDelete(params.id);
    await Expense.deleteMany({ tripId: params.id });
    return NextResponse.json({ message: 'Trip deleted' });
  } catch (error) {
    console.error('Delete trip error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import Expense from '@/models/Expense';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const trip = await Trip.findById(id);
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    const expenses = await Expense.find({ tripId: id }).sort({ createdAt: -1 });
    return NextResponse.json({ trip, expenses });
  } catch (error) {
    console.error('Get trip error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    await Trip.findByIdAndDelete(id);
    await Expense.deleteMany({ tripId: id });
    return NextResponse.json({ message: 'Trip deleted' });
  } catch (error) {
    console.error('Delete trip error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

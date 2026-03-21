import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';

export async function POST(req: NextRequest) {
  try {
    const { tripId, title, amount, category, paidBy, splits } = await req.json();

    if (!tripId || !title || !amount || !paidBy || !splits) {
      return NextResponse.json({ error: 'All expense fields are required' }, { status: 400 });
    }

    await connectDB();
    const expense = await Expense.create({ tripId, title, amount, category, paidBy, splits });
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { expenseId } = await req.json();
    await connectDB();
    await Expense.findByIdAndDelete(expenseId);
    return NextResponse.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error('Delete expense error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

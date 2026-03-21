import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const trips = await Trip.find({}).sort({ createdAt: -1 });
    return NextResponse.json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, date, members } = await req.json();

    if (!name || !members || members.length < 1) {
      return NextResponse.json({ error: 'Trip name and at least one member required' }, { status: 400 });
    }

    await connectDB();

    // Import User model to get user ID
    const UserModel = (await import('@/models/User')).default;
    const user = await UserModel.findOne({ email: session.user.email });

    const trip = await Trip.create({
      name,
      description: description || '',
      date: date ? new Date(date) : new Date(),
      creatorId: user._id,
      members,
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Create trip error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

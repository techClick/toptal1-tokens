import { NextRequest, NextResponse } from 'next/server';
import { validateCreateRequest, validateGetRequest } from '@/controllers/validateController';
import { createToken } from '@/controllers/createTokenController';
import { getTokensByUserId } from '@/controllers/getTokensController';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateCreateRequest(body);
    
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    
    const token = await createToken(validation.data);
    return NextResponse.json(token, { status: 201 });
  } catch (error) {
    console.error('Error creating token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const validation = validateGetRequest(searchParams.get('userId'));
    
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    
    const tokens = await getTokensByUserId(validation.userId);
    return NextResponse.json(tokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

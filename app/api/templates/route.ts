import { NextResponse } from 'next/server';
import { getTemplates } from '@/lib/data-source';

export async function GET() {
  const data = await getTemplates();
  return NextResponse.json(data);
}

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'places.json');

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    const fileData = await fs.readFile(dataPath, 'utf8');
    const places = JSON.parse(fileData);
    
    // 해당 ID를 제외한 나머지만 남기기 (삭제 로직)
    const newPlaces = places.filter((p: any) => p.id !== id);
    
    await fs.writeFile(dataPath, JSON.stringify(newPlaces, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete place error:', error);
    return NextResponse.json({ success: false, message: '삭제 실패' }, { status: 500 });
  }
}

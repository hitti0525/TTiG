import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'places.json');

export async function POST(request: Request) {
  try {
    const updatedPlace = await request.json();
    
    const fileData = await fs.readFile(dataPath, 'utf8');
    let places = JSON.parse(fileData);
    
    // 기존 데이터 찾아서 교체하기
    const index = places.findIndex((p: any) => p.id === updatedPlace.id);
    if (index !== -1) {
      places[index] = updatedPlace;
      await fs.writeFile(dataPath, JSON.stringify(places, null, 2), 'utf8');
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  } catch (error) {
    console.error('Update place error:', error);
    return NextResponse.json({ success: false, message: '수정 실패' }, { status: 500 });
  }
}

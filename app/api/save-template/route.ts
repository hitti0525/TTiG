import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'places.json');

export async function POST(request: Request) {
  try {
    const newItem = await request.json();
    let places = [];
    try {
      const fileData = await fs.readFile(dataPath, 'utf8');
      places = JSON.parse(fileData);
    } catch (e) { 
      places = []; 
    }

    const updatedPlaces = [newItem, ...places];
    await fs.writeFile(dataPath, JSON.stringify(updatedPlaces, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save template error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || '파일 저장 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}

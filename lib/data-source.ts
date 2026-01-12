import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'places.json');

export async function getTemplates() {
  try {
    const fileData = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    return [];
  }
}

export async function getPlaceBySlug(slug: string) {
  try {
    const templates = await getTemplates();
    return templates.find((t: any) => t.slug === slug) || null;
  } catch (error) {
    return null;
  }
}

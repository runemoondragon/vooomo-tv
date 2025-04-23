import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 });
    }

    // Get the absolute path to the categories directory
    const categoriesDir = path.join(process.cwd(), 'app/categories');
    const filePath = path.join(categoriesDir, `${category}.json`);

    try {
      // Read and parse the JSON file
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const channels = JSON.parse(fileContent);

      return NextResponse.json(channels);
    } catch (error) {
      console.error(`Error reading category file: ${category}`, error);
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
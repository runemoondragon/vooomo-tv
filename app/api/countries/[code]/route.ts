import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const countryCode = params.code.toLowerCase();
    const filePath = path.join(process.cwd(), 'app', 'countries', `${countryCode}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const channels = JSON.parse(fileContents);

    return NextResponse.json(channels);
  } catch (error) {
    console.error('Error loading country channels:', error);
    return NextResponse.json({ error: 'Failed to load channels' }, { status: 500 });
  }
} 
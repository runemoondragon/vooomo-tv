import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Channel {
  nanoid: string;
  name: string;
  iptv_urls: string[];
  youtube_urls: string[];
  language: string;
  country: string;
  isGeoBlocked: boolean;
}

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category.toLowerCase();
    const countriesDir = path.join(process.cwd(), 'app', 'countries');
    const files = await fs.readdir(countriesDir);
    
    let allChannels: Channel[] = [];
    
    // Read and combine channels from all country files
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(countriesDir, file);
        const fileContents = await fs.readFile(filePath, 'utf8');
        const channels = JSON.parse(fileContents) as Channel[];
        allChannels = allChannels.concat(channels);
      }
    }

    // Filter channels based on category
    const categoryChannels = allChannels.filter(channel => {
      switch (category) {
        case 'news':
          return channel.name.toLowerCase().includes('news') || 
                 channel.name.toLowerCase().includes('info') ||
                 channel.name.toLowerCase().includes('24');
        case 'sports':
          return channel.name.toLowerCase().includes('sport') ||
                 channel.name.toLowerCase().includes('racing') ||
                 channel.name.toLowerCase().includes('fight');
        case 'music':
          return channel.name.toLowerCase().includes('music') ||
                 channel.name.toLowerCase().includes('mtv') ||
                 channel.name.toLowerCase().includes('hits');
        case 'kids':
          return channel.name.toLowerCase().includes('kids') ||
                 channel.name.toLowerCase().includes('junior') ||
                 channel.name.toLowerCase().includes('cartoon');
        case 'movies':
          return channel.name.toLowerCase().includes('movie') ||
                 channel.name.toLowerCase().includes('film') ||
                 channel.name.toLowerCase().includes('cinema');
        case 'entertainment':
          return channel.name.toLowerCase().includes('entertainment') ||
                 channel.name.toLowerCase().includes('tv') ||
                 channel.name.toLowerCase().includes('show');
        default:
          return true; // For 'all channels' category
      }
    });

    return NextResponse.json(categoryChannels);
  } catch (error) {
    console.error('Error loading category channels:', error);
    return NextResponse.json({ error: 'Failed to load channels' }, { status: 500 });
  }
} 
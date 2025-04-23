import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Define the structure of a Channel based on previous context
interface Channel {
  nanoid: string;
  name: string;
  iptv_urls: string[];
  youtube_urls: string[];
  language: string;
  country: string;
  isGeoBlocked: boolean;
  // Add other potential fields if necessary based on the actual JSON structure
}

// Define the structure of the JSON file content
type AllChannelsData = Channel[];

// Cache the loaded data to avoid reading the large file on every request
let allChannelsCache: AllChannelsData | null = null;
let isLoadingCache = false;

async function getAllChannels(): Promise<AllChannelsData> {
  if (allChannelsCache) {
    return allChannelsCache;
  }
  if (isLoadingCache) {
     // If already loading, wait a bit and retry (simple polling)
     await new Promise(resolve => setTimeout(resolve, 100));
     return getAllChannels(); // Recursive call to check cache again
  }

  isLoadingCache = true;
  try {
    // Construct the path relative to the current file location within the build output
    // Note: Adjust the relative path if needed depending on deployment structure
    const jsonPath = path.join(process.cwd(), 'app', 'categories', 'all channels.json');
    console.log(`Attempting to read channels from: ${jsonPath}`); // Log path for debugging
    const jsonData = await fs.readFile(jsonPath, 'utf-8');
    const data: AllChannelsData = JSON.parse(jsonData);
    allChannelsCache = data; // Store in cache
    console.log(`Successfully loaded and cached ${data.length} channels.`);
    return data;
  } catch (error) {
    console.error('Failed to read or parse all channels.json:', error);
    // Decide on error handling: throw error, return empty array?
    // Returning empty for now to avoid breaking search on file read error
    return []; 
  } finally {
     isLoadingCache = false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query) {
      return NextResponse.json([]); // Return empty array if no query
    }

    const allChannels = await getAllChannels();
    
    if (!Array.isArray(allChannels)) {
        console.error("Cached channel data is not an array.");
        return NextResponse.json({ error: 'Internal server error: Invalid channel data' }, { status: 500 });
    }

    const filteredChannels = allChannels.filter(channel =>
      channel.name.toLowerCase().includes(query)
    );

    // Limit results to avoid excessively large responses? e.g., first 100
    // const limitedResults = filteredChannels.slice(0, 100); 

    return NextResponse.json(filteredChannels);

  } catch (error) {
    console.error('Error in search API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
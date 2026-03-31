import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const jinaApiKey = process.env.JINA_API_KEY;

    if (!jinaApiKey) {
      return NextResponse.json(
        { error: 'JINA_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Read the target page through Jina AI to support client-side rendered pages.
    const jinaUrl = `https://r.jina.ai/${url}`;

    const response = await fetch(jinaUrl, {
      headers: {
        Authorization: `Bearer ${jinaApiKey}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const markdown = await response.text();

    return NextResponse.json({ markdown });
  } catch (error) {
    console.error('Error fetching job URL:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job posting' },
      { status: 500 }
    );
  }
}

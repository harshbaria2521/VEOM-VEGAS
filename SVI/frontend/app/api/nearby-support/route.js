import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'India';
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
      // Graceful fallback when Tavily key is not yet set in .env.local
      return NextResponse.json({
        success: true,
        source: 'government_directory_fallback',
        location,
        results: [
          {
            title: `National Helpline Against Atrocities (NHAA - 14566)`,
            url: 'https://socialjustice.gov.in',
            snippet: `24x7 National toll-free helpline providing immediate legal, social, and psychological assistance for victims across all districts of ${location}.`,
            phone: '14566',
            type: 'Official National Helpline',
          },
          {
            title: `Tele-MANAS National Mental Health Programme (${location})`,
            url: 'https://telemanas.mohfw.gov.in',
            snippet: `Government of India 24/7 mental health tele-counselling network with regional language support available across ${location}.`,
            phone: '14416 / 1800-891-4416',
            type: 'Psychological Support',
          },
          {
            title: `District Legal Services Authority (DLSA) - ${location}`,
            url: 'https://nalsa.gov.in',
            snippet: `Free legal aid and victim compensation facilitation under Legal Services Authorities Act for complainants in ${location}.`,
            phone: '15100',
            type: 'Legal Aid & Protection',
          },
        ],
      });
    }

    // Call Tavily Search API server-side
    const query = `mental health counselling centre NGO victim support crisis helpline ${location} India`;
    const tavilyResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'basic',
        include_answer: true,
        max_results: 5,
      }),
    });

    if (!tavilyResponse.ok) {
      throw new Error(`Tavily API responded with status ${tavilyResponse.status}`);
    }

    const data = await tavilyResponse.json();

    const formattedResults = (data.results || []).map((item) => ({
      title: item.title,
      url: item.url,
      snippet: item.content,
      score: item.score,
      type: 'Local Community / NGO Resource',
    }));

    return NextResponse.json({
      success: true,
      source: 'tavily_search',
      answer: data.answer || null,
      location,
      results: formattedResults.length > 0 ? formattedResults : [
        {
          title: `NHAA 24/7 Helpline - ${location}`,
          url: 'https://socialjustice.gov.in',
          snippet: 'Toll-free 14566 immediate assistance for victims across India.',
          phone: '14566',
          type: 'Government Helpline'
        }
      ],
    });
  } catch (error) {
    console.error('Server error in nearby-support route:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch live search results. Showing verified helplines.',
      results: [
        {
          title: 'NHAA 24x7 Helpline (14566)',
          url: 'https://socialjustice.gov.in',
          snippet: 'Immediate victim assistance, protection, and counselling helpline.',
          phone: '14566',
          type: 'National Helpline',
        },
        {
          title: 'Tele-MANAS (14416)',
          url: 'https://telemanas.mohfw.gov.in',
          snippet: 'Free 24/7 multi-lingual psychological counselling.',
          phone: '14416',
          type: 'Mental Health Support',
        },
      ],
    });
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const backendBaseUrl = (
      process.env.SVI_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/$/, '');

    const backendResponse = await fetch(`${backendBaseUrl}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const raw = await backendResponse.text();
    let data;
    try { data = JSON.parse(raw); }
    catch { data = { response: raw }; }

    if (!backendResponse.ok) {
      console.error('[SVI] Backend /ask failed:', backendResponse.status, data);
      return NextResponse.json(
        { error: 'Backend request failed', status: backendResponse.status, details: data },
        { status: 502 }
      );
    }

    if (!data?.response || typeof data.response !== 'string') {
      console.error('[SVI] Invalid /ask response:', data);
      return NextResponse.json(
        { error: 'Backend returned an invalid response' },
        { status: 502 }
      );
    }

    // Return the FastAPI response unchanged.
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[SVI] /api/ask proxy error:', error);
    return NextResponse.json(
      { error: 'Unable to reach the SVI backend', message: error?.message || 'Unknown error' },
      { status: 502 }
    );
  }
}

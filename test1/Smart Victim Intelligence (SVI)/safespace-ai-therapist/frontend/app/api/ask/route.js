import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5500';

    const backendResponse = await fetch(`${backendBaseUrl}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // Server-side fetch with extended timeout
      cache: 'no-store',
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend responded with status ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server-side ask route error:', error);
    return NextResponse.json(
      {
        response:
          "I am here with you. If you are experiencing distress or need immediate assistance, please reach out to the National Helpline (NHAA 14566), Tele-MANAS (14416), or 112 directly.",
        tool_called: "None",
      },
      { status: 200 }
    );
  }
}

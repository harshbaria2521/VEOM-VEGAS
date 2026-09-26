import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'svi_session_id';

export async function POST(request) {
  let body = null;

  try {
    body = await request.json();

    const backendBaseUrl = (
      process.env.SVI_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://127.0.0.1:8000'
    ).replace(/\/$/, '');

    // Keep the conversation session isolated per browser. The cookie is
    // HttpOnly, so the session identifier is not exposed to page JavaScript.
    const existingSessionId = request.cookies.get(SESSION_COOKIE)?.value;
    const sessionId = existingSessionId || crypto.randomUUID();

    const backendPayload = {
      ...body,
      session_id: sessionId,
    };

    const backendResponse = await fetch(`${backendBaseUrl}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(backendPayload),
      cache: 'no-store',
    });

    const raw = await backendResponse.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      data = { response: raw };
    }

    if (!backendResponse.ok) {
      console.error('[SVI] Backend /ask failed:', backendResponse.status, data);
      return NextResponse.json(
        {
          error: 'Backend request failed',
          status: backendResponse.status,
          details: data,
        },
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

    const response = NextResponse.json(
      { ...data, session_id: sessionId },
      { status: 200 }
    );

    // Session cookie lasts for the browser session. Secure is enabled in
    // production (HTTPS) but remains false for local http://localhost work.
    response.cookies.set({
      name: SESSION_COOKIE,
      value: sessionId,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[SVI] /api/ask proxy error:', error);

    return NextResponse.json(
      {
        error: 'Unable to reach the SVI backend',
        message: error?.message || 'Unknown error',
      },
      { status: 502 }
    );
  }
}

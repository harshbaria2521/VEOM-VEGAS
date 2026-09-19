import { NextResponse } from 'next/server';

export async function POST(request) {
  let body = null;
  try {
    body = await request.json();
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
    let fallbackText = "I am here with you. If you are experiencing distress or need immediate assistance, please reach out to the National Helpline (NHAA 14566), Tele-MANAS (14416), or 112 directly.";
    try {
      if (body?.lang_code === 'hi') {
        fallbackText = "मैं आपकी सहायता के लिए यहाँ उपस्थित हूँ। यदि आप अत्यधिक संकट में हैं या तत्काल सहायता की आवश्यकता है, तो कृपया सीधे 112 या राष्ट्रीय हेल्पलाइन 14566 / टेली-मानस 14416 पर संपर्क करें।";
      } else if (body?.lang_code === 'gu') {
        fallbackText = "હું આપની સાથે છું. આપત્કાલીન સહાય માટે કૃપા કરીને રાષ્ટ્રીય હેલ્પલાઇન 14566 અથવા 112 પર તરત જ સંપર્ક કરો.";
      } else if (body?.lang_code === 'mr') {
        fallbackText = "मी आपल्या मदतीसाठी येथे उपस्थित आहे. तातडीच्या मदतीसाठी कृपया 112 किंवा राष्ट्रीय हेल्पलाइन 14566 वर संपर्क साधा.";
      }
    } catch (e) {}

    return NextResponse.json(
      {
        response: fallbackText,
        tool_called: "None",
      },
      { status: 200 }
    );
  }
}

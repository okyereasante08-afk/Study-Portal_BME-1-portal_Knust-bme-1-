import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = '8502604375:AAHM6DUR4yVxB7VPXmcXUzr_v4fpUz2Erb8';
const CHAT_ID = '8627616350';

async function sendTelegram(msg: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'Markdown' }),
  }).catch(() => {});
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, studentName, studentID } = body;

    const key = process.env.GROQ_API_KEY;

    // Log to Telegram so you can see what's happening
    await sendTelegram(`🔧 Chat hit\nUser: ${studentName}\nKey present: ${!!key}\nMessages: ${messages?.length}`);

    if (!key) {
      return NextResponse.json({ reply: 'API key not configured on server. Contact Kwaku.' });
    }

    const systemPrompt = `You are the BME Portal assistant for KNUST Biomedical Engineering Year 1 (Class of 2029), built by Kwaku Asante Okyere.

TIMETABLE:
Monday: CHEM 151 (10:30-12:25, PB212), ENGL 157 (17:00-17:55, ENG AUDIT)
Tuesday: COE 153 Lab (08:00-14:55, LAB), COE 181 (17:00-19:00, VSLA)
Wednesday: MATH 151 A (08:00-09:55, VSLA), COE 181 (13:00-13:55, Room 303)
Thursday: ME 161 (08:00-09:55, A110), MATH 151 B (13:00-14:55, PB020), BME 161 (15:00-16:55, PB008)
Friday: COE 153 Lab (10:30-12:25 and 13:00-14:55, LAB)

COURSES: MATH 151 (4cr), BME 161 (3cr), EE 151 (3cr), ME 161 (3cr), CHEM 151 (2cr), COE 153 (2cr), ENGL 157 (2cr)
CWA = sum(score x credits) / sum(credits)
Current user: ${studentName} (${studentID})
Semester ends: April 7 2026

Be friendly, helpful, concise. Use KNUST context.`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 600,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    const groqText = await groqRes.text();

    if (!groqRes.ok) {
      await sendTelegram(`❌ Groq error ${groqRes.status}: ${groqText.slice(0, 200)}`);
      return NextResponse.json({ reply: `AI error (${groqRes.status}). Kwaku has been notified.` });
    }

    const data = JSON.parse(groqText);
    const reply = data.choices?.[0]?.message?.content || 'No response from AI.';
    return NextResponse.json({ reply });

  } catch (err: any) {
    await sendTelegram(`💥 Route crash: ${err?.message || String(err)}`);
    return NextResponse.json({ reply: `Server error: ${err?.message || 'unknown'}. Kwaku has been notified.` });
  }
}

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
Monday: PHY 154 (13:00-14:55, Room G01), ENGL 158 (15:00-16:55, Eng. Audit)
Tuesday: SOC 152 (08:00-09:55, PB012), COE 152 (10:30-12:25, PB020), BME 166 (13:00-14:55, PB020)
Wednesday: MATH 152 A (08:00-09:55, NEB-GF)
Thursday: MATH 152 B (13:00-14:55, NEB-FF1)
Friday: ME 166 (08:00-09:55, NEB-FF2), COE 152 Lab (10:30-11:25, Lab)

COURSES: MATH 152 (4cr), COE 152 (3cr), BME 166 (3cr), PHY 154 (3cr), ME 166 (2cr), ENGL 158 (2cr), SOC 152 (2cr)
Total credit hours: 19

LECTURERS: PHY 154 - R. M. Noye, ENGL 158 - Z. Osei, SOC 152 - O. K. J. R. Kwabena, COE 152 - D. A. Addo, BME 166 - C. Apprey, MATH 152 - J. K. K. Asamoah, ME 166 - K. O. Amoabeng

CWA = sum(score x credits) / sum(credits)
Current user: ${studentName} (${studentID})

SEMESTER 2 ACADEMIC CALENDAR (2025/2026):
- Online Course Registration: May 18 - June 19, 2026
- Students Arrive: May 23, 2026
- Teaching Period: May 25 - August 14, 2026
- Lectures Start: May 25, 2026
- Biometric Registration: May 25 - June 19, 2026
- Departmental Board (Sem 1 Results): May 27-29, 2026
- Faculty Board (Sem 1 Results): June 1-5, 2026
- Auditing of Sem 1 Exam Results: June 8 - June 23, 2026
- College Boards (Sem 1 Results): June 15-26, 2026
- SGS Board Postgrad Results: July 2, 2026
- Mid-Semester Examinations: July 6-10, 2026
- Academic Board (Sem 1 Results): July 14-15, 2026
- Assessment of Lecturers by Students: August 10-14, 2026
- Second Semester Examinations: August 17 - September 4, 2026
- Students Depart: September 5, 2026
- NO SUPPLEMENTARY EXAMINATIONS FOR 2025/2026

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

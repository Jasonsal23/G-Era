import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const DISCOUNT_CODE = 'GERA10';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'G.Era <hello@g-era.com>',
      to: email,
      subject: 'Your 10% Off Code — Welcome to the G.Era',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background:#ffffff;font-family:monospace;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;padding:40px 24px;">
              <tr>
                <td>
                  <!-- Header -->
                  <h1 style="font-size:32px;font-weight:900;text-transform:uppercase;letter-spacing:-1px;margin:0 0 8px 0;color:#000000;">
                    G.ERA
                  </h1>
                  <p style="font-size:11px;text-transform:uppercase;letter-spacing:4px;color:#888888;margin:0 0 40px 0;font-family:monospace;">
                    Street Luxe. No Apologies.
                  </p>

                  <!-- Welcome -->
                  <p style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 24px 0;font-family:monospace;">
                    Welcome to the G.Era. You're in now — and to celebrate, here's your exclusive discount code:
                  </p>

                  <!-- Code Block -->
                  <div style="background:#000000;padding:24px;text-align:center;margin:0 0 24px 0;">
                    <p style="font-size:11px;text-transform:uppercase;letter-spacing:4px;color:#888888;margin:0 0 8px 0;font-family:monospace;">
                      Your code
                    </p>
                    <p style="font-size:32px;font-weight:900;letter-spacing:8px;color:#D4AF37;margin:0;font-family:monospace;">
                      ${DISCOUNT_CODE}
                    </p>
                    <p style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#888888;margin:8px 0 0 0;font-family:monospace;">
                      10% off your first order
                    </p>
                  </div>

                  <!-- CTA -->
                  <div style="text-align:center;margin:0 0 32px 0;">
                    <a href="https://g-era.com/shop" style="display:inline-block;background:#D4AF37;color:#000000;font-family:monospace;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:4px;padding:16px 32px;text-decoration:none;">
                      Shop Now
                    </a>
                  </div>

                  <!-- Footer -->
                  <p style="font-size:11px;color:#aaaaaa;font-family:monospace;text-align:center;line-height:1.6;margin:0;">
                    Enter the code at checkout. One use per customer.<br/>
                    Questions? <a href="mailto:g.erabrand21@gmail.com" style="color:#D4AF37;">g.erabrand21@gmail.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

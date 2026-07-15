/**
 * Server-backed Brevo email functions.
 * API key stays on the server (Vercel env vars) — never exposed to the browser.
 */

const API_ENDPOINT = '/api/brevo/send-email';

/**
 * Sends OTP verification email
 */
export async function sendBrevoOtp(toEmail, otpCode, userName) {
  const firstName = userName ? userName.split(' ')[0] : '';

  const subject = "Your Gurnaaz Verification Code";
  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:50px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td align="center" style="padding:40px 0 20px;">
          <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:32px;color:#C9A96E;letter-spacing:8px;margin:0;font-weight:300;">GURNAAZ</h1>
        </td></tr>
        <tr><td align="center" style="padding:0 0 40px;">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td width="80" height="1" style="background-color:#C9A96E;opacity:0.3;"></td>
            <td width="20"></td>
            <td width="8" height="8" style="border:1px solid #C9A96E;opacity:0.4;transform:rotate(45deg);"></td>
            <td width="20"></td>
            <td width="80" height="1" style="background-color:#C9A96E;opacity:0.3;"></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:0 30px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#141414 0%,#0f0f0f 100%);border:1px solid rgba(201,169,110,0.12);">
            <tr><td style="padding:60px 50px;text-align:center;">
              <p style="font-size:11px;color:#C9A96E;letter-spacing:5px;text-transform:uppercase;margin:0 0 30px;font-weight:500;">Verify Your Email</p>
              <h2 style="font-family:Georgia,serif;font-size:24px;color:#fff;margin:0 0 10px;font-weight:300;">
                ${firstName ? 'Dear ' + firstName + ', one step' : 'One step'} away from
              </h2>
              <h1 style="font-family:Georgia,serif;font-size:42px;color:#C9A96E;margin:0 0 35px;font-weight:300;letter-spacing:2px;">Gurnaaz</h1>
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 35px;"><tr>
                <td width="30" height="1" style="background-color:#C9A96E;opacity:0.25;"></td>
                <td width="8"></td>
                <td width="4" height="4" style="border:1px solid #C9A96E;opacity:0.35;"></td>
                <td width="8"></td>
                <td width="30" height="1" style="background-color:#C9A96E;opacity:0.25;"></td>
              </tr></table>
              <p style="font-size:15px;color:#999;line-height:1.8;margin:0 0 30px;font-weight:300;">
                Enter this code to verify your email and secure your spot on the waitlist.
              </p>
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 30px;"><tr>
                <td style="background-color:#0a0a0a;border:2px solid rgba(201,169,110,0.25);padding:20px 40px;">
                  <p style="font-size:36px;font-weight:bold;text-align:center;letter-spacing:12px;color:#C9A96E;margin:0;font-family:Georgia,serif;">${otpCode}</p>
                </td>
              </tr></table>
              <p style="font-size:12px;color:#666;margin:0 0 8px;">This code is valid for <span style="color:#C9A96E;">10 minutes</span></p>
              <p style="font-size:11px;color:#444;margin:0;">If you didn't request this, simply ignore this email.</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:40px 30px 20px;">
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;"><tr>
            <td width="40" height="1" style="background-color:#C9A96E;opacity:0.2;"></td>
            <td width="12"></td>
            <td width="4" height="4" style="border:1px solid #C9A96E;opacity:0.25;"></td>
            <td width="12"></td>
            <td width="40" height="1" style="background-color:#C9A96E;opacity:0.2;"></td>
          </tr></table>
          <p style="font-size:9px;color:#333;margin:0;line-height:1.8;">This code was sent to ${toEmail}<br>because you're joining the Gurnaaz waitlist.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail, subject, htmlContent })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send OTP');

    console.log("OTP email sent successfully to:", toEmail);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    return false;
  }
}

/**
 * Sends welcome email after successful waitlist join
 */
export async function sendWaitlistWelcomeEmail(toEmail, userName) {
  const firstName = userName ? userName.split(' ')[0] : '';

  const subject = `${firstName ? firstName + ', ' : ''}Welcome to Gurnaaz — You're On The List`;
  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:50px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td align="center" style="padding:40px 0 20px;">
          <h1 style="font-family:Georgia,serif;font-size:32px;color:#C9A96E;letter-spacing:8px;margin:0;font-weight:300;">GURNAAZ</h1>
        </td></tr>
        <tr><td align="center" style="padding:0 0 40px;">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td width="80" height="1" style="background-color:#C9A96E;opacity:0.3;"></td>
            <td width="20"></td>
            <td width="8" height="8" style="border:1px solid #C9A96E;opacity:0.4;transform:rotate(45deg);"></td>
            <td width="20"></td>
            <td width="80" height="1" style="background-color:#C9A96E;opacity:0.3;"></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:0 30px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#141414 0%,#0f0f0f 100%);border:1px solid rgba(201,169,110,0.12);">
            <tr><td style="padding:60px 50px;text-align:center;">
              <p style="font-size:11px;color:#C9A96E;letter-spacing:5px;text-transform:uppercase;margin:0 0 25px;font-weight:500;">Welcome to the family</p>
              <h2 style="font-family:Georgia,serif;font-size:28px;color:#fff;margin:0 0 5px;font-weight:300;">${firstName ? 'Dear ' + firstName + ',' : 'Dear Guest,'}</h2>
              <h1 style="font-family:Georgia,serif;font-size:48px;color:#C9A96E;margin:0 0 35px;font-weight:300;letter-spacing:3px;">You're In</h1>
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 35px;"><tr>
                <td width="30" height="1" style="background-color:#C9A96E;opacity:0.25;"></td>
                <td width="8"></td>
                <td width="4" height="4" style="border:1px solid #C9A96E;opacity:0.35;"></td>
                <td width="8"></td>
                <td width="30" height="1" style="background-color:#C9A96E;opacity:0.25;"></td>
              </tr></table>
              <p style="font-size:15px;color:#999;line-height:1.9;margin:0 0 15px;font-weight:300;">
                You've just unlocked early access to something extraordinary.
              </p>
              <p style="font-size:15px;color:#999;line-height:1.9;margin:0 0 40px;font-weight:300;">
                Our handcrafted collection is almost ready. ${firstName ? 'As one of our first members, this was made with someone like you in mind.' : ''}
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border:1px solid rgba(201,169,110,0.08);margin:0 0 40px;">
                <tr><td style="padding:30px 35px;">
                  <p style="font-size:9px;color:#C9A96E;letter-spacing:5px;text-transform:uppercase;margin:0 0 20px;font-weight:600;">Your Exclusive Perks</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr><td style="padding:8px 0;border-bottom:1px solid rgba(201,169,110,0.06);"><table cellpadding="0" cellspacing="0" border="0"><tr><td width="25" valign="top" style="color:#C9A96E;font-size:12px;">&#10022;</td><td style="color:#ccc;font-size:13px;font-weight:300;line-height:1.6;">First access to the full collection</td></tr></table></td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid rgba(201,169,110,0.06);"><table cellpadding="0" cellspacing="0" border="0"><tr><td width="25" valign="top" style="color:#C9A96E;font-size:12px;">&#10022;</td><td style="color:#ccc;font-size:13px;font-weight:300;line-height:1.6;">Exclusive launch-day pricing</td></tr></table></td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid rgba(201,169,110,0.06);"><table cellpadding="0" cellspacing="0" border="0"><tr><td width="25" valign="top" style="color:#C9A96E;font-size:12px;">&#10022;</td><td style="color:#ccc;font-size:13px;font-weight:300;line-height:1.6;">Priority on limited-edition pieces</td></tr></table></td></tr>
                    <tr><td style="padding:8px 0;"><table cellpadding="0" cellspacing="0" border="0"><tr><td width="25" valign="top" style="color:#C9A96E;font-size:12px;">&#10022;</td><td style="color:#ccc;font-size:13px;font-weight:300;line-height:1.6;">A handwritten thank-you with your first order</td></tr></table></td></tr>
                  </table>
                </td></tr>
              </table>
              <p style="font-family:Georgia,serif;font-size:16px;color:#666;line-height:1.8;margin:0;font-style:italic;">
                "Every thread tells a story.<br>Every stitch holds a tradition."
              </p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:40px 30px 20px;">
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 25px;"><tr>
            <td width="40" height="1" style="background-color:#C9A96E;opacity:0.2;"></td>
            <td width="12"></td>
            <td width="4" height="4" style="border:1px solid #C9A96E;opacity:0.25;"></td>
            <td width="12"></td>
            <td width="40" height="1" style="background-color:#C9A96E;opacity:0.2;"></td>
          </tr></table>
          <p style="font-size:11px;color:#555;margin:0 0 10px;letter-spacing:2px;">With love & craftsmanship,</p>
          <p style="font-size:14px;color:#C9A96E;margin:0 0 25px;letter-spacing:4px;">THE GURNAAZ FAMILY</p>
          <p style="font-size:9px;color:#333;margin:0;line-height:1.8;">This email was sent to ${toEmail}<br>because you joined the Gurnaaz waitlist.<br>No spam, ever.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toEmail, subject, htmlContent })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send welcome email');

    console.log("Welcome email sent successfully to:", toEmail);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
    return false;
  }
}

/**
 * Generates a 6-digit OTP code
 */
export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

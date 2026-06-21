export const verificationMailTemplate = (otp: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Snitch Verification Code</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial, Helvetica, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; margin:0; padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:10px;">
              <tr>
                <td style="padding:32px 24px 12px 24px;">
                  <p style="margin:0; font-size:14px; line-height:20px; color:#6b7280; font-weight:600;">
                    Snitch
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 24px 8px 24px;">
                  <h1 style="margin:0; font-size:24px; line-height:32px; color:#111827;">
                    Verify your email
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding:0 24px 16px 24px;">
                  <p style="margin:0; font-size:16px; line-height:24px; color:#374151;">
                    Use the verification code below to continue.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:8px 24px 24px 24px;">
                  <div style="text-align:center; background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:18px 20px;">
                    <span style="display:inline-block; font-size:30px; line-height:36px; font-weight:700; letter-spacing:6px; color:#111827;">
                      ${otp}
                    </span>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:0 24px 12px 24px;">
                  <p style="margin:0; font-size:14px; line-height:22px; color:#6b7280;">
                    This code will expire in 10 minutes.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 24px 32px 24px;">
                  <p style="margin:0; font-size:14px; line-height:22px; color:#6b7280;">
                    If you didn’t request this, you can ignore this email.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:16px 24px; border-top:1px solid #e5e7eb;">
                  <p style="margin:0; font-size:12px; line-height:18px; color:#9ca3af; text-align:center;">
                    Sent by Snitch
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

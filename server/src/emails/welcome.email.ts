export const welcomeEmail = (userName: string) => {
  const safeName = String(userName).replace(/[<>&"'`]/g, '');

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to Snitch</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; background-color:#f3f4f6; margin:0; padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
              
              <tr>
                <td style="padding:28px 32px 12px 32px; background-color:#ffffff;">
                  <p style="margin:0; font-size:13px; line-height:20px; color:#6b7280; font-weight:700; letter-spacing:0.5px; text-transform:uppercase;">
                    Snitch
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 10px 32px;">
                  <h1 style="margin:0; font-size:30px; line-height:38px; color:#111827; font-weight:700;">
                    Welcome aboard, ${safeName}
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 18px 32px;">
                  <p style="margin:0; font-size:16px; line-height:26px; color:#4b5563;">
                    Thanks for joining Snitch. Your account is ready, and you can now start exploring everything from your dashboard.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 18px 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:10px;">
                    <tr>
                      <td style="padding:18px 20px;">
                        <p style="margin:0 0 8px 0; font-size:15px; line-height:22px; color:#111827; font-weight:600;">
                          What you can do next
                        </p>
                        <p style="margin:0; font-size:14px; line-height:22px; color:#6b7280;">
                          Complete your profile, explore the dashboard, and get started with your first action inside Snitch.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:6px 32px 28px 32px;">
                  <a
                    href="https://snitch.nickdstudio.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="display:inline-block; background-color:#111827; color:#ffffff; text-decoration:none; font-size:14px; line-height:20px; font-weight:600; padding:13px 22px; border-radius:8px;"
                  >
                    Go to Dashboard
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 26px 32px;">
                  <p style="margin:0; font-size:14px; line-height:22px; color:#6b7280;">
                    Need help getting started? Just reply to this email and our team will be there for you.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:18px 32px; border-top:1px solid #e5e7eb; background-color:#fcfcfd;">
                  <p style="margin:0; font-size:12px; line-height:18px; color:#9ca3af; text-align:center;">
                    You received this email because you created a Snitch account.
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

/**
 * Helper templates for sending beautiful, responsive, theme-consistent dark mode emails.
 * Uses the portfolio design system: Crimson Red (#E63925) highlights, deep charcoal/black backgrounds,
 * clean typography, and elegant structured cards.
 */

interface ContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  ip: string;
}

interface VisitEmailParams {
  ip: string;
  locationString: string;
  referrer: string;
  language: string;
  screenResolution: string;
  userAgent: string;
  geoInfo: {
    country?: string;
    countryCode?: string;
    regionName?: string;
    city?: string;
    timezone?: string;
    isp?: string;
    org?: string;
    lat?: number;
    lon?: number;
  } | null;
}

/**
 * Renders a premium dark-theme email template for Contact Form submissions.
 */
export const renderContactEmail = ({ name, email, subject, message, ip }: ContactEmailParams): string => {
  const cleanMessage = message.replace(/\n/g, "<br/>");
  const dateStr = new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Portfolio Message</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #0A0A0A;
            color: #E4E4E7;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #0F0F0F;
            border: 1px solid #27272A;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .header {
            padding: 30px;
            background: linear-gradient(135deg, #18181B 0%, #0F0F0F 100%);
            border-bottom: 2px solid #E63925;
            text-align: left;
          }
          .header-accent {
            display: inline-block;
            width: 16px;
            height: 3px;
            background-color: #E63925;
            margin-bottom: 10px;
          }
          .header-title {
            margin: 0;
            color: #FFFFFF;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          .content {
            padding: 30px;
          }
          .meta-grid {
            margin-bottom: 25px;
            border-bottom: 1px solid #27272A;
            padding-bottom: 20px;
          }
          .meta-row {
            display: flex;
            margin-bottom: 10px;
            font-size: 13px;
          }
          .meta-label {
            width: 100px;
            color: #71717A;
            font-weight: 600;
            text-transform: uppercase;
            font-family: monospace;
          }
          .meta-val {
            color: #FFFFFF;
            font-weight: 500;
          }
          .meta-val a {
            color: #E63925;
            text-decoration: none;
          }
          .message-card {
            background-color: #18181B;
            border-left: 4px solid #E63925;
            border-radius: 4px;
            padding: 20px;
            margin-top: 20px;
          }
          .message-title {
            margin: 0 0 10px 0;
            font-size: 11px;
            color: #E63925;
            font-family: monospace;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: bold;
          }
          .message-text {
            margin: 0;
            font-size: 14px;
            line-height: 1.6;
            color: #E4E4E7;
            white-space: pre-wrap;
          }
          .footer {
            background-color: #0A0A0A;
            padding: 20px 30px;
            border-top: 1px solid #27272A;
            text-align: center;
            font-size: 11px;
            color: #52525B;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-accent"></div>
            <h1 class="header-title">✉️ Message Received</h1>
          </div>
          <div class="content">
            <div class="meta-grid">
              <div class="meta-row">
                <span class="meta-label">Sender:</span>
                <span class="meta-val">${name}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Email:</span>
                <span class="meta-val"><a href="mailto:${email}">${email}</a></span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Subject:</span>
                <span class="meta-val" style="color: #F4F4F5;">${subject}</span>
              </div>
            </div>
            
            <div class="message-card">
              <div class="message-title">Message Body</div>
              <p class="message-text">${cleanMessage}</p>
            </div>
          </div>
          <div class="footer">
            Sent automatically via Portfolio CMS Server.<br>
            Timestamp: ${dateStr} | IP: ${ip}
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Renders a detailed, beautiful template for Visitor notifications.
 */
export const renderVisitEmail = ({
  ip,
  locationString,
  referrer,
  language,
  screenResolution,
  userAgent,
  geoInfo,
}: VisitEmailParams): string => {
  const dateStr = new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC";
  
  const geoSection = geoInfo
    ? `
      <div class="meta-row"><span class="meta-label">Country</span><span class="meta-val">${geoInfo.country || "N/A"} (${geoInfo.countryCode || "N/A"})</span></div>
      <div class="meta-row"><span class="meta-label">Region</span><span class="meta-val">${geoInfo.regionName || "N/A"}</span></div>
      <div class="meta-row"><span class="meta-label">City</span><span class="meta-val">${geoInfo.city || "N/A"}</span></div>
      <div class="meta-row"><span class="meta-label">Timezone</span><span class="meta-val">${geoInfo.timezone || "N/A"}</span></div>
      <div class="meta-row"><span class="meta-label">ISP</span><span class="meta-val">${geoInfo.isp || "N/A"}</span></div>
      <div class="meta-row"><span class="meta-label">Organization</span><span class="meta-val">${geoInfo.org || "N/A"}</span></div>
      ${geoInfo.lat && geoInfo.lon ? `
        <div class="meta-row">
          <span class="meta-label">Location</span>
          <span class="meta-val">
            <a href="https://www.google.com/maps/search/?api=1&query=${geoInfo.lat},${geoInfo.lon}" target="_blank" style="color: #E63925; text-decoration: underline;">
              ${geoInfo.lat}, ${geoInfo.lon} ↗
            </a>
          </span>
        </div>
      ` : ""}
    `
    : `
      <div style="color: #71717A; font-style: italic; font-size: 13px;">
        No detailed geolocation details available (Local IP or Geo-IP API down).
      </div>
    `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Visitor Notification</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #0A0A0A;
            color: #E4E4E7;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #0F0F0F;
            border: 1px solid #27272A;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .header {
            padding: 30px;
            background: linear-gradient(135deg, #18181B 0%, #0F0F0F 100%);
            border-bottom: 2px solid #E63925;
            text-align: left;
          }
          .header-accent {
            display: inline-block;
            width: 16px;
            height: 3px;
            background-color: #E63925;
            margin-bottom: 10px;
          }
          .header-title {
            margin: 0;
            color: #FFFFFF;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          .content {
            padding: 30px;
          }
          .section-title {
            font-size: 11px;
            color: #E63925;
            font-family: monospace;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: bold;
            margin: 20px 0 10px 0;
            border-bottom: 1px solid #27272A;
            padding-bottom: 5px;
          }
          .meta-grid {
            margin-bottom: 20px;
          }
          .meta-row {
            display: flex;
            margin-bottom: 8px;
            font-size: 13px;
            align-items: center;
          }
          .meta-label {
            width: 130px;
            color: #71717A;
            font-weight: 600;
            text-transform: uppercase;
            font-family: monospace;
            font-size: 11px;
          }
          .meta-val {
            color: #FFFFFF;
            font-weight: 500;
          }
          .footer {
            background-color: #0A0A0A;
            padding: 20px 30px;
            border-top: 1px solid #27272A;
            text-align: center;
            font-size: 11px;
            color: #52525B;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-accent"></div>
            <h1 class="header-title">🌐 Visitor Logged</h1>
          </div>
          <div class="content">
            
            <div class="section-title">📍 Geolocation & ISP</div>
            <div class="meta-grid">
              ${geoSection}
            </div>

            <div class="section-title">💻 Technical Metrics</div>
            <div class="meta-grid">
              <div class="meta-row"><span class="meta-label">IP Address</span><span class="meta-val" style="font-family: monospace;">${ip}</span></div>
              <div class="meta-row"><span class="meta-label">Referrer</span><span class="meta-val" style="color: #F59E0B;">${referrer || "Direct / Bookmark"}</span></div>
              <div class="meta-row"><span class="meta-label">Language</span><span class="meta-val">${language || "N/A"}</span></div>
              <div class="meta-row"><span class="meta-label">Resolution</span><span class="meta-val">${screenResolution || "N/A"}</span></div>
              <div class="meta-row" style="align-items: flex-start;">
                <span class="meta-label">User Agent</span>
                <span class="meta-val" style="font-size: 12px; color: #A1A1AA; line-height: 1.4;">${userAgent}</span>
              </div>
            </div>

          </div>
          <div class="footer">
            Logged & reported via Portfolio CMS Server.<br>
            Timestamp: ${dateStr}
          </div>
        </div>
      </body>
    </html>
  `;
};

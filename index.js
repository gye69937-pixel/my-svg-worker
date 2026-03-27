export default {
  async fetch(request, env, ctx) {
    const { searchParams } = new URL(request.url);

    // Get parameters
    const layout = searchParams.get('layout') || 'alert';
    const title = searchParams.get('title') || 'Notification';
    const content = searchParams.get('content') || '';
    const sub = searchParams.get('sub') || '';
    const color = searchParams.get('color') || '6366f1'; // Default Indigo

    let svgBody = '';
    let height = 200;
    const width = 450;

    // Layout Logic
    if (layout === 'alert') {
      height = 160;
      svgBody = `
        <rect width="100%" height="100%" rx="16" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
        <rect width="6" height="100%" rx="3" fill="#${color}" x="0" y="0"/>
        <text x="30" y="45" font-family="sans-serif" font-size="18" font-weight="bold" fill="#111827">${title}</text>
        <foreignObject x="30" y="65" width="390" height="80">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-size:14px; color:#4b5563; line-height:1.5; word-wrap:break-word;">
            ${content.replace(/\n/g, '<br/>')}
          </div>
        </foreignObject>
      `;
    } else if (layout === 'profile') {
      height = 180;
      svgBody = `
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#${color};stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#${color};stop-opacity:0.02" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" rx="24" fill="url(#grad)" stroke="#${color}" stroke-opacity="0.2" stroke-width="1"/>
        <circle cx="60" cy="60" r="30" fill="#${color}"/>
        <text x="60" y="68" font-family="sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">${title.charAt(0)}</text>
        <text x="110" y="55" font-family="sans-serif" font-size="20" font-weight="bold" fill="#111827">${title}</text>
        <text x="110" y="75" font-family="sans-serif" font-size="13" font-weight="600" fill="#${color}">${sub}</text>
        <foreignObject x="40" y="105" width="370" height="60">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-size:14px; color:#374151; line-height:1.4; font-style:italic;">
            "${content.replace(/\n/g, '<br/>')}"
          </div>
        </foreignObject>
      `;
    } else if (layout === 'stats') {
      height = 220;
      const statsList = content.split(',').map(s => s.trim());
      let statsHtml = statsList.map(s => `<div style="background:#f9fafb; padding:8px 12px; border-radius:8px; margin-bottom:6px; border-left:4px solid #${color}; font-weight:500;">${s}</div>`).join('');
      
      svgBody = `
        <rect width="100%" height="100%" rx="12" fill="#111827"/>
        <text x="25" y="40" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" opacity="0.9">${title}</text>
        <foreignObject x="25" y="60" width="400" height="140">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:sans-serif; font-size:13px; color:#e5e7eb;">
            ${statsHtml}
          </div>
        </foreignObject>
      `;
    }

    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${svgBody}
      </svg>
    `;

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
};

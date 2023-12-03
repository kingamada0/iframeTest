const https = require('https');

module.exports = async (req, res) => {
    const baseDomain = 'https://lordne.vercel.app';
    let targetUrl = baseDomain;

    // Determine if the request is for the main HTML, a JS, or a CSS file
    if (req.url.endsWith('.js')) {
        targetUrl += '/path/to/your/javascript.js'; // Adjust the path
    } else if (req.url.endsWith('.css')) {
        targetUrl += '/path/to/your/styles.css'; // Adjust the path
    }

    https.get(targetUrl, (response) => {
        let rawData = '';

        response.on('data', (chunk) => {
            rawData += chunk;
        });

        response.on('end', () => {
            try {
                if (req.url.endsWith('.js')) {
                    // Serve JavaScript with correct content type
                    res.setHeader('Content-Type', 'application/javascript');
                    res.status(200).send(rawData);
                } else if (req.url.endsWith('.css')) {
                    // Serve CSS with correct content type
                    res.setHeader('Content-Type', 'text/css');
                    res.status(200).send(rawData);
                } else {
                    // Process and modify HTML content
                    rawData = modifyHtml(rawData, baseDomain);
                    res.status(200).send(rawData);
                }
            } catch (error) {
                console.error('Error:', error);
                res.status(500).send('Error processing request.');
            }
        });
    }).on('error', (e) => {
        res.status(500).send('Error fetching URL: ' + e.message);
    });
};

function modifyHtml(html, baseDomain) {
    // Modify HTML here as needed
    // For example, updating asset URLs to be served via this serverless function
    html = html.replace(/href="\/path\/to\/your\/(.*?)\.css"/g, `href="${baseDomain}/$1.css"`);
    html = html.replace(/src="\/path\/to\/your\/(.*?)\.js"/g, `src="${baseDomain}/$1.js"`);
    return html;
}

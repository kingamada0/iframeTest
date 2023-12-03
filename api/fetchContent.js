const https = require('https');

module.exports = async (req, res) => {
    // Determine the target URL based on the request
    let targetUrl = 'https://lordne.vercel.app';
    if (req.url.includes('.css') || req.url.includes('.js')) {
        targetUrl += req.url; // For CSS/JS files
    }

    https.get(targetUrl, (response) => {
        let contentType = response.headers['content-type'];
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            // Set the appropriate content type for the response
            res.setHeader('Content-Type', contentType);

            // If it's the HTML page, modify it as needed
            if (!req.url.includes('.css') && !req.url.includes('.js')) {
                data = modifyHtml(data);
            }
            
            res.status(200).send(data);
        });
    }).on('error', (e) => {
        res.status(500).send('Error: ' + e.message);
    });
};

function modifyHtml(html) {
    // Modify the HTML content as needed, e.g., updating asset URLs
    // This is where you would implement your HTML modification logic
    return html;
}

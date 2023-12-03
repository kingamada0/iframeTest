const https = require('https');

module.exports = async (req, res) => {
    let targetUrl;

    // Check if the request is for the HTML page or the JS file
    if (req.url.includes('/script.js')) {
        targetUrl = 'https://lordne.vercel.app/script.js';  // Path to the original JS file
    } else {
        targetUrl = 'https://lordne.vercel.app/';  // Path to the original HTML page
    }

    https.get(targetUrl, (response) => {
        response.setEncoding('utf8');
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            if (req.url.includes('/script.js')) {
                // Set appropriate headers for JavaScript content
                res.setHeader('Content-Type', 'application/javascript');
            }
            res.status(200).send(data);
        });
    }).on('error', (e) => {
        res.status(500).send('Error: ' + e.message);
    });
};

const https = require('https');
const { JSDOM } = require('jsdom');

module.exports = async (req, res) => {
    const baseDomain = 'https://lordne.vercel.app';
    let targetUrl = baseDomain;

    // Check if the request is for a specific asset like a JS file
    if (req.url.includes('/script.js')) {
        targetUrl += '/script.js';  // Append the specific script's path
    }

    https.get(targetUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            if (req.url.includes('/script.js')) {
                // Serve the JS file
                res.setHeader('Content-Type', 'application/javascript');
                res.status(200).send(data);
            } else {
                // Process the HTML content
                const dom = new JSDOM(data);
                const document = dom.window.document;

                // Modify the script src to point to the serverless function
                const scriptElements = document.querySelectorAll('script[src]');
                scriptElements.forEach(script => {
                    const originalSrc = script.getAttribute('src');
                    script.setAttribute('src', `https://lord-test.vercel.app/api/yourFunction${originalSrc}`);
                });

                res.status(200).send(dom.serialize());
            }
        });
    }).on('error', (e) => {
        res.status(500).send('Error: ' + e.message);
    });
};

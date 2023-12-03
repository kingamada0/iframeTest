const https = require('https');
const { JSDOM } = require('jsdom');

module.exports = async (req, res) => {
    const baseDomain = 'https://lordne.vercel.app';
    let targetUrl = baseDomain;

    // Determine whether the request is for the HTML, a JS file, or a CSS file
    if (req.url.endsWith('.js')) {
        targetUrl += req.url;  // Append the script's path
    } else if (req.url.endsWith('.css')) {
        targetUrl += req.url;  // Append the CSS file's path
    }

    https.get(targetUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            if (req.url.endsWith('.js')) {
                // Serve the JS file
                res.setHeader('Content-Type', 'application/javascript');
                res.status(200).send(data);
            } else if (req.url.endsWith('.css')) {
                // Serve the CSS file
                res.setHeader('Content-Type', 'text/css');
                res.status(200).send(data);
            } else {
                // Process the HTML content
                const dom = new JSDOM(data);
                const document = dom.window.document;

                // Modify script src and link href to point to the serverless function
                const assetElements = document.querySelectorAll('script[src], link[rel="stylesheet"][href]');
                assetElements.forEach(el => {
                    if (el.tagName === 'SCRIPT') {
                        const originalSrc = el.getAttribute('src');
                        el.setAttribute('src', `https://lord-test.vercel.app/api/${originalSrc}`);
                    } else if (el.tagName === 'LINK') {
                        const originalHref = el.getAttribute('href');
                        el.setAttribute('href', `https://lord-test.vercel.app/api/${originalHref}`);
                    }
                });

                res.status(200).send(dom.serialize());
            }
        });
    }).on('error', (e) => {
        res.status(500).send('Error: ' + e.message);
    });
};

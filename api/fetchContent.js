const https = require('https');
const { JSDOM } = require('jsdom'); // Ensure JSDOM is installed

module.exports = async (req, res) => {
    const targetUrl = 'https://lordne.vercel.app/';

    https.get(targetUrl, (response) => {
        let rawData = '';

        response.on('data', (chunk) => {
            rawData += chunk;
        });

        response.on('end', () => {
            try {
                const dom = new JSDOM(rawData);
                const document = dom.window.document;

                // Correctly handling base URL for relative paths
                const baseUrl = new URL(targetUrl);

                // Modify relative URLs to absolute in <link>, <script>, and <img> tags
                const elements = document.querySelectorAll('link[href], script[src], img[src]');
                elements.forEach(el => {
                    const attribute = el.tagName === 'LINK' ? 'href' : 'src';
                    let url = el.getAttribute(attribute);

                    // Check if the URL is relative and prepend the base URL
                    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                        el.setAttribute(attribute, new URL(url, baseUrl).href);
                    }
                });

                res.status(200).send(dom.serialize());
            } catch (error) {
                console.error('Error processing HTML:', error);
                res.status(500).send('Error processing HTML.');
            }
        });
    }).on('error', (e) => {
        console.error('Error fetching URL:', e);
        res.status(500).send('Error fetching URL.');
    });
};

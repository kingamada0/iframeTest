const https = require('https');
const { JSDOM } = require('jsdom');  // Ensure JSDOM is installed

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

                // Process all <a>, <link>, <script>, and <img> elements
                const elements = document.querySelectorAll('a[href], link[href], script[src], img[src]');
                elements.forEach(el => {
                    const attr = el.hasAttribute('href') ? 'href' : 'src';
                    let url = el.getAttribute(attr);

                    // Make sure the URL is relative
                    if (url && !url.startsWith('http') && !url.startsWith('//')) {
                        url = new URL(url, targetUrl).href;
                        el.setAttribute(attr, url);
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

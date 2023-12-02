const https = require('https');
const { JSDOM } = require('jsdom');

module.exports = async (req, res) => {
    const targetUrl = 'https://lordne.vercel.app/';

    https.get(targetUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const dom = new JSDOM(data);
                const document = dom.window.document;

                // Append original domain to all relative URLs for link and script tags
                const elements = document.querySelectorAll('link[href], script[src]');
                elements.forEach(element => {
                    const attr = element.tagName === 'LINK' ? 'href' : 'src';
                    const url = element.getAttribute(attr);
                    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                        element.setAttribute(attr, targetUrl + url);
                    }
                });

                const modifiedHtml = dom.serialize();
                res.status(200).send(modifiedHtml);
            } catch (error) {
                res.status(500).send('Error processing HTML: ' + error.message);
            }
        });
    }).on('error', (e) => {
        res.status(500).send('Error: ' + e.message);
    });
};

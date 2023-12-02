const https = require('https');
const { JSDOM } = require('jsdom'); // Ensure JSDOM is included in your dependencies

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

                // Function to check if a URL is absolute
                const isAbsoluteURL = (url) => /^(?:[a-z]+:)?\/\//i.test(url);

                // Update href/src attributes
                document.querySelectorAll('link[href], script[src], img[src]').forEach(element => {
                    const url = element.getAttribute('href') || element.getAttribute('src');
                    if (url && !isAbsoluteURL(url)) {
                        const newUrl = new URL(url, targetUrl).href; // Construct absolute URL
                        if (element.tagName === 'LINK') element.setAttribute('href', newUrl);
                        if (element.tagName === 'SCRIPT' || element.tagName === 'IMG') element.setAttribute('src', newUrl);
                    }
                });

                res.status(200).send(dom.serialize());
            } catch (error) {
                res.status(500).send('Error processing HTML: ' + error.message);
            }
        });
    }).on('error', (e) => {
        res.status(500).send('Error fetching URL: ' + e.message);
    });
};

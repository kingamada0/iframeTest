const https = require('https');
const { JSDOM } = require('jsdom');  // Ensure JSDOM is included in your project dependencies

module.exports = async (req, res) => {
    const targetUrl = 'https://lordne.vercel.app/';

    https.get(targetUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            // Parse the HTML content
            const dom = new JSDOM(data);
            const document = dom.window.document;

            // Modify URLs and handle dynamic content
            modifyUrls(document, targetUrl);

            // Convert the modified DOM back to HTML
            const modifiedHtml = dom.serialize();

            res.status(200).send(modifiedHtml);
        });
    }).on('error', (e) => {
        res.status(500).send('Error: ' + e.message);
    });
};

function modifyUrls(document, originalDomain) {
    // Function to check if a URL is absolute
    const isAbsolute = (url) => url.startsWith('http://') || url.startsWith('https://');

    // Modify href attributes in anchor tags and link tags
    document.querySelectorAll('a[href], link[href]').forEach(element => {
        if (!isAbsolute(element.href)) {
            element.href = originalDomain + '/' + element.getAttribute('href');
        }
    });

    // Modify src attributes in script tags and img tags
    document.querySelectorAll('script[src], img[src]').forEach(element => {
        if (!isAbsolute(element.src)) {
            element.src = originalDomain + '/' + element.getAttribute('src');
        }
    });

    // Additional logic to handle other elements or attributes as needed
}

const https = require('https');

module.exports = async (req, res) => {
    const targetUrl = 'https://lordne.vercel.app/'; // Replace with your target URL

    https.get(targetUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            const originalDomain = 'https://lordne.vercel.app';

            // Function to check if URL is absolute
            const isAbsoluteURL = (url) => /^(?:[a-z]+:)?\/\//i.test(url);

            // Replace relative URLs with absolute URLs
            data = data.replace(/(href|src|url)\("?'?\/?(.*?)"?'?\)/g, (match, p1, p2) => {
                if (isAbsoluteURL(p2)) {
                    return `${p1}("${p2}")`; // Return absolute URL unchanged
                } else {
                    return `${p1}("${originalDomain}/${p2}")`; // Prepend original domain to relative URL
                }
            });

            res.status(200).send(data);
        });
    }).on('error', (e) => {
        res.status(500).send('Error: ' + e.message);
    });
};

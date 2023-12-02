const https = require('https');

module.exports = async (req, res) => {
    const targetUrl = 'https://lordne.vercel.app/'; // Replace with your target URL

    https.get(targetUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            // Replace relative URLs with absolute URLs
            const originalDomain = 'https://lordne.vercel.app';
            data = data.replace(/href="\/(.*?)"/g, `href="${originalDomain}/$1"`);
            data = data.replace(/src="\/(.*?)"/g, `src="${originalDomain}/$1"`);
            data = data.replace(/url\(\/(.*?)\)/g, `url(${originalDomain}/$1)`);

            res.status(200).send(data);
        });
    }).on('error', (e) => {
        res.status(500).send('Error: ' + e.message);
    });
};

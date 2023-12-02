module.exports = async (req, res) => {
    const https = require('https');

    const targetUrl = 'https://lordne.vercel.app/'; // Replace with your target URL

    https.get(targetUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            // Modify data as needed
            const originalDomain = 'https://lordne.vercel.app';
data = data.replace(/href="\//g, `href="${originalDomain}/`);


            res.status(200).send(data);
        });
    }).on('error', (e) => {
        res.status(500).send('Error: ' + e.message);
    });
};

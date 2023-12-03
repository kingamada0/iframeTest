const puppeteer = require('puppeteer');

async function fetchAndModifyPage(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Example modification: Adding a new element to the body
    await page.evaluate(() => {
        const newElement = document.createElement('div');
        newElement.textContent = 'This is a new element added by Puppeteer';
        document.body.appendChild(newElement);
    });

    // Get the modified HTML
    const modifiedHtml = await page.content();

    await browser.close();
    return modifiedHtml;
}

// Example usage
fetchAndModifyPage('https://lordne.vercel.app/')
    .then(modifiedHtml => {
        console.log(modifiedHtml); // This HTML can be sent to the frontend
    });

import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import start from './browser';
dotenv.config();

(async () => {
	const browser = await puppeteer.launch({ headless: 'new' });
	console.log('Starting browser...');
	try {
		await start(browser);
	} finally {
		console.log('Hit ^C to stop the tool.');
		// await browser.close();
	}
})();

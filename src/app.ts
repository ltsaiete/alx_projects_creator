import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import start from './browser';
dotenv.config();

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	console.log('Starting browser...');
	await start(browser);
	console.log('Closing the browser.');
	// await browser.close();
})();

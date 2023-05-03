import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
dotenv.config();

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	await page.goto('https://intranet.alxswe.com/auth/sign_in');

	await page.type(
		'#user_email',
		process.env.USER_EMAIL ? process.env.USER_EMAIL : ''
	);
	await page.type(
		'#user_password',
		process.env.USER_PASS ? process.env.USER_PASS : ''
	);

	await Promise.all([
		page.waitForNavigation(),
		page.click('input[type="submit"]')
	]);

	const projectsLinks = await page.evaluate(() => {
		const panelsNodes = document.querySelectorAll('.panel-default');
		const projectsPanel = panelsNodes[2];
		const currentProjects = projectsPanel.querySelectorAll('a');
		const projectsArray = [...currentProjects];

		const links = projectsArray.map(({ href }) => ({ href }));
		return links;
	});

	projectsLinks.forEach(async ({ href }) => {
		const newPag = await browser.newPage();
		await newPag.goto(href);
	});

	// await browser.close();
})();

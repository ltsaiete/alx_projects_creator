import { Browser } from 'puppeteer';
import { homepage } from './homepage';
import { projectPage } from './projectPage';

async function createPage(browser: Browser) {
	return await browser.newPage();
}

export default async function start(browser: Browser) {
	const projects = await homepage(browser);
	console.log('Current projects will be loaded automatically...');
	console.log(
		'You will be prompted if you want to load past projects with score bellow 50%.'
	);

	// Browse trough current projects
	projects.current.forEach(async (project) => {
		await projectPage(browser, project);
	});
	// projectsLinks.forEach(async ({ href }) => {
	// 	const newPag = await browser.newPage();
	// 	await newPag.goto(href);
	// });

	// Testing project data
	//
}

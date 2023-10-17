import { Browser } from 'puppeteer';
import { homepage } from './homepage';
import { projectPage } from './projectPage';

export default async function start(browser: Browser) {
	const projects = await homepage(browser);
	console.log('Current projects will be loaded automatically...');
	console.log('You will be prompted if you want to load past projects with score bellow 50%.');

	// Browse trough current projects
	projects.forEach(async (project) => {
		await projectPage(browser, project);
	});
}

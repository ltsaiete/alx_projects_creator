import { Browser } from 'puppeteer';
import { ProjectProps, ProjectsProps } from './types';

export async function homepage(browser: Browser): Promise<ProjectProps[]> {
	const page = await browser.newPage();

	// Login to ALX
	await page.goto('https://intranet.alxswe.com/auth/sign_in', { timeout: 0 });
	await page.type('#user_email', process.env.USER_EMAIL ? process.env.USER_EMAIL : '');
	await page.type('#user_password', process.env.USER_PASS ? process.env.USER_PASS : '');
	await Promise.all([page.waitForNavigation(), page.click('input[type="submit"]')]);

	await page.goto('https://intranet.alxswe.com/projects/current', { timeout: 0 });

	const projects = await page.evaluate((): ProjectProps[] => {
		// Load current projects
		const projectsPanel = document.querySelectorAll('ul.list-group')[0];
		const projectsAnchors = projectsPanel.querySelectorAll('a');
		const projectsArr = [...projectsAnchors];

		const projects = projectsArr.map(({ href, innerText }) => ({
			href,
			title: innerText
		}));

		return projects;
	});

	return projects;
}

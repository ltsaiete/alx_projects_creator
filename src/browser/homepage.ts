import { Browser } from 'puppeteer';
import { ProjectProps, ProjectsProps } from './types';

export async function homepage(browser: Browser): Promise<ProjectsProps> {
	const page = await browser.newPage();

	// Login to ALX
	await page.goto('https://intranet.alxswe.com/auth/sign_in', { timeout: 0 });
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

	const current = await page.evaluate((): ProjectProps[] => {
		// Load current projects
		const projectsPanel = document.querySelectorAll('.panel-default')[1];
		const projectsAnchors = projectsPanel.querySelectorAll('a');
		const projectsArr = [...projectsAnchors];

		const projects = projectsArr.map(({ href, innerText }) => ({
			href,
			title: innerText
		}));

		return projects;
	});

	// Load past projects
	const past = await page.evaluate((): ProjectProps[] => {
		// Open past projects modal
		const modalToggleButton = document.querySelector(
			'a[data-target="#period_scores_modal_1"]'
		);
		modalToggleButton?.setAttribute('id', 'modal-toggle-btn');
		document.getElementById('modal-toggle-btn')?.click();
		// Load past projects
		const pastProjectsModal = document.getElementById('period_scores_modal_1');

		const projectsTable = pastProjectsModal?.querySelectorAll('tr');
		if (!projectsTable) return [];

		const projectsTableArray = [...projectsTable];
		const serializedProjects = projectsTableArray.filter((project) => {
			const isTitle = project.getAttribute('class') == 'bg-primary';
			// Getting the score  for each project
			const score = Number(
				project
					.getElementsByClassName('text-right')[0]
					.innerHTML.trim()
					.replace('%', '')
			);
			// Remove the titles ('Month #0') and
			// return only  the projects with score bellow 50%
			return !isTitle && score < 50;
		});
		const projectsArr: HTMLAnchorElement[] = [];

		serializedProjects.forEach((project) => {
			const projectAnchor: HTMLAnchorElement | null =
				project.querySelector('td > a');
			if (projectAnchor) projectsArr.push(projectAnchor);
		});

		const projects = projectsArr.map(({ href, innerText }) => ({
			href,
			title: innerText
		}));

		return projects;
	});

	return {
		current,
		past
	};
}

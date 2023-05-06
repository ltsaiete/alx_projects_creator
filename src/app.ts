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
		// Open past projects modal
		const modalToggleButton = document.querySelector(
			'a[data-target="#period_scores_modal_1"]'
		);
		modalToggleButton?.setAttribute('id', 'modal-toggle-btn');
		document.getElementById('modal-toggle-btn')?.click();
		// Load past projects
		const pastProjectsModal = document.getElementById('period_scores_modal_1');
		const pastProjectsTable = pastProjectsModal?.querySelectorAll('tr');

		let pastProjectsLinks: {
			href: string;
		}[] = [];

		if (pastProjectsTable) {
			const pastProjectsTableArray = [...pastProjectsTable];
			const serializedProjects = pastProjectsTableArray.filter((project) => {
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

			pastProjectsLinks = serializedProjects.map((project) => {
				const projectAnchor: HTMLAnchorElement | null =
					project.querySelector('td > a');

				return {
					href: projectAnchor ? projectAnchor.href : ''
				};
			});
		}

		// Load current projects
		const currentProjectsPanel = document.querySelectorAll('.panel-default')[2];

		const currentProjects = currentProjectsPanel.querySelectorAll('a');
		const currentProjectsArray = [...currentProjects];

		const currentProjectsLinks = currentProjectsArray.map(({ href }) => ({
			href
		}));

		return {
			currentProjects: currentProjectsLinks,
			pastProjects: pastProjectsLinks
		};
	});

	console.log(projectsLinks);

	// projectsLinks.forEach(async ({ href }) => {
	// 	const newPag = await browser.newPage();
	// 	await newPag.goto(href);
	// });

	// await browser.close();
})();

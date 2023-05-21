import { Browser } from 'puppeteer';
import { ProjectProps } from './types';

export async function projectPage(browser: Browser, project: ProjectProps) {
	const { href, title } = project;
	const page = await browser.newPage();
	await page.goto(href);

	const projectDetails = await page.evaluate(loadProjectDetails);
	projectDetails.unshift(`# ${title}`);
	console.log(projectDetails);
}

function loadProjectDetails() {
	const detailsPanel = document.querySelector(
		'#project-description > .panel-body'
	)?.children;

	if (!detailsPanel) return [];

	const detailsPanelArr = [...detailsPanel];
	let detailsSections: Element[][] = [];
	let submenu: Element[] = [];

	detailsPanelArr.forEach((item, idx) => {
		if (item.matches('h2')) {
			if (idx != 0) {
				detailsSections.push(submenu);
			}
			submenu = [];
		}
		submenu.push(item);
	});

	detailsSections.push(submenu);
	const excludedSections = ['Resources', 'Requirements', 'More Info'];

	detailsSections = detailsSections.filter((section) => {
		const sectionTitle = section[0].innerHTML;
		const tagName = section[0].tagName.toLowerCase();
		return !excludedSections.includes(sectionTitle) && tagName == 'h2';
	});
	const detailsSectionsArr = detailsSections.reduce((previous, current) =>
		previous.concat(current)
	);

	console.log(detailsSectionsArr);

	let detailsMd = detailsSectionsArr.map((section) => {
		const tagName = section.tagName.toLowerCase();
		switch (tagName) {
			case 'h2':
				return [`## ${section.innerHTML}`];
				break;
			case 'h3':
				return [`### ${section.innerHTML}`];
				break;
			case 'p':
				return [section.innerHTML];
				break;
			case 'ul':
				const lis = section.querySelectorAll('li');
				const liMd: string[] = [];
				lis.forEach((li) => {
					liMd.push(`- ${li.innerHTML}`);
				});
				return liMd;
				break;
			default:
				return [section.innerHTML];
				break;
		}
	});

	return detailsMd.reduce((previous, current) => previous.concat(current));
}

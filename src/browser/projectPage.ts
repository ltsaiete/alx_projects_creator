import { Browser } from 'puppeteer';
import { ProjectProps } from './types';

export async function projectPage(browser: Browser, project: ProjectProps) {
	const { href, title } = project;
	const page = await browser.newPage();
	await page.goto(href);

	// await page.evaluate(loadProjectDetails);
}

function loadProjectDetails() {
	const tagHandlers = {
		h2: handleH2
		// 'h3': ,
		// 'p': ,
		// 'ul': ,
	};

	function handleH2(item: Element): string[] {
		return [`## ${item.innerHTML}`];
	}

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
	const detailsSectionsArr = detailsSections.reduce((previous, current) => {
		return previous.concat(current);
	});

	console.log(detailsSectionsArr);

	// const detailsMd = [];
	// detailsSectionsArr.forEach((section) => {
	// 	const tagName = section.tagName.toLowerCase();
	// 	const tagMd = tagHandlers['h2'](section);
	// 	console.log(tagMd);
	// });
}

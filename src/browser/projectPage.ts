import { Browser } from 'puppeteer';
import { ProjectProps } from './types';

export async function projectPage(browser: Browser, project: ProjectProps) {
	const { href, title } = project;
	const page = await browser.newPage();
	await page.goto(href);

	const projectDir = await page.evaluate(loadProjectDir);

	const projectDetails = await page.evaluate(loadProjectDetails);
	projectDetails.unshift(`# ${title}`);

	const projectFiles = await page.evaluate(loadProjectFiles);

	console.log(projectFiles);
}

function loadProjectDir() {
	const taskInfoNode = document.querySelectorAll(
		'.task-card .list-group ul'
	)[0];
	const infoNodesArr = [...taskInfoNode.children];
	const dirNode = infoNodesArr.find((node) => {
		const tagName = node.tagName.toLowerCase();
		const innerHTML = node.innerHTML;
		return tagName === 'li' && innerHTML.includes('Directory:');
	});
	const dirName = dirNode?.querySelector('code');

	return dirName ? dirName.innerText : '.';
}

function loadProjectFiles() {
	const taskInfoNode = document.querySelectorAll('.task-card .list-group ul');

	const fileNames: string[] = [];

	taskInfoNode.forEach((infoNode) => {
		const infoNodesArr = [...infoNode.children];

		const filesNode = infoNodesArr.find((node) => {
			const tagName = node.tagName.toLowerCase();
			const innerHTML = node.innerHTML;
			return tagName === 'li' && innerHTML.includes('File:');
		});

		const fileName = filesNode?.querySelector('code');
		if (fileName) fileNames.push(fileName.innerText);
	});
	return fileNames;
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

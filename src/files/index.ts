import fs from 'fs';
import { resolve, join } from 'path';

interface CreateFilesProps {
	title: string;
	dir: string;
	details: string[];
	filenames: string[];
}
export function createFiles({
	title,
	dir,
	details,
	filenames
}: CreateFilesProps) {
	console.log('Creating files for project ' + title);
	const basePath = resolve(__dirname, '..', '..', 'output', dir);

	writeFile(join(basePath, 'README.md').replace(' ', ''), details.join('\n'));

	const separatedFiles = filenames.map((file) => {
		return file.split(',');
	});

	separatedFiles.forEach((files) => {
		files.forEach((filename) => {
			writeFile(join(basePath, filename).replace(' ', ''), '');
		});
	});
}

function writeFile(pathname: string, content: string) {
	// Find directory path
	const filenameIndex = Math.max(
		pathname.lastIndexOf('\\'),
		pathname.lastIndexOf('/')
	);
	const dir = pathname.substring(0, filenameIndex);
	// Create directory if not exists
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	fs.writeFile(pathname, content, (err) => {});
}

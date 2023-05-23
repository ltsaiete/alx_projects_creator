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
	const basePath = resolve(__dirname, '..', '..', 'output', dir);
	fs.mkdirSync(basePath, { recursive: true });
	writeFile(join(basePath, 'README.md'), details.join('\n'));
}

function writeFile(pathname: string, content: string) {
	fs.writeFile(pathname, content, (err) => {
		if (err) {
			console.error('Error writing to file:', err);
		} else {
			console.log('Content has been written to file.');
		}
	});
}

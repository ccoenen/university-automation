import fs from 'fs';
import path from 'path';

const DEFAULT_UNITY_VERISON = "2022.3.55f1";
const VERSION_REGEX = /^m_EditorVersion:\s(?<version>.+)[\r\n]+|$/;

const TEMPLATE = {
	"title": "Example Project",
	"lastModified": 1700000000000,
	"isCustomEditor": false,
	"path": "/home/example/projects/ExampleProject",
	"containingFolderPath": "/home/example/projects",
	"version": DEFAULT_UNITY_VERISON,
	"architecture": "x86_64",
	"isFavorite": false,
	"cloudEnabled": false
};

const parentDirectory = process.argv[2];
if (!parentDirectory) {
	console.error(`no directory provided. Please add a parent directory as first parameter ${process.argv[0]} ${process.argv[1]} /home/somewhere`);
	process.exit(1);
}


function findProjectVesionPath(parent, list = []) {
	const files = fs.readdirSync(parent, { withFileTypes: true });
  
	for (const file of files) {
		const filePath = path.join(parent, file.name);
		if (file.isDirectory()) {
			findProjectVesionPath(filePath, list);
		} else if (file.name == "ProjectVersion.txt") {
			list.push(filePath);
		}
	}
	return list;
}


function projectVersionPathToProject(versionFile) {
	console.log(versionFile);
	const project = structuredClone(TEMPLATE);

	const version = extractVersion(versionFile, project);

	const projectPath = path.join(versionFile, "..", "..");
	project.title = path.basename(projectPath);
	project.path = projectPath;
	project.containingFolderPath = path.join(projectPath, "..");
	project.version = version || DEFAULT_UNITY_VERISON;

	return project;
}

function extractVersion(versionFile, project) {
	const versionContent = fs.readFileSync(versionFile, "UTF-8");
	const versionMatch = VERSION_REGEX.exec(versionContent);
	return versionMatch ? versionMatch.groups.version : null;
}



// finding and outputting.
const paths = findProjectVesionPath(parentDirectory, []);
// paths.forEach(p => console.log);
const projects = paths.map(projectVersionPathToProject);
const projectObject = {};
for (const p of projects) {
	projectObject[p.path] = p;
}

console.log(JSON.stringify(projectObject, null, "\t"));

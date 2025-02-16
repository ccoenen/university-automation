import fs from 'fs';
import path from 'path';

const DEFAULT_UNITY_VERISON = "2022.3.55f1";

const MY_UNITY_VERSIONS = {
	"2022.3.55f1": /2022\.3\..+/,
	"6000.0.32f1": /6000\..+/
};

const VERSION_REGEX = /^m_EditorVersion:\s(?<version>.+)[\r\n]+|$/;

const TEMPLATE = {
	"title": "Example Project",
	"lastModified": (new Date()).getTime(),
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
	const project = structuredClone(TEMPLATE);

	const version = extractVersion(versionFile, project);

	const projectPath = path.join(versionFile, "..", "..");
	const containingFolderPath = path.join(projectPath, "..");
	project.title = path.basename(projectPath);
	project.path = projectPath;
	project.containingFolderPath = containingFolderPath;
	project.version = constrainVersion(version);

	return project;
}


function extractVersion(versionFile, project) {
	const versionContent = fs.readFileSync(versionFile, "UTF-8");
	const versionMatch = VERSION_REGEX.exec(versionContent);
	return versionMatch ? versionMatch.groups.version : null;
}


function constrainVersion(providedVersion, strict = false) {
	for (const constrainedVersion in MY_UNITY_VERSIONS) {
		if (Object.prototype.hasOwnProperty.call(MY_UNITY_VERSIONS, constrainedVersion)) {
			const check = MY_UNITY_VERSIONS[constrainedVersion];
			if (check.test(providedVersion)) {
				console.error(`contraining ${providedVersion} to use ${constrainedVersion}`); // on error stream on purpose so the result can be piped to a file.
				return constrainedVersion;
			}
		}
	}
	return strict ? null : providedVersion; // default to either of these
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

# Unity United

Importing TONS of unity projcts into UnityHub. More information at [Mass-Importing Unity-Projects into Unity Hub](https://www.claudiuscoenen.de/2025/02/mass-importing-unity-projects-into-unity-hub/)

UnityHub stores its project list in `projects-v1.json`. Let's add them there in large quantities so we don't have to do this manually.


## Setup

This will likely just need NodeJS somewhere. Why NodeJS? I already have it installed and it's relatively common. This is really not rocket science.


## Usage

Run it with a parent path to search recursively. `node unity-united.js /home/projects`.

Take the output and add it to your `projects-v1.json`.


## How it operates

It will recursively look for ProjectVersion.txt files and backtrack one level from there to find the actual project directory. It then derives the project name from the directory name and you should be good to go!


## Format

We want to generate blocks like these:

```json
    "/home/example/projects/ExampleProject": {
      "title": "Example Project",
      "lastModified": 1739400762199,
      "isCustomEditor": false,
      "path": "/home/example/projects/ExampleProject",
      "containingFolderPath": "/home/example/projects",
      "version": "2022.3.55f1",
      "architecture": "x86_64",
      "isFavorite": false,
      "cloudEnabled": false
    },
```

We're skipping these attributes: `localProjectId`, `changeset`, mostly because it does not seem like they are important.

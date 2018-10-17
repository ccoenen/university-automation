import {hex} from './helpers.js';
import Group from './model/Group.js';
import Item from './model/Item.js';

const $ = document.querySelector.bind(document);
let autorun = false;
const candidates = [];
let candidatePointer = 0;
let stepSize = 1;
const groups = [];
let groupPointer = 0;

$('#groupNumber').addEventListener('change', groupChange);
$('#groupNumber').addEventListener('pointerup', groupChange);
$('#groupNumber').addEventListener('keyup', groupChange);
$('#names').addEventListener('change', candidateChange);
$('#names').addEventListener('keyup', candidateChange);
$('#d1').addEventListener('change', candidateChange);
$('#d2').addEventListener('change', (e) => {
	stepSize = parseInt(e.currentTarget.value, 10);
});
$('#run').addEventListener('click', () => {
	autorun = true;
	draw();
});
$('#step').addEventListener('click', () => {
	autorun = false;
	draw();
});
$('#pause').addEventListener('click', () => {
	autorun = false;
});
groupChange();
candidateChange();

function groupChange() {
	const groupNumber = parseInt($('#groupNumber').value, 10);
	const playground = $('#playground');
	while (playground.children.length > 0) {
		playground.removeChild(playground.children[0]);
	}
	groups.splice(0,groups.length); // empty the array as well.

	for (let i = 0; i < groupNumber; i++) {
		const g = new Group(i);
		playground.appendChild(g.domElement);
		groups.push(g);
	}

	stepSize = parseInt($('#d2').value, 10);
	groupPointer = 0;
}

function candidateChange() {
	const names = $('#names').value
		.split('\n')
		.map((c) => c.trim())
		.filter((c) => c);

	const d1 = parseInt($('#d1').value, 10);
	const encoder = new TextEncoder('utf-8');
	candidates.splice(0, candidates.length);

	Promise.all(names.map((name) => {
		var buffer = encoder.encode(name + d1);
		return crypto.subtle.digest('SHA-256', buffer).then((hash) => [name, hash]);
	})).then((hashes) => {
		hashes.forEach((h) => {
			h[1] = hex(h[1]).substr(0,6);
		});
		hashes = hashes.sort((a, b) => {
			return a[1].localeCompare(b[1]);
		});
		const candidateList = $('#candidates');
		while (candidateList.children.length > 0) {
			candidateList.removeChild(candidateList.children[0]);
		}
		for (let i = 0; i < hashes.length; i++) {
			const item = new Item(i, hashes[i][0], hashes[i][1]);
			candidateList.appendChild(item.domElement);
			candidates.push(item);
		}
	});
	groupChange();
}

function updatePointerHighlight() {
	document.querySelectorAll('.candidate').forEach((c) => {
		c.classList.remove('active');
	});
	const candidates = $('#candidates');
	if (candidatePointer >= candidates.children.length) {
		candidatePointer = candidatePointer % candidates.length;
	}
	candidates.children[candidatePointer].classList.add('active');
}

function draw() {
	if (candidates.length == 0) { return; }

	const g = groups[groupPointer];
	if (candidatePointer >= candidates.length) {
		candidatePointer = candidatePointer % candidates.length;
	}
	updatePointerHighlight();
	const active = candidates[candidatePointer];

	var rejection = rejectMemberReason(active, g);
	if (rejection) {
		candidatePointer += stepSize;
		// wiggle
		active.domElement.animate([
			{transform: 'translate(-10px, 0)'},
			{transform: 'translate(10px, 0)'}
		], {
			duration: 200,
			easing: 'ease-in-out',
		});
		rejection.domElement.animate([
			{transform: 'translate(-10px, 0)'},
			{transform: 'translate(10px, 0)'}
		], {
			duration: 200,
			easing: 'ease-in-out',
		});
	} else {
		const first = active.domElement.getBoundingClientRect();
		g.add(active);
		candidates.splice(candidatePointer, 1);
		const last = active.domElement.getBoundingClientRect();

		const deltaX = first.left - last.left;
		const deltaY = first.top - last.top;
		const deltaW = first.width / last.width;
		const deltaH = first.height / last.height;

		active.domElement.animate([{
			transformOrigin: 'top left',
			transform: `
				translate(${deltaX}px, ${deltaY}px)
				scale(${deltaW}, ${deltaH})
			`
		}, {
			transformOrigin: 'top left',
			transform: 'none'
		}], {
			duration: 200,
			easing: 'ease-in-out',
			fill: 'both'
		});

		if (candidates.length > candidatePointer) { // beware we already changed the dom. this IS the following element!
			const follower = candidates[candidatePointer];
			follower.domElement.animate([{
				marginTop: first.height + 'px'
			}, {
				marginTop: 0
			}], {
				delay: 100,
				duration: 100,
				easing: 'ease-in-out',
				fill: 'both'
			});
		}
		groupPointer = ++groupPointer % groups.length;
		candidatePointer += (stepSize - 1); // -1 because we just removed one person from the list anyway.
	}

	if (autorun) {
		setTimeout(draw, $('#animations').checked ? 250 : 5);
	}
}

function rejectMemberReason(candidate, group) {
	// conflicts with another team member
	for (let m in group.members) {
		const existingMember = group.members[m];
		for (let t in candidate.tags) {
			const candidateTag = candidate.tags[t];
			if (existingMember.tags.includes(candidateTag)) {
				return existingMember;
			}
		}
	}

	// conflicts with gender diversity
	const genders = group.members.map((m) => m.gender);
	const sameGender = genders.reduce((n, value) => {
		return n + (value === candidate.gender);
	}, 0);
	if (sameGender / group.members.length > 0.67) {
		// more than two thirds already have the same gender, this is not a good idea.
		return group;
	}

	// if we end up here, we return false, which means "no rejection"
	return false;
}

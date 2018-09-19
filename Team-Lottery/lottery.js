import {hex} from './helpers.js';

const $ = document.querySelector.bind(document);
let candidatePointer = 0;
let groupNumber;
let groupPointer = 0;

$('#groupNumber').addEventListener('change', groupChange);
$('#groupNumber').addEventListener('pointerup', groupChange);
$('#groupNumber').addEventListener('keyup', groupChange);
$('#names').addEventListener('change', candidateChange);
$('#names').addEventListener('keyup', candidateChange);
$('#d1').addEventListener('change', candidateChange);
$('#d2').addEventListener('change', (e) => {
	candidatePointer = parseInt(e.currentTarget.value, 10) - 1;
	updatePointerHighlight();
});
$('#start').addEventListener('click', draw);
groupChange();
candidateChange();

function groupChange() {
	groupNumber = parseInt($('#groupNumber').value, 10);
	const playground = $('#playground');
	while (playground.children.length > 0) {
		playground.removeChild(playground.children[0]);
	}
	for (let i = 0; i < groupNumber; i++) {
		const c = document.createElement('div');
		c.id = "group-" + i;
		c.classList.add("group");
		c.innerHTML = `<h2>Gruppe ${i+1}</h2><ul></ul>`;
		playground.appendChild(c);
	}
}

function candidateChange() {
	const names = $('#names').value
		.split('\n')
		.map((c) => c.trim())
		.filter((c) => c);

	const d1 = parseInt($('#d1').value, 10);
	const encoder = new TextEncoder("utf-8");

	Promise.all(names.map((name) => {
		var buffer = encoder.encode(name + d1);
		return crypto.subtle.digest("SHA-256", buffer).then((hash) => [name, hash]);
	})).then((hashes) => {
		hashes.forEach((h) => {
			h[1] = hex(h[1]).substr(0,12);
		});
		hashes = hashes.sort((a, b) => {
			return a[1].localeCompare(b[1]);
		});
		const candidateList = $('#candidates');
		while (candidateList.children.length > 0) {
			candidateList.removeChild(candidateList.children[0]);
		}
		for (let i = 0; i < hashes.length; i++) {
			const c = document.createElement('div');
			c.id = "candidate-" + i;
			c.classList.add("candidate");
			c.innerHTML = `${hashes[i][0]}`; // <br>(<code>${hashes[i][1]}</code>)
			candidateList.appendChild(c);
		}
	});
}

function updatePointerHighlight() {
	document.querySelectorAll('.candidate').forEach((c) => {
		c.classList.remove('active');
	})
	const candidates = $('#candidates');
	if (candidatePointer >= candidates.children.length) {
		candidatePointer = 0;
	}
	candidates.children[candidatePointer].classList.add('active');
}

function draw() {
	const candidateList = $('#candidates');
	const g = $('#group-' + groupPointer);

	if (candidateList.children.length > 0) {
		if (candidatePointer >= candidateList.children.length) {
			candidatePointer = 0;
		}
		updatePointerHighlight();
		const active = candidateList.children[candidatePointer];
		const first = active.getBoundingClientRect();
		g.appendChild(active);
		const last = active.getBoundingClientRect();

		const deltaX = first.left - last.left;
		const deltaY = first.top - last.top;
		const deltaW = first.width / last.width;
		const deltaH = first.height / last.height;

		active.animate([{
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

		if (candidateList.children.length > candidatePointer) { // beware we already changed the dom. this IS the following element!
			const follower = candidateList.children[candidatePointer];
			follower.animate([{
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
		setTimeout(draw, 250);
	}
	groupPointer = ++groupPointer % groupNumber;
}

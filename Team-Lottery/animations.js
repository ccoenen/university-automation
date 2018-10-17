export const ANIMATION_DURATION = 300;

export function closeGap(element, height) {
	element.animate([{
		marginTop: height + 'px'
	}, {
		marginTop: 0
	}], {
		delay: 100,
		duration: ANIMATION_DURATION / 2,
		easing: 'ease-in-out',
		fill: 'both'
	});
}

export function moveCandidateToGroup(candidate, first, last) {
	const deltaX = first.left - last.left;
	const deltaY = first.top - last.top;
	const deltaW = first.width / last.width;
	const deltaH = first.height / last.height;

	candidate.domElement.animate([{
		transformOrigin: 'top left',
		transform: `
			translate(${deltaX}px, ${deltaY}px)
			scale(${deltaW}, ${deltaH})
		`
	}, {
		transformOrigin: 'top left',
		transform: 'none'
	}], {
		duration: ANIMATION_DURATION,
		easing: 'ease-in-out',
		fill: 'both'
	});
}

export function rejectionWiggle(rejected, rejectionReasons) {
	rejected.domElement.animate([
		{transform: 'translate(-10px, 0)', color: 'red'},
		{transform: 'translate(10px, 0)', color: 'inherit'}
	], {
		duration: ANIMATION_DURATION,
		easing: 'ease-in-out',
	});
	rejectionReasons.forEach((element) => {
		element.animate([
			{color: 'red'},
			{color: 'inherit'}
		], {
			duration: ANIMATION_DURATION,
			easing: 'ease-in-out',
		});
	});
}

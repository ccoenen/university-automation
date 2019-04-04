const _dragData = {};

function dragStart(e) {
	const original = e.currentTarget;
	document.addEventListener('pointermove', dragMove);
	document.addEventListener('pointerup', dragEnd);
	const rect = original.getBoundingClientRect();

	const element = original.cloneNode(true);
	_dragData[e.pointerId] = {
		dx: rect.left - e.clientX,
		dy: rect.top - e.clientY,
		element,
		original
	};

	original.style.opacity = 0.3;
	element.style.position = 'absolute';
	element.style.boxSizing = 'border-box';
	element.style.width = rect.width + 'px'; // actually slightly too large, because of padding
	element.style.height = rect.height + 'px';
	element.style.pointerEvents = 'none';
	document.body.appendChild(element);
	dragMove(e);
	e.preventDefault();
}
function dragMove(e) {
	if (_dragData[e.pointerId]) {
		const ct = _dragData[e.pointerId].element;
		ct.style.left = e.clientX + _dragData[e.pointerId].dx + 'px';
		ct.style.top = e.clientY + _dragData[e.pointerId].dy + 'px';
	}
}
function dragEnd(e) {
	if (_dragData[e.pointerId]) {
		const ct = _dragData[e.pointerId].element;
		ct.style.position = null;
		ct.style.top = null;
		ct.style.left = null;
		_dragData[e.pointerId].original.style.opacity = null;
		document.body.removeChild(ct);
		delete _dragData[e.pointerId];
	}

	document.removeEventListener('pointermove', dragMove);
	document.removeEventListener('pointerup', dragEnd);
}


export function grabify(element) {
	element.addEventListener('pointerdown', dragStart);
}

export function dragify(element, callback) {
	element.addEventListener('pointerenter', (e) => {
		if (_dragData[e.pointerId] && callback) {
			callback.call(null, e, _dragData[e.pointerId]);
		}
	});
}

export function dropify(element, callback) {
	element.addEventListener('pointerup', (e) => {
		if (_dragData[e.pointerId] && callback) {
			callback.call(null, e, _dragData[e.pointerId]);
		}
	});
}

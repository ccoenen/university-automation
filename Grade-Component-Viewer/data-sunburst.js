function prepareData(url, callback) {
	function fillInBlanks(subtree) {
		if (subtree.nodes && subtree.nodes.length > 0) {
			subtree.nodes.forEach(function (item) {
				item.relativeValue = item.value || 1 / subtree.nodes.length;
				item.absoluteValue = subtree.absoluteValue * item.relativeValue;
				fillInBlanks(item);
			});
		}
	}

	d3.json(url, function(error, tree) {
		tree.relativeValue = 1;
		tree.absoluteValue = 100;
		fillInBlanks(tree);
		callback.call(null, tree);
	});
}

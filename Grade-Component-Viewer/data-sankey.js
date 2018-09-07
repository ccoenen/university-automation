function prepareData(url, callback) {
	d3.json(url, function(error, tree) {

		var graph = {nodes:[], links:[]};
		function extractElements(subtree) {
			graph.nodes.push(subtree);
			subtree.node = graph.nodes.length -1;
			if (subtree.nodes && subtree.nodes.length > 0) {
				subtree.nodes.forEach(function (item) {
					item.relativeValue = item.value || 1 / subtree.nodes.length;
					item.absoluteValue = subtree.absoluteValue * item.relativeValue;
					var itemId = extractElements(item);
					graph.links.push({target: subtree.node, source: itemId, value: item.absoluteValue});
				});
			}
			delete subtree.nodes;
			return subtree.node;
		}
		tree.relativeValue = 1;
		tree.absoluteValue = 100;
		extractElements(tree);

		callback.call(null, graph);
	});
}

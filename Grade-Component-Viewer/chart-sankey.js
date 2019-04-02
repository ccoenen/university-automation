function chart(graph, options) {
	options = options || {};
	var margin = options.margin || {top: 20, right: 20, bottom: 20, left: 20};
	var width = options.width || window.innerWidth - margin.left - margin.right - 20;
	var height = options.height || window.innerHeight - margin.top - margin.bottom - 20;

	var formatNumber = d3.format(",.1f");
	var format = function(d) { return formatNumber(d) + "%"; };
	var defaultColor = d3.scaleOrdinal(d3.schemeCategory10);
	var preparedColors = {
		"CC": '#1f77b4',
		"M": "#ff7f0e",
		"D": "#2ca02c",
		"Dokumentation,": "#7f7f7f",

		"Abschlusspräsentation": '#e377c2',
		"Kontinuierlicher": "#9467bd",

		"Teamverhalten": "#17becf",
		"Persönliche": "#bcbd22",
		"Teamnote": "#d62728"
	};

	function color(subject) {
		return preparedColors[subject] || 'red';
	}

	// append the svg canvas to the page
	var svg = d3.select("#chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Set the sankey diagram properties
	var sankey = d3.sankey()
		.nodeWidth(30)
		.nodePadding(15)
		.size([width, height])
		.nodes(graph.nodes)
		.links(graph.links)
		.layout(0);

	var path = sankey.link();
	path.curvature(0.25);


	// add in the links
	var link = svg.append("g").selectAll(".link")
			.data(graph.links)
		.enter().append("path")
			.attr("class", "link")
			.attr("d", path)
			.style("fill", "none")
			.style("stroke", "#000")
			.style("stroke-opacity", "0.07")
			.style("stroke-width", function(d) { return Math.max(1, d.dy); })
			.sort(function(a, b) { return b.dy - a.dy; });


// add the link titles
	link.append("title")
		.text(function(d) {
			return d.source.name + " " + format(d.source.relativeValue*100) +
				" of " + d.target.name + "\n" +
				format(d.source.absoluteValue) + " of total"; 
		 });


// add in the nodes
	var node = svg.append("g").selectAll(".node")
			.data(graph.nodes)
		.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});


// add the rectangles for the nodes
	node.append("rect")
		.attr("height", function(d) { return d.dy; })
		.attr("width", sankey.nodeWidth())
		.style("fill", function(d) { 
			d.color = d.color || color(d.name.replace(/ .*/, ""));
			return d.color;
		}).append("title")
			.text(function(d) {
				if (d.name == 'Teamverhalten (+/-)') return;
				return d.name + " " + format(d.relativeValue*100) + "\n" +
						format(d.absoluteValue) + " of total";
			 });


// add in the title for the nodes
	node.append("text")
		.attr("x", -6)
		.attr("y", function(d) { return d.dy / 2; })
		.attr("dy", ".35em")
		.attr("text-anchor", "end")
		.attr("transform", null)
		.text(function(d) { return `${d.name} (${Math.round(d.relativeValue * 100)} %)` ; })
	.filter(function(d) { return d.x < width / 2; })
		.attr("x", 6 + sankey.nodeWidth())
		.attr("text-anchor", "start");
}

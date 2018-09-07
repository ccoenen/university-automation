function chart(tree, options) {
	options = options || {};
	var margin = options.margin || {top: 10, right: 10, bottom: 10, left: 10};
	var width = options.width || 1200 - margin.left - margin.right;
	var height = options.height || 1100 - margin.top - margin.bottom;
	var radius = 400;

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

		"Bonus/Malus": "#17becf",
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
			.attr("transform", "translate(" + (margin.left + radius) + "," + (margin.top + radius) + ")");

	var partition = d3.partition()
		.size([2 * Math.PI, radius*radius])
		.padding(0.0);

	var hierarchy = d3.hierarchy(tree, function (d) { return d.nodes; })
		.sum(function (d) { return (d.nodes && d.nodes.length > 0) ? 0 : d.absoluteValue; });

	partition(hierarchy);

	var arc = d3.arc()
		.startAngle(function(d) { return d.x0; })
		.endAngle(function(d) { return d.x1; })
		.innerRadius(function(d) { return Math.sqrt(d.y0); })
		.outerRadius(function(d) { return Math.sqrt(d.y1 - (radius * 0.000)); });
		// .cornerRadius(5);

	var firstArcSegment = /(^.+?)L/;

	var path = svg.selectAll("path.visible-arc")
			.data(hierarchy.descendants())
		.enter().append("path")
			.attr('class', 'visible-arc')
			.attr("d", arc)
			.style("fill", function (d) {
				d.data.color = d.data.color || color(d.data.name.replace(/ .*/, ""));
				return d.data.color;
			})
			.style("stroke", '#fff')
			.each(function (d,i) {
				var arcd = d3.select(this).attr('d');
				var newArc = firstArcSegment.exec(arcd);

				svg.append('path')
					.attr('class', 'hiddenDonutArc')
					.attr('id', 'segment-'+i)
					.attr('d', newArc)
					.style('fill', 'none');
			});

	path.append("title")
		.text(function(d) {
			return d.data.name + " " + format(d.data.relativeValue*100) +
				' (' + format(d.data.absoluteValue) + " of total)"; 
		 });

// add in the title for the nodes
	svg.selectAll('text')
			.data(hierarchy.descendants())
		.enter()
			.append("text")
				.attr('fill', '#fff')
				.attr('class', 'label')
				//.attr('dx', 5)
				.attr('dy', 28)
			.append("textPath")
				.attr('startOffset', '50%')
				.style('text-anchor', 'middle')
				.attr('xlink:href', function (d, i) { return '#segment-'+i; })
				.text(function(d) { return d.data.name; });

}

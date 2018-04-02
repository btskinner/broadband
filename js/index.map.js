---
---

// loader settings
var opts = {
    lines: 13
    , length: 28
    , width: 14
    , radius: 42
    , scale: 1
    , corners: 1
    , color: '#000'
    , opacity: 0.5
    , rotate: 0
    , direction: 1
    , speed: 1
    , trail: 60
    , fps: 20
    , zIndex: 2e9
    , className: 'spinner'
    , top: '50%'
    , left: '50%'
    , shadow: false
    , hwaccel: false
    , position: 'absolute'
}

var target = document.getElementById('map-container');

// initial function while waiting for load
function init() {

    // trigger loader
    var spinner = new Spinner(opts).spin(target);

    // wait until load all
    queue()
	.defer(d3.json, "{{ site.siteurl }}/data/us.json")
	.defer(d3.tsv, "{{ site.siteurl }}/data/map_data.tsv")
	.defer(d3.tsv, "{{ site.siteurl }}/data/countynames.tsv")
	.await(function(error, us, data, names) {
	    spinner.stop();
	    ready(us, data, names);
	});
}

// start the spinner, load data, kill spinner, load map
init();

// primary wrapper function
function ready(us, data, names) {

    // init variables for first load
    var mintime = "1"
    , maxtime = "8"
    , time = mintime
    , measure = "d"
    , currentFrame = 0
    , frameLength = +maxtime - +mintime
    , interval
    , playTime = 1000
    , isPlaying = false;

    // measure number
    var measure_num = {"d":0,"u":1,"p":2};

    // get date names
    var dnames = ['',
		  'Dec. 2010',
		  'June 2011',
		  'Dec. 2011',
		  'June 2012',
		  'Dec. 2012',
		  'June 2013',
		  'Dec. 2013',
		  'June 2014'];

    // concatenate to make data column name
    var	dataColumn = measure + time;

    // map dimensions
    var width = 960
    , height = 640;

    // set projection
    var projection = d3.geo.albers()
	.scale(1280)
	.translate([width / 2, height / 2]);

    // 
    var colorDomain = [0,1,2,3,4,5,6,7,8,9];
    var legendLabels = [
	["Missing",
	 "200 KB/sec <= x < 768 KB/sec",
	 "768 KB/sec <= x < 1.5 MB/sec",
	 "1.5 MB/sec <= x < 3 MB/sec",
	 "3MB/sec <= x < 6MB/sec",
	 "6 MB/sec <= x < 10 MB/sec",
	 "10 MB/sec <= x < 25 MB/sec",
	 "25 MB/sec <= x < 50 MB/sec",
	 "50 MB/sec <= x < 100 MB/sec",
	 "100 MB/sec <= x < 1 GB/sec"]
	, ["Missing",
	   "200 KB/sec <= x < 768 KB/sec",
	   "768 KB/sec <= x < 1.5 MB/sec",
	   "1.5 MB/sec <= x < 3 MB/sec",
	   "3MB/sec <= x < 6MB/sec",
	   "6 MB/sec <= x < 10 MB/sec",
	   "10 MB/sec <= x < 25 MB/sec",
	   "25 MB/sec <= x < 50 MB/sec",
	   "50 MB/sec <= x < 100 MB/sec",
	   "100 MB/sec <= x < 1 GB/sec"]
	, ["0","1","2","3","4","5","6","7","8","9"]	
    ];
 
    // color function
    var color = d3.scale.ordinal()
	.range(colorbrewer.RdBu[10])
	.domain(colorDomain);

    // project paths
    var path = d3.geo.path()
	.projection(projection);

    // hash to associate names with counties for mouse-over
    var id_name_map = {};
    for (var i = 0; i < names.length; i++) {
	id_name_map[names[i].id] = names[i].name;
    }

    // init map svg
    var svg = d3.select("#map-container").append("svg")
	.attr("width", width)
	.attr("height", height);

    // function to draw map
    function drawMap(dataColumn) {

	// init mapping function for getting decile by id
	var decById = d3.map();

	// for each row in data, peel off first digit of value in
	// selected column and associate with id (fips)
	data.forEach(function(d) {
	    decById.set(d.id, +String(d[dataColumn]).slice(0,-2));
	});

	// similar to above -- associate values in selected
	// column with id and add decimal
	var id_val_map = {};
	for (var i = 0; i < names.length; i++) {
	    id_val_map[names[i].id] = String(data[i][dataColumn])
		.replace(/\B(?=(\d{2})+(?!\d))/g, ".");
	}

        // clear old so doesn't slow down (will just keep appending otherwise)
	svg.selectAll("g.counties").remove();
	svg.selectAll("g.states").remove();
	svg.selectAll("path").remove();

        // start building map: counties, tooltip, state outlines
	svg.append("g")
	    .attr("class", "counties")
	    .selectAll("path")
	    .data(topojson.feature(us, us.objects.counties).features)
	    .enter().append("path")
	    .style("fill", function(d) { return color(decById.get(d.id)); })
	    .attr("d", path)
	    .on("mousemove", function(d) {
		var html = "";

		html += "<div class=\"tooltip_kv\">";
		html += "<span class=\"tooltip_key\">";
		html += id_name_map[d.id] + ': ' + id_val_map[d.id];
		html += "</span>";
		html += "</div>";

		$("#tooltip").html(html);
		$(this).attr("stroke", "#000").attr("stroke-width", 2);
		$("#tooltip").show();
	    })
	    .on("mouseout", function() {
                $(this).attr("stroke", "");
                $("#tooltip").hide();
            });

	svg.append("path")
	    .datum(topojson.mesh(us, us.objects.states, function(a, b) {
		return a !== b;
	    }))
	    .attr("class", "states")
	    .attr("d", path);

    }

    // function for drawing the legend; separate from drawMap b/c
    // don't need to redraw every time map changes -- only when school
    // sample changes
    function drawLegend(dataColumn) {

	// clear old
	svg.selectAll("g.legendOrd").remove();

	// build up legend, locate it, and call it
	svg.append("g")
	    .attr("class", "legendOrd")
	    .attr("transform", "translate(0,470)");

	var legendOrd = d3.legend.color()
	    .labels(legendLabels[measure_num[measure]])
	    .scale(d3.scale.ordinal()
		   .range(colorbrewer.RdBu[10])
		   .domain([0,1,2,3,4,5,6,7,8,9]));

	svg.select(".legendOrd")
	    .call(legendOrd);

    }

    // draw map and legend for first time
    drawMap(dataColumn);
    drawLegend(dataColumn);

    // if sample selector changes, redraw map and legend
    d3.select("#sample").on("change", function() {
	measure = this.value;
	drawMap(measure + time);
	drawLegend(measure + time);
    });

    // if year slider moves, redraw map only
    var axis = d3.svg.axis()
	.ticks(8)
	.tickFormat(function(d) { return dnames[d] });
    slider = d3.slider()
	.axis(axis)
	.min(1)
	.max(8)
	.step(1)
	.on("slide", function(evt, value) {

	    // stop animation if playing
	    if ( isPlaying ) {
		isPlaying = false;
		d3.select("#play")
		    .call(function() {
			$("#play > svg").attr('data-icon','pause')
			    .attr("title", "Play animation");
		    });
		clearInterval (interval);
	    }

	    // reset the current frame so new animation starts here
	    currentFrame = +value - +time

	    // change year
	    time = String(value);

	    // draw the map
	    drawMap(measure + time);

	});

    // call slider
    d3.select("#slider").call(slider);

    // play/pause
    d3.select("#play").on("click", function() {
	if ( !isPlaying ) {
	    isPlaying = true;
	    $("#play > svg").attr('data-icon', 'pause')
		.attr("title", "Pause animation");
	    animate();
	} else {
	    isPlaying = false;
	    $("#play > svg").attr('data-icon', 'play')
		.attr("title", "Play animation");
	    clearInterval (interval);
	}
    });

    // animate
    function animate(){
	interval = setInterval ( function(){

	    // increment current frame
	    currentFrame++;

	    // if it's above max, return to min
	    if (currentFrame == frameLength + 1) currentFrame = 0;

	    // store year
	    var y = +currentFrame + +mintime

	    // move slider button
	    d3.select("#slider .d3-slider-handle")
		.style("left",100*currentFrame/frameLength + "%");

	    // change slider value
	    slider.value(y);

	    // change year
	    time = String(y);

	    // draw the map
	    drawMap(measure + time);
	}, playTime);
    }
}

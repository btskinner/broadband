---
layout: page
custom_css:
- index
custom_js:
- d3.min
- spin.min
- d3.slider
- topojson.v1.min
- queue.v1.min
- colorbrewer
- jquery.min
- d3-legend.min
- index.map
---

<div id="viz-container">
	<div id="map-container"></div>
	<div id="submap-container">
		<div id="buttons-container">
			<select id="sample">
				<optgroup label="College sample">
					<option value="d" selected>Download speed</option>
					<option value="u">Upload speed</option>
					<option value="p">Number of providers</option>
				</optgroup>
			</select>
			<div id="play">
				<i class="fas fa-play fa-2x" title="Play animation"></i>
			</div>
		</div>
		<div id="tooltip-container">
			<div id="tooltip"></div>
		</div>
		<div id="slider-container">
			<div id="slider"></div>
		</div>
	</div>
</div>

<div class="posttext" markdown="1">


</div>


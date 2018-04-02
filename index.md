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
			<select id="fccdef">
				<optgroup label="Broadband definition">
					<option value="pre" selected>Pre-2015</option>
					<option value="post">Post-2015</option>
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

#### Average time to download files of various sizes based on broadband speed tier

| ||Book (1MB)|MP3 (4MB)|Movie (6GB)|
| |Rate/sec range|[HH:MM:SS]|[HH:MM:SS]|[HH:MM:SS]|
|:-|:---------:|:---:|:---:|:---:|
|Tier 1|x <= 200 KB/sec|00:00:40|00:02:40|68:16:00|
|Tier 2|200 KB/sec <= x < 768 KB/sec|00:00:10|00:00:42|17:47:00|
|Tier 3|768 KB/sec <= x < 1.5 MB/sec|00:00:05|00:00:21|09:06:00|
|Tier 4|1.5 MB/sec <= x < 3 MB/sec|00:00:03|00:00:11|04:33:00|
|Tier 5|3 MB/sec <= x < 6MB/sec|00:00:01|00:00:05|02:16:00
|Tier 6|6 MB/sec <= x < 10 MB/sec|< 00:00:01|00:00:02|01:22:00|
|Tier 7|10 MB/sec <= x < 25 MB/sec|< 00:00:01|00:00:01|00:33:00|
|Tier 8|25 MB/sec <= x < 50 MB/sec|< 00:00:01|00:00:01|00:16:00|
|Tier 9|50 MB/sec <= x < 100 MB/sec|< 00:00:01|< 00:00:01|00:08:00|
|Tier 10|100 MB/sec <= x < 1 GB/sec|< 00:00:01|< 00:00:01|00:00:49|
|Tier 11|x > 1 GB/sec|< 00:00:01|< 00:00:01|< 00:00:49|

*Notes.* Values are taken from the [National Broadband
Map](https://www.broadbandmap.gov/classroom/speed). *KB*: kilobyte;
*MB*: megabyte; *GB*: gigabyte. 1 *MB* = 1,000 *KB*; 1 *GB* = 1,000
*MB*. In 2015, the FCC raised the minimum download speed to qualify as
broadband from 4 MB/sec (Tier 5) to 25 MB/sec (Tier 8).
</div>


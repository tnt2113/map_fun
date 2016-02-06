// Using a data1set of your choice, create an interactive two-dimensional plot (bar chart, scatterplot, or line chart).  Visually, the chart must include the following attributes:

// Glyphs (rectangles, points, etc.) that accurately communicate data1 values
// An x-axis and a y-axis, each of which has tick marks and a meaningful axis label
// A descriptive chart title
// A method for updating the data1 from one state to another.  
// The chart should use the same function to update the data1 as it uses to draw the data1 initially.  
// It is fine if this is just using an update function in the console (please provide instructions if so), or if you would like, include a clickable element (ie, piece of text that says "update data1"), that updates the data1 from one state to another.  

// The code should be easily readable, and must use functions to assign attributes and styles of the graphical elements.

// While this is a technical assignment, it is a good opportunity to practice user-centered design and best practices for graphical perception. Consider which audiences you would target, and the  features of the data1 you are able to communicate most clearly through this visualization. 


// 1. Glyphs are properly positioned given data1 values
// 2. X and Y axes are present and properly positioned
// 3. Chart has meaningful labels (chart title, x axis label, y axis label)
// 4. There is a method for updating the data1 from one state to another that uses the same function as initial drawing
// 5. The positioning of the glyphs is done via reusable functions
// Width and height settings
var settings = {
  width:600, 
  height:600, 
  radius:5,
  padding:45
}
 
 
// Scale setting function
var setScales = function() {
	// Get min/max values for x
	xValues = data1.map(function(d) {return d.gdppc})
	xMin = 0
	xMax = 86000
  
	// Using a function for y
	yMin = 45
	yMax = 85
  
	// Define the xScale
	xScale = d3.scale.linear().domain([xMin, xMax]).range([settings.radius, settings.width - settings.radius])
 
	// Define the yScale
	yScale = d3.scale.linear().domain([yMin, yMax]).range([settings.height - settings.radius,settings.radius])
	
	// Define the xAxis
	xAxisFunction = d3.svg.axis()
	  .scale(xScale)
	  .orient('bottom')
	  .ticks(4)
	  
	// Define the yAxis
	yAxisFunction = d3.svg.axis()
	  .scale(yScale)
	  .orient('left')
	  .ticks(4)
	  
	// Color scale
	colorScale = d3.scale.category10()
}  

// Function to build chart -- appends axes, then calls the draw function for the circle elements
var build = function() {
	// Set scales
	setScales()
	
	// Append xAxis
	xAxis = d3.select('#my-svg').append('g').attr('class', 'axis')
	  .attr('transform', 'translate(' + settings.padding + ','+ (settings.height + settings.padding) + ')')
	  .call(xAxisFunction)
	  
	// Append yAxis
	yAxis = d3.select('#my-svg').append('g').attr('class', 'axis')
	  .attr('transform', 'translate(' + settings.padding + ',' + settings.padding + ')')
	  .call(yAxisFunction)
	  
	// Append G in which to draw the plot
	plotG = d3.select('#my-svg').append('g').attr('transform', 'translate(' + settings.padding + ',' + settings.padding + ')')
	
	// Draw legend
	drawLegend()
	
	// Draw axis labels
	drawAxisLabels()
	
	// Draw circles and axes
	draw()
}
// Circle positioning function
var circleFunc = function(circ) {
	circ
	.attr('cx', function(d) {return xScale(d.gdppc)})
  	.attr('cy', function(d) {return yScale(d.life_ex)})
	.attr('r', settings.radius)
	.attr('fill', function(d) {
		return colorScale(d.wbregion)
	})
	.style('opacity', '.8')
} 

// Draw axis labels
var drawAxisLabels = function() {
	// xAxisLabel
	xAxisLabel = d3.select('#my-svg').append('text').attr('transform', 'translate(' + settings.width/2 + ',' + (settings.height + settings.padding*2) + ')').text('GDP per capita 2005PPP')
	
	// yAxisLabel
	yAxisLabel = d3.select('#my-svg').append('text').attr('transform', 'translate(' + settings.padding/3 + ',' + (settings.height*2/3) + ') rotate(270)').text('Life expectancy (both sexes)')

	// title
	title = d3.select('#my-svg').append('text').attr('transform', 'translate(' + settings.width/2.5 + ',' + (30) + ')').text('Cross-country relationship between GDP per capita and life expectancy')
}

// Legend function
var drawLegend = function() {
	// Get unique list of wbregions from data1
	var wbregions = []
	data1.map(function(d) {
		if(wbregions.indexOf(d.wbregion) == -1) wbregions.push(d.wbregion)
	})
	
	// Append a legend G
	legendG = d3.select('#my-svg').append('g').attr('id', 'legendG').attr('transform', 'translate(' + (settings.width + 2*settings.padding) + ',' + settings.padding + ')')
	legendG.selectAll('text')
		.data(wbregions)
		.enter().append('text')
		.text(function(d) {return d})
		.attr('transform', function(d,i) {return 'translate(0, ' + i*20 + ')'})
		.style('fill', function(d) {return colorScale(d)})
}

// Draw function
var draw = function() {
	// Set the scales
	setScales()
	
	// Bind data1
	var circles = plotG.selectAll('circle').data(data1)
	
	// Enter new elements
	circles.enter().append('circle').call(circleFunc)
	
	// Exit elements that may have left
	circles.exit().remove()
	
	// Transition all circles to new data1
	plotG.selectAll('circle').transition().duration(500).call(circleFunc)
	
	// Axes
	
}	

// Call the draw function to make the visualization
build()

function update(updated_data) {
	var circles = plotG.selectAll('circle') // select all circles
		.data(updated_data) // select data as the one to go

		
		// Exit: remove old elements
		circles.exit().remove()
		
		// Enter new elements
		circles.enter() // enter all the data in
		.append('circle') // append all new circles into the dataset
		
		circles.attr('r', settings.radius)
			.style('fill', function(d) {return colorScale(d.wbregion)})
			.style('opacity',.7)
			.transition(500)
			.attr('cx', function(d) {return xScale(d.gdppc)})
			.attr('cy', function(d) {return yScale(d.life_ex)})
	
}

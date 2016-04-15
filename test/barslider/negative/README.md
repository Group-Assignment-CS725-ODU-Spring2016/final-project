Say your dataset is an array of numbers, and includes both positive and negative values. Use two scales to construct the bar chart: a quantitative scale (such as a [linear scale][1]) to compute the bar positions along the *x*-axis, and an [ordinal scale][2] with [rangeBands](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBands) to compute the bar positions along the *y*-axis.

For the quantitative scale, compute the data domain (the minimum and maximum value) using [d3.extent][3]:

    var x = d3.scale.linear()
        .domain(d3.extent(data, function(d) { return d.value; }))
        .range([0, width]);

[Nicing][4] the scale will extend the extent slightly to the nearest round numbers. If you want the zero-value to be centered in the middle of the canvas, take the greater of the minimum and maximum value by magnitude, or simply hard-code the desired domain.

For the *y*-axis, use [rangeRoundBands][5] to divide the vertical space into bands for each bar and specify the amount of padding between bars. The input (domain) to the ordinal scale is some identifying data—such as a name or a unique id. A simple such identifier is the data’s index:

    var y = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.name; }))
        .rangeRoundBands([0, height], .2);

Use both scales to position the bars. This is made slightly tricky in that SVG rects are positioned (the `x` and `y` attributes) by their top-left corner and cannot have a negative width or height. So, we must use the *x*- and *y*-scales to compute the position of the top-left corner, depending on whether the associated value is positive or negative: if the value is positive, then the data value determines the right edge of the bar, while if it’s negative, it determines the left edge of the bar. Hence the conditionals:

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(Math.min(0, d.value)); })
        .attr("y", function(d) { return y(d.name); })
        .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
        .attr("height", y.rangeBand());

Lastly, you can add an axis to display tick marks on top. You might also compute a fill style (or even a gradient) to alter the differentiate the appearance of positive and negative values. 

  [1]: https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-linear
  [2]: https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal
  [3]: https://github.com/mbostock/d3/wiki/Arrays#wiki-d3_extent
  [4]: https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-linear_nice
  [5]: https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeRoundBands
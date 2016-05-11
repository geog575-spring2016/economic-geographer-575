var mouseMoveControl = true;
function initializeChoropleth(data) {
  var map = d3.select("#map2")
    .append("svg")
    .attr("id", "d3map")
    .attr("class", "map")
    .attr("width", "100%")
    .attr("height", "100%");
    var projection = d3.geo.albers()
      .center([-80, 40])
      .rotate([90, 0, 0])
      .parallels([30.5, 44.8])
      .scale(1000)
      .translate([0, 0]);
      var path = d3.geo.path()
        .projection(projection);
  setEnumerationUnits(map, path, data)
  return {
    map:map,
    projection:projection,
    path:path,
  }

}

function setEnumerationUnits(map, path, data){
var counties = map.selectAll()
    .data(data.features)
    .enter()
    .append("path")
    .attr("class","counties")
    .attr("fips", function(d){
        return d.properties.FIPS;
    })
    .attr("d", path)
//    .style("fill", function(d){
//          return choropleth(d.properties, bivariates);
//    })
    .style("stroke", "#000")
    .style("stroke-width", "0.1px")

  //add style descriptor to each path
var desc = counties.append("desc")
    .text('{"stroke": "#000", "stroke-width": "0.5px"}');
};

function updateChoropleth(choropleth, FIPSxData, xCol, FIPSyData, yCol, year, bivariate) {
  colors = {}
  colors[[-1,-1]]=window.getComputedStyle(document.getElementById("A1")).fill
  colors[[ 0,-1]]=window.getComputedStyle(document.getElementById("B1")).fill
  colors[[ 1,-1]]=window.getComputedStyle(document.getElementById("C1")).fill
  colors[[-1, 0]]=window.getComputedStyle(document.getElementById("A2")).fill
  colors[[ 0, 0]]=window.getComputedStyle(document.getElementById("B2")).fill
  colors[[ 1, 0]]=window.getComputedStyle(document.getElementById("C2")).fill
  colors[[-1, 1]]=window.getComputedStyle(document.getElementById("A3")).fill
  colors[[ 0, 1]]=window.getComputedStyle(document.getElementById("B3")).fill
  colors[[ 1, 1]]=window.getComputedStyle(document.getElementById("C3")).fill
  var counties = d3.selectAll(".counties")
      .transition()
      .duration(1000)
      .style('fill',function(d){
        xVal = FIPSxData[d.properties.FIPS]
        yVal = FIPSyData[d.properties.FIPS]
        lookupXCoord = -1 + (xVal>=xQuantile01) + (xVal>=xQuantile02)
        lookupYCoord = -1 + (yVal>=yQuantile01) + (yVal>=yQuantile02)
        return colors[[lookupXCoord,lookupYCoord]]
//          return choropleth(d.propertiesFIPS], bivariates)
      });
}

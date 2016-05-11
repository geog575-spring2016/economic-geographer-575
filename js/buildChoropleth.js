var mouseMoveControl = true;
function initializeChoropleth(data) {
  var map = L.map('map2' ,{
      center: [40, -120],
      zoom: 4
  })

  createTileLayer(map)

  var dataLayer = setEnumerationUnits(map, dataLayer, data)
  return {
    map:map,
    dataLayer: dataLayer
//    projection:projection,
//    path:path,
  }

}
function createTileLayer(map) {
  var mapboxAccessToken = "pk.eyJ1IjoiY2F0aGVyaW5lc3RyZWlmZmVyIiwiYSI6ImNpa3BrOTVlaTEyNmZ0aWo3eDlyaThraGMifQ.bYUxm5s4cRD2iRGqvpNNBA"
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    attribution: '&copy; <a href="http://mapbox.com/">Mapbox</a> icon: Invitro Estudio; data source: UNHCR'
}).addTo(map);
}
function setEnumerationUnits(map, dataLayer, data) {
  var dataLayer = L.geoJson(data, {className: "counties"}).addTo(map)
  dataLayer.setStyle(function(feature) {
    return {
      weight: .1,
      color: 'black',
      dashArray: '3',
      opacity: 1,
      fillOpacity: 1,
    }
  })
//var counties = map.selectAll()
//    .attr("class","counties")
//    .attr("fips", function(d){
//        return d.properties.FIPS;
//    })
//    .attr("d", path)
//    .style("fill", function(d){
//          return choropleth(d.properties, bivariates);
//    })

  //add style descriptor to each path
//var desc = counties.append("desc")
//    .text('{"stroke": "#000", "stroke-width": "0.5px"}');
return dataLayer
};

function updateChoropleth(choropleth, FIPSxData, xCol, FIPSyData, yCol, year, bivariate) {
  colors = {}
  colors[[-1, 1]]=window.getComputedStyle(document.getElementById("A1")).fill
  colors[[ 0, 1]]=window.getComputedStyle(document.getElementById("B1")).fill
  colors[[ 1, 1]]=window.getComputedStyle(document.getElementById("C1")).fill
  colors[[-1, 0]]=window.getComputedStyle(document.getElementById("A2")).fill
  colors[[ 0, 0]]=window.getComputedStyle(document.getElementById("B2")).fill
  colors[[ 1, 0]]=window.getComputedStyle(document.getElementById("C2")).fill
  colors[[-1,-1]]=window.getComputedStyle(document.getElementById("A3")).fill
  colors[[ 0,-1]]=window.getComputedStyle(document.getElementById("B3")).fill
  colors[[ 1,-1]]=window.getComputedStyle(document.getElementById("C3")).fill
  choropleth.dataLayer.eachLayer(function(layer) {
    xVal = FIPSxData[layer.feature.properties.FIPS]
    yVal = FIPSyData[layer.feature.properties.FIPS]
    lookupXCoord = -1 + (xVal>=xQuantile01) + (xVal>=xQuantile02)
    lookupYCoord = -1 + (yVal>=yQuantile01) + (yVal>=yQuantile02)
    layer.setStyle({
                    fillColor: colors[[lookupXCoord,lookupYCoord]]
                });
  })
}

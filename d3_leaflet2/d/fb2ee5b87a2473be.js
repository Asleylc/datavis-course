// https://observablehq.com/d/fb2ee5b87a2473be@436
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# D3 com Crossfilter, DC.js e Leaflet parte 2`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<code>css</code> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.0/css/bootstrap.min.css" integrity="sha384-PDle/QlgIONtM1aqA2Qemk5gPOE7wFq8+Em+G/hmo5Iq0CCmYZLv3fVRDJ4MMwEA" crossorigin="anonymous">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
 integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
 crossorigin=""/>`
)});
  main.variable(observer("buildvis")).define("buildvis", ["md","container","dc","colorScale","typeDimension","d3","typeGroup","dayDimension","dataset","crimesByDay"], function(md,container,dc,colorScale,typeDimension,d3,typeGroup,dayDimension,dataset,crimesByDay)
{
  let view = md`${container()}`

  let barChart = dc.barChart(view.querySelector("#CrimeType-chart"))
  barChart.width(480)
          .height(150)
          .colors(colorScale)
          .colorAccessor(d => d.key)
          .dimension(typeDimension)
          .x(d3.scaleBand())
          .xUnits(dc.units.ordinal)
          .gap(60)
          .elasticY(true)
          .group(typeGroup)  
          .brushOn(false)
  
  let seriesChart = dc.seriesChart(view.querySelector("#CrimeDay-chart"))


  seriesChart.width(480)
             .height(150)
             .colors(colorScale)
             .dimension(dayDimension)
             .x(d3.scaleTime()
                .domain(d3.extent(dataset, d => d3.timeDay(d.date))))
             .group(crimesByDay)                   
             .xUnits(d3.timeDays)
             .brushOn(false)
             .elasticY(true)                          
             .yAxisLabel("Number of crimes")
             .xAxisLabel("Time")
             .mouseZoomable(true)
             .seriesAccessor((d) => d.key[0])
             .keyAccessor((d) => d.key[1])
             .valueAccessor((d) => d.value)

             
  dc.renderAll()
  return view  

}
);
  main.variable(observer("map")).define("map", ["buildvis","L"], function(buildvis,L)
{
 buildvis;
 let mapInstance = L.map('mapid').setView([41.881832, -87.623177], 10)
  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  attribution: "Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
  maxZoom: 17
  }).addTo(mapInstance)
 return mapInstance
}
);
  main.variable(observer("circlesLayer")).define("circlesLayer", ["L","map"], function(L,map){return(
L.layerGroup().addTo(map)
)});
  main.variable(observer("circles")).define("circles", ["circlesLayer","dataset","L","colorScale"], function(circlesLayer,dataset,L,colorScale)
{
 circlesLayer.clearLayers()
 dataset.forEach( function(d) {
 let circle = L.circle([d.latitude, d.longitude],100, {
 color: colorScale(d.type),
 weight: 2,
 fillColor: '#fecc5c',
 fillOpacity: 0.5
 })
 circle.bindPopup("crime "+d.key+" ,data: "+d.date)            
 circlesLayer.addLayer(circle) })
}
);
  main.variable(observer("colorScale")).define("colorScale", ["d3"], function(d3){return(
d3.scaleOrdinal()
  .domain(["HOMICIDE", "ROBBERY", "BURGLARY"])
  .range(["#ca0020", "#0571b0", "#fdae61"])
)});
  main.variable(observer("container")).define("container", function(){return(
function container() { 
  return `
<main role="main" class="container">
    <div class="row">
      <h4> Chicago Crimes</h4>
    </div>
    <div class='row'>
        <div id="mapid" class="col-6">
        </div>        
        <div class="col-6">
          <div id='CrimeType-chart'>
          <h5> Number of crimes by type </h5>
          </div>
         <div class="col-6">    
        <div id='CrimeDay-chart'>
          <h5> Number of crimes by day </h5>
        </div></div>
    </div>
</div>

   <p>Crime data via <a href="https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present/ijzp  q8t2">Chicago Data Portal</a>.</p>
  </main>
 `
}
)});
  main.variable(observer("dataset")).define("dataset", ["d3"], function(d3){return(
d3.csv('https://gist.githubusercontent.com/emanueles/13dfe2c1d43e11b5207bb4e6125d71bf/raw/41d14f8fbd9d6cd9e8ad074f8417cff1329ab339/chicago_crimes_sept_2019.csv').then(function(data) {
 
  let parseDate = d3.utcParse("%m/%d/%Y")  
  
  data.forEach(function(d){       
      d.date = parseDate(d.Date.substr(0,10))
      d.longitude = +d.Longitude
      d.latitude = +d.Latitude
      d.type = d['Primary Type']
   })
  return data
})
)});
  main.variable(observer("data")).define("data", ["crossfilter","dataset"], function(crossfilter,dataset){return(
crossfilter(dataset)
)});
  main.variable(observer("latitudeDim")).define("latitudeDim", ["data"], function(data){return(
data.dimension(d => d.latitude)
)});
  main.variable(observer("longitudeDim")).define("longitudeDim", ["data"], function(data){return(
data.dimension(d => d.longitude)
)});
  main.variable(observer("dateDimension")).define("dateDimension", ["data"], function(data){return(
data.dimension(d => d.date)
)});
  main.variable(observer("typeDimension")).define("typeDimension", ["data"], function(data){return(
data.dimension(d => d.type)
)});
  main.variable(observer("typeGroup")).define("typeGroup", ["typeDimension"], function(typeDimension){return(
typeDimension.group()
)});
  main.variable(observer("dayDimension")).define("dayDimension", ["data","d3"], function(data,d3){return(
data.dimension(d => [d.type,d3.timeDay(d.date)])
)});
  main.variable(observer("crimesByDay")).define("crimesByDay", ["dayDimension"], function(dayDimension){return(
dayDimension.group()
)});
  main.variable(observer()).define(["html"], function(html){return(
html`Esta célula inclui o css do dc.
<style>
#mapid {
    width:650px;
    height:480px;
}

.dc-chart path.dc-symbol, .dc-legend g.dc-legend-item.fadeout {
  fill-opacity: 0.5;
  stroke-opacity: 0.5; }

.dc-chart rect.bar {
  stroke: none;
  cursor: pointer; }
  .dc-chart rect.bar:hover {
    fill-opacity: .5; }

.dc-chart rect.deselected {
  stroke: none;
  fill: #ccc; }

.dc-chart .pie-slice {
  fill: #fff;
  font-size: 12px;
  cursor: pointer; }
  .dc-chart .pie-slice.external {
    fill: #000; }
  .dc-chart .pie-slice :hover, .dc-chart .pie-slice.highlight {
    fill-opacity: .8; }

.dc-chart .pie-path {
  fill: none;
  stroke-width: 2px;
  stroke: #000;
  opacity: 0.4; }

.dc-chart .selected path, .dc-chart .selected circle {
  stroke-width: 3;
  stroke: #ccc;
  fill-opacity: 1; }

.dc-chart .deselected path, .dc-chart .deselected circle {
  stroke: none;
  fill-opacity: .5;
  fill: #ccc; }

.dc-chart .axis path, .dc-chart .axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges; }

.dc-chart .axis text {
  font: 10px sans-serif; }

.dc-chart .grid-line, .dc-chart .axis .grid-line, .dc-chart .grid-line line, .dc-chart .axis .grid-line line {
  fill: none;
  stroke: #ccc;
  shape-rendering: crispEdges; }

.dc-chart .brush rect.selection {
  fill: #4682b4;
  fill-opacity: .125; }

.dc-chart .brush .custom-brush-handle {
  fill: #eee;
  stroke: #666;
  cursor: ew-resize; }

.dc-chart path.line {
  fill: none;
  stroke-width: 1.5px; }

.dc-chart path.area {
  fill-opacity: .3;
  stroke: none; }

.dc-chart path.highlight {
  stroke-width: 3;
  fill-opacity: 1;
  stroke-opacity: 1; }

.dc-chart g.state {
  cursor: pointer; }
  .dc-chart g.state :hover {
    fill-opacity: .8; }
  .dc-chart g.state path {
    stroke: #fff; }

.dc-chart g.deselected path {
  fill: #808080; }

.dc-chart g.deselected text {
  display: none; }

.dc-chart g.row rect {
  fill-opacity: 0.8;
  cursor: pointer; }
  .dc-chart g.row rect:hover {
    fill-opacity: 0.6; }

.dc-chart g.row text {
  fill: #fff;
  font-size: 12px;
  cursor: pointer; }

.dc-chart g.dc-tooltip path {
  fill: none;
  stroke: #808080;
  stroke-opacity: .8; }

.dc-chart g.county path {
  stroke: #fff;
  fill: none; }

.dc-chart g.debug rect {
  fill: #00f;
  fill-opacity: .2; }

.dc-chart g.axis text {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none; }

.dc-chart .node {
  font-size: 0.7em;
  cursor: pointer; }
  .dc-chart .node :hover {
    fill-opacity: .8; }

.dc-chart .bubble {
  stroke: none;
  fill-opacity: 0.6; }

.dc-chart .highlight {
  fill-opacity: 1;
  stroke-opacity: 1; }

.dc-chart .fadeout {
  fill-opacity: 0.2;
  stroke-opacity: 0.2; }

.dc-chart .box text {
  font: 10px sans-serif;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none; }

.dc-chart .box line {
  fill: #fff; }

.dc-chart .box rect, .dc-chart .box line, .dc-chart .box circle {
  stroke: #000;
  stroke-width: 1.5px; }

.dc-chart .box .center {
  stroke-dasharray: 3, 3; }

.dc-chart .box .data {
  stroke: none;
  stroke-width: 0px; }

.dc-chart .box .outlier {
  fill: none;
  stroke: #ccc; }

.dc-chart .box .outlierBold {
  fill: red;
  stroke: none; }

.dc-chart .box.deselected {
  opacity: 0.5; }
  .dc-chart .box.deselected .box {
    fill: #ccc; }

.dc-chart .symbol {
  stroke: none; }

.dc-chart .heatmap .box-group.deselected rect {
  stroke: none;
  fill-opacity: 0.5;
  fill: #ccc; }

.dc-chart .heatmap g.axis text {
  pointer-events: all;
  cursor: pointer; }

.dc-chart .empty-chart .pie-slice {
  cursor: default; }
  .dc-chart .empty-chart .pie-slice path {
    fill: #fee;
    cursor: default; }

.dc-data-count {
  float: right;
  margin-top: 15px;
  margin-right: 15px; }
  .dc-data-count .filter-count, .dc-data-count .total-count {
    color: #3182bd;
    font-weight: bold; }

.dc-legend {
  font-size: 11px; }
  .dc-legend .dc-legend-item {
    cursor: pointer; }

.dc-hard .number-display {
  float: none; }

div.dc-html-legend {
  overflow-y: auto;
  overflow-x: hidden;
  height: inherit;
  float: right;
  padding-right: 2px; }
  div.dc-html-legend .dc-legend-item-horizontal {
    display: inline-block;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer; }
    div.dc-html-legend .dc-legend-item-horizontal.selected {
      background-color: #3182bd;
      color: white; }
  div.dc-html-legend .dc-legend-item-vertical {
    display: block;
    margin-top: 5px;
    padding-top: 1px;
    padding-bottom: 1px;
    cursor: pointer; }
    div.dc-html-legend .dc-legend-item-vertical.selected {
      background-color: #3182bd;
      color: white; }
  div.dc-html-legend .dc-legend-item-color {
    display: table-cell;
    width: 12px;
    height: 12px; }
  div.dc-html-legend .dc-legend-item-label {
    line-height: 12px;
    display: table-cell;
    vertical-align: middle;
    padding-left: 3px;
    padding-right: 3px;
    font-size: 0.75em; }

.dc-html-legend-container {
  height: inherit; }
</style>`
)});
  main.variable(observer("dc")).define("dc", ["require"], function(require){return(
require('dc')
)});
  main.variable(observer("crossfilter")).define("crossfilter", ["require"], function(require){return(
require('crossfilter2')
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3')
)});
  main.variable(observer("$")).define("$", ["require"], function(require){return(
require('jquery').then(jquery => {
  window.jquery = jquery;
  return require('popper@1.0.1/index.js').catch(() => jquery);
})
)});
  main.variable(observer("bootstrap")).define("bootstrap", ["require"], function(require){return(
require('bootstrap')
)});
  main.variable(observer("L")).define("L", ["require"], function(require){return(
require('leaflet@1.5.1')
)});
  return main;
}

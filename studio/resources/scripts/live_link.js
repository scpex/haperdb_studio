
$(document).ready(function () {
    google.charts.load('current', { packages: ['corechart', 'line', 'bar', 'map', 'scatter', 'gauge', 'treemap', 'geochart'], 'mapsApiKey': 'AIzaSyAP0UYqFCuSOOIMOQ6Ltmrx1B79XUw4Tmw' });
    var graphDetail = document.getElementById('graphDetail').value;
    graphDetail = JSON.parse(graphDetail);    
    var g = $('.chart_div').get();    
    selectChart(graphDetail.graphType, graphDetail.data, graphDetail.options, g[0]);
    if (graphDetail.graphType != 'Bar')
        selectChart('Bar', graphDetail.data, graphDetail.options, g[1]);
    else
        selectChart('Pie', graphDetail.data, graphDetail.options, g[1]);

})
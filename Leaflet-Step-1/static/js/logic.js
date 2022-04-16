var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var layers = {
  layer: new L.LayerGroup()
};

var map = L.map("map", {
  center: [40.000, -100.000],
  zoom: 4.5,
  layers: [
    layers.layer
  ]
});

streetmap.addTo(map);

var overlays = {
  "Earthquakes": layers.layer
};

L.control.layers(null, overlays).addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(function(EarthquakeData) {

    let EarthquakeList = EarthquakeData.features;
    for (var i = 0; i < EarthquakeList.length; i++) {
        var Earthquake = EarthquakeList[i];
        var depth = Earthquake.geometry.coordinates[2];
        d = depth/300 + .1;
        if (d > 1) {d = 1};
        function getColor(depth) {
            return depth > 500 ? "#63DAF6" :
                   depth > 400  ? "#63F6DA" :
                   depth > 300  ? "#63F695" :
                   depth > 200  ? "#89F663" :
                   depth > 100   ? "#B8F663" :
                                   "#F2F663";
        }
        
        var EarthquakeSize = (Earthquake.properties.mag * 50000)*Math.cos((Earthquake.geometry.coordinates[1]/180)*Math.PI)
        var newQuake = L.circle([Earthquake.geometry.coordinates[1],Earthquake.geometry.coordinates[0]], {
            color: 'black',
            weight: 1,
            fillColor: getColor(Earthquake.geometry.coordinates[2]),
            fillOpacity: .65,
            radius: EarthquakeSize
        });
        newQuake.addTo(layers.layer);
        newQuake.bindPopup(" Magnitude: " + Earthquake.properties.mag + "<br> Depth: " + depth + "<br> Place: " + Earthquake.properties.place);
    };

    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        grades = [0, 100, 200, 300, 400, 500];
        labels = ["#F2F663","#B8F663","#89F663","#63F695","#63F6DA","#63DAF6"];
  
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += '<i style="background:' + labels[i] + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');  
        }
        return div;
    };
    info.addTo(map);
});
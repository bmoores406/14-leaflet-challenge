
var grayMap = L.tileLayer("https://api.mapbox.com/styles/v1/{style_id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    style_id: "mapbox/light-v10",
    accessToken: API_KEY
});

var myMap = L.map("map", {
    center: [28.5383, -81.3792],
    zoom: 12
});

grayMap.addTo(myMap);

// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

console.log(data.features.map(function(earthquake) {
    return earthquake.properties.mag
}))


    // Function to Determine Style of Marker Based on the Magnitude of the Earthquake
    function createFeatures(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Function to Determine Color of Marker Based on the Magnitude of the Earthquake
    function getColor(depth) {
        switch(true) {
            case depth > 90:
                return "#ea2c2c";
            case depth > 70:
                return "#ea822c";
            case depth > 50:
                return "#ee9c00";
            case depth > 30:
                return "#eecc00";
            case depth > 10:
                return "#d4ee00";
            default: 
                return "#98ee00";
        }
    }

    // Function to Determine Style of Marker Based on the Magnitude of the Earthquake
    function getRadius (magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }

    // Create a GeoJSON Layer Containing the Features Array on the earthquakeData Object
    L.geoJson(data, {
        pointToLayer: function(features, latlng) {
            return L.circleMarker(latlng);
        },
        style: createFeatures,
        onEachFeature: function(features, layer) {
            layer.bindPopup(
                "Magnitude:"
                + features.properties.mag
                + "< br > Depth:"
                + features.geometry.coordinates[2]
                + "< br > Location:"
                + features.properties.place
            );
        }
    }).addTo(myMap);

    // Set Up Legend
    var legend = L.control({ position: "bottomright"});

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        grades = [-10,10,30,50,70,90],
        colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];
        for(var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i = 'background: "+ colors[i] + "' ></i>"
            + grades[i] + (grades[i + 1] ? "&ndash:" + grades[i + 1] + "<br>": "+");
        }
        return div;
    };

    // Add Legend to my Map
    legend.addTo(myMap);
});

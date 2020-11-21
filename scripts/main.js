// configs
import * as config_planes from '../configs/planes.js'
import * as config_route from '../configs/route.js'

// config variables
var planes = config_planes.default.data
var route = config_route.default.data

// global variables
var selector = -1
var distance = 0

// start
function start() {

    let card = document.getElementById("card")
    let startbtn = document.createElement("BUTTON")
    startbtn.classList.add("pfstartbtn")
    startbtn.id = "startbtn"
    startbtn.innerText = "Start"

    card.appendChild(startbtn)
}

function load() {
    let card = document.getElementById("card")
    let loadbtn = document.createElement("BUTTON")
    loadbtn.classList.add("pfloadbtn")
    loadbtn.id = "loadbtn"
    loadbtn.innerText = "Load"

    card.appendChild(loadbtn)
}


// create info
function information() {

    // selector
    let card = document.getElementById("card")
    let info = document.createElement("div")

    let ha1 = document.createElement('a')
    ha1.href = "#"
    ha1.classList.add("ha1")
    let hh1 = document.createElement('h2')
    hh1.classList.add("hh1")
    hh1.innerText = "Information"

    let txta1 = document.createElement('a')
    txta1.href = "#"
    txta1.classList.add("txta1")
    let txtp1 = document.createElement('p')
    txtp1.classList.add("txtp1")
    txtp1.innerText = "Select an aircraft:"
    
    let logo1 = document.createElement("plogo1")
    logo1.classList.add("plogo1")

    card.appendChild(info)

    info.appendChild(ha1)
    ha1.appendChild(hh1)

    info.appendChild(txta1)
    txta1.appendChild(txtp1)

    info.appendChild(logo1)

    // description
    let desc1 = document.createElement("div")
    desc1.classList.add("pdesc1")

    let imga1 = document.createElement("a")
    imga1.href = "#"

    let img1 = document.createElement("img")
    img1.id = "img1"
    img1.src = "images/invalid.png"
    img1.classList.add("pimg1")

    let namea1 = document.createElement("a")
    namea1.classList.add("namea1")
    namea1.href = "#"
    let nameh1 = document.createElement("h3")
    nameh1.id = "nameh1"
    nameh1.innerText = "None"
    nameh1.classList.add("nameh1")

    let specsa1 = document.createElement("a")
    specsa1.classList.add("specsa1")
    specsa1.href = "#"
    let specsp1 = document.createElement("p")
    specsp1.id = "specsp1"
    specsp1.classList.add("specsp1")
    specsp1.href = "#"

    // list of aircrafts
    for(let i = 0; i < planes.length; i++) {

        let radiobtn = document.createElement("INPUT")
        radiobtn.setAttribute("type", "radio")

        let labelbtn = document.createElement("Label")
        labelbtn.id = "p" + i + "logo1"
        labelbtn.classList.add("plabelbtn")
        labelbtn.style.backgroundImage = planes[i].logo

        specsp1.innerText = "Average speed: " + "?" + " KM/H" + "\n" + "Distance: " + distance + " KM" + "\n" + "Time: " + "?" + " H" + "\n" + "Fuel: " + "?" + " L" +  "\n" + "Fuel Consumption: " + "?" + " L/H"

        logo1.appendChild(radiobtn)
        logo1.appendChild(labelbtn)

        info.appendChild(desc1)
        desc1.appendChild(imga1)
        imga1.appendChild(img1)

        desc1.appendChild(namea1)
        namea1.appendChild(nameh1)
        
        desc1.appendChild(specsa1)
        specsa1.appendChild(specsp1)
    }   
}

// FIX
function speed() {
    let card = document.getElementById("card")
    let speed = document.createElement("div")

    // ADD SLIDER (FIX!!!)
    let sliderinp = document.createElement("INPUT")
    sliderinp.id = "sliderinp"
    sliderinp.setAttribute("type", "range")
    sliderinp.setAttribute("min", "1")
    sliderinp.setAttribute("max", "1000")
    sliderinp.classList.add("sliderinp")
    sliderinp.value = "1"

    let slidera = document.createElement("a")
    slidera.classList.add("slidera")
    slidera.href = "#"

    let sliderl = document.createElement("label")
    sliderl.classList.add("sliderl")
    sliderl.innerHTML = "Speed";
    sliderl.htmlFor = "sliderinp"

    card.appendChild(speed)

    speed.appendChild(sliderinp)

    speed.appendChild(slidera)
    slidera.appendChild(sliderl)
}

// OPENLAYERS

function mapAPI() {

    var raster = new ol.layer.Tile({
        source: new ol.source.OSM(),
    });

    var source = new ol.source.Vector();

    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 0, 0, 0.7)',
                width: 2,
            }),
        }),
    });
    
    var fincoords;
    var extcoords = [];

    var sketch;
    var measureTooltipElement;
    var measureTooltip;

    var drawing = false

    var animating = false;
    var startButton = document.getElementById('startbtn');
    var loadButton = document.getElementById('loadbtn');


    var step = 1, interval;

    startButton.disabled = true

    var styleMarker = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: 'images/icon.png',
        }),
        zIndex: 5
    })


    var geoMarker = new ol.Feature();
    geoMarker.setStyle(styleMarker);

    var center = [3593151.825630, 6339992.874086]
    var map = new ol.Map({
        controls: ol.control.defaults().extend([
            new ol.control.ScaleLine()
        ]),
        target: 'map',
        layers: [
            raster,
            vector
        ],
        view: new ol.View({
            center: center,
            zoom: 6
        }),
        interactions: ol.interaction.defaults({ doubleClickZoom: false })
    });


    var formatLength = function (line) {
        var length = ol.sphere.getLength(line);
        var output;
        if (length > 100) {
            output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
        } else {
            output = Math.round(length * 100) / 100 + ' ' + 'm';
        }

        distance = Math.round((length / 1000) * 100) / 100
        return output;
    };

    var draw; // global so we can remove it later

    draw = new ol.interaction.Draw({
        source: source,
        type: 'LineString',
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.2)',
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 0, 0, 0.7)',
                width: 2,
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.7)',
                }),
            }),
        }),
    });

    var listener;


    function addDrawInteraction() {

        map.addInteraction(draw);

        var keydown = function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode === 27 && drawing == true) {
                draw.removeLastPoint();
                if (fincoords.length <= 1) {
                    fuelRestrict()
                    map.removeOverlay(measureTooltip);
                    map.removeInteraction(draw);
                    map.addInteraction(draw)
                }

            }
        };
        
        document.addEventListener('keydown', keydown, false);
        
        // set a custom listener
        draw.set('escKey', '');

        
        draw.on('drawstart', function (evt) {

            drawing = true

            startButton.disabled = true

            extcoords = []


            // set sketch 
            sketch = evt.feature;
            sketch.setId(0)

            var tooltipCoord = evt.coordinate;

            createMeasureTooltip();

            listener = sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;

                for (let i = 0; i < planes.length; i++) {
                    planes[i].s = distance
                }

                if (selector == -1) {
                    specsp1.innerText = "Average speed: " + "?" + " KM/H" + "\n" + "Distance: " + distance + " KM" + "\n" + "Time: " + "?" + " H" + "\n" + "Fuel: " + "?" + " L" +  "\n" + "Fuel Consumption: " + "?" + " L/H"
                } else {
                    specsp1.innerText = "Average speed: " + planes[selector].v + " KM/H" + "\n" + "Distance: " + distance + " KM" + "\n" + "Time: " + Math.round(distance / planes[selector].v) + " H" + "\n" + "Fuel: " + planes[selector].fuel + " L" +  "\n" + "Fuel Consumption: " + planes[selector].fuelperhour + " L/H"
                }

                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
                fincoords = geom.getCoordinates()

                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        });

        draw.on('drawend', function (evt) {

            drawing = false

            fuelRestrict()
            
            fincoords = sketch.getGeometry().getCoordinates()

            geoMarker.setGeometry(new ol.geom.Point(fincoords[0]));
            source.addFeatures([geoMarker]);
            geoMarker.setId(1);

            step = 1
            iconRotation()

            measureTooltipElement.className = 'ol-tooltip';
            measureTooltip.setOffset([0, -7]);

            measureTooltipElement = measureTooltip.getElement();
            ol.Observable.unByKey(listener);
            map.removeInteraction(draw);

        });
    }

    var modify;

    modify = new ol.interaction.Modify({
        source: source,
        type: 'LineString',
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(255, 0, 0, 0.7)',
                }),
                fill: new ol.style.Fill({
                color: 'rgba(255, 0, 0, 0.7)',
                }),
            }),
        }),
    });

    function addModifyInteraction() {

        map.addInteraction(modify);

        var keydown = function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode === 27 && drawing == false && animating == false && fincoords.length >= 2) { // esc key
                // dispatch event
                modify.set('escKey', Math.random());         
            }
        };
        
        document.addEventListener('keydown', keydown, false);
        
        // set a custom listener
        modify.set('escKey', '');

        modify.on('modifystart', function(evt) {
            sketch = source.getFeatureById(0);
            
            var tooltipCoord = evt.coordinate;

            extcoords = []
            
            listener = sketch.getGeometry().on('change', function(evt) {
                var geom = evt.target;
                
                var output;

                for (let i = 0; i < planes.length; i++) {
                    planes[i].s = distance
                }

                fuelRestrict()

                output = formatLength((geom));
                tooltipCoord = geom.getLastCoordinate();

                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        }, this);

        modify.on('modifyend', function() {

            fincoords = sketch.getGeometry().getCoordinates()

            fuelRestrict()

            geoMarker.setGeometry(new ol.geom.Point(fincoords[0]));

            step = 1
            iconRotation()

            measureTooltipElement.className = 'ol-tooltip';
            measureTooltip.setOffset([0, -7]);

            measureTooltipElement = measureTooltip.getElement();
            ol.Observable.unByKey(listener);
        }, this);


        modify.on('change:escKey', function(evt) {

            
            var tooltipCoord = evt.coordinate;

            var geom = sketch.getGeometry()
            
            var coords = geom.getCoordinates();
            var len = coords.length;

            var new_coords = coords.slice(0, len - 1);
            geom.setCoordinates(new_coords);

            fincoords = new_coords

            var output;
            output = formatLength((geom));

            tooltipCoord = geom.getLastCoordinate();

            fuelRestrict()

            geoMarker.setGeometry(new ol.geom.Point(fincoords[0]));

            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);

            if (len == 2) {
                startButton.disabled = true
                source.removeFeature(source.getFeatureById(0))
                source.removeFeature(geoMarker);
                map.removeOverlay(measureTooltip);
                map.addInteraction(draw);
            } else {
                iconRotation()
            }
        });
    }

    // creates a new measure tooltip
    function createMeasureTooltip() {
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'ol-tooltip';
        measureTooltip = new ol.Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
        });
        map.addOverlay(measureTooltip);
    }


    var moveMarker = function() {

        if (animating) {

            geoMarker.setGeometry(new ol.geom.Point(extcoords[step]));
            step++;
            
            if (step >= extcoords.length) {
                step = 1
                loadButton.disabled = false
                sliderinp.disabled = false
                stopAnimation()
                return
            }

            iconRotation()
        }
    }


    // fire the animation
    function startAnimation() {

        changeCoords()

        if (!fincoords ? false : fincoords.length > 1) {
            if (animating) {
                stopAnimation()
            } else {
                animating = true
                startButton.textContent = 'Cancel';
                sliderinp.disabled = true

    
                map.removeInteraction(modify);
    
                source.removeFeature(geoMarker);
    
                source.addFeatures([geoMarker]);
                geoMarker.setId(1)
    
                map.once('postcompose', function() {
                    interval = setInterval(moveMarker, 0);
                });
            }
        }
    }

    function stopAnimation() {
        animating = false;
        
        startButton.textContent = 'Start';        

        map.addInteraction(modify);

        map.once('postcompose', function() {
            clearInterval(interval);
        });
    }

    function loadRoute() {
        drawing = false

        fincoords = route

        if (source.getFeatureById(0)) {
            source.removeFeature(source.getFeatureById(0))
        } else {
            createMeasureTooltip();
            map.removeInteraction(draw);
        }
            
        sketch = new ol.Feature({
            geometry: new ol.geom.LineString(fincoords)
        });

        source.addFeature(sketch);
        sketch.setId(0);

        var geom = sketch.getGeometry()

        geom.setCoordinates(fincoords);

        geoMarker.setGeometry(new ol.geom.Point(fincoords[0]));
        
        if (source.getFeatureById(1)) {
            source.removeFeature(source.getFeatureById(1))
        }
        source.addFeatures([geoMarker]);
        geoMarker.setId(1);

        stopAnimation()
        step = 1
        iconRotation()

        sliderinp.disabled = false

        var output;

        output = formatLength((geom));
        var tooltipCoord = fincoords[fincoords.length - 1]

        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);

        fuelRestrict()

    }

    function selectPlane() {
        for (let i = 0; i < planes.length; i++) {
            document.getElementById("p" + i + "logo1").onclick = function() {
                if (!fincoords ? false : fincoords.length > 1) {
                    stopAnimation()
                    geoMarker.setGeometry(new ol.geom.Point(fincoords[0]));
                    step = 1
                    iconRotation()
                } else {
                    startButton.disabled = true
                }

                selector = i
                let maxdistance = (planes[selector].fuel * planes[selector].v) / planes[selector].fuelperhour
                if (maxdistance < distance) {
                    startButton.disabled = true
                } else if (maxdistance > distance && fincoords != undefined && fincoords.length >= 2) {
                    startButton.disabled = false
                    sliderinp.disabled = false
                }

                document.getElementById("img1").src = planes[i].img
                document.getElementById("nameh1").innerText = planes[i].name
                specsp1.innerText = "Average speed: " + planes[i].v + " KM/H" + "\n" + "Distance: " + distance + " KM" + "\n" + "Time: " + Math.round(distance / planes[i].v) + " H" + "\n" + "Fuel: " + planes[selector].fuel + " L" +  "\n" + "Fuel Consumption: " + planes[selector].fuelperhour + " L/H"
            }
        }
    }

    function iconRotation() {

        if (extcoords.length) {
            var x1 = extcoords[step][0]
            var x2 = extcoords[step - 1][0]
    
            var y1 = extcoords[step][1]
            var y2 = extcoords[step - 1][1]
        } else {
            var x1 = fincoords[step][0]
            var x2 = fincoords[step - 1][0]

            var y1 = fincoords[step][1]
            var y2 = fincoords[step - 1][1]
        }
        
        var alpharad = Math.acos((y2 - y1) / (Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))))

        var angle = x1 < x2 ? Math.PI + alpharad : Math.PI - alpharad

        styleMarker.image_.setRotation(angle)
        geoMarker.setStyle(styleMarker);
    }

    function changeCoords() {

        if (drawing == false && animating == false) {
            extcoords = []
            
            var delta = (0.001 * planes[selector].v) * sliderinp.value
            for (let i = 0; i < fincoords.length - 1; i++) {

                extcoords.push(fincoords[i])

                let x1 = fincoords[i][0]
                let x2 = fincoords[i + 1][0]

                let y1 = fincoords[i][1]
                let y2 = fincoords[i + 1][1]

                let len = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
                for (let j = delta; j < len - delta; j += delta) {
                    let lambda = j / (len - j)
                    let x = (x1 + lambda * x2 ) / (1 + lambda)
                    let y = (y1 + lambda * y2 ) / (1 + lambda)
                    extcoords.push([x, y])
                }
            }
            extcoords.push(fincoords[fincoords.length - 1])
        }
    }

    function fuelRestrict() {       
            
        if (selector == -1) {
            startButton.disabled = true
            specsp1.innerText = "Average speed: " + "?" + " KM/H" + "\n" + "Distance: " + distance + " KM" + "\n" + "Time: " + "?" + " H" + "\n" + "Fuel: " + "?" + " L" +  "\n" + "Fuel Consumption: " + "?" + " L/H"
        } else {
            let maxdistance = (planes[selector].fuel * planes[selector].v) / planes[selector].fuelperhour
            if (maxdistance < distance) {
                startButton.disabled = true
            } else {
                startButton.disabled = false                
            }
            specsp1.innerText = "Average speed: " + planes[selector].v + " KM/H" + "\n" + "Distance: " + distance + " KM" + "\n" + "Time: " + Math.round(distance / planes[selector].v) + " H" + "\n" + "Fuel: " + planes[selector].fuel + " L" +  "\n" + "Fuel Consumption: " + planes[selector].fuelperhour + " L/H"
        }
    }

    addDrawInteraction()
    addModifyInteraction()
    
    startButton.addEventListener('click', startAnimation, false);
    loadButton.addEventListener('click', loadRoute, false);

    selectPlane()
}


// MAIN
function main() {
    information()
    speed()
    start()
    load()
    mapAPI()
}

main()
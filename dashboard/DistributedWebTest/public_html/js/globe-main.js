console.log("D3 version:", d3.version);
 $(function() {

$( window ).resize(function() {
        recalcElementSizes();
        refresh();
    });
$("#overlaypane")
    //$("").dialog();
//    $("#dialog").dialog({
//        position: {
//            my: "right top",
//            at: "right-10 top+20",
//            of: window
//        },
//        drag: function(event, ui) {
//            //console.log("drag");
//            refresh();
//        },
//        resizeStop: function(event, ui) {
//            //console.log("dragStop");
//            refresh();
//        },
//        resize: function(event, ui) {
//            //console.log("dragStop");
//            refresh();
//        },
//        close: function(event, ui) {
//            //console.log("dragStop");
//            clickedPoint = null;
//            refresh();
//        },
//        autoOpen: false,
//        closeOnEscape: true,
//    });

});

var width = $("#boxy").width(),
    height = $("#boxy").height(),
    minDim = Math.min(width, height),
    skyheight=1.25,
    midheight=1.175,
    iconSize,
    pointSize,
    inset = 10,
    velocity = 2,
    flickDelta = 0,
    supressTime = 20,
    supress,
    then = Date.now()
    ;

supress = supressTime;
var lineData = [];
var clickedPoint;
var rotate = {x: 150, y: 15};

var projection = d3.geo.orthographic()
        .clipAngle(90)
        .rotate([rotate.x / 2, -rotate.y / 2])
        .precision(.1)
        .scale(220)
        ;
var sky = d3.geo.orthographic()
        .clipAngle(90)
        .rotate([rotate.x / 2, -rotate.y / 2])
        .precision(.1)
        .scale(220*skyheight)
        ;
var mid = d3.geo.orthographic()
        .clipAngle(90)
        .rotate([rotate.x / 2, -rotate.y / 2])
        .precision(.1)
        .scale(220*midheight)
        ;

var path = d3.geo.path().projection(projection).pointRadius(10);

var swoosh = d3.svg.line()
      .x(function(d) { return d[0] })
      .y(function(d) { return d[1] })
      .interpolate("cardinal")
      .tension(.05);

var links = [],
    arcLines = [];


var graticule = d3.geo.graticule().step([30, 30]);

var svg = d3.select("#boxy").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "globe earth");
//
//
//var m0, m1, m2,
        o0;

queue()
        .defer(d3.json, "./js/vendor/d3/world-110m.json")
//        .defer(d3.json, "./js/vendor/d3/world-50m.json")
        .defer(d3.json, "./js/pinger_mock_data.json")
        .await(ready);
recalcElementSizes();
function ready(error, world, places) {
//    console.log(places);
    svg.append("defs")
            .append("path")
            .datum({type: "Sphere"})
            .attr("id", "sphere")
            .attr("d", path)
            ;
    svg.selectAll("defs")
            .append("pattern")
            .attr("id", "xone_symbol")
            .attr("patternUnits", "userSpaceOnUse")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "186")
            .attr("height", "186")
            .append("image")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "186")
            .attr("height", "186")
            .attr("xlink:href", "./img/ExOne_symbol_debug.png")
            ;
    svg.append("use")
            .attr("class", "stroke earth")
            .attr("xlink:href", "#sphere");

    svg.append("use")
            .attr("class", "fill earth")
            .attr("xlink:href", "#sphere");

    svg.append("path")
            .datum(graticule.outline)
            .attr("class", "backcircle earth")
            .attr("d", path);

    svg.selectAll(".graticule")
            .data(graticule.lines)
            .enter().append("path")
            .attr("class", "graticule earth")

            .attr("d", path);

//    svg.append("path")
//            .datum(graticule.outline)
//            .attr("class", "foreground earth")
//            .attr("d", path);

    svg.append("path")
            .datum(topojson.object(world, world.objects.land))
            .attr("class", "land earth")

            .attr("d", path);

    svg.append("path")
            .datum(graticule)
            .attr("class", "graticule noclicks earth")
            .attr("d", path);

// 
//The line SVG Path we draw
//    var lineGraph = svg.append("path")
//            .attr("d", lineFunction(lineData))
//            .attr("class", "callout")
//            .attr("stroke", "#0b3e6f")
//            .attr("stroke-width", 4)
//            .attr("fill", "none");

//    svg.append("g")
//            .attr("class", "points")
//            .selectAll("text")
//            .data(places.features)
//            .enter()
//
//            //for circle-point------------------------------
//            .append("path")
//            .style("fill","black")
//            .attr("opacity",0.5)
////            .attr("d", path.pointRadius(function(d) {
////                if (d.properties)
//////            return 3+(iconSize*d.properties.isExOne);
////                    return d.properties.isExOne ? "0" : pointSize;
////            }))
//            .attr("d", path)
//            .on("click", pointClick)
//            ;
//            
        
      // spawn links between cities as source/target coord pairs
//  places.forEach(function(a) {
//    
//        links.push({
//          source: a.geometry.coordinates,
//          target: b.geometry.coordinates
//        })
//        
//        });
  // build geoJSON features from links array
//  console.log(places);
  places.forEach(function(e) {
//      console.log(e);
      links.push({
          source:[
              e.geoFrom.longitude,
              e.geoFrom.latitude
          ],
          target:[
              e.geoTo.longitude,
              e.geoTo.latitude
          ]
      })
    var feature =   { "type": "Feature", 
                    "properties" : {
                        "nodeInfo":e
                    },
                    "geometry": {
                        "type": "LineString", 
                        "coordinates": [
                            e.source,
                            e.target
                        ] }
                };
    arcLines.push(feature);
  });

//  svg.append("g").attr("class","arcs")
//    .selectAll("path").data(arcLines)
//    .enter().append("path")
//      .attr("class","arc")
//      .attr("d",path)

  svg.append("g").attr("class","flyers")
    .selectAll("path").data(places)
    .enter().append("path")
    .attr("class","flyer")
    .attr("d", function(d) { return swoosh(flying_arc(d)) })
    ;

            
            
    d3.select(self.frameElement).style("height", height + "px");
    
    
    
    

}

d3.timer(function() {
    var now = Date.now();
    var delta = (now - then) / 1000;
    if (supress > 0) {
        supress -= delta;
    } else {
        handleClose();
    }
    var curRotation = projection.rotate();
    flickDelta = flickDelta * .95;
    var rotateIncrement = delta * velocity * unitClamp((1 - supress));
    curRotation[0] = curRotation[0] + rotateIncrement + flickDelta / 6.0;;
    projection.rotate(curRotation);
    sky.rotate(curRotation);
    mid.rotate(curRotation);

    refresh();
    then = now;
});
d3.select(".globe")
        .on("touchstart", mousedown)
        .on("mousedown", mousedown)
        .on("mousemove", mousemove)
        .on("touchmove", mousemove)
        .on("mouseup", mouseup)
//        .on("mouseout", mouseup)
        .on("touchend", mouseup)
        ;
//svg.on("mouseout",mouseup);
var m0, o0, oldflick;
function mousedown() {
    m0 = [d3.event.pageX, d3.event.pageY];
    oldflick = m0[0];
    supress = supressTime;//resets the autorotate
    o0 = projection.rotate();
}
function mousemove() {
    if (m0) {
        var m1 = [d3.event.pageX, d3.event.pageY]
                , o1 = [o0[0] + (m1[0] - m0[0]) / 6, 
                  o0[1] + (m0[1] - m1[1]) / 6];
        oldflick = m1[0];
//    o1[1] = o1[1] > 30  ? 30  :
//            o1[1] < -30 ? -30 :
//            o1[1];
        o1[1] = -7.5;
        projection.rotate(o1);
        sky.rotate(o1);
        mid.rotate(o1);
        refresh();
    }
}
function mouseup() {
    if (m0) {
        flickDelta = d3.event.pageX - oldflick;
        mousemove();
        m0 = null;
    }
}

function refresh(duration) {
    //recalcCallout();
    svg
        .selectAll("#sphere")
        .attr("d", path);
    svg
        .selectAll(".earth")
        .attr("d", path);
//  svg.selectAll(".land").attr("d", path);
//  svg.selectAll(".point").attr("d", path);
    svg.selectAll(".point")
//       .filter(function(d){
//          return !d.properties.isExOne;
//      })

            .attr("d", path);
// svg.selectAll("point").attr("d",path);
    svg.selectAll(".site")
//      .filter(function(d){
//          console.log(d);
//          return d.properties.isExOne;
//      })
            .attr("transform", function(d) {
                return "translate(" + projection([
                    d.properties.longitude,
                    d.properties.latitude
                ]) + ")"
            })
            .attr("opacity", function(d) {
                var geoangle = d3.geo.distance(
                        d.geometry.coordinates,
                        [
                            -projection.rotate()[0],
                            projection.rotate()[1]
                        ]);
                var opacity=unitClamp((1.57079632679490-geoangle)*8);
                return opacity;
            })
            .attr("x", -(iconSize / 2.0))
            .attr("y", -(iconSize / 2.0))
            .attr("width", iconSize)
            .attr("height", iconSize)
            ;
    svg.selectAll(".callout")
            .attr("d", lineFunction(lineData));
    //lineGraph.attr("d",path);
    //path.attr("d", linkArc);

    //(duration ? feature.transition().duration(duration) : feature).attr("d", clip);
//  svg.selectAll(".arc").attr("d", path)
//    .attr("opacity", function(d) {
//        return fade_at_edge(d)
//    })
//;
  svg.selectAll(".flyer")
    .attr("d", function(d) { return swoosh(flying_arc(d)) })
    .attr("opacity", function(d) {
      return fade_at_edge(d)
    }) 
;
//  refresh();
}
function flying_arc(pts) {
    //console.log(pts);
  var source = 
//            pts.source,
              [       
              pts.geoFrom[0].longitude,
              pts.geoFrom[0].latitude
              ],
          target=[
              pts.geoTo[0].longitude,
              pts.geoTo[0].latitude
          ]


  var midptA = location_along_arc(source, target, .25);
  var midptB = location_along_arc(source, target, .75);
  var skypt = location_along_arc(source, target, .5);
  var result = [ projection(source),
//                 mid(midptA),
                 sky(skypt),
//                 mid(midptB),
                 projection(target)
             ]
  return result;
}
function fade_at_edge(d) {
    return d;
  var centerPos = projection.invert([width/2,height/2]),
      arc = d3.geo.greatArc(),
      start, end;
  // function is called on 2 different data structures..
  if (d.source) {
    start = d.source, 
    end = d.target;  
  }
  else {
    start = d.geometry.coordinates[0];
    end = d.geometry.coordinates[1];
  }
  
  var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
      end_dist = 1.57 - arc.distance({source: end, target: centerPos});
    
  var fade = d3.scale.linear().domain([-.1,0]).range([0,.1]) 
  var dist = start_dist < end_dist ? start_dist : end_dist; 

  return fade(dist)
}
function is_eclipsed(d){
    
}
function location_along_arc(start, end, loc) {
    //console.log(start, end, loc);
  var interpolator = d3.geo.interpolate(start,end);
  return interpolator(loc)
}

function highlightClass(classType){
    svg.selectAll(".point")
            .transition()
            .duration(500)
            .style("fill","black")
            .attr("opacity",0.5)
    ;
    svg.selectAll("."+classType)
            .transition()
            .duration(500)
//            .delay(500)
            .style("fill","red")
            .attr("opacity",1.0)
    ;
}
function pointClick(element, e, funct) {
    //console.log(element.properties,funct);
    clickedPoint = element;
//    $("#contentcontainer").empty();
//    if (element.properties.capabilities) {
//        $.each(element.properties.capabilities,
//                function(index, value) {
//                    $.get('' + value + ".html", function(data) {
//                        $(data).appendTo("#contentcontainer");
//                    });
//                });
//    } else {
//        $("#contentcontainer").html("<div class='infoheader'><i>No Data</i></div>")
//    }
//    $("#dialog").dialog("open");
    //recalcCallout();
    refresh();
}

function clip(d) {
    //return path(circle.clip(d));
}

function recalcElementSizes() {
    width = $("#boxy").width();
    height = $("#boxy").height();

    minDim = Math.min(width, height) * .75;
    iconSize = minDim * 0.02;
    pointSize = minDim * 0.01;
    projection
            .scale(((minDim / 2) - inset))
            .translate([minDim / 2+inset/2 , minDim / 2 +inset/2])
            .translate([width/2+inset/2 , height / 2 +inset/2])
            ;
    sky
            .scale(((minDim / 2) - inset)*skyheight)
            .translate([minDim / 2+inset/2 , minDim / 2 +inset/2])
            .translate([width / 2+inset/2 , height / 2 +inset/2])
            ;
    mid
            .scale(((minDim / 2) - inset)*midheight)
            .translate([minDim / 2+inset/2 , minDim / 2 +inset/2])
            .translate([width / 2+inset/2 , height / 2 +inset/2])
            ;
    svg
            .attr("width", width)
            .attr("height", height)
            ;
}

function recalcCallout() {
    if (clickedPoint) {
//        console.log(clickedPoint.properties.latitude,
//                clickedPoint.properties.longitude);
        var mapPoint = projection([
            clickedPoint.properties.longitude,
            clickedPoint.properties.latitude
        ]);

        var dialogPoint = [ 
                $("#overlaypane").offset().left+150,
                $("#overlaypane").offset().top + 150
                        ];
//        console.log(mapPoint, dialogPoint);
        var midPoint = [(mapPoint[0] + dialogPoint[0]) / 2,
            (mapPoint[1] + dialogPoint[1]) / 2];
//        lineData = [
//            {"x": mapPoint[0], "y": mapPoint[1]},
//            {"x": midPoint[0], "y": mapPoint[1]},
//            {"x": midPoint[0], "y": dialogPoint[1]},
//            {"x": dialogPoint[0], "y": dialogPoint[1]}
//        ];
    } else {
        lineData = [];
    }

}
function linkArc(d) {
    var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}
function handleClose() {
    if ($("#dialog").dialog("isOpen"))
        $("#dialog").dialog("close");
}


function unitClamp(val) {
    return Math.min(Math.max(val, 0), 1);
}
function collide(node) {
    var r = node.radius + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.radius + quad.point.radius;
            if (l < r) {
                l = (l - r) / l * .5;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
            }
        }
        return x1 > nx2
                || x2 < nx1
                || y1 > ny2
                || y2 < ny1;
    };
}
var lineFunction = d3.svg.line()
        .x(function(d) {
            return d.x;
        })
        .y(function(d) {
            return d.y;
        })
        .interpolate("bundle");


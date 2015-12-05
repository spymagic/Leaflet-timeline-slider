$(document).ready(function() {


	    function playButtonPress() {
	    $("#play ").toggleClass("glyphicon glyphicon-play .btn btn-success glyphicon glyphicon-pause .btn btn-danger");
		$("#play").button('refresh');
	    
	    play = !play;
	}



	var map = L.map('map', {
			center: [40.7445846, -73.9761047], 
			zoom: 10,
			minZoom: 4
		});

		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3B5bWFnaWMiLCJhIjoiY2lneml2MncxMHZzZXZvbTN6M3k1MTdmdiJ9.fEnowOJrbBPq1Ar8OzgG8g', {
			maxZoom: 18,
			
			id: 'mapbox.light'
		}).addTo(map);

	var geoLayer;

	//load json data
	$.getJSON("data/city-data.json")
		.done(function(data) {
			geoLayer = L.geoJson(data, {
				style:style,
				onEachFeature: onEachFeature

			}).addTo(map);

		})
		.fail(function() { alert("There has been a problem loading the data.")});


	    function onEachFeature(feature, layer) {
	      layer.on({
	        click:chart,
	        mouseover: highlightFeature,
	        mouseout: resetHighlight
	        
	      });
	    }

	    function highlightFeature(e) {
	      var layer = e.target;

	     layer.setStyle({
	        weight: 2,
	        color: '#666',
	        
	        fillOpacity: 0.7
	      });

	      if (!L.Browser.ie && !L.Browser.opera) {
	        layer.bringToFront();
	      }

	      info.update(layer.feature.properties);

	    }

	    function resetHighlight(e) {
	    var layer = e.target;

	     layer.setStyle({
	          weight: 1.2,
	        opacity: 1,
	        color: '#A3A3A3',
	        
	        fillOpacity: 0.7
	      });
	        
	        info.update();
    	}

        var info = L.control();

    	info.onAdd = function (map) {
		    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		    this.update();
		    return this._div;
		};


		// method that we will use to update the control based on feature properties passed
		info.update = function (props) {
		  //prec=props.precint
		    this._div.innerHTML = '<h4>Population</h4>' +  (props ?
		        '<b> '+ props.name + ' </b><br />' + props['y'+currentSlide] + ' people '+ currentSlide 
		        : 'Hover over');
		};
		info.addTo(map);
				 

	// get color depending on population density value
		function getColor(d) {
				return d > 2800000  ? '#99000d' :
				       d > 2500000  ? '#cb181d' :
				       d > 2000000  ? '#ef3b2c' :
				       d > 1500000  ? '#fb6a4a' :
				       d > 1000000  ? '#fc9272' :
				       d > 500000  ? '#fcbba1' :
				       d > 100000   ? '#fff5f0' :
				                 '#FFEDA0';
		}



		//set population style 
		function style(feature) {
				return {
					weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.7,
					fillColor: getColor(feature.properties.y2005)
				};
			}	
		//define some parameters	
		var currentSlide=1950;
		var playInterval;
		var slideDuration = 700; // in milliseconds
		var autoRewind = true;

		//jquery's slider method
		$(function() {
		    $( "#slider" ).slider({
		        value: 1950,
		        min: 1950,
		        max: 2040,
		        step: 10,
		        slide: function( event, ui ) {
		          year=(ui.value)
		     setSlide(year)		     
		      }
		    });
		});

		//setup the play button function
	    $( "#play" ).button({
	      icons: {
	        primary: "glyphicon glyphicon-search"
	      },
	      text: false
	    }).click(function () {
	        if (playInterval != undefined) {
	            clearInterval(playInterval);
	            playInterval = undefined;
	            $(this).button({
	                icons: {
	                    primary: "glyphicon glyphicon-star"
	                }
	            });
	            return;
	        }
	        $(this).button({
	            icons: {
	                primary: "glyphicon glyphicon-search"
	            }
	        });
	        playInterval = setInterval(function () {
	            currentSlide=currentSlide+10;
	            
	            if (currentSlide > 2040) {
	                if (autoRewind) {
	                    currentSlide = 1950;
	                }
	                else {
	                    clearIntveral(playInterval);
	                    return;
	                }
	            }
	            setSlide(currentSlide);
	        }, slideDuration);
	    });
	


		//update slide to reassign the population value
		function setSlide (index) {
		    currentSlide = index;

		    $( "#slider" ).slider( "value", index );
		    $( "#amount" ).val($( "#slider" ).slider( "value" ) );
		    geoLayer.eachLayer(function(layer,currentslide){
		          
		        layer.setStyle({fillColor: getColor(layer.feature.properties['y'+currentSlide])}); 
		        });
		}

		
		//use amchart
		function chart(e){

		data=e.target.feature.properties;
 
		$( "#place" ).val( data.precint  );
		var chartt = AmCharts.makeChart( "chartdiv", {
		  
		  "type": "serial",
		  "theme": "black",
		"color": "#F6F6F6",
		  "dataProvider": [ {
		    "year": 1950,
		    "crimes": data.y1950
		  }, {
		    "year": 1960,
		    "crimes": data.y1960
		  
		  },
		  {
		    "year": 1970,
		    "crimes": data.y1970
		  
		  },
		  {
		    "year": 1980,
		    "crimes": data.y1980
		  
		  },
		{
		    "year": 1990,
		    "crimes": data.y1990
		  
		  },{
		    "year": 2000,
		    "crimes": data.y2000
		  
		  },{
		    "year": 2010,
		    "crimes": data.y2010
		  
		  },
		  {
		    "year": 2020,
		    "crimes": data.y2020
		  },
		  {
		    "year": 2030,
		    "crimes": data.y2030
		  
		  },
		{
		    "year": 2040,
		    "crimes": data.y2040
		  	  
		  }
		  ],
		  "valueAxes": [ {
		    "gridColor": "#FFFFFF",
		    "gridAlpha": 0.2,
		    "dashLength": 0
		  } ],
		  "gridAboveGraphs": true,	
		  "startDuration": 1,
		  "graphs": [ {
		    "balloonText": "[[category]]: <b>[[value]]</b>",
		    "fillAlphas": 0.8,
		    "lineAlpha": 0.2,
		    "type": "column",
		    "valueField": "crimes"
		  } ],
		  "chartCursor": {
		    "categoryBalloonEnabled": false,
		    "cursorAlpha": 0,
		    "zoomable": false
		  },
		  "categoryField": "year",
		  "categoryAxis": {
		    "gridPosition": "start",
		    "labelRotation": 45,

		    "tickPosition": "start"
		    
		  },
		  "export": {
		    "enabled": false
		  }

		} );
		}


		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'info legend'),
		        grades = [100000, 500000, 1000000, 1500000, 2000000, 2500000, 3000000],
		        labels = [];

		    // loop through our density intervals and generate a label with a colored square for each interval
		    for (var i = 0; i < grades.length; i++) {
		        div.innerHTML +=
		            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
		            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		    }

		    return div;
		};

		legend.addTo(map);



});

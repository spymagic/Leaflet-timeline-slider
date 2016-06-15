#New York City population trends
##[Demo](http://dv-pengyisong.rhcloud.com)
####This is a project integrate Leaflet and Amchart. And the JQuery slider adding a time dimension to the map. 
![intro image](https://cloud.githubusercontent.com/assets/8851616/14406986/656045c4-fe86-11e5-92db-21340407c0ed.jpg)

This is an example of how to add timeline slider in leflet's map, and make the slider automatically to play showing the animation and changes of the population.

```javascript
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
	    }).click(function(){
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

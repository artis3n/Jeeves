//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "weather",
	newsViews:"news",
	showNumber: 5,
	previousView: ["weather"],
	city: 'Waltham',
	country: 'us',
	section: 'news',
	articles: [],
	newsArticles: {
		news: [],
		world: [],
		sports: [],
		business: [],
		tech: [],
		science: []
	},
	weather: { temp: {}, clouds: -3 }
};

var jeevesApp = angular.module("jeevesApp", ['ui.bootstrap', 'ngTouch']);

jeevesApp.run(function($http) {
	$http.jsonp('http://api.openweathermap.org/data/2.5/weather?q='+model.city+','+model.country+ '&units=imperial&callback=JSON_CALLBACK').success(function(data) {
            model.weather.temp.current = data.main.temp;
            model.weather.temp.min = data.main.temp_min;
            model.weather.temp.max = data.main.temp_max;
            model.weather.clouds = data.clouds ? data.clouds.all : undefined;
    });
});

// Create a sglclick action to avoid the ng-click conflict with ng-dblclick
jeevesApp.directive('sglclick', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
          	var fn = $parse(attr['sglclick']);
          	var delay = 300, clicks = 0, timer = null;
          	element.on('click', function (event) {
	            clicks++;  //count clicks
	            if(clicks === 1) {
	              	timer = setTimeout(function() {
	               		scope.$apply(function (){
	               			fn(scope, { $event: event });
	               		}); 
	                	clicks = 0;			//after action performed, reset counter
	              	}, delay);
	            } else {
	                clearTimeout(timer);	//prevent single-click action
	                clicks = 0;				//after action performed, reset counter
            	}
          	});
        }
    };
}]);

jeevesApp.controller("jeevesCtrl", function($scope, $http) {
	$scope.jeeves = model;

	$scope.imgurl = function() {
                var baseUrl = 'https://ssl.gstatic.com/onebox/weather/128/';
                if ($scope.jeeves.weather.clouds < 20 && $scope.jeeves.weather.clouds > -1) {
                    return baseUrl + 'sunny.png';
                } else if ($scope.jeeves.weather.clouds < 90) {
                   return baseUrl + 'partly_cloudy.png';
                } else {
                    return baseUrl + 'cloudy.png';
                }
    };

	$scope.changeView = function(selected) {
		if(selected == 'back'){
			$scope.jeeves.previousView.pop();
			var back = $scope.jeeves.previousView[$scope.jeeves.previousView.length - 1];
			$scope.jeeves.view = back;
		}else if (selected == 'news'){
			$scope.jeeves.previousView.push(selected);
			$scope.jeeves.view = selected;
			$scope.getListArticle();
		}else{
			$scope.jeeves.previousView.push(selected);
			$scope.jeeves.view = selected;
		}
	};

	$scope.changeWeather = function(setting) {
		if(setting !== null){
			if (setting){
				$scope.jeeves.city = document.getElementById("weather_city_setting").value;
			}else{
				$scope.jeeves.city = document.getElementById("weather_city").value;
			}
		}

		$http.jsonp('http://api.openweathermap.org/data/2.5/weather?q='+$scope.jeeves.city+','+$scope.jeeves.country+ '&units=imperial&callback=JSON_CALLBACK').success(function(data) {
            $scope.jeeves.weather.temp.current = data.main.temp;
            $scope.jeeves.weather.temp.min = data.main.temp_min;
            $scope.jeeves.weather.temp.max = data.main.temp_max;
            $scope.jeeves.weather.clouds = data.clouds ? data.clouds.all : undefined;
    	});
    	document.getElementById("weather_city").value = "";
    	document.getElementById("weather_city_setting").value = "";
	}

	$scope.changeSection=function(selected){
		document.getElementById($scope.jeeves.section).innerHTML="";
		$scope.jeeves.section = selected;
		$scope.jeeves.showNumber = 5;
		$scope.getListArticle();
	}

	$scope.reco= function(){
		navigator.speechrecognizer.recognize(successCallback, failCallback, 3, "Jeeves Personal Assistant");
		function successCallback(results){
			for (var i = 0; i < results.length; i++) {
				var result = results[i].toLowerCase();
				if ($scope.globalCommands(result)) {
					break;
				}
				if($scope.jeeves.view == 'weather'){
				$scope.weatherSpeech(result);
				break;
	    		}else if($scope.jeeves.view == 'news'){
	    			var stop = $scope.speechNews(result);
	    			if(stop){
	    				break;
	    			}
	    		}else if($scope.jeeves.view == 'email'){
	    			$scope.emailSpeech(result);
	    			break;
	    		}
		   		$scope.$apply();
			}
 		}

 		function failCallback(error){
		    alert("Error: " + error);
		}
	}

	$scope.globalCommands = function(result) {
		if (result == "how is the weather" || result == "how's the weather" || result == "what's the weather" || result == "what is the weather like today" || result == "what's the weather like" || result == "how's the weather today" || result == "how is the weather today"){
			$scope.changeView('weather');
			$scope.$apply();
			navigator.tts.speak("The current temperature is " + $scope.jeeves.weather.temp.current + " degrees fahrenheit.", function() {
				$scope.changeView('back');
				$scope.$apply();
			});
			return true;
		} else if (result.match(/go to/)) {
			if (result.match(/news/)) {
				navigator.tts.speak("Gotcha. Going to news now.", function() {
					$scope.changeView('news')
					$scope.$apply();
				})
				return true;
			} else if (result.match(/email/)) {
				navigator.tts.speak("Gotcha. Going to email now.", function() {
					$scope.changeView('email')
					$scope.$apply();
				})
				return true;
			} else if (result.match(/weather/)) {
				navigator.tts.speak("Gotcha. Going to weather now.", function() {
					$scope.changeView('weather')
					$scope.$apply();
				})
				return true;
			} else if (result.match(/settings/)) {
				navigator.tts.speak("Gotcha. Going to settings now.", function() {
					$scope.changeView('settings')
					$scope.$apply();
				})
				return true;
			} else if (result.match(/contact/)) {
				navigator.tts.speak("Gotcha. Going to contact page now.", function() {
					$scope.changeView('contact')
					$scope.$apply();
				})
				return true;
			} else if (result.match(/about/)) {
				navigator.tts.speak("Gotcha. Going to about page now.", function() {
					$scope.changeView('about')
					$scope.$apply();
				})
				return true;
			} else if (result.match(/help/)) {
				navigator.tts.speak("Gotcha. Going to help page now.", function() {
					$scope.changeView('help')
					$scope.$apply();
				})
				return true;
			}
		}else if (result.match(/read me/)) {
			if (result.match(/news/)) {
				$scope.changeView('news');
				$scope.$apply();
				// Start reading news category articles.
				navigator.tts.speak("Now reading news articles.");
				return true;
			} else if (result.match(/business/)) {
				$scope.changeView('news');
				$scope.$apply();
				// Start reading business news articles.
				navigator.tts.speak("Now reading business articles.");
				return true;
			} else if (result.match(/world/)) {
				$scope.changeView('news');
				$scope.$apply();
				// Start reading world news articles.
				navigator.tts.speak("Now reading world articles.");
				return true;
			} else if (result.match(/sports/)) {
				$scope.changeView('news');
				$scope.$apply();
				// Start reading sports news articles.
				navigator.tts.speak("Now reading sports articles.");
				return true;
			} else if (result.match(/tech/)) {
				$scope.changeView('news');
				$scope.$apply();
				// Start reading tech news articles.
				navigator.tts.speak("Now reading technology articles.");
				return true;
			} else if (result.match(/science/)) {
				$scope.changeView('news');
				$scope.$apply();
				// Start reading science news articles.
				navigator.tts.speak("Now reading science articles.");
				return true;
			} else if (result.match(/emails/)) {
				$scope.changeView('email');
				$scope.$apply();
				// Start reading emails.
				navigator.tts.speak("Now reading emails.");
				return true;
			}
		}else if (result == "help") {
			if ($scope.jeeves.view == 'weather') {
				navigator.notification.alert(
					"You can say:" +
					"\n- Change city to - city name." +
					"\n- Change to - city name." +
					"\n- Change weather to - city name." +
					"\n- How's the weather?" +
					"\n- Will it rain, snow, be cloudy, or be sunny today?", 'Jeeves', 'Weather Commands', 'Confirm'
				)
				navigator.tts.speak("you can say change city to, city name.");
				navigator.tts.speak("or you can say change to, city name.");
				navigator.tts.speak("or you can say change weather to, city name.");
				navigator.tts.speak("or you can say, how's the weather?");
				navigator.tts.speak("or you can say, will it rain, snowe , be cloudy, or be sunny today?");
				return true;
			}else if (help.match(/email/)) {
				//5
				//read
				navigator.tts.speak("you can say read me my emails");
				navigator.tts.speak("or you can say read");
				navigator.tts.speak("or you can say read me - subject title");
				navigator.tts.speak("or you can say read me email by - insert name");
				navigator.tts.speak("or you can say how many emails do i have");
			}else if (help.match(/favorites/)) {
				//1
				navigator.tts.speak("you can say read");
			}else if (help.match(/menu/)) {
				//1
				navigator.tts.speak("you can say go to insert section");
			}else if (help.match(/about/)) {
				//1
				navigator.tts.speak("you can say read");
				navigator.tts.speak("or you can say tell me about jeeves")
			}else if (help.match(/settings/)) {
				//1
				navigator.tts.speak("you can say change city to insert city"); 
			}else if (help.match(/contact/)) {
				//1
				navigator.tts.speak("you can say read");
			}else if (help.match(/news/)) {
				//5
				navigator.tts.speak("you can say read me - insert section");
				navigator.tts.speak("you can say read me next article");
				navigator.tts.speak("you can say read me article - insert title");
				navigator.tts.speak("you can say more articles");
				navigator.tts.speak("you can say read me last or previous article");
			}

		}
	}

	$scope.weatherSpeech = function(result) {
		var city = "INVALID";
		var stop = false;

		if (result.lastIndexOf("change city to")==0){
			city = result.slice(15);
		}else if (result.lastIndexOf("change to")==0){
			city = result.slice(10);
		}else if (result.lastIndexOf("change weather to")==0){
			city = result.slice(18);
		// }else if (result.lastIndexOf("change whether to")==0){
		// 	city = result.slice(18);
		}else if (result.lastIndexOf("what's the weather of")==0){
			city = result.slice(22);
		}else if (result.lastIndexOf("how's the weather")==0){
			var str = ""
			alert("How's the weather?");
			stop = true;
			//TTS command to tell the weather
		}else {
			alert(result + " is an invalid command.");
		}

		if(city !== "INVALID"){
			$scope.jeeves.city = $scope.capitaliseFirstLetter(city);
			$scope.changeWeather(null);
			stop = true;
		}

		return stop;
	}

	$scope.speechNews = function(result){
		var stop =false;
	    if (result == 'go to help'){
	    	$scope.changeView('help');
	    	$scope.$apply();
	    	stop=true;
		}     				
		//reads a certain news section, e.g. read me news business.
		else if(result.substring(0, 12) =='read me news') { 
    		if(result.length>14){
    			alert("moving to section: "+ result.substring(13, result.length));
    			$scope.changeSection(result.substring(13, result.length));
    		}
    		x=$scope.jeeves.section;
			$scope.jeeves.showNumber = 5;
			$http.get('http://beta.content.guardianapis.com/search?q=US&section='+x+'&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
				$scope.jeeves.articles=data.response.results;
				var stop2=false;
				for (var j = 0; j < $scope.jeeves.showNumber; j++) {
					var entry = $scope.jeeves.articles[j];
					//alert("Article "+j+": "+entry.webTitle);
					navigator.tts.speak(entry.webTitle);
					//for user dialogue 
					alert("Tell us if you like to 'move on next', 'read article', 'more articles', 'read me last article', 'read me news <section>', 'quit'.");
					navigator.speechrecognizer.recognize(successCallback, failCallback, 3, "Jeeves Personal Assistant");
					function successCallback(results){
						for (var i = 0; i < results.length; i++) {
							var result = results[i].toLowerCase();
							alert("dialogue response: "+result);
							if(result.substring(0, 12) =='read me news'){
								stop2=true;
								$scope.speechNews(result);
								break;
							}
							else if(result=='read article'){
								alert("Article Content: "+ entry.fields.body.textContent);
								break;
							}
							else if(result=='more articles'){
								$scope.updateShowAmount();
								break;
							}
							else if(result=='read me last article'){
								j=j-2;
								break;
							}
							else if(result=='move on next'){
								break;
							}
							else if(result=='quit'){	
								stop2=true;
								break;
							}
							else{
								alert("unrecognized command, moving on...");
								break;
							}
							//dont forget to break the loop
						}

					}
					function failCallback(error){
		   				 alert("Error: " + error);
					}
					if(stop2){
						break;
					}
					//navigator.tts.speakZ(entry.webTitle);
				};
			}); 

    		$scope.$apply();
    		stop=true;
		}

		return stop;
	}

	$scope.startTTS = function() {
		navigator.tts.startup(success, fail);

		function success () {
			navigator.tts.speak("Hello! I am ready to begin reading.");
		}

		function fail () {
			navigator.notification.alert("Something went wrong with the TTS", 'Jeeves', 'Confirm');
		}
	}

	$scope.emailSpeech = function(result) {
		if (result.match(/authorize/) != null) {
			navigator.tts.speak("Now authorizing");
		} else if (result == "read my emails" || "read" || "start reading") {
			var content = document.getElementById('email-announcement').innerText;
			navigator.tts.speak(content);
		}
	}

	$scope.getListArticle=function(){
		var x = $scope.jeeves.section;
		$scope.jeeves.newsViews=x;

		$http.get('http://beta.content.guardianapis.com/search?q=US&section='+x+'&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
			$scope.jeeves.articles=data.response.results;
			var container = document.getElementById(x);
			container.innerHTML="";
			container.setAttribute('class', 'btn-group btn-block');

			for (i = 0; i < $scope.jeeves.showNumber; i++){
				var entry = $scope.jeeves.articles[i]; 
				var div = document.createElement("div"); 
				var button = document.createElement('input');
				button.setAttribute('type', 'button'); 
				button.setAttribute('class', 'btn btn-default btn-block'); 
				button.setAttribute('id', x+"_" +i);
				button.name=entry.webTitle; 
				button.setAttribute('value', entry.webTitle); 
				var divSub = document.createElement("div");
				divSub.setAttribute('id', x+"_" +i + "_div");
				button.onclick=function(){ 
					var container = document.getElementById(this.id+"_div");
					container.setAttribute('class', 'alert alert-success'); 
					if($scope.jeeves.showNumber <= 10){
						container.innerHTML=$scope.jeeves.articles[Number(this.id.slice(-1))].fields.body;
					}else{
						container.innerHTML=$scope.jeeves.articles[Number(this.id.slice(-2))].fields.body;
					}
				}
				button.ondblclick=function(){
					var containerContent = document.getElementById(this.id+"_div"); 
					containerContent.outerHTML="";
					$scope.getListArticle();
				}
				div.appendChild(button); 
				div.appendChild(divSub);
				container.appendChild(div);
			}

			if($scope.jeeves.showNumber<95){
				var buttonMore = document.createElement('input');
				buttonMore.setAttribute('type', 'button'); 
				buttonMore.setAttribute('class', 'btn btn-default btn-block');
				buttonMore.name="More"; 
				buttonMore.setAttribute('value', "More");
				buttonMore.addEventListener("click", $scope.updateShowAmount)
				container.appendChild(buttonMore);
			} 
		});
	}

	$scope.updateShowAmount=function(){
		$scope.jeeves.showNumber = $scope.jeeves.showNumber +5;
		$scope.getListArticle();
	}

	$scope.collapse=function(){
		$scope.jeeves.newsViews='';
	}

	$scope.capitaliseFirstLetter=function(string){
    	return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
});

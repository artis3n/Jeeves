//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "weather",
	newsViews:"newsArticles",
	showNumber: 5,
	previousView: ["weather"],
	city: 'Waltham',
	curNum: 0,
	country: 'us',
	emailLabels: ['INBOX'],
	section: 'news',
	articles: [],
	weather: { temp: {}, clouds: -3 }
};

var jeevesApp = angular.module("jeevesApp", []);

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
		if (setting){
			$scope.jeeves.city = document.getElementById("weather_city_setting").value;
		}else{
			$scope.jeeves.city = document.getElementById("weather_city").value;
		}
		$http.jsonp('http://api.openweathermap.org/data/2.5/weather?q='+model.city+','+model.country+ '&units=imperial&callback=JSON_CALLBACK').success(function(data) {
            model.weather.temp.current = data.main.temp;
            model.weather.temp.min = data.main.temp_min;
            model.weather.temp.max = data.main.temp_max;
            model.weather.clouds = data.clouds ? data.clouds.all : undefined;
            console.log("Weather: " + JSON.stringify(model.weather))
            console.log("Data: " + data.main.temp)
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
		navigator.speechrecognizer.recognize(successCallback, failCallback, 1, "Jeeves Personal Assistant");

		function successCallback(results){
			var result = JSON.stringify(results);
			result = result.substring(2,result.length - 2);

    		if (result == 'help'){
    			$scope.changeView('help');
    			$scope.$apply();
    		} else if(result == 'go to news') {
    			$scope.changeView('news');
    			$scope.$apply();
    		} else if(result.substring(0, 15) == 'Read Me section') {
    			alert(result + ': You said read me section '+result.substring(15, result.length)+'.');
    			$scope.changeSection(result.substring(15, result.length));
    			$scope.$apply();
    		}
    		else if(result == 'edittttt') {
    			alert(result + ': You said news.');
    			$scope.changeView('news');
    			$scope.$apply();
    		}else{
    			alert(result + ": You didn't say help.");
    		}
 		}

		function failCallback(error){
		    alert("Error: " + error);
		}
	}

	$scope.tts = function() {
		navigator.tts.startup(startupWin, fail);
		function startupWin(result) {
		    alert("Startup win");
		    // When result is equal to STARTED we are ready to play
		    alert("Result "+result);
		    //TTS.STARTED==2 use this once so is answered
		    if (result == 2) {
		        navigator.tts.getLanguage(win, fail);
		        navigator.tts.speak("The text to speech service is ready");
		    }
		}                               

		function win(result) {
		    alert(result);
		}

		function fail(result) {
		    alert("Error = " + result);
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
});

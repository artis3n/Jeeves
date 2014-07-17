//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "weather",
	newsViews:"newsArticles",
	previousView: ["weather"],
	city: 'Waltham',
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
})


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
		$scope.jeeves.section = selected;
		$scope.getListArticle();
	}

	$scope.getListArticle=function(){
		var x = $scope.jeeves.section;
		$scope.jeeves.newsViews=x;

		$http.get('http://beta.content.guardianapis.com/search?q=US&section='+x+'&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
			$scope.jeeves.articles=data.response.results;
			var container = document.getElementById(x);
			container.innerHTML="";
			container.setAttribute('class', 'btn-group btn-block');

			for (i = 0; i < 10; i++){
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
					container.innerHTML=$scope.jeeves.articles[Number(this.id.slice(-1))].fields.body;
				}
				button.ondblclick=function(){
					var container = document.getElementById(this.id+"_div"); 
					container.outerHTML="";
					var divSub = document.createElement("div");
					divSub.setAttribute('id',this.id+"_div");
					div.appendChild(divSub);
				}
				div.appendChild(button); 
				div.appendChild(divSub);
				container.appendChild(div);
			}
		});
	}
});
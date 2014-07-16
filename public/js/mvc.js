//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "weather",
	previousView: ["weather"],
	city: 'Waltham',
	country: 'us',
	feeds: [],
	articles: [],
	weather: { temp: {}, clouds: -3 }
};

var jeevesApp = angular.module("jeevesApp", []);

jeevesApp.run(function($http) {
	$http.get("/model/feeds").success(function(data) {
		model.feeds = data;
	})

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
		}else{
			$scope.jeeves.previousView.push(selected);
			console.log($scope.jeeves.previousView);
			$scope.jeeves.view = selected;
		}
	};

	$scope.changeWeather = function() {
		$scope.jeeves.city = document.getElementById("weather_city").value;
		$http.jsonp('http://api.openweathermap.org/data/2.5/weather?q='+model.city+','+model.country+ '&units=imperial&callback=JSON_CALLBACK').success(function(data) {
            model.weather.temp.current = data.main.temp;
            model.weather.temp.min = data.main.temp_min;
            model.weather.temp.max = data.main.temp_max;
            model.weather.clouds = data.clouds ? data.clouds.all : undefined;
            console.log("Weather: " + JSON.stringify(model.weather))
            console.log("Data: " + data.main.temp)
    	});
    	document.getElementById("weather_city").value = "";
	}

	$scope.getFullArticle= function(){

		console.log("called get Full Article");
		$http.get('http://beta.content.guardianapis.com/world/2014/jul/15/israel-approves-egyptian-ceasefire-in-gaza-live-updates?format=json&show-fields=all&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
			console.log("Worked");
			console.log(data.response.content.webTitle);
		});
	}

	$scope.getListArticle=function(section){
	//	var x=section;
		var x='politics';
		$http.get('http://beta.content.guardianapis.com/search?q=US&section='+x+'&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		//	console.log(data.response.results[1].webTitle);
			$scope.jeeves.articles=data.response.results;
			//console.log("asdf"+$scope.jeeves.articles[1].webTitle);

	  var container = document.getElementById("buttonTitles");
      //  var buttonList=[];

      //First Entry------------------------------------------------------------------------------------------------------
      var entry0 = $scope.jeeves.articles[0];
      console.log(entry0);
      var div0 = document.createElement("div");
      var button0 = document.createElement('input');
      button0.setAttribute('type', 'button');
      button0.setAttribute('class', 'btn btn-default btn-block');
      button0.name=entry0.webTitle;
      //button.setAttribute('name', entry.title);
      button0.setAttribute('value', entry0.webTitle);  
      button0.onclick=function(){
      		var div21 = document.createElement("div");
     		div21.appendChild(document.createTextNode(entry0.fields.body));
     	 	var container2 = document.getElementById("feed1");
    	  	container2.appendChild(div21);       
			}
		      	div0.appendChild(button0);
       		   container.appendChild(div0);


		});
	}
	
});
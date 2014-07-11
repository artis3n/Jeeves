//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "weather",
	previousView: ["weather"],
	weathersrc: 'http://voap.weather.com/weather/oap/02453?template=LAWNV&par=3000000007&unit=0&key=twciweatherwidget',
	feeds: []
};

var jeevesApp = angular.module("jeevesApp", []);

jeevesApp.run(function($http) {
	$http.get("/model/feeds").success(function(data) {
		model.feeds = data;
	})
})

jeevesApp.controller("jeevesCtrl", function($scope) {
	$scope.jeeves = model;

	$scope.changeView = function(selected) {
		if(selected == 'back'){
			$scope.jeeves.previousView.pop();
			var back = $scope.jeeves.previousView[$scope.jeeves.previousView.length - 1];
			console.log("Returning to " + back + "...");
			console.log($scope.jeeves.previousView);
			$scope.jeeves.view = back;
		}else{
			$scope.jeeves.previousView.push(selected);
			console.log($scope.jeeves.previousView);
			$scope.jeeves.view = selected;
		}
	};

	$scope.listMessages = function() {
  		var gmail = Gmail();
  		console.log(gmail.get.user_email());
  	}

	// Changes weather widget to reflect new zip code as enterred by user.
	// Precondition: zip code is 5 characters long. If not, throws alert error.
	$scope.changeWeather = function() {
		var zip = document.getElementById("weather_zipcode").value;
		if (zip.length == 5) {
			console.log("Changing weather zip code to: " + zip);
			document.getElementById('zip-error').style.display="none";
			$scope.jeeves.weathersrc = 'http://voap.weather.com/weather/oap/' + zip + '?template=LAWNV&par=3000000007&unit=0&key=twciweatherwidget';
			document.getElementById("weather_zipcode").value = "";
		} else {
			document.getElementById('zip-error').style.display="block";
		}
	}
	
});
//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "main",
	previousView: ["main"],
	weathersrc: 'http://voap.weather.com/weather/oap/02453?template=LAWNV&par=3000000007&unit=0&key=twciweatherwidget',
	feeds: [],
	weather = { temp: {}, clouds: null }
};

var jeevesApp = angular.module("jeevesApp", []);

jeevesApp.run(function($http) {
	$http.get("/model/feeds").success(function(data) {
		model.feeds = data;
	});

	$http.jsonp('http://api.openweathermap.org/data/2.5/weather?q=Waltham,us&units=metric&callback=JSON_CALLBACK').success(function(data) {
		console.log(data)
	});
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

	$scope.listMessages = function(userId, query, callback) {
  		
  		var getPageOfMessages = function(request, result) {
    		request.execute(function(resp) {
      		result = result.concat(resp.messages);
      		var nextPageToken = resp.nextPageToken;
      		if (nextPageToken) {
        		request = gmail.users().messages().list({
          		'userId': userId,
          		'pageToken': nextPageToken,
          		'q': query
        		}).execute();
        		getPageOfMessages(request, result);
     			} else {
     					callback(result);
     			}
    		});
 			};
  		var initialRequest = gmail.users().messages().list({
    		'userId': userId,
    		'q': query
 	 		}).execute();
  		var messages = getPageOfMessages(initialRequest, []);

  		angular.forEach(messages, function(message) {
  			var node = document.createElement("LI");
  			var textnode = document.createTextNode(message);
  			node.appendChild(textnode);
  			document.getElementById("messageList").appendChild(node);
  		})
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
//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "weather",
	previousView: ["weather"],
	city: 'Waltham',
	country: 'us',
	section: 'news',
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
		}else if (selected == 'news'){
			$scope.jeeves.previousView.push(selected);
			console.log($scope.jeeves.previousView);
			$scope.jeeves.view = selected;
			$scope.getListArticle();
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

	$scope.changeSection=function(selected){
		$scope.jeeves.section = selected;
		$scope.getListArticle();
	}

	$scope.getListArticle=function(){
		var x=$scope.jeeves.section;

		$http.get('http://beta.content.guardianapis.com/search?q=US&section='+x+'&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		//	console.log(data.response.results[1].webTitle);
			$scope.jeeves.articles=data.response.results;
			//console.log("asdf"+$scope.jeeves.articles[1].webTitle);

	  var span =document.createElement("span");
	  var container = document.getElementById("buttonTitles");
	  container.innerHTML="";
	  container.setAttribute('class', 'btn-group-vertical');
      //  var buttonList=[];

      //First Entry------------------------------------------------------------------------------------------------------
      var entry0 = $scope.jeeves.articles[0]; var div0 = document.createElement("div"); var button0 = document.createElement('input');
      button0.setAttribute('type', 'button'); button0.setAttribute('class', 'btn btn-default btn-block'); button0.name=entry0.webTitle; button0.setAttribute('value', entry0.webTitle);  
      button0.onclick=function(){ var container0 = document.getElementById("feed1"); container0.setAttribute('class', 'alert alert-success'); container0.innerHTML=entry0.fields.body;}
	//	span.appendChild(button0.onclick);
		div0.appendChild(button0); container.appendChild(div0);// span.appendChild(container);
	      //Second Entry------------------------------------------------------------------------------------------------------
      var entry1 = $scope.jeeves.articles[1]; var div1 = document.createElement("div"); var button1 = document.createElement('input');
      button1.setAttribute('type', 'button'); button1.setAttribute('class', 'btn btn-default btn-block'); button1.name=entry1.webTitle; button1.setAttribute('value', entry1.webTitle);  
      button1.onclick=function(){ var container1 = document.getElementById("feed1"); container1.setAttribute('class', 'alert alert-success'); container1.innerHTML=entry1.fields.body;}
		       div1.appendChild(button1); container.appendChild(div1);
		             //Third Entry------------------------------------------------------------------------------------------------------
      var entry2 = $scope.jeeves.articles[2]; var div2 = document.createElement("div"); var button2 = document.createElement('input');
      button2.setAttribute('type', 'button'); button2.setAttribute('class', 'btn btn-default btn-block'); button2.name=entry2.webTitle; button2.setAttribute('value', entry2.webTitle);  
      button2.onclick=function(){var container2 = document.getElementById("feed1"); container2.setAttribute('class', 'alert alert-success'); container2.innerHTML=entry2.fields.body;}
		       div2.appendChild(button2); container.appendChild(div2);
		             //First Entry------------------------------------------------------------------------------------------------------
      var entry3 = $scope.jeeves.articles[3]; var div3 = document.createElement("div"); var button3 = document.createElement('input');
      button3.setAttribute('type', 'button'); button3.setAttribute('class', 'btn btn-default btn-block'); button3.name=entry3.webTitle; button3.setAttribute('value', entry3.webTitle);  
      button3.onclick=function(){ var container3 = document.getElementById("feed1"); container3.setAttribute('class', 'alert alert-success'); container3.innerHTML=entry3.fields.body;}
		       div3.appendChild(button3); container.appendChild(div3);
		             //First Entry------------------------------------------------------------------------------------------------------
      var entry4 = $scope.jeeves.articles[4]; var div4 = document.createElement("div"); var button4 = document.createElement('input');
      button4.setAttribute('type', 'button'); button4.setAttribute('class', 'btn btn-default btn-block'); button4.name=entry4.webTitle; button4.setAttribute('value', entry4.webTitle);  
      button4.onclick=function(){ var container4 = document.getElementById("feed1"); container4.setAttribute('class', 'alert alert-success'); container4.innerHTML=entry4.fields.body;}
		       div4.appendChild(button4); container.appendChild(div4);




		});
	}
	
});
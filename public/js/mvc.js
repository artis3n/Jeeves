//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "weather",
	newsViews:"newsArticles",
	newsShow: "",
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

			//First Entry------------------------------------------------------------------------------------------------------
			var entry0 = $scope.jeeves.articles[0]; 
			var div0 = document.createElement("div"); 
			var button0 = document.createElement('input');
			button0.setAttribute('type', 'button'); 
			button0.setAttribute('class', 'btn btn-default btn-block'); 
			button0.name=entry0.webTitle; 
			button0.setAttribute('value', entry0.webTitle); 
			var div01 = document.createElement("div");
			div01.setAttribute('id', entry0.webTitle);
			button0.onclick=function(){ 
				$scope.jeeves.newsShow=entry0.webTitle;
				var container0 = document.getElementById(entry0.webTitle); 
				container0.setAttribute('class', 'alert alert-success'); 
				container0.innerHTML=entry0.fields.body;
			}
			button0.ondblclick=function(){
				var container0 = document.getElementById(entry0.webTitle); 
				container0.outerHTML="";
				var div01 = document.createElement("div");
				div01.setAttribute('id', entry0.webTitle);
				div0.appendChild(div01);
			}
			div0.appendChild(button0); 
			div0.appendChild(div01);
			container.appendChild(div0);

			//Second Entry------------------------------------------------------------------------------------------------------
			var entry1 = $scope.jeeves.articles[1]; 
			var div1 = document.createElement("div"); 
			var button1 = document.createElement('input');
			button1.setAttribute('type', 'button'); 
			button1.setAttribute('class', 'btn btn-default btn-block'); 
			button1.name=entry1.webTitle; 
			button1.setAttribute('value', entry1.webTitle); 
			var div11 = document.createElement("div");
			div11.setAttribute('id',entry1.webTitle); 
			button1.onclick=function(){ 
				var container1 = document.getElementById(entry1.webTitle); 
				container1.setAttribute('class', 'alert alert-success'); 
				container1.innerHTML=entry1.fields.body;
			}
			button1.ondblclick=function(){
				var container1 = document.getElementById(entry1.webTitle);
				container1.outerHTML="";
				var div11 = document.createElement("div");
				div11.setAttribute('id', entry1.webTitle);
				div1.appendChild(div11);
			}
			div1.appendChild(button1); 
			div1.appendChild(div11);
			container.appendChild(div1);

			//Third Entry------------------------------------------------------------------------------------------------------
			var entry2 = $scope.jeeves.articles[2]; 
			var div2 = document.createElement("div"); 
			var button2 = document.createElement('input');
			button2.setAttribute('type', 'button'); 
			button2.setAttribute('class', 'btn btn-default btn-block');
			button2.name=entry2.webTitle; 
			button2.setAttribute('value', entry2.webTitle);  
			var div21 = document.createElement("div");
			div21.setAttribute('id',entry2.webTitle);
			button2.onclick=function(){
				var container2 = document.getElementById(entry2.webTitle); 
				container2.setAttribute('class', 'alert alert-success'); 
				container2.innerHTML=entry2.fields.body;
			}
			button2.ondblclick=function(){
				var container2 = document.getElementById(entry2.webTitle);
				container2.outerHTML="";
				var div21 = document.createElement("div");
			div21.setAttribute('id',entry2.webTitle);
			div2.appendChild(div21);
			}
			div2.appendChild(button2); 
			div2.appendChild(div21);
			container.appendChild(div2);

			//Fourth Entry------------------------------------------------------------------------------------------------------
			var entry3 = $scope.jeeves.articles[3]; 
			var div3 = document.createElement("div"); 
			var button3 = document.createElement('input');
			button3.setAttribute('type', 'button'); 
			button3.setAttribute('class', 'btn btn-default btn-block'); 
			button3.name=entry3.webTitle; 
			button3.setAttribute('value', entry3.webTitle);  
			var div31 = document.createElement("div");
			div31.setAttribute('id',entry3.webTitle);
			button3.onclick=function(){ 
				var container3 = document.getElementById(entry3.webTitle); 
				container3.setAttribute('class', 'alert alert-success'); 
				container3.innerHTML=entry3.fields.body;
			}
			button3.ondblclick=function(){
				var container3 = document.getElementById(entry3.webTitle);
				container3.outerHTML="";
				var div31 = document.createElement("div");
				div31.setAttribute('id',entry3.webTitle);
				div3.appendChild(div31);
			}
			div3.appendChild(button3);
			div3.appendChild(div31); 
			container.appendChild(div3);

			//Fifth Entry------------------------------------------------------------------------------------------------------
			var entry4 = $scope.jeeves.articles[4]; 
			var div4 = document.createElement("div"); 
			var button4 = document.createElement('input');
			button4.setAttribute('type', 'button'); 
			button4.setAttribute('class', 'btn btn-default btn-block'); 
			button4.name=entry4.webTitle; 
			button4.setAttribute('value', entry4.webTitle);  
			var div41 = document.createElement("div");
			div41.setAttribute('id',entry4.webTitle);
			button4.onclick=function(){ 
				var container4 = document.getElementById(entry4.webTitle); 
				container4.setAttribute('class', 'alert alert-success'); 
				container4.innerHTML=entry4.fields.body;
			}
			button4.ondblclick=function(){
				var container4 = document.getElementById(entry4.webTitle);
				container4.outerHTML="";
				var div41 = document.createElement('div');
				div41.setAttribute('id',entry4.webTitle);
				div4.appendChild(div41)
			}
			div4.appendChild(button4); 
			div4.appendChild(div41);
			container.appendChild(div4);
		});
	}
});
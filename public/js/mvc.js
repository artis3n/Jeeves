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
	weather: { temp: {}, clouds: -3, description: "" },
	newsArticles: {
		news: [],
		world: [],
		sports: [],
		business: [],
		tech: [],
		science: []
	},
	newsPosition: {
		section: 'news',
		articleIndex: 0
	}

};

var jeevesApp = angular.module("jeevesApp", ['ui.bootstrap']);

jeevesApp.run(function($http) {
	$http.jsonp('http://api.openweathermap.org/data/2.5/weather?q='+model.city+','+model.country+ '&units=imperial&callback=JSON_CALLBACK').success(function(data) {
            model.weather.temp.current = data.main.temp;
            model.weather.clouds = data.clouds ? data.clouds.all : undefined;
            model.weather.description = data.weather[0].description;
    });
			$http.get('http://beta.content.guardianapis.com/search?q=US&section=news&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
				model.newsArticles.news=data.response.results;
				for(var i=0;i<model.showNumber;i++){
				//	if(data.response.results[i].hasOwnProperty('fields')){
					if(data.response.results[i]!=null){
						if(data.response.results[i].fields!=undefined){
							model.newsArticles.news[i]=data.response.results[i];
						}
					}
				}
			});
			$http.get('http://beta.content.guardianapis.com/search?q=US&section=world&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
				model.newsArticles.world=data.response.results;
				for(var i=0;i<model.showNumber;i++){
					if(data.response.results[i]!=null){
						if(data.response.results[i].fields!=undefined){
							model.newsArticles.world[i]=data.response.results[i];
						}
					}
				}
			});
			$http.get('http://beta.content.guardianapis.com/search?q=US&section=sports&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
				model.newsArticles.sports=data.response.results;
				for(var i=0;i<model.showNumber;i++){
					if(data.response.results[i]!=null){
						if(data.response.results[i].fields!=undefined){
							model.newsArticles.sports[i]=data.response.results[i];
						}
					}
				}
			});
			$http.get('http://beta.content.guardianapis.com/search?q=US&section=business&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
				model.newsArticles.business=data.response.results;
				for(var i=0;i<model.showNumber;i++){
					if(data.response.results[i]!=null){
						if(data.response.results[i].fields!=undefined){
							model.newsArticles.business[i]=data.response.results[i];
						}
					}
				}
			});
			$http.get('http://beta.content.guardianapis.com/search?q=US&section=tech&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
				model.newsArticles.tech=data.response.results;
				for(var i=0;i<model.showNumber;i++){
					if(data.response.results[i]!=null){
						if(data.response.results[i].fields!=undefined){
							model.newsArticles.tech[i]=data.response.results[i];
						}
					}
				}
			});
			$http.get('http://beta.content.guardianapis.com/search?q=US&section=science&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
				model.newsArticles.science=data.response.results;
				for(var i=0;i<model.showNumber;i++){
					if(data.response.results[i]!=null){
						if(data.response.results[i].fields!=undefined){
							model.newsArticles.science[i]=data.response.results[i];
						}
					}
				}
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

jeevesApp.controller("jeevesCtrl", function($scope, $http, $modal) {
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
		if (selected == 'back'){
			if ($scope.jeeves.previousView.length > 1) {
				$scope.jeeves.previousView.pop();
				var back = $scope.jeeves.previousView[$scope.jeeves.previousView.length - 1];
				$scope.jeeves.view = back;
				$scope.$close();
			}
			
		} else if (selected == 'news'){
			$scope.jeeves.previousView.push(selected);
			$scope.jeeves.view = selected;
			$scope.getListArticle();
			$scope.$close();
		} else if (selected == 'menu' && $scope.jeeves.view == 'menu') {
			$scope.changeView('back');
		} else if (selected == 'menu') {
			var modalInstance = $modal.open({
				templateUrl: 'menuContent.html'
			})
		} else {
			$scope.jeeves.previousView.push(selected);
			$scope.jeeves.view = selected;
			$scope.$close();
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

	$scope.reco = function(){
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
	    			$scope.newsSpeech(result);
	    			break;
	    		
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
			$scope.$apply(function() {
				$scope.changeView('weather');
				$scope.speakWeatherReport();
			});
			return true;
		} else if (result.match(/go to/)) {
			if (result.match(/news/)) {
				if ($scope.jeeves.view != 'news') {
					navigator.tts.speak("Gotcha. Going to the news page now.", function() {
						$scope.$apply(function() {
							$scope.changeView('news');
						});
					})
				} else {
					navigator.tts.speak("You're already on the news page. Would you like to listen to world or business news?")
				}
				return true;
			} else if (result.match(/email/)) {
				if ($scope.jeeves.view != 'email') {
					navigator.tts.speak("Gotcha. Going to the email page now.", function() {
						$scope.$apply(function() {
							$scope.changeView('email');
						});
					})
				} else {
					navigator.tts.speak("You're already on the email page. Would you like to hear your inbox messages?");
				}
				
				return true;
			} else if (result.match(/weather/)) {
				if ($scope.jeeves.view != 'weather') {
					navigator.tts.speak("Gotcha. Going to weather now.", function() {
						$scope.changeView('weather');
						$scope.$apply();
					})
				} else {
					navigator.tts.speak("You're already on the weather page. You can ask for the current weather.");
				}
				return true;
			} else if (result.match(/menu/)) {
				if ($scope.jeeves.view != 'menu') {
					navigator.tts.speak("Gotcha. Going to menu now.", function() {
						$scope.changeView('menu')
						$scope.$apply();
					})
				} else {
					navigator.tts.speak('You are already on the menu. Would you like to check out the news or your email?');
				}
				
				return true;
			} else if (result.match(/settings/)) {
				if ($scope.jeeves.view != 'settings') {
					navigator.tts.speak("Gotcha. Going to settings now.", function() {
						$scope.changeView('settings')
						$scope.$apply();
					})
				} else {
					navigator.tts.speak("You're already on the settings page. You can ask for help if you'd like assistance on any part of the app by saying 'help' on that page.");
				}
				return true;
			} else if (result.match(/contact/)) {
				if ($scope.jeeves.view != 'contact') {
					navigator.tts.speak("Gotcha. Going to contact page now.", function() {
						$scope.changeView('contact')
						$scope.$apply();
					})
				} else {
					navigator.tts.speak("You're already on the contact page. Whether you have an issue with our application or would like to express how much you love it, please feel free to email us at jeevescorp@gmail.com!");
				}
				return true;
			} else if (result.match(/about/)) {
				if ($scope.jeeves.view != 'about') {
					navigator.tts.speak("Gotcha. Going to about page now.", function() {
						$scope.changeView('about')
						$scope.$apply();
					})
				} else {
					navigator.tts.speak("You're already on the about page. Let me introduce myself to you!");
				}
				return true;
			} else if (result.match(/help/)) {
				if ($scope.jeeves.view != 'help') {
					navigator.tts.speak("Gotcha. Going to help page now.", function() {
						$scope.changeView('help')
						$scope.$apply();
					})
				} else {
					navigator.tts.speak("You're already on the help page, which displays all the possible commands for every part of the app. If you still cannot figure something out, please email us at jeevescorp@gmail.com with your issue, and we will do our best to promptly respond to you!");
				}
				return true;
			}
		}else if (result.match(/read/)) {
			if (result.match(/email/)) {
				$scope.changeView('email');
				$scope.$apply();
				// Start reading emails.
				navigator.tts.speak("Now reading emails.");
				return true;
			} else {
				$scope.newsSpeech(result);
				return true;
			}
		}else if (result == "help") {
			if ($scope.jeeves.view == 'weather') {
				navigator.notification.alert(
					"You can say:" +
					"\n- Change city to - city name." +
					"\n- Change to - city name." +
					"\n- Change weather to - city name." +
					"\n- How's the weather?", 'Jeeves', 'Weather Commands', 'Confirm'
				)
				navigator.tts.speak("you can say change city to, city name.");
				navigator.tts.speak("or you can say change to, city name.");
				navigator.tts.speak("or you can say change weather to, city name.");
				navigator.tts.speak("or you can say, how's the weather?");
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
		}else {
			alert(result + " is an invalid command.");
		}

		if(city !== "INVALID"){
			$scope.jeeves.city = $scope.capitaliseFirstLetter(city);
			$scope.changeWeather(null);
			stop = true;

			navigator.tts.speak("Changing the city to " + $scope.jeeves.city + ".");
		}

		return stop;
	}

	$scope.speakWeatherReport = function(){
		var currentTemperature = "The current temperature in " + $scope.jeeves.city + " is " + $scope.jeeves.weather.temp.current + " degrees fahrenheit. ";
		navigator.speak(currentTemperature + $scope.jeeves.weather.description);
		if ($scope.jeeves.previousView[$scope.jeeves.previousView.length - 2] != 'weather') {
			$scope.changeView('back');
			$scope.$apply();
		}
	}

	$scope.newsSpeech = function(result){
		if ($scope.jeeves.view != 'news') {
			$scope.changeView('news');
			$scope.$apply();
		}
		if (result.match(/read me/) || result.match(/readme/)){
			if (result.length>7){
				var section1;
				if (result.match(/readme/)) {
					section1 = result.substring(7);
				} else {
					section1 = result.substring(8);
				}
				$scope.jeeves.newsPosition.section=section1;
				$scope.jeeves.newsPosition.articleIndex = 0;
				$scope.changeSection(section1);
			}
			else{
				$scope.jeeves.newsPosition.section=section;
				$scope.changeSection('news');
			}
			$scope.sayWebTitle($scope.jeeves.newsPosition.section);
			$scope.$apply();
		}else if (result.match(/next article/) || result.match(/continue/)) {
			navigator.tts.speak("Going to next article");
			$scope.sayWebTitle($scope.jeeves.newsPosition.section);
		}
		else if (result.match(/previous/)){
			if($scope.jeeves.newsPosition.articleIndex>1){
				navigator.tts.speak("Going to previous article");
				$scope.jeeves.newsPosition.articleIndex=$scope.jeeves.newsPosition.articleIndex-2;
				$scope.sayWebTitle($scope.jeeves.newsPosition.section);
			}
			else{
				navigator.tts.speak("There are no previous articles.");
			}
		}
		else if(result.match(/read article/)){
			$scope.readArticle();
			navigator.tts.speak("Finished reading article, either switch section or contine to next article?");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}
		else if(result.match(/more articles/)){

		}	
		$scope.$apply();
	}

	$scope.sayWebTitle = function(section){
		if ($scope.jeeves.newsPosition.section == "news"){
			navigator.tts.speak($scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].webTitle);
		//	navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section");
			// setTimeout(function(){
			// 	$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			// }, 14000);
		}else if ($scope.jeeves.newsPosition.section == "world"){
			navigator.tts.speak($scope.jeeves.newsArticles.world[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 12000);
		}else if ($scope.jeeves.newsPosition.section == "sports"){
			navigator.tts.speak($scope.jeeves.newsArticles.sports[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 12000);
		}else if ($scope.jeeves.newsPosition.section == "business"){
			navigator.tts.speak($scope.jeeves.newsArticles.business[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 12000);
		}else if ($scope.jeeves.newsPosition.section == "technology"){
			navigator.tts.speak($scope.jeeves.newsArticles.tech[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 12000);
		}else if ($scope.jeeves.newsPosition.section == "science"){
			navigator.tts.speak($scope.jeeves.newsArticles.science[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 12000);
		}
		$scope.$apply();
	}
	//change back title reader for news,merge with master and make sure not to delete anything, chaange read me to only read <section>, finish readArticle for articles with body, finish matches for newsSpeeech, get undefined articles removed ****************************************************************************
	//**********************************************************************************************************************************************
	//*************************************************************************************************************************
	$scope.readArticle = function(){
		if ($scope.jeeves.newsPosition.section == "news"){
		//	navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].webTitle);
			alert("PASSED speak");
			alert($scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].fields.body);
			var gotResult = $scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			alert("body :"+ div1.innerHTML);
			var finalResult="";
			 for (var i = 0; i >= gotResult.length; i++) {
			 	var h2 = div1.getElementsByTagName('p')[i];
				if(div1.getElementsByTagName('p')[i+1]==null){
			 		break;
			 	}
			 	var text = h2.innerHTML;
			 	finalResult=finalResult+text;
			 };
			 alert(finalResult);
			//navigator.tts.speak($scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].fields.body);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}else if ($scope.jeeves.newsPosition.section == "world"){
			navigator.tts.speak($scope.jeeves.newsArticles.world[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}else if ($scope.jeeves.newsPosition.section == "sports"){
			navigator.tts.speak($scope.jeeves.newsArticles.sports[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}else if ($scope.jeeves.newsPosition.section == "business"){
			navigator.tts.speak($scope.jeeves.newsArticles.business[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}else if ($scope.jeeves.newsPosition.section == "tech"){
			navigator.tts.speak($scope.jeeves.newsArticles.tech[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}else if ($scope.jeeves.newsPosition.section == "science"){
			navigator.tts.speak($scope.jeeves.newsArticles.science[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}
		$scope.$apply();
	}

	$scope.emailSpeech = function(result) {
		if (result == "read my emails" || "read" || "start reading") {
			var content = document.getElementById('email-announcement').innerText;
			navigator.tts.speak(content);
		}
	}

	$scope.getListArticle=function(){
		// var x = $scope.jeeves.section;
		// //$scope.jeeves.articles=$scope.jeeves.newsArticles.x;
		// $scope.jeeves.newsViews=x;

		// $http.get('http://beta.content.guardianapis.com/search?q=US&section='+x+'&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		// 	$scope.jeeves.articles=data.response.results;
		// 	var container = document.getElementById(x);
		// 	container.innerHTML="";
		// 	container.setAttribute('class', 'btn-group btn-block');

		// 	for (i = 0; i < $scope.jeeves.showNumber; i++){
		// 		var entry = $scope.jeeves.articles[i]; 
		// 		var div = document.createElement("div"); 
		// 		var button = document.createElement('input');
		// 		button.setAttribute('type', 'button'); 
		// 		button.setAttribute('class', 'btn btn-default btn-block'); 
		// 		button.setAttribute('id', x+"_" +i);
		// 		button.name=entry.webTitle; 
		// 		button.setAttribute('value', entry.webTitle); 
		// 		var divSub = document.createElement("div");
		// 		divSub.setAttribute('id', x+"_" +i + "_div");
		// 		button.onclick=function(){ 
		// 			var container = document.getElementById(this.id+"_div");
		// 			container.setAttribute('class', 'alert alert-success'); 
		// 			if($scope.jeeves.showNumber <= 10){
		// 				container.innerHTML=$scope.jeeves.articles[Number(this.id.slice(-1))].fields.body;
		// 			}else{
		// 				container.innerHTML=$scope.jeeves.articles[Number(this.id.slice(-2))].fields.body;
		// 			}
		// 		}
		// 		button.ondblclick=function(){
		// 			var containerContent = document.getElementById(this.id+"_div"); 
		// 			containerContent.outerHTML="";
		// 			$scope.getListArticle();
		// 		}
		// 		div.appendChild(button); 
		// 		div.appendChild(divSub);
		// 		container.appendChild(div);
		// 	}

		// 	if($scope.jeeves.showNumber<95){
		// 		var buttonMore = document.createElement('input');
		// 		buttonMore.setAttribute('type', 'button'); 
		// 		buttonMore.setAttribute('class', 'btn btn-default btn-block');
		// 		buttonMore.name="More"; 
		// 		buttonMore.setAttribute('value', "More");
		// 		buttonMore.addEventListener("click", $scope.updateShowAmount)
		// 		container.appendChild(buttonMore);
		// 	} 
		// });

		var x = $scope.jeeves.section;

		if(x=='news'){
			$scope.jeeves.articles=$scope.jeeves.newsArticles.news;
		}
		else if (x=='world') {
			$scope.jeeves.articles=$scope.jeeves.newsArticles.world;
		}
		else if (x=='sports') {
			$scope.jeeves.articles=$scope.jeeves.newsArticles.sports;
		}
		else if (x=='business') {
			$scope.jeeves.articles=$scope.jeeves.newsArticles.business;
		}
		else if (x=='tech') {
			$scope.jeeves.articles=$scope.jeeves.newsArticles.tech;
		}
		else if (x=='science') {
			$scope.jeeves.articles=$scope.jeeves.newsArticles.science;
		}
		else{
			$scope.jeeves.articles=$scope.jeeves.newsArticles.news;
		}

		$scope.jeeves.newsViews=x;
		var container = document.getElementById(x);
		container.innerHTML="";
		container.setAttribute('class', 'btn-group btn-block');
	//	console.log("DISPLAYYY");
	//	console.log($scope.jeeves.newsArticles.news);
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

	$scope.oauthlogin = function() {
		OAuth.initialize("hmTB5riczHFLIGKSA73h1_Tw9bU");
		OAuth.popup('google_mail', {cache: true})
		.done(function(result) {
			alert(JSON.stringify(result));
			result.me().done(function(data) {
				alert(JSON.stringify(data));
				result.get("https://www.googleapis.com/gmail/v1/users/me/messages?labelIds=['INBOX']")
				.done(function(email) {
					alert(JSON.stringify(email));
				})
			});
		})
	}
});


//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "weather",
	newsViews:"news",
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
	displayNews: {
		news: [],
		world: [],
		sports: [],
		business: [],
		tech: [],
		science: [],
		newsCount: 0,
		worldCount: 0,
		sportsCount: 0,
		businessCount: 0,
		techCount: 0,
		scienceCount:0
	},
	newsPosition: {
		section: 'news',
		articleIndex: 0,
		pause:false,
		pausePosition:0,
		contArticleContent:""
	},
	menuModal: {},
	isMenuOpen: false
};

var jeevesApp = angular.module("jeevesApp", ['ui.bootstrap']);

jeevesApp.run(function($http) {

	// Weather Info
	$http.jsonp('http://api.openweathermap.org/data/2.5/weather?q='+model.city+','+model.country+ '&units=imperial&callback=JSON_CALLBACK&APPID=32472867a57a09c1e174daf4fddb70d5').success(function(data) {
            model.weather.temp.current = data.main.temp;
            model.weather.clouds = data.clouds ? data.clouds.all : undefined;
            model.weather.description = data.weather[0].description;
    });

	// DO NOT DELETE. Loading News and this is the correct API url. DO NOT DELETE
	$http.get('http://beta.content.guardianapis.com/search?q=US&section=news&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		var count=0;
		for(var i=0;i<200;i++){
			if(data.response.results[i]!=undefined){
				if(data.response.results[i].hasOwnProperty('fields')){
					model.newsArticles.news[count]=data.response.results[i];
					count=count+1;
				}
				if(count>100){
					break;
				}
			}
		}
	});
	$http.get('http://beta.content.guardianapis.com/search?q=US&section=world&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		var count=0;
		for(var i=0;i<200;i++){
			if(data.response.results[i]!=undefined){
				if(data.response.results[i].hasOwnProperty('fields')){
					model.newsArticles.world[count]=data.response.results[i];
					count=count+1;
				}
				if(count>100){
					break;
				}
			}
		}
	});
	$http.get('http://beta.content.guardianapis.com/search?q=US&section=sport&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		var count=0;
		for(var i=0;i<200;i++){
			if(data.response.results[i]!=undefined){
				if(data.response.results[i].hasOwnProperty('fields')){
					model.newsArticles.sports[count]=data.response.results[i];
					count=count+1;
				}
				if(count>100){
					break;
				}
			}
		}
	});
	$http.get('http://beta.content.guardianapis.com/search?q=US&section=business&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		var count=0;
		for(var i=0;i<200;i++){
			if(data.response.results[i]!=undefined){
				if(data.response.results[i].hasOwnProperty('fields')){
					model.newsArticles.business[count]=data.response.results[i];
					count=count+1;
				}
				if(count>100){
					break;
				}
			}
		}
	});
	$http.get('http://beta.content.guardianapis.com/search?q=US&section=technology&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		var count=0;
		for(var i=0;i<200;i++){
			if(data.response.results[i]!=undefined){
				if(data.response.results[i].hasOwnProperty('fields')){
					model.newsArticles.tech[count]=data.response.results[i];
					count=count+1;
				}
				if(count>100){
					break;
				}
			}
		}
	});
	$http.get('http://beta.content.guardianapis.com/search?q=US&section=science&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		var count=0;
		for(var i=0;i<200;i++){
				if(data.response.results[i]!=undefined){
				if(data.response.results[i].hasOwnProperty('fields')){
					model.newsArticles.science[count]=data.response.results[i];
					count=count+1;
				}
				if(count>100){
					break;
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

	// For the use of first showing up "News" Section
	$scope.status = {
	    isFirstOpen: true,
	};

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
			if ($scope.jeeves.isMenuOpen) {
				$scope.closeMenu();
			} else {
				if ($scope.jeeves.previousView.length > 1) {
					$scope.jeeves.previousView.pop();
					var back = $scope.jeeves.previousView[$scope.jeeves.previousView.length - 1];
					$scope.jeeves.view = back;
				} else {
					navigator.app.exitApp();
				}
			}
		} else if (selected == 'news'){
			$scope.jeeves.previousView.push(selected);
			$scope.jeeves.view = selected;
			$scope.cutNews();
			$scope.closeMenu();
			if ($scope.jeeves.isMenuOpen) {
				$scope.closeMenu();
			}
		} else if (selected == 'menu') {
			if (!$scope.jeeves.isMenuOpen) {
				$scope.openMenu();
			}
		} else {
			if (selected == 'email') {
				$scope.oauthlogin();
				navigator.tts.speak("Please wait while I grab your emails.");
			}
			$scope.jeeves.previousView.push(selected);
			$scope.jeeves.view = selected;
			if ($scope.jeeves.isMenuOpen) {
				$scope.closeMenu();
			}
		}

		console.log($scope.jeeves.previousView);
	};

	$scope.openMenu = function() {
		$scope.jeeves.menuModal = $modal.open({
			templateUrl: 'menuContent.html',
			backdrop: 'static'
		})
		$scope.jeeves.isMenuOpen = true;
	}

	$scope.closeMenu = function() {
		$scope.jeeves.menuModal.close();
		$scope.jeeves.isMenuOpen = false;
	}

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
	}

	$scope.reco = function(){
		navigator.speechrecognizer.recognize(successCallback, failCallback, 3, "Jeeves Personal Assistant");
		function successCallback(results){
			for (var i = 0; i < results.length; i++) {
				var result = results[i].toLowerCase();
			}
				return results;
 		}

 		function failCallback(error){
		    alert("Error: " + error);
		}
	}

$scope.dialogMan = function(){
		var results = $scope.reco();
		if ($scope.globalCommands(results)){
			return;
		}else if ($scope.weatherSpeech(results))	{ //view == * do
			return;
		}
		else if ($scope.newsSpeech(results)) {
			return;
		}
		else if ($scope.emailSpeech(results)){
			return;
		}
	}



	$scope.globalCommands = function(results) {
		for (var i = 0; i < results.length; i++){ results[i]
			if (results[i] == "how is the weather" || results[i] == "how's the weather" || results[i] == "what's the weather" || results[i] == "what is the weather like today" || results[i] == "what's the weather like" || results[i] == "how's the weather today" || results[i] == "how is the weather today"){
				$scope.$apply(function() {
					$scope.changeView("weather");
				})
				navigator.tts.speak("The current temperature in " + $scope.jeeves.city + " is " + $scope.jeeves.weather.temp.current + " degrees fahrenheit. " + $scope.jeeves.weather.description + ".", function() {
					$scope.$apply(function() {
						$scope.changeView('back');
					})
				})
				return true;
			} else if (results[i].match(/go to/) || results[i].match(/open/)) {
				if (results[i].match(/news/)) {
					if ($scope.jeeves.view != 'news') {
						navigator.tts.speak("On it.", function() {
							$scope.$apply(function() {
								$scope.changeView('news');
							});
						})
					} else {
						navigator.tts.speak("You're already on the news page. Would you like to listen to world or business news?")
					}
					return true;
				} else if (results[i].match(/email/)) {
					if ($scope.jeeves.view != 'email') {
						navigator.tts.speak("On it.", function() {
							$scope.$apply(function() {
								$scope.changeView('email');
							});
						})
					} else {
						navigator.tts.speak("You're already on the email page. Would you like to hear your inbox messages?");
					}
					
					return true;
				} else if (results[i].match(/weather/)) {
					if ($scope.jeeves.view != 'weather') {
						navigator.tts.speak("On it.", function() {
							$scope.$apply(function() {
								$scope.changeView('weather');
							});
						})
					} else {
						navigator.tts.speak("You're already on the weather page. You can ask for the current weather.");
					}
					return true;
				} else if (results[i].match(/menu/)) {
					if ($scope.jeeves.view != 'menu') {
						navigator.tts.speak("On it.", function() {
							$scope.$apply(function() {
								$scope.changeView('menu');
							});
						})
					} else {
						navigator.tts.speak('You are already on the menu. Would you like to check out the news or your email?');
					}
					
					return true;
				} else if (results[i].match(/settings/)) {
					if ($scope.jeeves.view != 'settings') {
						navigator.tts.speak("On it.", function() {
							$scope.$apply(function() {
								$scope.changeView('settings');
							});
						})
					} else {
						navigator.tts.speak("You're already on the settings page. You can ask for help if you'd like assistance on any part of the app by saying 'help' on that page.");
					}
					return true;
				} else if (results[i].match(/contact/)) {
					if ($scope.jeeves.view != 'contact') {
						navigator.tts.speak("On it.", function() {
							$scope.$apply(function() {
								$scope.changeView('contact');
							});
						})
					} else {
						navigator.tts.speak("You're already on the contact page. Whether you have an issue with our application or would like to express how much you love it, please feel free to email us at jeevescorp@gmail.com!");
					}
					return true;
				} else if (results[i].match(/about/)) {
					if ($scope.jeeves.view != 'about') {
						navigator.tts.speak("On it.", function() {
							$scope.$apply(function() {
								$scope.changeView('about');
							});
						})
					} else {
						navigator.tts.speak("You're already on the about page. Let me introduce myself to you!");
					}
					return true;
				} else if (results[i].match(/help/)) {
					if ($scope.jeeves.view != 'help') {
						navigator.tts.speak("On it.", function() {
							$scope.$apply(function() {
								$scope.changeView('help');
							});
						})
					} else {
						navigator.tts.speak("You're already on the help page, which displays all the possible commands for every part of the app. If you still cannot figure something out, please email us at jeevescorp@gmail.com with your issue, and we will do our best to promptly respond to you!");
					}
					return true;
				}
			}else if (results[i].match(/read/)) {
				if (results[i].match(/email/)) {
					navigator.tts.speak("No problem! Let's pull up your emails.", function () {
						$scope.$apply(function() {
							$scope.changeView('email');
						});
						// Start reading emails.
					});
					return true;
				} else {
					//Begin news speech recognition.
					$scope.newsSpeech(results[i]);
					return true;
				}
			}else if (results[i] == "help") {
				if ($scope.jeeves.view == 'weather') {
					$scope.jeeves.weathermodalhelp = $modal.open({
						templateUrl: "weather-help.html",
						windowClass: 'help-window'
					})
					navigator.tts.speak("I welcome natural language! But if you need a hint, you can say 'How's the weather?' or 'Change city to - city name.'", function() {
						$scope.jeeves.weathermodalhelp.close();
					});
					return true;
				}else if ($scope.jeeves.view == 'email') {
					$scope.jeeves.emailmodalhelp = $modal.open({
						templateUrl: "email-help.html",
						windowClass: "help-window"
					})
				} else {
					navigator.tts.speak("You're already on the help page, which displays all the possible commands for every part of the app. If you still cannot figure something out, please email us at jeevescorp@gmail.com with your issue, and we will do our best to promptly respond to you!");
				}
				return true;
			}
		}else if (results[i].match(/read/)) {
			if (results[i].match(/email/)) {
				navigator.tts.speak("Let's pull up your emails.", function () {
					$scope.$apply(function() {
						$scope.changeView('email');
					});
					// Start reading emails.
				});
				return true;
			} else {
				//Begin news speech recognition.
				$scope.newsSpeech(result);
				return true;
			}
		}else if (results[i] == "help") {
			if ($scope.jeeves.view == 'weather') {
				$scope.jeeves.weathermodalhelp = $modal.open({
					templateUrl: "weather-help.html",
					windowClass: 'help-window'
				})
				navigator.tts.speak("I welcome natural language! But if you need a hint, you can say 'How's the weather?' or 'Change city to - city name.'", function() {
					$scope.jeeves.weathermodalhelp.close();
				});
				return true;
			}else if ($scope.jeeves.view == 'email') {
				$scope.jeeves.emailmodalhelp = $modal.open({
					templateUrl: "email-help.html",
					windowClass: "help-window"
				})
				navigator.tts.speak("I welcome natural language! But if you need a hint, you can say 'Read me my emails!' or 'Log me in.'", function() {
					$scope.jeeves.emailmodalhelp.close();
				});
				return true;
			// }else if (help.match(/favorites/)) {
				//Favorites is currently disabled.
			}else if (results[i].match(/menu/)) {
				// Don't open a new modal, menu is already a modal.
				navigator.tts.speak("Let me know where you'd like to go! Can I grab your emails or check the latest news?", function() {
					$scope.reco();
				});
			}else if (results[i].match(/about/)) {
				navigator.tts.speak("Nothing to do on this page! Can I take you back to the menu?", function() {
					var resps = $scope.reco();
					var confirmed = $scope.confirmSpeech(resps, "go to menu");
					if (!confirmed) {
						navigator.tts.speak("Not the menu? That's ok. Maybe you'd prefer to go to news or email?")
					}
				});
			}else if (results[i].match(/settings/)) {
				navigator.tts.speak("you can say change city to insert city"); 
			}else if (results[i].match(/contact/)) {
				navigator.tts.speak("you can say read");
			}else if (results[i].match(/news/)) {
				navigator.tts.speak("you can say read me - insert section");
				navigator.tts.speak("you can say read me next article");
				navigator.tts.speak("you can say read me article - insert title");
				navigator.tts.speak("you can say more articles");
				navigator.tts.speak("you can say read me last or previous article");
			}

			}
		}
	}
	$scope.confirmSpeech = function(resps, command) {
		for (var i = 0; i < resps.length; i++) {
			if (resps[i].match(/yes/)) {
				$scope.dialogMan(command);
				return true;
			}
		}
		return false;

	}

	$scope.weatherSpeech = function(results) {
		var city = "INVALID";
		// var stop = false;
		for (var i = 0; results.length; i++) {
			if (results[i].lastIndexOf("change city to")==0){
				city = results[i].slice(15);
			}else if (results[i].lastIndexOf("change to")==0){
				city = results[i].slice(10);
			}else if (results[i].lastIndexOf("change weather to")==0){
				city = results[i].slice(18);
			// }else if (result.lastIndexOf("change whether to")==0){
			// 	city = result.slice(18);
			}else if (results[i].lastIndexOf("what's the weather of")==0){
				city = results[i].slice(22);
			}else {
				alert(results[i] + " is an invalid command.");
			}

			if(city !== "INVALID"){
				$scope.jeeves.city = $scope.capitaliseFirstLetter(city);
				$scope.changeWeather(null);
				// stop = true;

				navigator.tts.speak("Changing the city to " + $scope.jeeves.city + ".");
				return true;
			} 
			// return stop;
			return false;
		}
	}

	//Commands are: read, read <section>, read article, continue, previous, more articles
	$scope.newsSpeech = function(results){
		for (var i = 0; results.length; i++) {
			if ($scope.jeeves.view != 'news') {
				$scope.changeView('news');
				$scope.$apply();
			}
			if (results[i].match(/read/)){
				 if(results[i].match(/article/)){
					$scope.readArticle();
					$scope.jeeves.newsPosition.pause=false;
					$scope.jeeves.newsPosition.pausePosition=0;
					$scope.jeeves.newsPosition.contArticleContent="";
				}
				else{
				if (results[i].length>4){
					var section1=results[i].substring(5);
					$scope.jeeves.newsPosition.section=section1;
					$scope.jeeves.newsPosition.articleIndex = 0;
				}
				else{
					$scope.jeeves.newsPosition.section=section;
				}
				$scope.sayWebTitle($scope.jeeves.newsPosition.section);
				$scope.$apply();
				}
			}else if (results[i].match(/next article/) || results[i].match(/continue/)) {
				navigator.tts.speak("Going to next article", function(){
					$scope.$apply(function(){
						$scope.jeeves.newsPosition.articleIndex++;
						$scope.sayWebTitle($scope.jeeves.newsPosition.section);
					});
				});
			}
			else if (results[i].match(/previous/)){
				if($scope.jeeves.newsPosition.articleIndex>1){
					navigator.tts.speak("Going to previous article", function(){
						$scope.$apply(function(){
							$scope.jeeves.newsPosition.articleIndex=$scope.jeeves.newsPosition.articleIndex-1;
							$scope.sayWebTitle($scope.jeeves.newsPosition.section);
						});
					});
				}
				else{
						navigator.tts.speak("There are no previous articles.");
				}
			}
			else if(result.match(/more articles/)){
				//We have to remove if were changing the style of news, maybe?
				$scope.differentFive($scope.jeeves.newsPosition.section,true);
			}
			else if(result.match(/previous five/)){
				$scope.differentFive($scope.jeeves.newsPosition.section,false);
			}	
			$scope.$apply();
		}
	}

	$scope.sayWebTitle = function(section){
		if ($scope.jeeves.newsPosition.section == "news"){
			navigator.tts.speak($scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].webTitle+ ". If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles.", function() {
						$scope.$apply(function() {
							$scope.reco();
						});
				});
		}else if ($scope.jeeves.newsPosition.section == "world"){
			navigator.tts.speak($scope.jeeves.newsArticles.world[$scope.jeeves.newsPosition.articleIndex].webTitle+ ". If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles.", function() {
						$scope.$apply(function() {
							$scope.reco();
						});
				});
		}else if ($scope.jeeves.newsPosition.section == "sports"){
			navigator.tts.speak($scope.jeeves.newsArticles.sports[$scope.jeeves.newsPosition.articleIndex].webTitle+ ". If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles.", function() {
						$scope.$apply(function() {
							$scope.reco();
						});
				});
		}else if ($scope.jeeves.newsPosition.section == "business"){
			navigator.tts.speak($scope.jeeves.newsArticles.business[$scope.jeeves.newsPosition.articleIndex].webTitle+ ". If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles.", function() {
						$scope.$apply(function() {
							$scope.reco();
						});
				});
		}else if ($scope.jeeves.newsPosition.section == "technology"){
			navigator.tts.speak($scope.jeeves.newsArticles.tech[$scope.jeeves.newsPosition.articleIndex].webTitle+ ". If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles.", function() {
						$scope.$apply(function() {
							$scope.reco();
						});
				});
		}else if ($scope.jeeves.newsPosition.section == "science"){
			navigator.tts.speak($scope.jeeves.newsArticles.science[$scope.jeeves.newsPosition.articleIndex].webTitle+ ". If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles.", function() {
						$scope.$apply(function() {
							$scope.reco();
						});
				});
		}
		$scope.$apply();
	}

	$scope.readArticle = function(){
		if ($scope.jeeves.newsPosition.section == "news"){			
			var gotResult = $scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
						$scope.$apply(function() {
							$scope.jeeves.newsPosition.contArticleContent=finalResult;
							$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
						});
				});
		}else if ($scope.jeeves.newsPosition.section == "world"){
			var gotResult = $scope.jeeves.newsArticles.world[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.world[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
						$scope.$apply(function() {
							$scope.jeeves.newsPosition.contArticleContent=finalResult;
							$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
						});
				});
		}else if ($scope.jeeves.newsPosition.section == "sports"){
			var gotResult = $scope.jeeves.newsArticles.sports[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.sports[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
						$scope.$apply(function() {
							$scope.jeeves.newsPosition.contArticleContent=finalResult;
							$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
						});
				});
		}else if ($scope.jeeves.newsPosition.section == "business"){
			var gotResult = $scope.jeeves.newsArticles.business[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.business[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
						$scope.$apply(function() {
							$scope.jeeves.newsPosition.contArticleContent=finalResult;
							$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
						});
				});
		}else if ($scope.jeeves.newsPosition.section == "tech"){
			var gotResult = $scope.jeeves.newsArticles.tech[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.tech[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
						$scope.$apply(function() {
							$scope.jeeves.newsPosition.contArticleContent=finalResult;
							$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
						});
				});
		}else if ($scope.jeeves.newsPosition.section == "science"){
			var gotResult = $scope.jeeves.newsArticles.science[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.science[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
						$scope.$apply(function() {
							$scope.jeeves.newsPosition.contArticleContent=finalResult;
							$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
						});
				});
		}
		$scope.$apply();
	}

	$scope.recursiveArticleChunk = function(chunkArray, position){
		output = chunkArray[position];
		if($scope.jeeves.newsPosition.pause==true){
			$scope.jeeves.newsPosition.pausePosition=position;
		}
		else if(position>=chunkArray.length){
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles.", function(){
				$scope.$apply(function(){
					$scope.reco();
				});
			});
		}
		else{
			navigator.tts.speak(output, function(){
				$scope.recursiveArticleChunk(chunkArray, (position+1));
			});
		}
	}

	$scope.pauseAndPlay = function(){
		if($scope.jeeves.newsPosition.pause==false){
			alert("click pause true");
			$scope.jeeves.newsPosition.pause=true;
		}
		else{
			alert("click pause false");
			$scope.jeeves.newsPosition.pause=false;
			var cont=$scope.jeeves.newsPosition.contArticleContent;
			alert("cont: "+cont);
			alert("pause position: "+$scope.jeeves.newsPosition.pausePosition);
			$scope.recursiveArticleChunk(cont.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
		}
	}


	$scope.emailSpeech = function(results) {
		for (var i = 0; i <results.length; i++) {
			if (results[i] == "read my emails" || "read" || "start reading") {
				var content = document.getElementById('email-announcement').innerText;
				navigator.tts.speak(content);
			}
		}	
	}

	$scope.capitaliseFirstLetter=function(string){
    	return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	$scope.setInnerHTML = function(entry){
		document.getElementById(entry.webTitle).innerHTML=entry.fields.body;
	};

	$scope.differentFive = function(selected, increment){
		var change = 5;

		if(!increment){
			change = -5;
		}

		if(selected=="news"){
			$scope.jeeves.displayNews.newsCount += change;
		}else if (selected=="world"){
			$scope.jeeves.displayNews.worldCount += change;
		}else if (selected=="sports"){
			$scope.jeeves.displayNews.sportsCount += change;
		}else if (selected=="business"){
			$scope.jeeves.displayNews.businessCount += change;
		}else if (selected=="tech"){
			$scope.jeeves.displayNews.techCount += change;
		}else if (selected=="science"){
			$scope.jeeves.displayNews.scienceCount += change;
		}else{
			console.log("Something wrong with the cutting");
		}

		$scope.cutNews();
	}

	$scope.disableBack = function(){
		if($scope.jeeves.displayNews.newsCount<5){
			var button = document.getElementById('newsBack');
			button.disabled = 'disabled';
		}else{
			var button = document.getElementById('newsBack');
			button.disabled = null;
		}
		if($scope.jeeves.displayNews.worldCount<5){
			var button = document.getElementById('worldBack');
			button.disabled = 'disabled';
		}else{
			var button = document.getElementById('worldBack');
			button.disabled = null;
		}
		if($scope.jeeves.displayNews.sportsCount<5){
			var button = document.getElementById('sportsBack');
			button.disabled = 'disabled';
		}else{
			var button = document.getElementById('sportsBack');
			button.disabled = null;
		}
		if($scope.jeeves.displayNews.businessCount<5){
			var button = document.getElementById('businessBack');
			button.disabled = 'disabled';
		}else{
			var button = document.getElementById('businessBack');
			button.disabled = null;
		}
		if($scope.jeeves.displayNews.techCount<5){
			var button = document.getElementById('techBack');
			button.disabled = 'disabled';
		}else{
			var button = document.getElementById('techBack');
			button.disabled = null;
		}
		if($scope.jeeves.displayNews.scienceCount<5){
			var button = document.getElementById('scienceBack');
			button.disabled = 'disabled';
		}else{
			var button = document.getElementById('scienceBack');
			button.disabled = null;
		}
	}

	$scope.cutNews = function(){
		$scope.jeeves.displayNews.news = $scope.jeeves.newsArticles.news.slice($scope.jeeves.displayNews.newsCount, $scope.jeeves.displayNews.newsCount+5);
		$scope.jeeves.displayNews.world = $scope.jeeves.newsArticles.world.slice($scope.jeeves.displayNews.worldCount, $scope.jeeves.displayNews.worldCount+5);
		$scope.jeeves.displayNews.sports = $scope.jeeves.newsArticles.sports.slice($scope.jeeves.displayNews.sportsCount, $scope.jeeves.displayNews.sportsCount+5);
		$scope.jeeves.displayNews.business = $scope.jeeves.newsArticles.business.slice($scope.jeeves.displayNews.businessCount, $scope.jeeves.displayNews.businessCount+5);
		$scope.jeeves.displayNews.tech = $scope.jeeves.newsArticles.tech.slice($scope.jeeves.displayNews.techCount, $scope.jeeves.displayNews.techCount+5);
		$scope.jeeves.displayNews.science = $scope.jeeves.newsArticles.science.slice($scope.jeeves.displayNews.scienceCount, $scope.jeeves.displayNews.scienceCount+5);
		$scope.disableBack();
	}


	$scope.oauthlogin = function() {
		OAuth.initialize("hmTB5riczHFLIGKSA73h1_Tw9bU");
		OAuth.popup('google_mail', {cache: true})
		.done(function(result) {
			result.me().done(function(data) {
				result.get("https://www.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX")
				.done(function(list) {
					document.getElementById('authorize-button').style.visibility = '';
					document.getElementById('email-announcement').innerHTML = '<i>Hello! I am reading your <b>unread inbox</b> emails.</i><br><br>';
					var content = document.getElementById("message-list");
					if (list.messages == null) {
				        content.innerHTML = "<b>Your inbox is empty.</b>";
				      } else {
				        content.innerHTML = "------<br>";
				        angular.forEach(list.messages, function(message) {
				        	result.get("https://www.googleapis.com/gmail/v1/users/me/messages/" + message.id)
				        	.done(function(email) {
				        		// if (email.payload == null) {
				        		// 	console.log("Payload null: " + message.id);
				        		// }
			        			var header = document.createElement('div');
			            		var sender = document.createElement('div');
			            		angular.forEach(email.payload.headers, function(item) {
			            			if (item.name == 'Subject') {
			            				header.setAttribute('id', 'email-header');
			            				header.innerHTML = '<b>Subject: ' + item.value + '</b><br>';
			              			}
			              			if (item.name == "From") {
						                sender.setAttribute('id', 'email-sender');
						                sender.innerHTML = '<b>From: ' + item.value + '</b><br>';
						            }
			            		})
				              	content.appendChild(header);
				              	content.appendChild(sender);
				              	var contents = document.createElement('div');
				              	contents.setAttribute('id', 'email-content');
				              	alert("Read this");
				              	contents.innerHTML = atob(stuff.payload.body.data);
				              	alert("Read this too");
				              	// if (stuff.payload.parts == null) {
				              	// 	alert("Read me 1");
				              	// 	contents.innerHTML = atob(stuff.payload.body.data);
				              	// 	// try {
				              	// 	// 	contents.innerHTML = base64.decode(stuff.payload.body.data) + "<br><br>";
				              	// 	// } catch (err) {
				              	// 	// 	contents.innerHTML = "Error decoding, but got to this step.<br><br>"
				              	// 	// }

				              	// } else {
				              	// 	alert("Read me 2");
				              	// 	contents.innerHTML = atob(stuff.payload.parts[0].body.data);
				              	// 	// try {
				              	// 	// 	contents.innerHTML = base64.decode(stuff.payload.parts[0].body.data) + "<br><br>";
				              	// 	// } catch (err) {
				              	// 	// 	contents.innerHTML = "Error decoding, but got to this step.<br><br>"
				              	// 	// }
				              	// }
				              	content.appendChild(contents);
				        	})
				        })
				    }
				})
			});
		})
	}

	$scope.testcall = function() {
		$http.post({
			url: "/decode",
			data: JSON.stringify('Qm9zdG9uIFVwZGF0ZQ0KDQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQkgCQ0KDQpCb3N0b24gUmVkIFNveA0KDQp2cy4gTmV3IFlvcmsgWWFua2VlcyA4LzENCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NDAvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMzMzU3JTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQp2cy4gSG91c3RvbiBBc3Ryb3MgOC8xNQ0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ0MS9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzI2NTMlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQoNCnZzLiBIb3VzdG9uIEFzdHJvcyA4LzE2DQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDQyL2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMTElMjZwcm9kSUQlM0QzMjY1NCUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCg0KdnMuIEhvdXN0b24gQXN0cm9zIDgvMTcNCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NDMvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMyNjU1JTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQp2cy4gTG9zIEFuZ2VsZXMgQW5nZWxzIG9mIEFuYWhlaW0gOC8xOA0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ0NC9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzI2NTYlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQoNCnZzLiBMb3MgQW5nZWxlcyBBbmdlbHMgb2YgQW5haGVpbSA4LzE5DQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDQ1L2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMTElMjZwcm9kSUQlM0QzMjY1NyUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCg0KYW5kIG1hbnkgTW9yZSENCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NDYvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZjYXRlZ29yeSUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMDIlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQ0KDQpUaGUgTGlvbiBLaW5nIC0gSGlnaCBkZW1hbmQhDQpCb3N0b24gT3BlcmEgSG91c2UgLSBCb3N0b24sIE1BDQoNClNlcHRlbWJlciAyMCwgMjAxNCAtIE1hdGluZWUNCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NDcvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMyNzIzJTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQpTZXB0ZW1iZXIgMjUsIDIwMTQgLSBFdmVuaW5nDQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDQ4L2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMTElMjZwcm9kSUQlM0QzMjcyMSUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCg0KU2VwdGVtYmVyIDI4LCAyMDE0IC0gRXZlbmluZw0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ0OS9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzI3MjIlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQkNCg0KTWFtbWEgTWlhIC0gSGlnaCBkZW1hbmQhDQpDaXRpIEVtZXJzb24gQ29sb25pYWwgVGhlYXRyZSAtIEJvc3RvbiwgTUENCg0KT2N0b2JlciAzMSwgMjAxNCAtIEV2ZW5pbmcNCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NTAvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMyNzkxJTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQpOb3ZlbWJlciAyLCAyMDE0IC0gRXZlbmluZw0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ1MS9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzI3OTAlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQkNCg0KTmV3ISBCb3N0b24gQmFsbGV0IC0gU3dhbiBMYWtlIC0gU2F2ZSB1cCB0byAkMTIuMDAhDQpCb3N0b24gT3BlcmEgSG91c2UgLSBCb3N0b24sIE1BDQoNCk5vdmVtYmVyIDEsIDIwMTQgLSBFdmVuaW5nDQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDUyL2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMTElMjZwcm9kSUQlM0QzMzMxNiUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCQ0KDQpKb3NlcGggYW5kIHRoZSBBbWF6aW5nIFRlY2huaWNvbG9yIERyZWFtY29hdCAtIFNhdmUgdXAgdG8gJDE1LjUwIQ0KSGFub3ZlciBUaGVhdHJlIC0gV29yY2VzdGVyLCBNQQ0KDQpOb3ZlbWJlciAyLCAyMDE0IC0gTWF0aW5lZQ0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ1My9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzMxMTQlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQ0KDQpBbm5pZSAtIFNhdmUgdXAgdG8gJDE1LjEwIQ0KV2FuZyBUaGVhdHJlIC0gQm9zdG9uLCBNQQ0KDQpOb3ZlbWJlciAxNiwgMjAxNCAtIEV2ZW5pbmcNCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NTQvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMzMzE2JTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0JIAkNCg0KTmV3ISBUaGUgTnV0Y3JhY2tlciAtIFNhdmUgdXAgdG8gJDIyLjAwIQ0KQm9zdG9uIE9wZXJhIEhvdXNlIC0gQm9zdG9uLCBNQQ0KDQpOb3ZlbWJlciAyOSwgMjAxNCAtIEV2ZW5pbmcNCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NTUvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMzMzQ1JTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQpEZWNlbWJlciA2LCAyMDE0IC0gRXZlbmluZyAJDQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDU2L2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMTElMjZwcm9kSUQlM0QzMzM0NiUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tDQoJIAkNClJ1ZG9scGggVGhlIFJlZC1Ob3NlZCBSZWluZGVlcjogVGhlIE11c2ljYWwgLSBTYXZlIHVwIHRvICQxMS41MCENCkNpdGkgU2h1YmVydCBUaGVhdHJlIC0gQm9zdG9uLCBNQQ0KDQpEZWNlbWJlciAxMywgMjAxNCAtIDEwOjAwIGEubS4NCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NTcvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMzMDYxJTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0NCg0KTmV3ISBBIENocmlzdG1hcyBDYXJvbCAtIFNhdmUgdXAgdG8gJDUuMDAhDQpIYW5vdmVyIFRoZWF0cmUgLSBXb3JjZXN0ZXIsIE1BDQoNCkRlY2VtYmVyIDIxLCAyMDE0IC0gTWF0aW5lZQ0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ1OC9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzMzNDglMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQ0KDQpEaXNuZXkgb24gSWNlIC0gRnJvemVuIQ0KVEQgR2FyZGVuIC0gQm9zdG9uLCBNQQ0KDQpGZWJydWFyeSAxNCwgMjAxNSAtIDc6MDAgcC5tLg0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ1OS9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzMwOTIlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQoNCkZlYnJ1YXJ5IDE1LCAyMDE1IC0gNTowMCBwLm0uDQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDYwL2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMTElMjZwcm9kSUQlM0QzMzA5MyUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCg0KRmVicnVhcnkgMjAsIDIwMTUgLSA3OjAwIHAubS4NCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NjEvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMzMDk0JTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQpGZWJydWFyeSAyMSwgMjAxNSAtIDc6MDAgcC5tLg0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ2Mi9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzMwOTUlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQoNCkZlYnJ1YXJ5IDIyLCAyMDE1IC0gNzowMCBwLm0uDQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDYzL2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMTElMjZwcm9kSUQlM0QzMzA5NiUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCQ0KDQpNb3Rvd246IFRoZSBNdXNpY2FsIC0gSGlnaCBkZW1hbmQhDQpCb3N0b24gT3BlcmEgSG91c2UgLSBCb3N0b24NCg0KRmVicnVhcnkgNiwgMjAxNSAtIEV2ZW5pbmcNCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NjQvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMyNzk0JTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQpGZWJydWFyeSAxMiwgMjAxNSAtIEV2ZW5pbmcNCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NjUvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMyNzkzJTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQpGZWJydWFyeSAxNSwgMjAxNSAtIEV2ZW5pbmcNCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NjYvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMyNzkyJTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0NCg0KSXJ2aW5nIEJlcmxpbidzIFdoaXRlIENocmlzdG1hcyAtIFNhdmUgdXAgdG8gJDE3LjAwIQ0KV2FuZyBUaGVhdHJlIC0gQm9zdG9uLCBNQQ0KDQpEZWNlbWJlciAyMSwgMjAxNCAtIEV2ZW5pbmcNCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NjcvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMzMzEzJTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0JIAkJDQoNCkRpcnR5IERhbmNpbmcgLSBIaWdoIGRlbWFuZCENCkNpdGkgRW1lcnNvbiBDb2xvbmlhbCBUaGVhdHJlIC0gQm9zdG9uDQoNCkFwcmlsIDMwLCAyMDE1IC0gRXZlbmluZw0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ2OC9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzI4MDIlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQoNCk1heSAzLCAyMDE1IC0gTWF0aW5lZQ0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ2OS9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzI4MDElMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQoNCk1heSA5LCAyMDE1IC0gRXZlbmluZw0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ3MC9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzI4MDAlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQ0KDQpLaW5reSBCb290cyAtIEhpZ2ggZGVtYW5kIQ0KQm9zdG9uIE9wZXJhIEhvdXNlIC0gQm9zdG9uDQoNClRoZXNlIGFyZSAyMDE1IHBlcmZvcm1hbmNlcy4NCg0KQXVndXN0IDEzLCAyMDE1IC0gRXZlbmluZw0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ3MS9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzI5NTElMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQoNCkF1Z3VzdCAxNCwgMjAxNSAtIEV2ZW5pbmcNCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NzIvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMyOTQwJTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQpBdWd1c3QgMTYsIDIwMTUgLSBFdmVuaW5nDQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDczL2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMTElMjZwcm9kSUQlM0QzMjk1MCUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tDQoNCk5ld3NpZXMgLSBIaWdoIGRlbWFuZCENCkJvc3RvbiBPcGVyYSBIb3VzZSAtIEJvc3Rvbg0KDQpKdW5lIDI2LCAyMDE1IC0gRXZlbmluZw0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ3NC9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDExJTI2cHJvZElEJTNEMzI3OTklMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQoNCkp1bmUgMjgsIDIwMTUgLSBFdmVuaW5nDQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDc1L2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMTElMjZwcm9kSUQlM0QzMjc5OCUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tDQoNCkZvciBhIGNvbXBsZXRlIGxpc3Qgc2hvd3MsIHBsZWFzZSB2aXNpdCB0aGUgQm9zdG9uICBzZWN0aW9uIG9mIHRoZWF0cmUgYW5kIGV2ZW50cyBwYWdlLg0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ3Ni9odHRwJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGc3ViY2F0ZWdvcnklMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMTElMjZzdWJjYXRJRCUzRDI3NCUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQlMjZ1dG0lNUZwcm9kJTNEb3RoZXJzaG93cw0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0JIAkNCg0KQXR0cmFjdGlvbnMNCg0KQ2Fub2JpZSBMYWtlIFBhcmsJIAkNCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NzcvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QyMSUyNnByb2RJRCUzRDMyNjgyJTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQpCb3N0b24gQ2l0eVBBU1MgDQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDc4L2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMTElMjZwcm9kSUQlM0QzMjEyNiUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCg0KV2F0ZXIgQ291bnRyeSANCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0NzkvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QyMSUyNnByb2RJRCUzRDMyNjQ4JTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQpCcm9tbGV5DQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDgwL2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMjElMjZwcm9kSUQlM0QzMjg0NSUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCg0KU2l4IEZsYWdzIE5ldyBFbmdsYW5kIFNpbmdsZSBEYXkgVGlja2V0DQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDgxL2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMjElMjZwcm9kSUQlM0QzMjY0MSUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCg0KRHVjayBUb3VycyBTYXZlIHVwIHRvICQ1Ljc5IQ0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ4Mi9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDIxJTI2cHJvZElEJTNEMzMzMjclMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQoNClNvdXRod2ljaydzIFpvbwkgCQ0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ4My9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDIxJTI2cHJvZElEJTNEMTUwMjAlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQoNCktpbmcgUmljaGFyZCdzIEZhaXINCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0ODQvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRmNhdGVnb3J5SUQlM0QxMSUyNnByb2RJRCUzRDMxNjMwJTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQpOZXcgRW5nbGFuZCBBcXVhcml1bQ0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ4NS9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGY2F0ZWdvcnlJRCUzRDIxJTI2cHJvZElEJTNEMzE1NDQlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQoNCkxha2UgQ29tcG91bmNlCSAJDQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDg2L2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGcHJvZHVjdERldGFpbHMlMkVjZm0lM0ZjYXRlZ29yeUlEJTNEMTElMjZwcm9kSUQlM0QzMjc2NSUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCg0KQ2xpY2sgaGVyZSBmb3IgYSBjb21wbGV0ZSBsaXN0IG9mIEJvc3RvbiBBdHRyYWN0aW9ucy4NCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0ODcvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZzdWJjYXRlZ29yeSUyRWNmbSUzRmNhdGVnb3J5SUQlM0QyMSUyNnN1YmNhdElEJTNEMjY0NyUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCSAJIAkNCg0KQ2xpY2sgSEVSRSB0byB2aWV3IGEgY29tcGxldGUgbGlzdCBvZiBNb3ZpZSBFLVRpY2tldHMhDQpodHRwOi8vdC5zZW5kMjR3ZWIuY29tL3RyYWNrL2NsaWNrLzE3Ojc5MzA6MjY2NDAzNzpFNzQyOUI0RC02ODQ0LTQwRUQtODEzRS0wMTc3NzQwMzlDN0IvMzIyNDg4L2h0dHBzJTNBJTJGJTJGd3d3JTJFd29ya2luZ2FkdmFudGFnZSUyRWNvbSUyRnByb2R1Y3RzJTJGc3ViY2F0ZWdvcnklMkVjZm0lM0ZzdWJjYXRJRCUzRDI2ODIlMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQkgCQ0KCQ0KVG9wIFdlYiBEZWFscw0KDQpWZXJpem9uIFdpcmVsZXNzIDUwJSBPZmYgTmV3IFNtYXJ0cGhvbmVzIGF0IFZlcml6b24gV2lyZWxlc3MhIE5ldyAyeXIgYWN0aXZhdGlvbiByZXEnZC4gRnJlZSBPdmVybmlnaHQgU2hpcHBpbmcsIDcvMjcuCQ0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ4OS9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGcHJvZElEJTNEMzIyMTklMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQoNCkFUJlQJVS1mYW1pbHkgVFYgKyBJbnRlcm5ldCBFbGl0ZSArIFZvaWNlIDIwMDogJDc5L21vICsgJDI1MCBpbiByZXdhcmQgY2FyZHMsIHRocnUgNy8yNiENCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0OTAvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRnByb2RJRCUzRDMyOTg3JTI2dXRtJTVGc291cmNlJTNEZU5ld3MlMjZ1dG0lNUZtZWRpdW0lM0RlbWFpbCUyNnV0bSU1RmNhbXBhaWduJTNEQm9zdG9uTmV3czA3MjgxNA0KDQpIZXJiYWxpZmUgUmVjZWl2ZSAyMCUgb2ZmIGFsbCBIZXJiYWxpZmUgcHJvZHVjdHMhCQ0KaHR0cDovL3Quc2VuZDI0d2ViLmNvbS90cmFjay9jbGljay8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCLzMyMjQ5MS9odHRwcyUzQSUyRiUyRnd3dyUyRXdvcmtpbmdhZHZhbnRhZ2UlMkVjb20lMkZwcm9kdWN0cyUyRnByb2R1Y3REZXRhaWxzJTJFY2ZtJTNGcHJvZElEJTNEMzMxNyUyNnV0bSU1RnNvdXJjZSUzRGVOZXdzJTI2dXRtJTVGbWVkaXVtJTNEZW1haWwlMjZ1dG0lNUZjYW1wYWlnbiUzREJvc3Rvbk5ld3MwNzI4MTQNCg0KQmx1ZSBOaWxlIDEwJSBvZmYgamV3ZWxyeS4NCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0OTIvaHR0cHMlM0ElMkYlMkZ3d3clMkV3b3JraW5nYWR2YW50YWdlJTJFY29tJTJGcHJvZHVjdHMlMkZwcm9kdWN0RGV0YWlscyUyRWNmbSUzRnByb2RJRCUzRDI4NzklMjZ1dG0lNUZzb3VyY2UlM0RlTmV3cyUyNnV0bSU1Rm1lZGl1bSUzRGVtYWlsJTI2dXRtJTVGY2FtcGFpZ24lM0RCb3N0b25OZXdzMDcyODE0DQotLS0tLS0tLS0tLS0tLS0tLS0tLS0NCg0KQmVjb21lIG91ciBmYW4gb24gRmFjZWJvb2sgZm9yIGV4Y2x1c2l2ZSBvZmZlcnMhIEZpbmQgZ3JlYXQgZGVhbHMgb24gTW92aWUgVGlja2V0cywgdXBkYXRlcyBvbiBldmVudHMsIG5ldyBwcm9kdWN0cyBhbmQgbW9yZSENCmh0dHA6Ly90LnNlbmQyNHdlYi5jb20vdHJhY2svY2xpY2svMTc6NzkzMDoyNjY0MDM3OkU3NDI5QjRELTY4NDQtNDBFRC04MTNFLTAxNzc3NDAzOUM3Qi8zMjI0OTMvaHR0cHMlM0ElMkYlMkZ3d3clMkVmYWNlYm9vayUyRWNvbSUyRmVtcGxveWVlc2F2aW5ncw0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0NCg0KV2FudCB0byBiZSBub3RpZmllZCBvZiBtZW1iZXIgc2F2aW5ncyBvbiBhcHBhcmVsIGFuZCBhY2Nlc3NvcmllcywgZWxlY3Ryb25pY3MsIHRyYXZlbCBhbmQgbW9yZT8gVXBkYXRlIHlvdXIgTmV3c2xldHRlciBTdWJzY3JpcHRpb25zIChodHRwczovL3d3dy53b3JraW5nYWR2YW50YWdlLmNvbS9zdWJzY3JpcHRpb25zLmNmbT8pIG9ubGluZSBub3cgYW5kIHJlY2VpdmUgZW1haWxzIHdpdGggc29tZSBvZiB0aGUgYmVzdCBkZWFscyBmcm9tIG91ciBTaG9wcGluZyBQYXJ0bmVycyAoaHR0cDovL3d3dy53b3JraW5nYWR2YW50YWdlLmNvbS9wcm9kdWN0cy9jYXRlZ29yeS5jZm0_Y2F0ZWdvcnlJRD0yKS4NCg0KLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0NCg0KQ2xpY2sgaGVyZSB0byB1bnN1YnNjcmliZTogaHR0cDovL3dvcmtpbmdhZHZhbnRhZ2Uuc2VuZDI0d2ViLmNvbS9pbmRleC5jZm0vZXZlbnQvdW5zdWJzY3JpYmUvdC8xNzo3OTMwOjI2NjQwMzc6RTc0MjlCNEQtNjg0NC00MEVELTgxM0UtMDE3Nzc0MDM5QzdCL2wvMzIyNDk0')
		}).success(function(resp) {
			alert(JSON.stringify(resp));
		})
	}
});

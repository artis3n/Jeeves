
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
	//newsIntroduction:true,
	webTitle: {
		calledTitle:0,
		calledWebTitle:". Available commands are: next article, read section name, read article, previous, more articles or previous five articles."
	},
	readingArticle:false,
	menuModal: {},
	isMenuOpen: false,
	emailList: [],
	emailCount: 0
};

var jeevesApp = angular.module("jeevesApp", ['ui.bootstrap']);

jeevesApp.run(function($http) {

	// Weather Info
	$http.jsonp('http://api.openweathermap.org/data/2.5/weather?q='+model.city+','+model.country+ '&units=imperial&callback=JSON_CALLBACK&APPID=32472867a57a09c1e174daf4fddb70d5').success(function(data) {
            model.weather.temp.current = data.main.temp;
            model.weather.clouds = data.clouds ? data.clouds.all : undefined;
            model.weather.description = data.weather[0].description;
    });

	// Loading News.
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
			$scope.jeeves.previousView.push(selected);
			$scope.jeeves.view = selected;
			if ($scope.jeeves.isMenuOpen) {
				$scope.closeMenu();
			}
			if (selected == 'email') {
				navigator.tts.speak("Let's grab your emails.");
				$scope.checkEmail();
			}
		}
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
		var city = "";
		if(typeof setting == "boolean"){
			if (setting){
				city = document.getElementById("weather_city_setting").value;
			}else{
				city = document.getElementById("weather_city").value;
			}
		}else{
			city=setting;
		}

		$http.jsonp('http://api.openweathermap.org/data/2.5/weather?q='+city+','+$scope.jeeves.country+ '&units=imperial&callback=JSON_CALLBACK').success(function(data) {
            if(data.cod == 200){
            	navigator.tts.speak("Changing the city to " + city + ".");
            	$scope.jeeves.city = city;
		        $scope.jeeves.weather.temp.current = data.main.temp;
		        $scope.jeeves.weather.clouds = data.clouds ? data.clouds.all : undefined;
		    }else{
		    	if(typeof setting == "boolean"){
		    		alert("I am sorry, but "+city + " is not available. Please enter a another city name");
		    	}else{
		    		navigator.tts.speak("Sorry, I didn't catch the city name. Can you repeat the city name again?", function() {
		    			$scope.reco($scope.weatherSpeechFallBack);
		    		})
		    	}
		    }
    	});
    	document.getElementById("weather_city").value = "";
    	document.getElementById("weather_city_setting").value = "";
	}

	$scope.changeSection=function(selected){
		document.getElementById($scope.jeeves.section).innerHTML="";
		$scope.jeeves.section = selected;
	}

	$scope.reco = function(callback){
		navigator.speechrecognizer.recognize(lowerSpeech, failCallback, 3, "How can I help?");

		function lowerSpeech(results) {
			for (var i = 0; i < results.length; i++) {
				results[i] = results[i].toLowerCase();
			}
			callback(results); // Call respective dialogue management function.
		}

 		function failCallback(error){
		    alert("Error: " + error);
		}
	}

	$scope.dialogMan = function(results){
		if ($scope.globalCommands(results)){
			return;
		} else if ($scope.weatherSpeech(results)) {
			return;
		} else if ($scope.newsSpeech(results)) {
			return;
		}
	}

	$scope.globalCommands = function(results) {
		for (var i = 0; i < results.length; i++){
			if (results[i] == "how is the weather" || results[i] == "how's the weather" || results[i] == "what's the weather" || results[i] == "what is the weather like today" || results[i] == "what's the weather like" || results[i] == "how's the weather today" || results[i] == "how is the weather today"){
				$scope.$apply(function() {
					$scope.changeView("weather");
				})
				navigator.tts.speak("The current temperature in " + $scope.jeeves.city + " is " + $scope.jeeves.weather.temp.current + " degrees fahrenheit. " + $scope.jeeves.weather.description + ".", function() {
					$scope.$apply(function() {
						$scope.changeView('back');
					})
					navigator.tts.speak("What now?", function() {
						$scope.reco($dialogMan);
					})
				})
				return true;
			} else if (results[i].match(/go to/) || results[i].match(/goto/) || results[i].match(/open/)) {
				return $scope.goToSpeech(results);
			}else if (results[i].match(/read/)) {
				return $scope.globalReadSpeech(results);
			}else if (results[i] == "help") {
				return $scope.getHelp(results);
			}
		}
		return false;
	}

	$scope.speechFailed = function(results) {
		navigator.tts.speak("")
	}

	$scope.regXloop = function(results, match) {
		var regX = new RegExp(match);
		for (var i = 0; i < results.length; i++) {
			if (regX.test(results[i])) {
				return true;
			}
		}
		return false;
	}

	$scope.goToSpeech = function(results) {
		if ($scope.regXloop(results, 'news')) {
			if ($scope.jeeves.view != 'news') {
				navigator.tts.speak("On it.", function() {
					$scope.$apply(function() {
						// if($scope.jeeves.newsIntroduction==true){
						// 	navigator.tts.speak("Going to the news page. News commands are: read, read section name, read article, next article, previous, more articles or previous five articles. ", function(){
						// 		$scope.$apply(function(){
						// 			$scope.jeeves.newsIntroduction=false;
						// 			$scope.changeView('news');
						// 		});
						// 	});
						// }else{
						// 	$scope.changeView('news');
						// }
						$scope.changeView('news');
					});
					navigator.tts.speak("What now?", function() {
						$scope.reco($scope.dialogMan);
					})
				})
			} else {
				navigator.tts.speak("You're already on the news page. Would you like to listen to world or business news?")
			}
			return true;
		} else if ($scope.regXloop(results, 'email')) {
			if ($scope.jeeves.view != 'email') {
				navigator.tts.speak("On it.", function() {
					$scope.$apply(function() {
						$scope.changeView('email');
					});
					navigator.tts.speak("What now?", function() {
						$scope.reco($scope.dialogMan);
					})
				})
			} else {
				navigator.tts.speak("You're already on the email page. Would you like to hear your inbox messages?");
			}
			
			return true;
		} else if ($scope.regXloop(results, 'weather')) {
			if ($scope.jeeves.view != 'weather') {
				navigator.tts.speak("On it.", function() {
					$scope.$apply(function() {
						$scope.changeView('weather');
					});
					navigator.tts.speak("What now?", function() {
						$scope.reco($scope.dialogMan);
					})
				})
			} else {
				navigator.tts.speak("You're already on the weather page. You can ask for the current weather.");
			}
			return true;
		} else if ($scope.regXloop(results, 'menu')) {
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
		} else if ($scope.regXloop(results, 'settings')) {
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
		} else if ($scope.regXloop(results, 'contact')) {
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
		} else if ($scope.regXloop(results, 'about')) {
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
		} else if ($scope.regXloop(results, 'help')) {
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
		} else {
			$scope.goToFallback(results);
		}
	}

	$scope.goToFallBack = function(results) {
		navigator.tts.speak("Sorry, I didn't catch all of that. Where would you like to go?", function() {
			$scope.reco(goToSpeech);
		})
	}

	// $scope.routeToMenu = function(results) {
	// 	if (!$scope.confirmSpeech(results, ['go to menu'])) {
	// 		$scope.dialogMan(results);
	// 	} // else, successfully routed.
	// }

	$scope.routeToNews = function(results) {
		if (!$scope.confirmSpeech(results, ['go to news'])) {
			navigator.tts.speak("Not to news? No problem.", function() {
				var no = false;
				for (var i = 0; i < results.length; i++) {
					if (results[i] == 'no') {
						no = true;
					}
				}
				if (!no) {
					$scope.dialogMan(results);
				}
			})
		}
	}

	$scope.globalReadSpeech = function(results) {
		if ($scope.regXloop(results, 'email') || $scope.jeeves.view == 'email') {
			if ($scope.jeeves.view != 'email') {
				navigator.tts.speak("Let's pull up your emails.", function () {
					$scope.$apply(function() {
						$scope.changeView('email');
					});
					return $scope.emailSpeech(results);
				});
				return true;
			} else {
				$scope.emailSpeech(results);
				return true;
			}
		} else {
			if ($scope.jeeves.view != 'news') {
					$scope.$apply(function(){
					$scope.changeView('news');
				});
			 }
			//Begin news speech recognition.
			$scope.newsSpeech(results);
			return true;
		}
	}

	$scope.getHelp = function(results) {
		if ($scope.jeeves.view == 'weather') {
			$scope.jeeves.weathermodalhelp = $modal.open({
				templateUrl: "weather-help.html",
				windowClass: 'help-window'
			})
			navigator.tts.speak("I welcome natural language! But if you need a hint, you can say 'How's the weather?' or 'Change city to - city name.'", function() {
				$scope.jeeves.weathermodalhelp.close();
				navigator.tts.speak("What now?", function() {
					$scope.reco($scope.dialogMan);
				})
			});
			return true;
		}else if ($scope.jeeves.view == 'email') {
			$scope.jeeves.emailmodalhelp = $modal.open({
				templateUrl: "email-help.html",
				windowClass: "help-window"
			})
			navigator.tts.speak("I welcome natural language! But if you need a hint, you can say 'Read me my emails!' or, if you want to update the list of emails, you can say 'Refresh.'", function() {
				$scope.jeeves.emailmodalhelp.close();
				navigator.tts.speak("What now?", function() {
					$scope.reco($scope.dialogMan);
				})
			});
			return true;
		}else if ($scope.jeeves.view == 'news') {
			$scope.jeeves.newsmodalhelp = $modal.open({
				templateUrl: "news-help.html",
				windowClass: "help-window"
			})
			navigator.tts.speak("I welcome natural language! But if you need a hint, you can say 'Read me, article name,' 'Reeed me, section,' 'More articles,' or 'Previous articles.'", function() {
				$scope.jeeves.newsmodalhelp.close();
				navigator.tts.speak("What now?", function() {
					$scope.reco($scope.dialogMan);
				})
			});
			return true;
			//You can't call speech from inside the menu.
		// }else if ($scope.jeeves.isMenuOpen) {
		// 	// Don't open a new modal, menu is already a modal.
		// 	navigator.tts.speak("Let me know where you'd like to go! Can I check the latest news for you?", function() {
		// 		$scope.reco(routeToNews);
		// 	});
		// 	return true;
		}else if ($scope.jeeves.view == 'about') {
			navigator.tts.speak("Nothing to do on this page! Let me open up the menu for you.", function() {
				$scope.$apply(function() {
					$scope.changeView('menu');
				})
			});
			return true;
		// }else if ($scope.jeeves.view == 'favorites') {
			//Favorites is currently disabled.
		}else if ($scope.jeeves.view == 'settings') {
			navigator.tts.speak("you can say 'Change city' to change the city on the weather page, or say 'Log out' to be signed out of your gmail account.", function() {
				navigator.tts.speak("What now?", function() {
					$scope.reco($scope.dialogMan);
				})
			}); 
			return true;
		}else if ($scope.jeeves.view == 'contact') {
			navigator.tts.speak("you can say read");
			return true;
		}
	}
	
	$scope.confirmSpeech = function(results, command) {
		if ($scope.regXloop(results, 'yes')) {
			$scope.dialogMan(command); // Command must be an array.
			return true;
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
			}
			if(city !== "INVALID"){
				var cityChange = $scope.capitaliseFirstLetter(city)
				$scope.changeWeather(cityChange);
				return true;
			} 
			// return stop;
			return false;
		}
	}

	$scope.weatherSpeechFallBack = function(cityName){
		var city = $scope.capitaliseFirstLetter(cityName[0]);
		$scope.changeWeather(city);
	}
	//Trying more accurate pause, pause when speech is called, and change section of news

	//Commands are: read, read <section>, read article, continue, previous, more articles
	$scope.newsSpeech = function(results){
		for (var i = 0; results.length; i++) {
			// if($scope.jeeves.newsIntroduction==true){
			// 	navigator.tts.speak("Going to the news page. News commands are: read, read section name, read article, next article, previous, more articles or previous five articles.");
			// 	$scope.jeeves.newsIntroduction=false;
			// }
			
			if ($scope.regXloopForNews(results[i], 'read')){
				return $scope.readDiagNews(results);
				
			}else if ($scope.regXloopForNews(results[i], 'next article') || $scope.regXloopForNews(results[i], 'continue')) {
				return $scope.contDiagNews();
			}
			else if($scope.regXloopForNews(results[i], 'previous five')){
				$scope.$apply(function(){
					$scope.differentFive($scope.jeeves.newsPosition.section,false);
				});
				return true;
			}	
			else if ($scope.regXloopForNews(results[i], 'previous')){
				return $scope.previousDiagNews();
			}
			else if($scope.regXloopForNews(results[i], 'more articles')){
				$scope.$apply(function(){
					$scope.differentFive($scope.jeeves.newsPosition.section,true);
				});
				return true;
			}
			else if($scope.regXloopForNews(results[i], 'news commands')){
				navigator.tts.speak("Available commands are: next article, read section name, read article, previous, more articles or previous five articles.", function(){
					$scope.reco(newsSpeech);
				})
			}
			$scope.$apply();
		}
	}

	//Either reads the web title for the article on that section or reads the whole article if said read article
	$scope.readDiagNews = function(results1){
		for(var i=0; i<results1.length;i++){
			if(results1[i].match(/article/)){
				$scope.readArticle();
				return true;
			}
			else{
				if (results1[i].length>4){
					var section1=results1[i].substring(5);
					if (section1=='news'||section1=='world'||section1=='sports'||section1=='tech'||section1=='science') {
						$scope.jeeves.newsPosition.section=section1;
						$scope.jeeves.newsPosition.articleIndex = 0;
					}
					else{
						navigator.tts.speak("You requested to read a section but the section name was unclear, please respond with the name of the section after saying read or say any other command.", function(){
							$scope.reco($scope.routeToReadSection);
						})
						return true;
					}
				}
				else{
					$scope.jeeves.newsPosition.section=section;
				}
				$scope.sayWebTitle($scope.jeeves.newsPosition.section);
				$scope.$apply();
				return true;
			}
		}
	}


	$scope.routeToReadSection = function(results){
		if($scope.regXloop(results, 'news')||$scope.regXloop(results, 'world')||$scope.regXloop(results, 'sports')||$scope.regXloop(results, 'tech')||$scope.regXloop(results, 'science')){
			$scope.readDiagNews(results);
		}
		else{
			$scope.dialogMan(results);
		}
	}

	$scope.contDiagNews = function(){
		navigator.tts.speak("Going to next article", function(){
		$scope.$apply(function(){
			$scope.jeeves.newsPosition.articleIndex++;
			$scope.sayWebTitle($scope.jeeves.newsPosition.section);
			});
		});
		return true;
	}

	$scope.previousDiagNews = function(){
		if($scope.jeeves.newsPosition.articleIndex>=1){
			navigator.tts.speak("Going to previous article", function(){
				$scope.$apply(function(){
					$scope.jeeves.newsPosition.articleIndex=$scope.jeeves.newsPosition.articleIndex-1;
					$scope.sayWebTitle($scope.jeeves.newsPosition.section);
				});
			});
		}
		else{
				navigator.tts.speak("There are no previous articles. Would you like to hear the next article? Say yes or other command.", function(){
					$scope.reco($scope.routeToPrevious);
				});
		}
		return true;
	}

	$scope.routeToPrevious = function(results){
		if($scope.regXloop(results, 'yes')){
			var x = ['continue'];
			$scope.newsSpeech(x);
		}else{
			$scope.dialogMan(results);
		}
	}

	  $scope.redirect = function() {
	  	if ($scope.jeeves.readingArticle){
			$scope.jeeves.newsPosition.pause=true;
	  		$scope.reco(function(results){
	  			if ($scope.regXloop(results, 'pause')){
	  			}else if($scope.regXloop(results, 'play')){
	  				$scope.pauseAndPlay();	
	  			}else {
	  				$scope.dialogMan(results);
	  			}
	  		})
		 }
	  	else {
	  		$scope.reco($scope.dialogMan);
	  	}
	  }

	$scope.adaptivePrompt = function(){
		$scope.jeeves.webTitle.calledTitle++;
		if($scope.jeeves.webTitle.calledTitle==2){
			$scope.jeeves.webTitle.calledWebTitle=". By the way, if you ever want to hear the available commands again, just press speech and say: news commands.";
		}
		else if($scope.jeeves.webTitle.calledTitle>2){
			$scope.jeeves.webTitle.calledWebTitle=".";
		}
	}

	$scope.regXloopForNews = function(result, match) {
		var regX = new RegExp(match);
			if (regX.test(result)) {
				return true;
			}
		return false;
	}

	$scope.sayWebTitle = function(section){
		$scope.adaptivePrompt();
		if ($scope.jeeves.newsPosition.section == "news"){
			navigator.tts.speak($scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].webTitle+ $scope.jeeves.webTitle.calledWebTitle, function() {
							$scope.reco($scope.dialogMan);
				});
		}else if ($scope.jeeves.newsPosition.section == "world"){
			navigator.tts.speak($scope.jeeves.newsArticles.world[$scope.jeeves.newsPosition.articleIndex].webTitle+ $scope.jeeves.webTitle.calledWebTitle, function() {
							$scope.reco($scope.dialogMan);
				});
		}else if ($scope.jeeves.newsPosition.section == "sports"){
			navigator.tts.speak($scope.jeeves.newsArticles.sports[$scope.jeeves.newsPosition.articleIndex].webTitle+ $scope.jeeves.webTitle.calledWebTitle, function() {
							$scope.reco($scope.dialogMan);
				});
		}else if ($scope.jeeves.newsPosition.section == "business"){
			navigator.tts.speak($scope.jeeves.newsArticles.business[$scope.jeeves.newsPosition.articleIndex].webTitle+ $scope.jeeves.webTitle.calledWebTitle, function() {
							$scope.reco($scope.dialogMan);
				});
		}else if ($scope.jeeves.newsPosition.section == "technology"){
			navigator.tts.speak($scope.jeeves.newsArticles.tech[$scope.jeeves.newsPosition.articleIndex].webTitle+ $scope.jeeves.webTitle.calledWebTitle, function() {
							$scope.reco($scope.dialogMan);
				});
		}else if ($scope.jeeves.newsPosition.section == "science"){
			navigator.tts.speak($scope.jeeves.newsArticles.science[$scope.jeeves.newsPosition.articleIndex].webTitle+ $scope.jeeves.webTitle.calledWebTitle, function() {
							$scope.reco(scope.dialogMan);
				});
		}
		$scope.$apply();
	}

	$scope.readArticle = function(){
		$scope.jeeves.newsPosition.pause=false;
		$scope.jeeves.newsPosition.pausePosition=0;
		$scope.jeeves.newsPosition.contArticleContent="";

		if ($scope.jeeves.newsPosition.section == "news"){			
			var gotResult = $scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			//alert("coming");
		//	alert(finalResult.match(/\S+/g));
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
						$scope.$apply(function() {
							$scope.jeeves.newsPosition.contArticleContent=finalResult;
							$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
							//$scope.recursiveArticleChunk(finalResult.match(/\S+/g), $scope.jeeves.newsPosition.pausePosition);
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
	 	$scope.jeeves.readingArticle=true;
	 	if($scope.jeeves.newsPosition.pause==true){
	 		$scope.jeeves.newsPosition.pausePosition=position;
	 	}
	 	else if(position>=chunkArray.length){
	 		navigator.tts.speak("Available commands are: next article, read section name, read article, previous, more articles or previous five articles.", function(){
	 			$scope.$apply(function(){
	 				 $scope.jeeves.readingArticle=false;
	 				$scope.reco($scope.dialogMan);
	 			});
	 		});
	 	}
	 	else{
	 		navigator.tts.speak(output, function(){
	 			$scope.recursiveArticleChunk(chunkArray, (position+1));
	 		});
	 	}
	 }


	// $scope.recursiveArticleChunk = function(chunkArray, position, smallerIndex){
	// 	output = chunkArray[position];
	// 	// $scope.readingArticle=true;
	// 	if($scope.jeeves.newsPosition.pause==true){
	// 		$scope.jeeves.newsPosition.pausePosition=position;
	// 	}
	// 	else if(position>=chunkArray.length){
	// 		navigator.tts.speak("Available commands are: next article, read section name, read article, previous, more articles or previous five articles.", function(){
	// 			$scope.$apply(function(){
	// 				// $scope.readingArticle=false;
	// 				$scope.reco($scope.dialogMan);
	// 			});
	// 		});
	// 	}
	// 	else if(smallerIndex>=(output.length-1)){
	// 		navigator.tts.speak(output, function(){
	// 			$scope.recursiveArticleChunk(chunkArray, (position+1), 0);
	// 		});
	// 	}
	// 	else{
	// 		setTimeout(function(){$scope.recursiveArticleChunk(chunkArray, position, (smallerIndex+1));}, 150);	
	// 	}
	// }

	$scope.pauseAndPlay = function(){
		if($scope.jeeves.newsPosition.pause==false){
			navigator.tts.stop();
			$scope.jeeves.newsPosition.pause=true;
		}
		else{
			$scope.jeeves.newsPosition.pause=false;
			var cont=$scope.jeeves.newsPosition.contArticleContent;
			$scope.recursiveArticleChunk(cont.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
			return true;
		}
	}

	$scope.emailSpeech = function(results) {
		var email = $scope.jeeves.emailList[$scope.jeeves.emailCount];
		var content = email.content;
		navigator.tts.speak(email.subject + " from " + email.from + ". " + content + ".", function() {
			$scope.jeeves.emailCount++;
			if ($scope.jeeves.emailCount < $scope.jeeves.emailList.length) {
				navigator.tts.speak("Would you like me to read the next email?", function() {
					$scope.reco($scope.confirmReadEmail);
				})
			} else {
				navigator.tts.speak("That's all the emails. What now?", function() {
					$scope.reco($scope.dialogMan);
				})
			}
			
		});
	}

	$scope.confirmReadEmail = function(results) {
		if (!$scope.confirmSpeech(results, ['read'])) {
			navigator.tts.speak("Ok. So what next?", function() {
				$scope.reco($dialogMan);
			})
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
			$scope.getEmail();
			navigator.tts.speak("You are now logged in to Gmail!");
		})
	}

	$scope.getEmail = function() {
		$scope.jeeves.emailList.length = 0;
		$scope.jeeves.emailCount = 0;
		document.getElementById("authorize-button").style.visibility = "hidden";
		OAuth.initialize("hmTB5riczHFLIGKSA73h1_Tw9bU");
		var loggedIn = OAuth.create("google_mail");
		loggedIn.me().done(function(data) {
			loggedIn.get("https://www.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX")
			.done(function(list) {
				$scope.jeeves.emailListCount = 0;
				document.getElementById('email-announcement').innerHTML = '<i>Hello! I am reading your <b>inbox</b> emails.</i><br><br>';
				var prologue = document.getElementById("message-list");
				if (list.messages == null) {
			        prologue.innerHTML = "<b>Your inbox is empty.</b>";
			      } else {
			        prologue.innerHTML = "------<br><br>";
			        angular.forEach(list.messages, function(message) {
			        	var emailObject = {};
			        	loggedIn.get("https://www.googleapis.com/gmail/v1/users/me/messages/" + message.id)
			        	.done(function(email) {
		        			var header = "";
		            		var sender = "";
		            		angular.forEach(email.payload.headers, function(item) {
		            			if (item.name == 'Subject') {
		            				header = item.value;
		              			}
		              			if (item.name == "From") {
					                sender = item.value;
					            }
		            		})
			              	emailObject.subject = header;
			              	emailObject.from = sender;
			              	if (email.payload.parts == null) {
			              		emailObject.content = unescape(atob(email.payload.body.data));
			              	} else {
			              		emailObject.content = unescape(atob(email.payload.parts[0].body.data));
			              	}
			              	$scope.$apply(function() {
			              		$scope.jeeves.emailList.push(emailObject);
			              	});
			              	document.getElementById("authorize-button").style.visibility = "visible";
			        	})
			        })
			    }
			})
		});
	}

	$scope.checkEmail = function() {
		OAuth.initialize("hmTB5riczHFLIGKSA73h1_Tw9bU");
		if (!OAuth.create('google_mail')) {
			$scope.oauthlogin();
		} else {
			$scope.getEmail();
		}
	}
});

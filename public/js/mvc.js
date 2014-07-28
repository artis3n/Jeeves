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
		contArticleContent:''
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
				if ($scope.globalCommands(result)) {
					break;
				} else if($scope.jeeves.view == 'weather'){
					$scope.weatherSpeech(result);
					break;
	    		} else if($scope.jeeves.view == 'news'){
	    			$scope.newsSpeech(result);
	    			break;
	    		
	    		} else if($scope.jeeves.view == 'email'){
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
				$scope.changeView("weather");
			})
			navigator.tts.speak("The current temperature in " + $scope.jeeves.city + " is " + $scope.jeeves.weather.temp.current + " degrees fahrenheit. " + $scope.jeeves.weather.description + ".", function() {
				$scope.$apply(function() {
					$scope.changeView('back');
				})
			})
			return true;
		} else if (result.match(/go to/) || result.match(/open/)) {
			if (result.match(/news/)) {
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
			} else if (result.match(/email/)) {
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
			} else if (result.match(/weather/)) {
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
			} else if (result.match(/menu/)) {
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
			} else if (result.match(/settings/)) {
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
			} else if (result.match(/contact/)) {
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
			} else if (result.match(/about/)) {
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
			} else if (result.match(/help/)) {
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
		}else if (result.match(/read/)) {
			if (result.match(/email/)) {
				navigator.tts.speak("No problem! Let's pull up your emails.", function () {
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
		}else if (result == "help") {
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

	//Commands are: read, read <section>, read article, continue, previous, more articles
	$scope.newsSpeech = function(result){
		if ($scope.jeeves.view != 'news') {
			$scope.changeView('news');
			$scope.$apply();
		}
		if (result.match(/read/)){
			 if(result.match(/article/)){
				$scope.readArticle();
				$scope.jeeves.newsPosition.pause=false;
				$scope.jeeves.newsPosition.pausePosition=0;
				$scope.jeeves.newsPosition.contArticleContent="";
			}
			else{
				if (result.length>4){
					var section1=result.substring(5);
					$scope.jeeves.newsPosition.section=section1;
					$scope.jeeves.newsPosition.articleIndex = 0;
					//$scope.changeSection(section1);
				}
				else{
					$scope.jeeves.newsPosition.section=section;
					//$scope.changeSection('news');
				}
				$scope.sayWebTitle($scope.jeeves.newsPosition.section);
				$scope.$apply();
			}
		}else if (result.match(/next article/) || result.match(/continue/)) {
			navigator.tts.speak("Going to next article");
			$scope.jeeves.newsPosition.articleIndex++;
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
		else if(result.match(/more articles/)){
			//We have to remove if were changing the style of news, maybe?
			$scope.updateShowAmount();
		}	
		$scope.$apply();
	}

	$scope.sayWebTitle = function(section){
		if ($scope.jeeves.newsPosition.section == "news"){
			navigator.tts.speak($scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles");
				setTimeout(function(){
			 	$scope.reco();
			 }, 14000);
		}else if ($scope.jeeves.newsPosition.section == "world"){
			navigator.tts.speak($scope.jeeves.newsArticles.world[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles");
			setTimeout(function(){
				$scope.reco();
			}, 14000);
		}else if ($scope.jeeves.newsPosition.section == "sports"){
			navigator.tts.speak($scope.jeeves.newsArticles.sports[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles");
			setTimeout(function(){
				$scope.reco();
			}, 14000);
		}else if ($scope.jeeves.newsPosition.section == "business"){
			navigator.tts.speak($scope.jeeves.newsArticles.business[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles");
			setTimeout(function(){
				$scope.reco();
			}, 14000);
		}else if ($scope.jeeves.newsPosition.section == "technology"){
			navigator.tts.speak($scope.jeeves.newsArticles.tech[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles");
			setTimeout(function(){
				$scope.reco();
			}, 14000);
		}else if ($scope.jeeves.newsPosition.section == "science"){
			navigator.tts.speak($scope.jeeves.newsArticles.science[$scope.jeeves.newsPosition.articleIndex].webTitle);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles");
			setTimeout(function(){
				$scope.reco();
			}, 14000);
		}
		$scope.$apply();
	}

	$scope.readArticle = function(){
		if ($scope.jeeves.newsPosition.section == "news"){
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].webTitle);
			var gotResult = $scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			$scope.jeeves.newsPosition.contArticleContent=finalResult;
			$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}else if ($scope.jeeves.newsPosition.section == "world"){
			navigator.tts.speak($scope.jeeves.newsArticles.world[$scope.jeeves.newsPosition.articleIndex].webTitle);
			var gotResult = $scope.jeeves.newsArticles.world[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			$scope.jeeves.newsPosition.contArticleContent=finalResult;
			$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}else if ($scope.jeeves.newsPosition.section == "sports"){
			navigator.tts.speak($scope.jeeves.newsArticles.sports[$scope.jeeves.newsPosition.articleIndex].webTitle);
			var gotResult = $scope.jeeves.newsArticles.sports[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			$scope.jeeves.newsPosition.contArticleContent=finalResult;
			$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}else if ($scope.jeeves.newsPosition.section == "business"){
			navigator.tts.speak($scope.jeeves.newsArticles.business[$scope.jeeves.newsPosition.articleIndex].webTitle);
			var gotResult = $scope.jeeves.newsArticles.business[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			$scope.jeeves.newsPosition.contArticleContent=finalResult;
			$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}else if ($scope.jeeves.newsPosition.section == "tech"){
			navigator.tts.speak($scope.jeeves.newsArticles.tech[$scope.jeeves.newsPosition.articleIndex].webTitle);
			var gotResult = $scope.jeeves.newsArticles.tech[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			$scope.jeeves.newsPosition.contArticleContent=finalResult;
			$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}else if ($scope.jeeves.newsPosition.section == "science"){
			navigator.tts.speak($scope.jeeves.newsArticles.science[$scope.jeeves.newsPosition.articleIndex].webTitle);
			var gotResult = $scope.jeeves.newsArticles.science[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			$scope.jeeves.newsPosition.contArticleContent=finalResult;
			$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
			navigator.tts.speak("If you would like to go to the next article, please say continue. Otherwise, say read me for another section, read article, previous, more articles");
			setTimeout(function(){
				$scope.reco();
				$scope.jeeves.newsPosition.articleIndex++;
			}, 200000);
		}
		$scope.$apply();
	}

	$scope.recursiveArticleChunk = function(chunkArray, position){
		output = chunkArray[position];
		if($scope.jeeves.newsPosition.pause==true){
			$scope.jeeves.newsPosition.pausePosition=position;
		}
		else if(position>=chunkArray.length){
			//end
		}
		else{
			navigator.tts.speak(output);
			setTimeout(function(){    //This set time out is important for the pause and play but it is ideal to have it as callback to tts
				$scope.recursiveArticleChunk(chunkArray, (position+1));
			}, (output.length*250));
	
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
			$scope.recursiveArticleChunk(cont.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
		}
	}


	$scope.emailSpeech = function(result) {
		if (result == "read my emails" || "read" || "start reading") {
			var content = document.getElementById('email-announcement').innerText;
			navigator.tts.speak(content);
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

	$scope.cutNews = function(){
		$scope.jeeves.displayNews.news = $scope.jeeves.newsArticles.news.slice($scope.jeeves.displayNews.newsCount, $scope.jeeves.displayNews.newsCount+5);
		$scope.jeeves.displayNews.world = $scope.jeeves.newsArticles.world.slice($scope.jeeves.displayNews.worldCount, $scope.jeeves.displayNews.worldCount+5);
		$scope.jeeves.displayNews.sports = $scope.jeeves.newsArticles.sports.slice($scope.jeeves.displayNews.sportsCount, $scope.jeeves.displayNews.sportsCount+5);
		$scope.jeeves.displayNews.business = $scope.jeeves.newsArticles.business.slice($scope.jeeves.displayNews.businessCount, $scope.jeeves.displayNews.businessCount+5);
		$scope.jeeves.displayNews.tech = $scope.jeeves.newsArticles.tech.slice($scope.jeeves.displayNews.techCount, $scope.jeeves.displayNews.techCount+5);
		$scope.jeeves.displayNews.science = $scope.jeeves.newsArticles.science.slice($scope.jeeves.displayNews.scienceCount, $scope.jeeves.displayNews.scienceCount+5);
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
				              	if (stuff.payload.parts == null) {
				              		try {
				              			contents.innerHTML = base64.decode(stuff.payload.body.data) + "<br><br>";
				              		} catch (err) {
				              			contents.innerHTML = "Error decoding, but got to this step.<br><br>"
				              		}
				              	} else {
				              		try {
				              			contents.innerHTML = base64.decode(stuff.payload.parts[0].body.data) + "<br><br>";
				              		} catch (err) {
				              			contents.innerHTML = "Error decoding, but got to this step.<br><br>"
				              		}
				              	}
				              	content.appendChild(contents);
				        	})
				        })
				    }
				})
			});
		})
	}
});

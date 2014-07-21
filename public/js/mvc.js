//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "weather",
	newsViews:"news",
	showNumber: 5,
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
		if(setting !== null){
			if (setting){
				$scope.jeeves.city = document.getElementById("weather_city_setting").value;
			}else{
				$scope.jeeves.city = document.getElementById("weather_city").value;
			}
		}

		$http.jsonp('http://api.openweathermap.org/data/2.5/weather?q='+$scope.jeeves.city+','+$scope.jeeves.country+ '&units=imperial&callback=JSON_CALLBACK').success(function(data) {
            model.weather.temp.current = data.main.temp;
            model.weather.temp.min = data.main.temp_min;
            model.weather.temp.max = data.main.temp_max;
            model.weather.clouds = data.clouds ? data.clouds.all : undefined;
            // For Testing
            // console.log("Weather: " + JSON.stringify(model.weather))
            // console.log("Data: " + data.main.temp)
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

	$scope.reco= function(){
		navigator.speechrecognizer.recognize(successCallback, failCallback, 3, "Jeeves Personal Assistant");

		function successCallback(results){
			alert(results);

			//Don't forget to break the for loop if there is a match!!!!!!!
			for (var i = 0; i < results.length; i++) {
				var result = results[i].toLowerCase();
				alert(result);

				if($scope.jeeves.view == 'weather'){
					// A Stop variable to break
					var stop = $scope.speechWeather(result);
					if(stop){
						break;
					}
	    		}else if($scope.jeeves.view == 'news'){
	    			if (result == 'go to help'){
	    				$scope.changeView('help');
	    				$scope.$apply();
		    		}     				
		    		else if(result.substring(0, 7) =='read me') { 
    					alert(result.substring(8, result.length));
    					$scope.changeSection(result.substring(8, result.length));
    					x=$scope.jeeves.section;
						$scope.jeeves.showNumber = 5;
						$http.get('http://beta.content.guardianapis.com/search?q=US&section='+x+'&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
							$scope.jeeves.articles=data.response.results; 
							for (var i = 0; i < $scope.jeeves.showNumber; i++) {
								var entry = $scope.jeeves.articles[i];
								alert(entry.webTitle);
								//replace alert by read entry.webTitle
								};
							}) 
    						$scope.$apply();
					}

    				else if(result =='read me next'){
    				alert('You said read me next.');
    				//$scope.changeSection(result.substring(12, result.length)); 
    				$scope.$apply();	
    				} 
    				else if(result.substring(0, 15) =='read me article'){
    				alert(': You said read me article '+result.substring(16, result.length)+'.');
    				//$scope.changeSection(result.substring(12, result.length)); 
    				$scope.$apply();	
    				} 
    				else if(result =='more articles'){
    				alert(': You said more articles.');
    				//$scope.changeSection(result.substring(12, result.length)); 
    				$scope.$apply();	
    				} 
    				else if(result =='read me last article'){
    				alert(': You said read me last article.');
    				//$scope.changeSection(result.substring(12, result.length)); 
    				$scope.$apply();	
    				} 
    				else if(result =='read me previous article'){
    				alert(': You said read me previous articles.');
    				//$scope.changeSection(result.substring(12, result.length)); 
    				$scope.$apply();	
    				} 
	    		}else if($scope.jeeves.view == 'email'){
	    			if (result.match(/authorize/) != null) {
	    				navigator.notification.alert("Now authorizing...", 'Jeeves', 'Continue');
	    			} else if (result == "read my emails" || "read" || "start reading") {
	    				var content = document.getElementById('email-announcement').innerText;
	    				navigator.tts.speakZ(content);
	    			}
	    		}else if($scope.jeeves.view == 'menu'){
	    			
	    		}else if($scope.jeeves.view == 'about'){
	    			if(result == 'read'){
	    			  //tts read abt page
	    			}
	    			//tell me about jeeves === global
	    		}else if($scope.jeeves.view == 'setting'){
					$scope.speechWeather(result);
	    		}else if($scope.jeeves.view == 'contact' ){
					   if(result == 'read' || result.match(/read/) != null){
					   	 //read tts of contact
					   }
	    		}else if($scope.jeeves.view == 'favorite' ){
	    			if(result ==  'read' || result.match(/read/) != null){
					   	 //read tts of favs
					   }
	    		}else if($scope.jeeves.view == 'help' ){
	    			if(result == 'read' || result.match(/read/) != null){
					   	 //read tts of helpscreen
					}
					if (result.lastIndexOf("help")==0){
						 if (result.match(/cmd/)){
						 	//do cmd help
						 }
						 else if (result.match(/change city to/)){
						 	//do cmd help
						 }  
						 else if (result.match(/read me/)){
						 	//do cmd help
						 }  
						 else if (result.match(/more articles/)){
						 	//do cmd help
						 }  
						 else if (result.match(/how many emails do i have/)){
						 	//do cmd help
						 }  
						 else if (result.match(/about/)){
						 	//do cmd help
						 }   								
						 else if (result.match(/settings/)){
						 	//do cmd help
						 }  
						 else if (result.match(/menu/)){
						 	//do cmd help
						 }  
						 else if (result.match(/email/)){
						 	//do cmd help
						 }  
						 else if (result.match(/news/)){
						 	//do cmd help
						 }  
						 else if (result.match(/weather/)){
						 	//do cmd help
						 }
						 else if (result.match(/contact/)){
						 	//do cmd help
						 }   
						 else if (result.match(/what can i say/)){
						 	//do cmd help
						 }  
					} 
				}
		   		$scope.$apply();
			}
 		}

 		// There is a bug in this section.

 		// function globalCmds(gResult){
 		// 	if (gResult.match(/How’s the weather/)){
 		// 		//How’s the weather?
 		// 	}else if (gResult.match(/Read me/)) { 
 				//news
 		// 		//nest ifs for sections
 		// 		//Read me <section>
 		// 		if (){

 		// 		}else if () {

 		// 		}else if () {

 		// 		}
 		// 	}else if (gResult == "read my emails" || "read" || "start reading") {//Read me my emails
 				
 		// 	}else if (gResult=="go to") {//menu
 		// 		//Go to <menu section>
 		// 		if (gResult.lastIndexOf())
 		// 	}else if () {//about
 		// 		//Tell me about Jeeves
 				
 		// 	}else if () {//help
 		// 		//What can I do/say on <section>?
 				
 		// 	}else if (gResult == "go to help") {// go to help

 		// 	}
 		// }

		function failCallback(error){
		    alert("Error: " + error);
		}
	}

	$scope.speechWeather = function(result) {
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
		}else if (result.lastIndexOf("how's the weather")==0){
			var str = ""
			alert("How's the weather?");
			stop = true;
			//TTS command to tell the weather
		}else {
			alert(result + " is an invalid command.");
		}

		if(city !== "INVALID"){
			$scope.jeeves.city = $scope.capitaliseFirstLetter(city);
			$scope.changeWeather(null);
			stop = true;
		}

		return stop;
	}

	$scope.startTTS = function() {
		navigator.tts.startup(success, fail);

		function success () {
			navigator.tts.speak("Hello! I am ready to begin reading.");
		}

		function fail () {
			navigator.notification.alert("Something went wrong with the TTS", 'Jeeves', 'Confirm');
		}
	}

	$scope.getListArticle=function(){
		var x = $scope.jeeves.section;
		$scope.jeeves.newsViews=x;

		$http.get('http://beta.content.guardianapis.com/search?q=US&section='+x+'&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
			$scope.jeeves.articles=data.response.results;
			var container = document.getElementById(x);
			container.innerHTML="";
			container.setAttribute('class', 'btn-group btn-block');

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
		});
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
});

	document.addEventListener("deviceready", startTTS, false);
	document.addEventListener("backbutton", goBack, false);
	document.addEventListener("menubutton", openMenu, false);
	document.addEventListener("shutdown", endTTS, false);
	document.addEventListener('resume', closeSplash, false);

	function startTTS() {
		navigator.tts.startup(success, fail);

		function success () {
			var $element = $('#body-controller-element');
			var scope = angular.element($element).scope();
			var firstTime = window.localStorage.getItem('firstTimeCookie');
			if (firstTime == null) {
				setTimeout(function() {
					document.getElementById('splash-loading').innerHTML = "<font color='white'>Welcome!</font>";
				}, 3500)
				window.localStorage.setItem('firstTimeCookie', 'last checked in: ' + Date.now());

				navigator.tts.speak("Hello! Welcome to Jeeves. Please give me the next few seconds of your time. You can speak with me using natural, regular conversation. I will figure out what you mean, or ask you for further clarification! On any page, you can say help to get some example phrases. I am also designed to be hands and eyes-free. So, after a speech command, I will usually begin listening for the next command, so you can keep your hands and eyes on whatever else you are doing. I hope you enjoy getting to know me!", function() {
					scope.$apply(function() {
						scope.hideSplashScreen();
					});
				})
			}
			else {
				window.localStorage.setItem('firstTimeCookie', 'last checked in: ' + Date.now());
				navigator.tts.speak("Hello! I am ready to begin listening.");
				setTimeout(function() {
					scope.$apply(function() {
						scope.hideSplashScreen();
					})
				}, 3000)
			}
		}

		function fail () {
			navigator.notification.alert("Something went wrong with the TTS engine. Please restart the application.", function(){},'Speech Error', 'Confirm');
		}
	}

	function goBack() {
		try {
			var $element = $('#body-controller-element');
			var scope = angular.element($element).scope();
			scope.$apply(function() {
				scope.changeView('back');
			});
		} catch (err) {}
		
	}

	function openMenu() {
		navigator.tts.stop();
		try {
			var $element = $('#body-controller-element');
			var scope = angular.element($element).scope();
			scope.$apply(function() {
				scope.changeView('menu');	
			});
		} catch (err) {}
	}

	function endTTS() {
		navigator.tts.shutdown();
	}

	function closeSplash() {
		var $element = $('#body-controller-element');
		var scope = angular.element($element).scope();
		scope.$apply(function() {
			scope.hideSplashScreen();
		});

	}
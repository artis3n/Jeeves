	document.addEventListener("deviceready", startTTS, false);
	document.addEventListener("backbutton", goBack, false);
	document.addEventListener("menubutton", openMenu, false);
	document.addEventListener("shutdown", endTTS, false);

	function startTTS() {
		navigator.tts.startup(success, fail);

		function success () {
			setTimeout(function() {
				var $element = $('#body-controller-element');
				var scope = angular.element($element).scope();
				scope.$apply(function() {
					scope.hideSpalshScreen();
				});
			}, 2000);
			navigator.tts.speak("Hello! I am ready to begin listening.");
		}

		function fail () {
			navigator.notification.alert("Something went wrong with the TTS engine. Please restart the application.", function(){},'Jeeves', 'Confirm');
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
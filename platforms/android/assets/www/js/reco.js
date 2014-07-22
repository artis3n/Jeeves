var sp = {
	reco: function(){
		navigator.speechrecognizer.recognize(successCallback, failCallback, 5, "Cordova Speech Recognizer Plugin");

		function successCallback(results){
		    console.log("Results: " + results);
		}

		function failCallback(error){
		    console.log("Error: " + error);
		}
	}
}

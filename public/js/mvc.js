//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "weather",
	previousView: ["weather"],
	feeds: []
};

var jeevesApp = angular.module("jeevesApp", []);

jeevesApp.run(function($http) {
	$http.get("/model/feeds").success(function(data) {
		model.feeds = data;
	})
	// Waiting for the server to test the NYT API
	// $http.get("http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1?api-key=985d8028d34e7d34a098bfdd6b6b604c:5:67948289").success(function(data){
	// 	console.log(data);
	// })
})

jeevesApp.controller("jeevesCtrl", function($scope) {
	$scope.jeeves = model;

	$scope.changeView = function(selected) {
		if(selected === 'back'){
			$scope.jeeves.previousView.pop();
			var back = $scope.jeeves.previousView[$scope.jeeves.previousView.length - 1];
			console.log(back);
			$scope.jeeves.view = back;
		}else{
			$scope.jeeves.previousView.push(selected);
			console.log($scope.jeeves.previousView);
			$scope.jeeves.view = selected;
		}
	};
});
//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	feeds: [{src: "Test 1", rss: "HTTP:Test 1"},
	{src:"Test 2", rss: "HTTP:Test 2"}]
};

var jeevesApp = angular.module("jeevesApp", []);

jeevesApp.controller("jeevesCtrl", function($scope) {
	$scope.jeeves = model;

	$scope.showView = function(selected) {
		//TODO: Recreate in angular
	}
})
}
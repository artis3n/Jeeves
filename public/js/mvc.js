//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "welcome",
	feeds: []
};

var jeevesApp = angular.module("jeevesApp", []);

jeevesApp.run(function($http) {
	$http.get("/model/feeds").success(function(data) {
		model.feeds = data;
		console.log("data: " + JSON.stringify(data));
	})
})

jeevesApp.controller("jeevesCtrl", function($scope) {
	$scope.jeeves = model;

	$scope.changeView = function(selected) {
		$scope.jeeves.view = selected;
	};

	$scope.showFeeds = function() {
		var result = [];
		angular.forEach($scope.jeeves.feeds, function(feed) {
			result.push(feed.name + ': ' + feed.rss);
		})
		return result;
	}
});
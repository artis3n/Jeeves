//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "welcome",
	feeds: []
};

var jeevesApp = angular.module("jeevesApp", []);

jeevesApp.run(function($http) {
	$http.get("/model/test").success(function(data) {
		model.feeds = data.find({name:"steve"});
		console.log("data: " + JSON.stringify(data));
	})
})

jeevesApp.controller("jeevesCtrl", function($scope) {
	$scope.jeeves = model;

	$scope.changeView = function(selected) {
		$scope.jeeves.view = selected;
	};
});
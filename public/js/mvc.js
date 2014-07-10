//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "welcome",
	preView: "welcome",
	feeds: []
};

var jeevesApp = angular.module("jeevesApp", []);

jeevesApp.run(function($http) {
	$http.get("/model/feeds").success(function(data) {
		model.feeds = data;
	})
})

jeevesApp.controller("jeevesCtrl", function($scope) {
	$scope.jeeves = model;

	$scope.changeView = function(selected) {
		if(selected === 'back'){
			$scope.jeeves.view = $scope.jeeves.preView;
		}else{
			$scope.jeeves.preView = $scope.jeeves.view;
			$scope.jeeves.view = selected;
		}
	};
});
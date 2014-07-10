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

	$scope.listMessages = function(userId, query, callback) {
  		var getPageOfMessages = function(request, result) {
    		request.execute(function(resp) {
      		result = result.concat(resp.messages);
      		var nextPageToken = resp.nextPageToken;
      		if (nextPageToken) {
        		request = gapi.client.request(www.googleapis.com/gmail/v1/users/me/messages/list, function() {
        			'userId': userId,
        			'pageToken': nextPageToken,
        			'q': query
        		});
        		getPageOfMessages(request, result);
     			} else {
     				callback(result);
     			}
    		});
 			};
  		var initialRequest = gapi.client.request(www.googleapis.com/gmail/v1/users/me/messages/list, function() {
        		'userId': userId,
        		'q': query
        		});
  		var messages = getPageOfMessages(initialRequest, []);

  		angular.forEach(messages, function(message) {
  			var node = document.createElement("LI");
  			var textnode = document.createTextNode(message);
  			node.appendChild(textnode);
  			document.getElementById("messageList").appendChild(node);
  		})
	}
});
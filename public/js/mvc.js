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
  		gapi.client.load('gmail', 'v1', function() {
  			console.log("API loaded");
  		});
  		var getPageOfMessages = function(request, result) {
    		request.execute(function(resp) {
      		result = result.concat(resp.messages);
      		var nextPageToken = resp.nextPageToken;
      		if (nextPageToken) {
        		request = gmail.users().messages().list({
          		'userId': userId,
          		'pageToken': nextPageToken,
          		'q': query
        		}).execute();
        		getPageOfMessages(request, result);
     			} else {
     					callback(result);
     			}
    		});
 			};
  		var initialRequest = gmail.users().messages().list({
    		'userId': userId,
    		'q': query
 	 		}).execute();
  		var messages = getPageOfMessages(initialRequest, []);

  		angular.forEach(messages, function(message) {
  			var node = document.createElement("LI");
  			var textnode = document.createTextNode(message);
  			node.appendChild(textnode);
  			document.getElementById("messageList").appendChild(node);
  		})
	}
});
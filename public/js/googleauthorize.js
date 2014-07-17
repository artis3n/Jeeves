// Enter a client ID for a web application from the Google Developer Console.
// In your Developer Console project, add a JavaScript origin that corresponds to the domain
// where you will be running the script.
var clientId = '718585900559-24g02h03tqtiiui9cdnl80a1m3a82q2l.apps.googleusercontent.com';

// Enter the API key from the Google Develoepr Console - to handle any unauthenticated
// requests in the code.
// To use in your own application, replace this API key with your own.
var apiKey = 'AIzaSyAOsjRfBxUE893UO243KmMe12Q5uMHlbKQ';

// To enter one or more authentication scopes, refer to the documentation for the API.
var scopes = 'https://www.googleapis.com/auth/gmail.readonly';

// Use a button to handle authentication the first time.
function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth,1);
}

function checkAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}


function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = 'hidden';
    makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
  gapi.client.load('gmail', 'v1', function() {
    getLabels();
  });
}

function getLabels() {
  var requestLabels = gapi.client.gmail.users.labels.list();
  var names = [];
  requestLabels.execute(function(resp) {
    angular.forEach(resp.labels, function(label) {
      names.push(label.name);
    })
    postLabels(names);
  });
}

function postLabels(labels) {
  document.getElementById('label-div').setAttribute('style', 'display: block');
  var labelList = document.getElementById("label-list");
  angular.forEach(labels, function(label) {
    var option = document.createElement("option");
    option.setAttribute('value', label);
    option.innerHTML = label;
    labelList.appendChild(option);
  })
}

function getEmail() {

  var requestEmails = gapi.client.gmail.users.messages.list({
    labelIds: jeevesApp.emailFolder
  });
  requestEmails.execute(function(resp) {
    var content = document.getElementById("message-list");
    if (resp.messages == null) {
      content.innerHTML = "<b>Your inbox is empty.</b>";
    } else {
      content.innerHTML = "";
      angular.forEach(resp.messages, function(message) {
        var email = gapi.client.gmail.users.messages.get({
        'id': message.id
        });
        email.execute(function(stuff) {
          var header = "";
          angular.forEach(stuff.payload.headers, function(item) {
            if (item.name == "Subject") {
              header = item.value;
            }
          })
          var contentType = "";
          angular.forEach(stuff.payload.parts[0].headers, function(item) {
            if (item.name == "Content-Type") {
              contentType = item.value;
            }
          })
          content.innerHTML += '<b>Subject: ' + header + '</b><br>';
          var contents = stuff.payload.parts[0].body.data;
          content.innerHTML += base64.decode(contents) + "<br><br>";
        })
      })
    }
  });
}
cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.manueldeveloper.speech-recognizer/www/speechrecognizer.js",
        "id": "com.manueldeveloper.speech-recognizer.speechrecognizer",
        "clobbers": [
            "navigator.speechrecognizer"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/android/notification.js",
        "id": "org.apache.cordova.dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.plugin.tts/www/tts.js",
        "id": "org.apache.cordova.plugin.tts.tts",
        "clobbers": [
            "navigator.tts"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.oauthio/www/dist/oauth.js",
        "id": "com.phonegap.plugins.oauthio.OAuth",
        "merges": [
            "OAuth"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.manueldeveloper.speech-recognizer": "0.0.1",
    "org.apache.cordova.dialogs": "0.2.8",
    "org.apache.cordova.inappbrowser": "0.5.0",
    "org.apache.cordova.plugin.tts": "0.2.0",
    "com.phonegap.plugins.oauthio": "0.2.1"
}
// BOTTOM OF METADATA
});
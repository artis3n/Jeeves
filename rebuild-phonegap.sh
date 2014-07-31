if [ "$1" = "-rm" ]; then
        echo "require sudo"
	sudo rm -r jeeves_phonegap
	echo "deleting phonegap project..."
fi

phonegap create jeeves_phonegap
cd jeeves_phonegap
cordova platform add android
phonegap build android
cordova plugin add https://github.com/domaemon/org.apache.cordova.plugin.tts.git
cordova plugin add https://github.com/manueldeveloper/cordova-plugin-speech-recognizer.git
cordova plugin add https://github.com/oauth-io/oauth-phonegap
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-splashscreen.git
cordova plugin add org.apache.cordova.dialogs
phonegap build android
cd ..
echo "done"
if [ "$2" = "-r" ]; then
        bash toPhonegap.sh -r
else 
	bash toPhonegap.sh -b
fi

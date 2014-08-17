#&nbsp;&nbsp;Jeeves<a href="url"><img src="https://lh3.ggpht.com/2S1_31n4Wu6Xxmo4Ocrkt5IG8rZs5NoXS3KCHbKrY8UiO1wPfLCB9nqCDMiUU7BG8Cc=w300-rw" align="left" height="40" width="40" ></a>

####ScreenShoot
<div>
<a href="url"><img src="https://lh5.ggpht.com/LjxXFkJgxWaihGpELPiedIYXD-T5TWef4suPP-hYZ89eGb-W9oADo7kbjVzzSZTbiw=h310-rw" align="left" height="300">
<a href="url"><img src="https://lh3.ggpht.com/6ZAXc5RwbRWSIcmBtfv3-nHJm5Kw_8Z8Cgm_4lKURIo1pkgw_E9bz_7XWTcq9c_5fOE=h310-rw" align="left" height="300">
<a href="url"><img src="https://lh5.ggpht.com/Ydi06nEWkkFJpISvM1zEgxe3cP4JvxMw_p-p2buujViWV9vNGzhciyckp9tyUZyhQw=h310-rw" align="left" height="300">
<a href="url"><img src="https://lh3.ggpht.com/fm4oq8c5THFf0HCWX156jAe5ayi2Ptv8LUSbghFCLNPnjib5yPGxAUi5PGHcEhhtpg=h310-rw" align="left" height="300">
</div>

# t

####Description
Who has time to sit and read the morning paper anymore? Should you make coffee, or turn on the news? Brush your teeth, or catch up on your email? Never worry about making these choices again. We present a new, hands- and eyes-free, voice-based application that will read the news, your email, and the weather to you while you go about your morning schedule. We call it Jeeves. Getting dressed in the morning? Tell Jeeves to read you the latest headlines. Caught in rush hour traffic? Have Jeeves read you your latest emails. Best of all, this app is simple, user-friendly, and free.

####Technology
We used a host of services to bring this project together. Our front- and back-end technologies include HTML5, CSS3 and Twitter Bootstrap, AngularJS, and a little jQuery along with extended Bootstrap UI designs built on top of AngularJS. We turned our code into an Android application with Phonegap, and used Phonegap to access the native speech recognition and text-to-speech systems on the user’s device. To get our news articles, we used a Content API provided by The Guardian. Our original plans involved getting multiple news sources and allowing a user to designate a preferred news source, but we found The Guardian was the only source that provided full articles to developers. But we’ll talk about this more when we get to our future plans. Our weather data is provided to us through a great API from OpenWeatherMap, and our Gmail integration comes from OAuth’s Phonegap SDK to access the recently released Gmail API. We used Git for version control and code collaboration, and, to simplify jobs such as moving files, building our Phonegap application, and configuring the project for release, we fell in love with bash scripts, and they deserve an honorable mention here.

####Speech Recoginition
  Jeeves grabs the native speech recognition from the user’s device and passes this recognition a callback function, which allows us to efficiently route our dialogue and initiate specific commands using only general responses from the user like “yeah” or “ok.” 
The native speech recognition, whether from Google, Samsung powered by Vlingo, Nuance, or another party, uses a statistical model to understand speech, from which we grab the “n-best”  -- currently, the 3 best -- transcriptions of what the user has actually said and then matches those results to our list of possible commands.

  Grabbing the 3 best transcriptions and matching across all of them allow us to correct distorted speech and cheat our way to improving recognition. For example, if a user says “take me to the weather page,” but the first transcription result is “take me to the whopper,” we can check the next 2 results, and if one of them recorded the user saying ‘weather,’ we can match “take me” from the first result and “weather” from the second or third result and successfully initiate the command. 

  We’ve found that if the recognition hears a user successfully, the successful recognition will be somewhere in the 3 best results. 
We match the speech to commands using regular expressions, which allows the user a lot of flexibility in what he or she can say. For example, one of the ways we initiate a command to navigate to the news section is by matching “go to” and “news” in a speech phrase. This means the user can say anything from “go to news” to “hi mom no I’m busy right now Jeeves I want to go to news no mom I said I’m busy.” This allows us to achieve a high level of conversational dialogue.

####Future Plan
There were a lot of features that we would have liked to implement, but ultimately did not either because of time restraints or due to legal feasibility. We wanted to incorporate a lot of touch features to allow for sliding components around or swiping to navigate around the app. In the future, we’d like to return to this and really ‘touchify’ our app. As for the news in particular, we would like to work with several additional news outlets besides The Guardian to allow some user choice in news provider. Due to legal restrictions, we weren’t able to include any other news sources, and because of time limitations during building these last 5 weeks, we weren’t able to enter into these discussions. We would also like to explore including other items besides news, email, and weather into Jeeves, such as social media

####Testing
Our app is currently in the play store for testing, however, it is not publicly available. And in the future, we would like make the app freely available to any user

####Co-Founders
Ari Kalfus akalfus@brandeis.edu

Burak Sezer bsezer@brandeis.edu

Sam Raphael sraph@brandeis.edu

Wesely Chin weschin@brandeis.edu

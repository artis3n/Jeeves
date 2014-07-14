     /**google.load("feeds", "1");

      function initialize() {
        var feed = new google.feeds.Feed("http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml");
        feed.setNumEntries(10);
        feed.load(function(result) {
          if (!result.error) {
            var container = document.getElementById("feed");
            var listOfButtons=[];
            for (var i = 0; i < result.feed.entries.length; i++) {
              var entry = result.feed.entries[i];
              var div = document.createElement("div");
              var button = document.createElement('input');
                    button.setAttribute('type', 'button');
                    button.setAttribute('class', 'btn btn-default btn-block');
    				button.name=entry.title;
    				button.setAttribute('value', entry.title);			 	
      	 //       div.appendChild(button);
     	//	      container.appendChild(div);
     	//for loop, add onclick to each button, than append
            }
          }
        });
      }

      google.setOnLoadCallback(initialize); 
     **/

     //Add certain feeds kinda of things, and also parse html to view content!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



    	google.load("feeds", "1");

      function initialize() {

       	var feedOption="";
      	var clicked=false;
   //   	var feedDivGroup=document.getElementById("feeds3");
    //  	feedDivGroup.setAttribute('class', 'btn-group btn-group-justified');
    //Most Popular-------------------------------------------------------------------------------------------
      	var feedContainer = document.getElementById("feed2");
      	feedContainer.setAttribute('class', 'btn-group btn-group-justified');
      	var feedDiv = document.createElement('div');
      	feedDiv.setAttribute('class', 'btn-group');
      	var feedButton1=document.createElement('input');
      	feedButton1.setAttribute('type', 'button');
        feedButton1.setAttribute('class', 'btn btn-default');
   		feedButton1.name="Most Popular";
    	feedButton1.setAttribute('value', "Most Popular");
    	feedButton1.onclick=function(){
    		clicked=true;
    		feedOption="http://feeds.arstechnica.com/arstechnica/index?format=xml";
    		//feedOption="http://www.guardian.co.uk/science/mostclipped/rss";
    		//feedOption="http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml";
    		move();
    	};
    	feedDiv.appendChild(feedButton1);
    	feedContainer.appendChild(feedDiv);	
    //Business----------------------------------------------------------------------------------------------
      	var feedDiv2 = document.createElement('div');
      	      	feedDiv2.setAttribute('class', 'btn-group');
      	var feedButton2=document.createElement('input');
      	feedButton2.setAttribute('type', 'button');
        feedButton2.setAttribute('class', 'btn btn-default');
   		feedButton2.name="Business";
    	feedButton2.setAttribute('value', "Business");
    	feedButton2.onclick=function(){
    		clicked=true;
    		feedOption="http://rss.nytimes.com/services/xml/rss/nyt/Business.xml";
    		move();
    	};
    	feedDiv2.appendChild(feedButton2);
    	feedContainer.appendChild(feedDiv2);
   	//Science----------------------------------------------------------------------------------------------
      	var feedDiv3 = document.createElement('div');
      	 	feedDiv3.setAttribute('class', 'btn-group');
      	var feedButton3=document.createElement('input');
      	feedButton3.setAttribute('type', 'button');
        feedButton3.setAttribute('class', 'btn btn-default');
   		feedButton3.name="Science";
    	feedButton3.setAttribute('value', "Science");
    	feedButton3.onclick=function(){
    		clicked=true;
    		feedOption="http://rss.nytimes.com/services/xml/rss/nyt/Science.xml";
    		move();
    	};
    	feedDiv3.appendChild(feedButton3);
    	feedContainer.appendChild(feedDiv3);
     //Fashion----------------------------------------------------------------------------------------------
      	var feedDiv4 = document.createElement('div');
      	feedDiv4.setAttribute('class', 'btn-group');
      	var feedButton4=document.createElement('input');
      	feedButton4.setAttribute('type', 'button');
        feedButton4.setAttribute('class', 'btn btn-default');
   		feedButton4.name="Fashion";
    	feedButton4.setAttribute('value', "Fashion");
    	feedButton4.onclick=function(){
    		clicked=true;
    		feedOption="http://rss.nytimes.com/services/xml/rss/nyt/FashionandStyle.xml";
    		move();
    	};
    	feedDiv4.appendChild(feedButton4);
    	feedContainer.appendChild(feedDiv4);	



    	function move(){
        var feed = new google.feeds.Feed(feedOption);
        feed.setNumEntries(10);
        feed.load(function(result) {
          if (!result.error) {
            	var container = document.getElementById("feed");
            //	var buttonList=[];

            //First Entry------------------------------------------------------------------------------------------------------
              		var entry0 = result.feed.entries[0];
              		var div0 = document.createElement("div");
                    var button0 = document.createElement('input');
                    button0.setAttribute('type', 'button');
                    button0.setAttribute('class', 'btn btn-default btn-block');
    				button0.name=entry0.title;
    				//button.setAttribute('name', entry.title);
    				button0.setAttribute('value', entry0.title);	
    			//	button0.setAttribute('ng-click', printArticle());
    			
    				//	var div21 = document.createElement("div");
    				//	div21.setAttribute('class', 'bg-primary');
   					//	div21.appendChild(document.createTextNode(entry0.contentSnippet));
   				 	//	var container2 = document.getElementById("feed1");
   				 	//	container2.appendChild(div21);	
    				//});

    				//buttonList[0]=button;			 	
            		div0.appendChild(button0);
            		container.appendChild(div0);
            //Second Entry-------------------------------------------------------------------------------------------------------
            		var entry1 = result.feed.entries[1];
              		var div1 = document.createElement("div");
                    var button1 = document.createElement('input');
                    button1.setAttribute('type', 'button');
                    button1.setAttribute('class', 'btn btn-default btn-block');
    				button1.name=entry1.title;
    				//button.setAttribute('name', entry.title);
    				button1.setAttribute('value', entry1.title);	
    				button1.onclick=function(){
    					var div21 = document.createElement("div");
    					div21.setAttribute('class', 'bg-success');
   						div21.appendChild(document.createTextNode(entry1.contentSnippet));
   				 		var container2 = document.getElementById("feed1");
   				 		container2.appendChild(div21);	
    				};
    				//buttonList[0]=button;			 	
            		div1.appendChild(button1);
            		container.appendChild(div1);
            //Third Entry--------------------------------------------------------------------------------------------------------
            		var entry2 = result.feed.entries[2];
              		var div2 = document.createElement("div");
                    var button2 = document.createElement('input');
                    button2.setAttribute('type', 'button');
                    button2.setAttribute('class', 'btn btn-default btn-block');
    				button2.name=entry2.title;
    				//button.setAttribute('name', entry.title);
    				button2.setAttribute('value', entry2.title);	
    				button2.onclick=function(){
    					var div21 = document.createElement("div");
    					div21.setAttribute('class', 'bg-info');
   						div21.appendChild(document.createTextNode(entry2.contentSnippet));
   				 		var container2 = document.getElementById("feed1");
   				 		container2.appendChild(div21);	
    				};
    				//buttonList[0]=button;			 	
            		div2.appendChild(button2);
            		container.appendChild(div2);
            //Four Entry--------------------------------------------------------------------------------------------------------
            		var entry3 = result.feed.entries[3];
              		var div3 = document.createElement("div");
                    var button3 = document.createElement('input');
                    button3.setAttribute('type', 'button');
                    button3.setAttribute('class', 'btn btn-default btn-block');
    				button3.name=entry3.title;
    				//button.setAttribute('name', entry.title);
    				button3.setAttribute('value', entry3.title);	
    				button3.onclick=function(){
    					var div21 = document.createElement("div");
    					div21.setAttribute('class', 'bg-warning');
   						div21.appendChild(document.createTextNode(entry3.contentSnippet));
   				 		var container2 = document.getElementById("feed1");
   				 		container2.appendChild(div21);	
    				};
    				//buttonList[0]=button;			 	
            		div3.appendChild(button3);
            		container.appendChild(div3);
            //Five Entry----------------------------------------------------------------------------------------------------------
            		var entry4 = result.feed.entries[4];
              		var div4 = document.createElement("div");
                    var button4 = document.createElement('input');
                    button4.setAttribute('type', 'button');
                    button4.setAttribute('class', 'btn btn-default btn-block');
    				button4.name=entry4.title;
    				//button.setAttribute('name', entry.title);
    				button4.setAttribute('value', entry4.title);	
    				button4.onclick=function(){
    					var div21 = document.createElement("div");
    					div21.setAttribute('class', 'bg-danger');
   						div21.appendChild(document.createTextNode(entry4.contentSnippet));
   				 		var container2 = document.getElementById("feed1");
   				 		container2.appendChild(div21);	
    				};
    				//buttonList[0]=button;			 	
            		div4.appendChild(button4);
            		container.appendChild(div4);


          }
        });
      }
  }
	google.setOnLoadCallback(initialize);

 
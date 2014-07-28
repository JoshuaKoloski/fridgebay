
var fridgeApp = (function($) {


    // first create the model
    var myList = new Information();
    
    var showView = function (selected) {
        console.log("VIEW IS SHOWN");
      window.location.hash = '#' + selected;
      $('.view').hide().filter('#' + selected + '-view').show();
    };
    
    function showAlert() {
        console.log("clicked");
        alert("You have 2 new messages");
    }
    function showHelp() {
        console.log("clicked");
        alert("If you want to make a new post, click 'New Post'\nIf you want to buy an item, search through the list of items and sort by categories.");
    }
    function verifySubmission(){
        showView("home");
        alert("Your Message has been submitted");
    }
    

    $(function () {
        $('#notify').popover(
        {
            trigger: 'hover',
            html: true,
            content: 'you have 1 new notification',
        });
    });
    
    function refreshView() {
        fridgeView.refreshView(myList);
    }
    
    function filterMainCategory(maincategory) {
        fridgeView.filterMainCategory(myList, maincategory);
    }
    
    function filterSubCategory(subcategory) {
        fridgeView.filterSubCategory(myList, subcategory);
    }

    function reloadModel(){
        myList.loadModel();
        refreshView();
    }
    function addItem() {
    	
    	var imageArray = [];
    	
    	for (i = 0; i < 3; i++){
    		if (document.getElementById("img_"+i).innerHTML != ""){
    			imageArray[imageArray.length] = document.getElementById("img_"+i).innerHTML;
    			console.log("true");
    		} else {
    			console.log("false");
    		}

    	}
    	console.log("images = "+ imageArray);
    	
        myList.addElement({
            seller: myList.currentUser,
            images: imageArray,
            category: $("#itemMainCategory").val(),
            subcategory: $("#itemSubCategory").val(),
            name: $("#itemName").val(),
            price: $("#itemPrice").val(),
            quantity: $("#itemQuantity").val(),
            condition: $("#itemCondition").val(),
            sellBy: $("#itemSellBy").val(),
            university: $("#itemUniversity").val(),
            location: $("#itemLocation").val(),
            description: $("#itemDesc").val() 
        });
    }

    //loads edit page for an item
    function loadEdit(element){
        console.log("Loading Edit Page");
        id = element.getAttribute("sid");
        item = myList.searchById(id);
        document.getElementById("#editMainCategory").innerHTML = item.category;
        document.getElementById("#editSubCategory")= item.subCategory;
        document.getElementById("#editName") = item.name;
        document.getElementById("#editPrice") = item.price;
        document.getElementById("#editQuantity") = item.quantity;
        document.getElementById("#editCondition")= item.condition;
        document.getElementById("#ediSellBy") = item.sellBy;
        document.getElementById("#editUniversity") = item.university;
        document.getElementById("#editLocation") = item.location;
        document.getElementById("#editDesc") = item.description;
        showView("edit");
    }
    function updateItem(element){
        console.log("CTRL Activated: Updating item with id " + element.getAttribute("sid"));
        loadEdit(element);
        myList.updateElement({
            images: imageArray,
            category: $("#editMainCategory").val(),
            subcategory: $("#editSubCategory").val(),
            name: $("#editName").val(),
            price: $("#editPrice").val(),
            quantity: $("#editQuantity").val(),
            condition: $("#editCondition").val(),
            sellBy: $("#editSellBy").val(),
            university: $("#editUniversity").val(),
            location: $("#editLocation").val(),
            description: $("#editDesc").val() 
        });
        reloadModel();
    }
    
    function imageTextAlign(){
        $(document).ready(function(){
            var coordinates = $("#nestImage").offset();
            console.log("Image Coordinates:{Top: "+ coordinates.top + ", Left: " + coordinates.left + "} ");
            coordinates.top += 17;
            coordinates.left += 65;
            console.log("Text Coordinates:{Top: "+ coordinates.top + ", Left: " + coordinates.left + "} ");
            $("#showNumber").offset({top: coordinates.top, left: coordinates.left});
        });
    }
    
    function pass(element) {
        console.log("element= " + element.getAttribute("sid"));
        fridgeView.refreshItemItems(element.getAttribute("sid"), myList);   
    }
    
    function defer(element) {   	
		var obj = {
			hello: function(element) {	
			  	console.log("add");
			  	$(element).addClass('home-fake-hover');
			},
			bye: function(element) {	
				console.log("bye");
				$(element).removeClass('home-fake-hover');			
			}
		  },
		  // Create a Deferred
		  defer = $.Deferred();
 
		// Set object as a promise
		defer.promise( obj );
 
		// Resolve the deferred
		defer.resolve(element);
 
		return obj;
    } 
    
    function a() {

	  	var deferred = $.Deferred();
 		
	  	setTimeout(function() {		
			deferred.resolve();
	  	}, 2000);
 
	  	return deferred.promise();
	}
        
    function homeChooseItem(index) {
    
    	console.log("choose item clicked!");
    	
    	var list=[];
    	// Use the object as a Promise
		$('.home-item').each(function() {
			list.push($(this).attr('sid'));
		})
		
		$('.home-item').removeClass('home-fake-hover');
		console.log(index);
		bringToViewpoint("div[sid="+list[index]+"]");
		$("[sid="+list[index]+"]").addClass('home-fake-hover');
		
    	return index;
    	
    	
    	/**
    	var obj = friend_highlight();
    	
    	$('.home-item').each(function(){
			obj.done(function() {
			  	obj.highlight(this);
			}); 
    	})
    	
    	
    	
    	
    	var list = [];
    	$('.home-item').each(function() {
    		list.push($(this).attr('sid'));
    	})
    	
    	for (i=0; i<list.length; i++){
    		wait(list[i]);
    		
    	}
    	**/

    	
    	/**
    	$.each($('.home-item'), function(i, el){
			$(el).css({'opacity':0});
			setTimeout(function(){
			   $(el).animate({
				'opacity':1.0
			   }, 500);
			   bringToViewpoint(el)
			},500 + ( i * 500 ));
		});  **/
    }
    
    //scroll to a certain element. example call: bringToViewpoint('#tree');
    function bringToViewpoint(element) {
    	$("body, html").animate({ 
            scrollTop: $(element).offset().top-30
        }, 600);
    }
    
    function bringToTop() {
    	$("body, html").animate({ 
            scrollTop: 0
        }, 600);
    }
       
    function deleteItem(element){
        var c = confirm("Are you sure you want to delete this item?")
        if (c) {
            console.log("CTRL Activated: Deleting item with id " + element.getAttribute("sid"));
            myList.deleteElement(element.getAttribute("sid"));
        } else {
            console.log("delete canceled");
        }
    }
    
    function encodeImageFileAsURL(divNum){

		var filesSelected = document.getElementById("inputFileToLoad_"+divNum).files;
		if (filesSelected.length > 0)
		{
			var fileToLoad = filesSelected[0];

			var fileReader = new FileReader();

			fileReader.onload = function(fileLoadedEvent) {
				var srcData = fileLoadedEvent.target.result; // <--- data: base64

				var newImage = document.createElement('img');
				newImage.src = srcData;
				if(newImage.width > newImage.height) { 
					newImage.width = 250;
				} else {
					newImage.height = 250;
				}

				document.getElementById("img_"+divNum).innerHTML = newImage.outerHTML;
				console.log("Converted Base64 version is "+document.getElementById("img_"+divNum).innerHTML);
			}
			fileReader.readAsDataURL(fileToLoad);
		}
	}
    
    function initEventListeners(){
        $(window).on('hashchange', function(event){
          var view = (window.location.hash || '').replace(/^#/, '');
          if ($('#' + view + '-view').length) {
            showView(view);
          }
        });
    }

	function getUser(){
		return myList.currentUser;
	}
	
	function speechJumpToPage(pageName){
		if (pageName == 'home' || pageName == 'login' || pageName == 'welcome' || pageName == 'profile') {	 
			showView(pageName);
			tts("You are on " + pageName + " page now.");
		} else if (pageName == 'account'){
			showView('profile');
			tts("You are on " + pageName + " page now.")
		} else if (pageName == 'feedback') {
			showView('contact');
			tts("You are on the feedback page now. You are welcome to report any issue or leave a kind message.");
		} else {
			tts("Sorry, we don't have "+pageName+" page. We have home page, login page, profile page and feedback page. Please try the command again.");
		}
	}
	
	//speech filters for items in the home page including name, university, price, main category
	function homeItemsSpeechFilter(filter, content, searchPhrase){
		if (window.location.hash == '#home') {
			if (filter == 'university') {
				var school = content;
				$('#schoolCutoffHome').val(school);
				refreshView();
				tts("Here are items from "+school+" university.");
			} else if (filter == 'price') {
				var price = content;
				if (isNaN(price)){
					tts("I heard "+searchPhrase+" price "+price+" and price need to be a positive number. Please try again.");
				} else {
					$('#priceCutoffHome').val(price);
					refreshView();
					tts("Here are items cheaper than "+price+" dollars.");
				}			
			} else if (filter == 'name') {
				var name = content;
				$('#nameCutoffHome').val(name);
				refreshView();
				tts("Here are items with name containing "+name+".");
			} else if (filter == 'category') {
				if (content == 'furniture' || content == 'appliances' || content == 'vehicles' || content == 'electronics' || content == 'cutlery' || content == 'supplies' || content == 'books' || content == 'clothes' || content == 'bed') {
					var category = content;
					var categoryId = category.substring(0,1).toUpperCase()+category.substring(1);
					$('.collapse').removeClass("in");
					$('#collapse'+categoryId).addClass("in");
					filterMainCategory(category);
					tts("Here are items in the "+category+" category.");
				} else {
					tts("I heard "+searchPhrase+" category "+ category +" but I don't understand. Please choose a category in the category menu and try the command again.");
				}
			} else {
				tts("I heard "+searchPhrase+" "+ filter +" but I don't understand. You can "+searchPhrase+" name, university, price and category.");
			}
		} else {
			tts("It seems that you said a command to filter items in the home page. Please say. go to home page to go to home page first.");
		}
	}
	
	//speech filter for a sub category for the home page items
	function subcategorySpeechFilter(subcategory){
		if (window.location.hash == '#home') {
			if (subcategory == 'table' || subcategory == 'chair' || subcategory == 'shelves' || subcategory == 'bookcase' || subcategory == 'drawer' || 
				subcategory == 'fridge' || subcategory == 'microwave' || subcategory == 'oven' || subcategory == 'bike' || subcategory == 'car' || 
				subcategory == 'motocycle' || subcategory == 'boat' || subcategory == 'computer' || subcategory == 'tv' || subcategory == 'phone' || 
				subcategory == 'charger' || subcategory == 'dishes' || subcategory == 'blender' || subcategory == 'mixer' || subcategory == 'scissors' || 
				subcategory == 'notebook' || subcategory == 'binder' || subcategory == 'folder' || subcategory == 'sciences' || subcategory == 'arts' || 
				subcategory == 'math' || subcategory == 'novel' || subcategory == 'shoes' || subcategory == 'shirt' || subcategory == 'pants' || 
				subcategory == 'hat' || subcategory == 'sweater' || subcategory == 'sheet' || subcategory == 'padding' || subcategory == 'comforter')
				//filter subcategory
				filterSubCategory(subcategory);
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory == 'TV') {
				filterSubCategory('tv');
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory == 'coffee maker') {
				filterSubCategory('coffee_maker');
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory == 'media player') {
				filterSubCategory('media_player');
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory == 'gaming systems') {
				filterSubCategory('gaming_systems');
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory == 'pen or pencil') {
				filterSubCategory('pen_pencil');
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory == 'pillow case') {
				filterSubCategory('pillow_case');
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory == 'furniture' || subcategory == 'appliances' || subcategory == 'vehicles' || subcategory == 'electronics' || subcategory == 'cutlery' || 
					subcategory == 'supplies' || subcategory == 'books' || subcategory == 'clothes' || subcategory == 'bed') {
				var subcategoryUp = subcategory.substring(0,1).toUpperCase()+subcategory.substring(1);
				filterSubCategory('other'+subcategoryUp);
				tts("Here are items in the other "+subcategory+" sub category.");
			} else if (subcategory == 'other') {
				tts("For choosing an other sub category. You also need to specify the main category. For example, you can say. Search or sort by other furniture.")	
			} else {
				tts("I heard sub category "+subcategory+" which is not exist. Please choose an existing sub category and try the command again.");
			}
		} else {
			tts("It seems that you said a command to choose a sub category in the home page. Please say. go to home page to go to home page first.");
		}
	}

    function start() {
        myList.loadModel();
        showView('home');
        imageTextAlign();
        enableSpeech();
        bringToTop();
    }
    
    function enableSpeech() {	
		if (annyang) {
			var commands = {
				'show speech instructions': function () {
					$('#speechInstructions').removeClass("hidden");
					tts("Speech instructions showed.")
				},
				'choose an item': function(){
					var index = 0;
					var myInterval = setInterval(function(){
										homeChooseItem(index++);
										if (index > 9) {
											clearInterval(myInterval)
										}
									},3000);
				},
				'choose the :index item': function(index){
					if (index == 'first') {
						homeChooseItem(0);
					} else if (index == 'second') {
						homeChooseItem(1);
					} else if (index == 'third') {
						homeChooseItem(2);
					} else if (index == 'fourth') {
						homeChooseItem(3);
					} else if (index == 'fifth') {
						homeChooseItem(4);
					}
				},
				'choose the next item': function(){			
					homeChooseItem(++index);
				},
				'(*junk) post *item': function (junk, item) {
					if (item == 'an item' || item == 'a item' || item == 'new item' || item == 'item') {		 
						showView('form');
						tts("Fill the form and click submit to post an item.");
					} else {
						tts("I heard post" + item + " and I don't understand. If you want to post an item you can say post an item.")
					}
				},
				'(*junk) go to :pageName page': function (junk, pageName) {
					speechJumpToPage(pageName);		
				},
				'(*junk) search by (item) :filter *content': function (junk, filter, content) {
					homeItemsSpeechFilter(filter, content, 'search by');
				},
				'(*junk) sort by (item) :filter *content': function (junk, filter, content) {
					homeItemsSpeechFilter(filter, content, 'sort by');
				},
				'(*junk) sub category (other) *subcategory': function (junk, subcategory) {
					subcategorySpeechFilter(subcategory);
				},
			};
			
			annyang.addCommands(commands);
			initializeCallbacks();
			annyang.debug();
	
			//ADD callbacks
			function initializeCallbacks () {
				annyang.addCallback('start', function () {
				  $('.myStateText').text('Listening...');
				});

				annyang.addCallback('end', function () {
				  $('.myStateText').text('Listening section ended!');
				});

				annyang.addCallback('error', function () {
				  $('.myErrorText').text('There was an error!');
				});

				annyang.addCallback('result', function () {
				  $('.myStateText').text('Got a result!');
				});
				
				annyang.addCallback('resultNoMatch', function () {
				  $('.myStateText').text('Command not found!');
				  tts("I didn't understand you. Please try again.");
				});
			}
	
			// pass a context to a global function
			annyang.addCallback('errorNetwork', notConnected, this);

			function notConnected () {
				console.error("Help, there's no internet connection!");
				tts("Help, there's no internet connection!");
			}
		}
		
		var isRecording = false;
		$('.myStartButton').click(function () {
			if (annyang) {
				if (isRecording) {			
					annyang.abort(); //stop listening
					tts("Speech interaction ended. See you next time!");
					isRecording = false;
					$('.myStartButton').text("Start speech interaction!");
					$('.myStartButton').removeClass('btn-danger');		// turn off red class
					$('.myStartButton').addClass('btn-primary');
				} else {
					annyang.start({autoRestart: true}); //start listening
					tts("Hi, I am ollie speech assistant. What can I help you? Say. Show speech instructions, for more information.");
					isRecording = true;
					$('.myStartButton').text("End speech interaction!");
					$('.myStartButton').removeClass('btn-primary');		// turn on red class
					$('.myStartButton').addClass('btn-danger');
				}
			} else {
				$('#unsupported').removeClass("hidden");
			}
		})
    }
    
    function tts(text) {
    	var msg = new SpeechSynthesisUtterance(text);
    	msg.lang = 'en-US';
		speechSynthesis.speak(msg);
    }
  
    // here is were we decide what is visible to the outside!
    fridgeApp = {
        start: start,
        getUser: getUser,
        filterMainCategory: filterMainCategory,
        filterSubCategory: filterSubCategory,
        encodeImageFileAsURL: encodeImageFileAsURL,
        showAlert: showAlert,
        encodeImageFileAsURL: encodeImageFileAsURL,
        showHelp: showHelp,
        verifySubmission: verifySubmission,
        refreshView: refreshView,
        reloadModel: reloadModel,
        showView: showView,
        deleteItem: deleteItem,
        updateItem: updateItem,
        pass:pass,
        getUser: getUser,
        deleteItem: deleteItem,
        imageTextAlign: imageTextAlign,
        homeChooseItem: homeChooseItem,
    }

    return (fridgeApp);

}(jQuery));




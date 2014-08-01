
/*
Fridge bay speech interaction using annyang (stt) and web speech synthesis (tts)
*/

var fridgeSpeech = (function($) {

	function enableSpeech() {
		console.log("SPEECH LOADED!!!");
		if (annyang) {
			var trying = 0;
			var commands = {
				'(*junk) show speech instructions': function (junk) {
					trying = 0;
					$('#speechInstructions').removeClass("hidden");
					tts("Speech instructions showed.")
				},
				'(*junk) hide speech instructions': function (junk) {
					trying = 0;
					$('#speechInstructions').addClass("hidden");
					tts("Speech instructions hidden.")
				},
				//*************
				'(*junk) start browse *item': function(junk, item){
					trying = 0;
					speechBrowseOption(item.toLowerCase(), 'browse');
				},
				'(*junk) start browsing *item': function(junk, item){
					trying = 0;
					speechBrowseOption(item.toLowerCase(), 'browsing');
				},
				'(*junk) start look at *item': function(junk, item){
					trying = 0;
					speechBrowseOption(item.toLowerCase(), 'look at');
				},
				'(*junk) start go over *item': function(junk, item){
					trying = 0;
					speechBrowseOption(item.toLowerCase(), 'go over');
				},
				//*************
				'(*junk) next (*item)': function(junk, item){
					trying = 0;	
					if (typeof item == 'undefined') {
						item = 'item';	
					}
					speechNextItem(item.toLowerCase());
					
				},
				'(*junk) previous (*item)': function(junk, item){
					trying = 0;			
					if (typeof item == 'undefined') {
						item = 'item';	
					}
					speechPreviousItem(item.toLowerCase());
					
				},
				'(*junk) resume (browsing) (*item)': function (junk, item) {
					trying = 0;
					if (typeof item == 'undefined') {
						item = 'item';	
					}
					speechContinueBrowseItems(item.toLowerCase());
					
				},
				'(*junk) continue (browsing) (*junk2)': function (junk, junk2) {
					trying = 0;
					if (typeof junk2 == 'undefined'){
						junk2 = 'items';
					}
					speechContinueBrowseItems(junk2);
				},
				'(*junk) end browsing (*junk2)': function (junk, junk2) {
					trying = 0;
					tts("Item browsing section ended.");
					$('.home-item').removeClass('home-fake-hover');
				},
				'(*junk) view (*junk2)': function (junk, junk2) {
					trying = 0;
					viewItem();
				},
				'(*junk) open (*junk2)': function (junk, junk2) {
					trying = 0;
					viewItem();
				},
				'(*junk) click (*junk2)': function (junk, junk2) {
					trying = 0;
					viewItem();
				},
				'(*junk) stop *term': function (junk, term) {
					trying = 0;
					if (window.location.hash == '#home') {
						if (term.indexOf('browsing')>-1 || term.indexOf('going')>-1 || term.indexOf('item')>-1) {
							stopFlag = true;
						} else {
							tts("I heard stop "+term+". If you are browsing items and you want to stop. Say. Stop browsing.");
						}
					} else {
						tts("I heard stop and I didn't understand. You cannot stop anything unless you are browsing items in the home page.");
					}
				},
				'(*junk) post *item': function (junk, item) {
					trying = 0;
					speechPostItem(item.toLowerCase(), 'post');
				},
				'(*junk) sell *item': function (junk, item) {
					trying = 0;
					speechPostItem(item.toLowerCase(), 'sell');
				},
				'(*junk) go to *page': function (junk, page) {
					trying = 0;
					speechJumpToPage(page.toLowerCase());		
				},
				'(*junk) clear *filter': function (junk, filter) {
					trying = 0;
					console.log("0000000");
					homepageCheck(speechClearFilter, 'clear '+filter, filter.toLowerCase());
				},
				'(*junk) delete *filter': function (junk, filter) {
					trying = 0;
					console.log("0000000");
					homepageCheck(speechClearFilter, 'delete '+filter, filter.toLowerCase());
				},
				'(*junk) search (by) (item) :filter *content': function (junk, filter, content) {
					trying = 0;
					homeItemsSpeechFilter(filter.toLowerCase(), content.toLowerCase(), 'search by');
				},
				'(*junk) show (me) :filter *content': function (junk, filter, content) {
					trying = 0;
					homeItemsSpeechFilter(filter.toLowerCase(), content.toLowerCase(), 'show');
				},
				'(*junk) sort (by) (item) :filter *content': function (junk, filter, content) {
					trying = 0;
					homeItemsSpeechFilter(filter.toLowerCase(), content.toLowerCase(), 'sort by');
				},
				'(*junk) sub category (other) *subcategory': function (junk, subcategory) {
					trying = 0;
					subcategorySpeechFilter(subcategory.toLowerCase());
				},
				'(*junk) all :category (*junk2)': function (junk, category, junk2) {
					trying = 0;
					if (window.location.hash == '#home') {
						if (category.toLowerCase() == "category" || category.toLowerCase() == "categories") {
							fridgeApp.refreshView();
						} else {
							tts("I heard all "+category+". You can say all categories to see items from all categories.");
						}
					} else {
						tts("I heard all "+category+" but I didn't understand. You may need to go to home page to execute a command. To go to home page, say. go to home page.");
					}
				},
				'*dontUnderstand': function (dontUnderstand) {
					$('.myStateText').text('Command not found!');
					if (trying<2) {
						tts("Sorry I didn't understand the command "+dontUnderstand+". You can say. show speech instructions to look at speech commands.");
						trying++;
					} else {
						tts("Sorry I didn't understand the command "+dontUnderstand+". You may want to try keyboard.");
					}
				}
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
				  $('.myStateText').text('Cannot hear you');
				  tts("Sorry. I cannot hear you.");
				});
			}

			// a context to a global function
			annyang.addCallback('errorNetwork', notConnected, this);

			function notConnected () {
				console.error("Help, there's no internet connection!");
				tts("Help, there's no internet connection!");
			}
			
			var isListening = false;
			var speechButton = false;
			$('.myStartButton').click(function () {
				console.log("start button clicked!");
				
				if (annyang) {
					if (speechButton) {	
						annyang.abort(); //stop listening
						tts("Speech interaction ended. See you next time!");
						$('.home-item').removeClass('home-fake-hover');
						index = 0;
						itemList = [];
						stopFlag = false;
						trying = 0;
						isListening = false;
						speechButton = false;
						$('.myStartButton').text("Start speech interaction!");
						$('.myStartButton').removeClass('btn-danger');		// turn off red class
						$('.myStartButton').addClass('btn-primary');
					} else {
						//homePageCheck();
						speechButton = true;
						var annyangInterval = setInterval(function(){
							if (!speechButton){
								clearInterval(annyangInterval);
								alert("annyang interval cleared");
							}
							if (speechSynthesis.speaking){
								annyang.abort();
								isListening = false;
							} else {
								if (!isListening){
									isListening = true;
									annyang.start();
								}
							}
						}, 2000)

						tts("Hi, I am ollie speech assistant. Please say your command or say show speech instructions to see command guide.");
						$('.myStartButton').text("End speech interaction!");
						$('.myStartButton').removeClass('btn-primary');		// turn on red class
						$('.myStartButton').addClass('btn-danger');
					}
				} else {
					$('#unsupported').removeClass("hidden");
				}
			})
		}
	}	

	function speechJumpToPage(pageName){
		if (pageName.indexOf('home')>-1) {	 
			fridgeApp.showView('home');
			tts("You are on home page now.");
		} else if (pageName.indexOf('login')>-1){
			fridgeApp.showView('login');
			tts("You are on the login page now.");
		} else if (pageName.indexOf('post')>-1){
			fridgeApp.showView('form');
			tts("You are on the post new item page now.");
		} else if (pageName.indexOf('account')>-1 || pageName.indexOf('profile')>-1){
			fridgeApp.showView('profile');
			tts("You are on your account page now.");
		} else if (pageName.indexOf('feedback')>-1) {
			fridgeApp.showView('contact');
			tts("You are on the feedback page now. You are welcome to report any issue or leave a kind message.");
		} else {
			tts("Sorry, we don't have "+pageName+" page. We have home page, login page, profile page, post page and feedback page. Please try the command again.");
		}
	}
	
	function speechPostItem(item, postPhrase){					
		if (item.indexOf("item") > -1) {	 
			fridgeApp.showView('form');
			tts("Please fill the post new item form and click submit to post an item.");
		} else {
			tts("I heard "+postPhrase+" " + item + " and I don't understand. If you want to "+postPhrase+" an item you can say "+postPhrase+" an item.");
		}
	}
	
	function homepageCheck(fun, text, para1, para2) {
		if (window.location.hash == '#home') {
			fun(para1, para2);
		} else {
			tts("I heard "+text+" and it's a homepage command. Say. go to homepage to go to homepage first.");
		}
	}

	function speechClearFilter( filter) {
	//	if (window.location.hash == '#home') {
			if (filter.indexOf('university')>-1) {
				$('#schoolCutoffHome').val('');
				fridgeApp.refreshView();
				tts("University filter cleared.");
			} else if (filter == 'price') {
				$('#priceCutoffHome').val(0);
				fridgeApp.refreshView();
				tts("Price filter cleared.");		
			} else if (filter == 'name') {
				$('#nameCutoffHome').val('');
				fridgeApp.refreshView();
				tts("Name filter cleared.");
			} else if (filter == 'category') {
				fridgeApp.refreshView();
				tts("Category filter cleared.");
			} else {
				tts("I heard clear "+ filter +" but I don't understand. You can clear a filter field by saying clear name, clear university, clear price or clear filter.");
			}
	//	} else {
	//		tts("I heard "+text+", which seems like a command for home page. If you want to go to home page say go to home page.");
	//	}
	}
	
	//speech filters for items in the home page including name, university, price, main category
	function homeItemsSpeechFilter(filter, content, searchPhrase){
		if (window.location.hash == '#home') {
			if (filter == 'university') {
				var school = content;
				$('#schoolCutoffHome').val(school);
				fridgeApp.refreshView();
				tts("Here are items from "+school+" university.");
			} else if (filter == 'price') {
				var price = content;
				if (isNaN(price)){
					tts("I heard "+searchPhrase+" price "+price+" and price need to be a positive number. Please try again.");
				} else {
					$('#priceCutoffHome').val(price);
					fridgeApp.refreshView();
					tts("Here are items cheaper than "+price+" dollars.");
				}			
			} else if (filter == 'name') {
				var name = content;
				$('#nameCutoffHome').val(name);
				fridgeApp.refreshView();
				tts("Here are items with name containing "+name+".");
			} else if (filter == 'category') {
				if (content == 'furniture' || content == 'appliances' || content == 'vehicles' || content == 'electronics' || content == 'cutlery' || content == 'supplies' || content == 'books' || content == 'clothes' || content == 'bed') {
					var category = content;
					var categoryId = category.substring(0,1).toUpperCase()+category.substring(1);
					$('.collapse').removeClass("in");
					$('#collapse'+categoryId).addClass("in");
					fridgeApp.filterMainCategory(category);
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
	
	var index = 0;
	var itemList = [];
	var stopFlag = false;
	
	function viewItem(){
		if (window.location.hash == '#home') {
			if (itemList == []){
				itemList = homeCollectItemList();
			}
			if (index<=itemList.length){
				console.log("VIEWING THIS ITEM "+itemList[--index]);
				fridgeApp.passById(itemList[index]);
				var thisItem = fridgeApp.searchById(itemList[index]);
				tts("Item name is "+thisItem.name+"."+
				"It is in category "+thisItem.category+" and sub category "+thisItem.subcategory+"."+
				"It is sell by "+thisItem.sellBy+"."+
				"University is "+thisItem.university+"."+
				"Location is "+thisItem.location+"."+
				"Price is "+thisItem.price+"."+
				"Quantity is "+thisItem.quantity+"."+
				"Condition is "+thisItem.condition+"."+
				"Seller is "+thisItem.seller+"."+
				thisItem.interested+" people is interested in this item.")
				index++;
			} else {
				tts("No item to view.");
			}
		} else {
			tts("It seems that you want to view an item. You can only view item on the home page. Please say go to home page to go to home page first.");
		}
	}
	
	function speechBrowseOption(item, browsePhrase){
		if (window.location.hash == '#home') {
			if (item.indexOf("item") > -1) {
				speechAutoBrowseItems(item);
			} else {
				tts("I heard "+browsePhrase+" "+item+" and I didn't understand. To "+browsePhrase+" items, you can say. "+browsePhrase+" items or "+browsePhrase+" items with information reading.");
			}	
		} else {
			tts("I heard "+browsePhrase+". If you want to "+browsePhrase+" the items on the home page. Please say. go to home page to go to home page first.");
		}
	}
	
	function speechNextItem(item){
		if (window.location.hash == '#home'){
			if (item.indexOf('item')>-1 || item.indexOf('one')>-1){
				if (itemList == []) {
					itemList = homeCollectItemList();
				} else if (index >= itemList.length){
					itemList = homeCollectItemList();
					if (index >= itemList.length) {
						console.log("ITEM INDEX = "+index);
						tts("This is the end of item list. Please go back or end browsing.");
					} else {
						homeChooseItem(itemList, index++, true);
					}
				} else {
					homeChooseItem(itemList, index++, true);
				}
			} else {
				tts("I heard next "+item+" and I didn't understand. You can say next item or next one to go to the next item.")
			}
		} else {
			tts("It seems you want to browse the next item in the home page. Please say go to home page to go to home page first.");
		}
	}
	
	function speechPreviousItem(item){
		if (window.location.hash == '#home'){
			if (item.indexOf('item')>-1 || item.indexOf('one')>-1){
				index -= 2;
				if (itemList == []) {
					itemList = homeCollectItemList();
				}
				if (index < 0){
					tts("Item is out of range. Please go next or end browsing items");
					index += 2;
				} else {
					homeChooseItem(itemList, index++, true);
				}
			} else {
				tts("I heard previous "+item+" and I didn't understand. You can say previous item or previous one to go to the previous item.")
			}
		} else {
			tts("It seems you want to browse the previous item in the home page. Please say go to home page to go to home page first.");
		}
	}
	
	function speechContinueBrowseItems(item){
		if (window.location.hash == '#home'){
			itemList = homeCollectItemList();
			browseItems(item, "Browsing continued. You can always say stop browsing to stop at a certain item.");
		} else {
			tts("It seems you want to continue browse items in the home page. Please say go to home page to go to home page first.");
		}
	}
	
	function speechAutoBrowseItems(item){
		itemList = homeCollectItemList();
		index = 0;
		browseItems(item, "Browsing started. You can always say stop browsing to stop at a certain item.");	
	}
	
	function browseItems(item, text) {
		stopFlag = false;
		if (itemList.length == 0) {
			tts('Sorry, there are no items to go over.');
		} else if (itemList.length == 1) {
			tts("There is only one item in the item list. No automatic browsing provided. Please check the item by saying next item.");
		} else if (index >= itemList.length) {
			tts("This is the end of item list. Please go back or end browsing.");
		} else { //more than one item
			tts(text);
			if (item.indexOf("information") > -1){				
				var infoInterval = setInterval(function(){
					console.log(speechSynthesis.speaking);
					if (!speechSynthesis.speaking) {
						console.log(speechSynthesis.speaking);
						homeChooseItem(itemList, index++, true);
						if (index >= itemList.length || stopFlag) {						
							clearInterval(infoInterval);
							tts("Item browsing stopped. You can view this item, continue browsing items, go to next item, go to previous item or end browsing.");
						}
					}
				},2000);							
			} else {					
				// doesn't request reading information while browsing		
				var myInterval = setInterval(function(){
					homeChooseItem(itemList, index++, false);
					if (index >= itemList.length || stopFlag) {					
						clearInterval(myInterval);
						tts("Item browsing stopped. You can view this item, continue browsing items, go to next item, go to previous item or end browsing.");
					}
				},3000);
			}
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
				subcategory == 'hat' || subcategory == 'sweater' || subcategory == 'sheet' || subcategory == 'padding' || subcategory == 'comforter') {
				//filter subcategory
				fridgeApp.filterSubCategory(subcategory);
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory == 'TV') {
				fridgeApp.filterSubCategory('tv');
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory == 'coffee maker') {
				fridgeApp.filterSubCategory('coffee_maker');
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory.indexOf('media')>-1) {
				fridgeApp.filterSubCategory('media_player');
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory == 'gaming systems') {
				fridgeApp.filterSubCategory('gaming_systems');
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory.indexOf('pencil')>-1) {
				fridgeApp.filterSubCategory('pen_pencil');
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory.indexOf('pillow')>-1) {
				fridgeApp.filterSubCategory('pillow_case');
				tts("Here are items in the "+subcategory+" sub category.");
			} else if (subcategory == 'furniture' || subcategory == 'appliances' || subcategory == 'vehicles' || subcategory == 'electronics' || subcategory == 'cutlery' || 
					subcategory == 'supplies' || subcategory == 'books' || subcategory == 'clothes' || subcategory == 'bed') {
				var subcategoryUp = subcategory.substring(0,1).toUpperCase()+subcategory.substring(1);
				fridgeApp.filterSubCategory('other'+subcategoryUp);
				tts("Here are items in the other "+subcategory+" sub category.");
			} else if (subcategory.indexOf('other')>-1) {
				tts("I heard other. For choosing an other sub category. You also need to specify the main category. For example, you can say. Search or sort by other furniture.")	
			} else {
				tts("I heard sub category "+subcategory+" which is not exist. Please choose an existing sub category and try the command again.");
			}
		} else {
			tts("It seems that you said a command to choose a sub category in the home page. Please say. go to home page to go to home page first.");
		}
	}
	
	function homeCollectItemList(){
    	var list=[];
    	// Use the object as a Promise
		$('.home-item').each(function() {
			list.push($(this).attr('sid'));
		})
		return list;
    }
        
    function homeChooseItem(list, index, readInformation) {
    	console.log("choose item!");
		$('.home-item').removeClass('home-fake-hover');
		console.log(index);
		bringToViewpoint("div[sid="+list[index]+"]");
		$("[sid="+list[index]+"]").addClass('home-fake-hover');
		
		if (readInformation) {
			var thisItem = fridgeApp.searchById(list[index]);
			console.log(thisItem);
			tts("Item name is "+thisItem.name+". Price is "+thisItem.price+". University is "+thisItem.university+".")
		}
    }
    
    //scroll to a certain element. example call: bringToViewpoint('#tree');
    function bringToViewpoint(element) {
    	$("body, html").animate({ 
            scrollTop: $(element).offset().top-30
        }, 600);
    }
	
    function tts(text) {
    	var msg = new SpeechSynthesisUtterance(text);
		speechSynthesis.speak(msg);
    }

	// here is were we decide what is visible to the outside!
    fridgeSpeech = {
        enableSpeech: enableSpeech,
    }

    return (fridgeSpeech);

}(jQuery));
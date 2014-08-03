
/*
Fridge bay speech interaction using annyang (stt) and web speech synthesis (tts)
*/

var fridgeSpeech = (function($) {

	function enableSpeech() {
		console.log("SPEECH LOADED!!!");
		if (annyang) {
			var trying = 0;
			var commands = {
				'(*junk) speech (*junk2)': function (junk, junk2) {
					trying = 0;
					if (typeof junk == 'undefined'){
						tts("I heard speech. You can show speech instructions or hide speech instructions.");
					} else if (junk.indexOf('show')>-1 || junk.indexOf('open')>-1 || junk.indexOf('see')>-1 || junk.indexOf('pop')>-1){
						$('#speechInstructions').removeClass("hidden");
						tts("Speech instructions showed.")
					} else if (junk.indexOf('hide')>-1 || junk.indexOf('close')>-1 || junk.indexOf('remove')>-1){
						$('#speechInstructions').addClass("hidden");
						tts("Speech instructions hidden.")
					} else {
						tts("I heard speech. You can show speech instructions or hide speech instructions.");
					}
				},
				'(*junk) down (*junk2)': function(junk, junk2){
					window.scrollBy(0,100);
					/**
					$("body, html").animate({ 
						scrollTop: $("body, html").offset().top+30
					}, 600);
					**/
					tts("page scrolled down");
				},
				'(*junk) up (*junk2)': function(junk, junk2){
					window.scrollBy(0,-100);
					/**
					$("body, html").animate({ 
						scrollTop: $("body, html").offset().top-30
					}, 600);
					**/
					tts("page scrolled up");
				},
				//*****
				'(*junk) post (*item)': function (junk, item) {
					trying = 0;
					if (typeof item == 'undefined'){
						item = 'item';
					}
					speechPostItem(item.toLowerCase(), 'post');
				},	
				'(*junk) sell (*item)': function (junk, item) {
					trying = 0;
					if (typeof item == 'undefined'){
						item = 'item';
					}
					speechPostItem(item.toLowerCase(), 'post');
				},
				//*****
				'(*junk) go (back) to *page': function (junk, page) {
					trying = 0;
					speechJumpToPage(page.toLowerCase());
				},
				//*************

				'(*junk) (start) browsing (*info)': function(junk, info){
					trying = 0;
					if (typeof info == 'undefined'){
						info = 'item';
					}
					homepageCheck(speechStartBrowseItems, 'browsing', info.toLowerCase());
				},
				
				'(*junk) browse (*info)': function(junk, info){
					trying = 0;
					if (typeof info == 'undefined'){
						info = 'item';
					}
					homepageCheck(speechStartBrowseItems, 'browse', info.toLowerCase());
				},
				'(*junk) go over (*info)': function(junk, info){
					trying = 0;
					if (typeof info == 'undefined'){
						info = 'item';
					}
					homepageCheck(speechStartBrowseItems, 'go over', info.toLowerCase());
				},
				//*************
				'(*junk) next (*item)': function(junk, item){
					trying = 0;	
					if (typeof item == 'undefined') {
						item = 'item';	
					}
					homepageCheck(speechNextItem, 'next', item.toLowerCase());	
				},
				'(*junk) previous (*item)': function(junk, item){
					trying = 0;			
					if (typeof item == 'undefined') {
						item = 'item';	
					}
					homepageCheck(speechPreviousItem, 'previous', item.toLowerCase());			
				},
				'(*junk) resume (browsing) (*item)': function (junk, item) {
					trying = 0;
					if (typeof item == 'undefined') {
						item = 'item';	
					}
					homepageCheck(speechContinueBrowseItems, 'resume', item.toLowerCase());					
				},
				'(*junk) continue (browsing) (*item)': function (junk, item) {
					trying = 0;
					if (typeof item == 'undefined'){
						item = 'items';
					}
					homepageCheck(speechContinueBrowseItems, 'continue', item.toLowerCase());
				},
				'(*junk) end browsing (*junk2)': function (junk, junk2) {
					trying = 0;
					tts("Item browsing section ended.");
					$('.home-item').removeClass('home-fake-hover');
				},
				'(*junk) view (*junk2)': function (junk, junk2) {
					trying = 0;
					homepageCheck(viewItem(), 'view');
				},
				'(*junk) open (*junk2)': function (junk, junk2) {
					trying = 0;
					homepageCheck(viewItem(), 'open');
				},
				'(*junk) click (*junk2)': function (junk, junk2) {
					trying = 0;
					homepageCheck(viewItem(), 'click');
				},
				'(*junk) stop (*junk2)': function (junk, junk2) {
					trying = 0;
					if (window.location.hash == '#home') {
						stopFlag = true;
					} else {
						tts("I heard stop. You cannot stop anything unless you are browsing items in the home page.");
					}
				},
				//**** filter deletion *****
				'(*junk) clear (*filter)': function (junk, filter) {
					trying = 0;
					if (typeof filter == 'undefined'){
						tts("You can clear a filter such as name, university, price or category.");
					} else {
						homepageCheck(speechClearFilter, 'clear', filter.toLowerCase());
					}
				},
				'(*junk) delete *filter': function (junk, filter) {
					trying = 0;
					if (typeof filter == 'undefined'){
						tts("You can delete a filter such as name, university, price or category.");
					} else {
						homepageCheck(speechClearFilter, 'delete', filter.toLowerCase());
					}
				},
				'(*junk) all :category (*junk2)': function (junk, category, junk2) {
					trying = 0;
					if (window.location.hash == '#home') {
						if (category.toLowerCase().indexOf('category')>-1) {
							fridgeApp.refreshView();
						} else {
							tts("I heard all "+category+". You can say all categories to see items from all categories.");
						}
					} else {
						tts("I heard all "+category+", which looks like a homepage command. To go to home page, say. go to home page.");
					}
				},
				//**** filter deletion end *****
				
				//**** add filter *****
				'(*junk) search (by) (:filter) (*content)': function (junk, filter, content) {
					trying = 0;
					if (typeof filter == 'undefined'){
						filter = 'nothing';
					}
					if (typeof content == 'undefined'){
						content = '';
					}
					if (filter.indexOf('buy')>-1){
						filter = content.substring(1);
						content = '';
					}
					homepageCheck(homeItemsSpeechFilter, 'search', filter.toLowerCase(), content.toLowerCase());
				},
				'(*junk) sort (by) (:filter) (*content)': function (junk, filter, content) {
					trying = 0;
					if (typeof filter == 'undefined'){
						filter = 'nothing';
					}
					if (typeof content == 'undefined'){
						content = '';
					}
					if (filter.indexOf('buy')>-1){
						filter = content.substring(1);
						content = '';
					}
					homepageCheck(homeItemsSpeechFilter, 'sort', filter.toLowerCase(), content.toLowerCase());
				},			
				'(*junk) show (me) (:filter) (*content)': function (junk, filter, content) {
					trying = 0;
					if (typeof filter == 'undefined'){
						filter = 'nothing';
					}
					if (typeof content == 'undefined'){
						content = '';
					}
					if (filter.indexOf('buy')>-1){
						filter = content.substring(1);
						content = '';
					}
					homepageCheck(homeItemsSpeechFilter, 'show', filter.toLowerCase(), content.toLowerCase());
				},
				'(*junk) sub category (other) *subcategory': function (junk, subcategory) {
					trying = 0;
					homepageCheck(subcategorySpeechFilter, 'sub category', subcategory.toLowerCase());
				},
				//**** add filter end *****
				
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
							if (isListening && speechSynthesis.speaking){
								annyang.abort();
								isListening = false;
							} else if (!isListening && !speechSynthesis.speaking) {
								isListening = true;
								annyang.start();
							}
							console.log("speechSynthesis.speaking = "+speechSynthesis.speaking+" isListening = "+isListening);
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
		} else if (pageName.indexOf('feedback')>-1 || pageName.indexOf('contact')>-1) {
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
			tts("I heard "+text+" and it seems like a homepage command. You can say. go to homepage to go to homepage first.");
		}
	}

	function speechClearFilter(filter) {
		if (filter.indexOf('university')>-1) {
			$('#schoolCutoffHome').val('');
			fridgeApp.refreshView();
			tts("University filter cleared.");
		} else if (filter.indexOf('price')>-1) {
			$('#priceCutoffHome').val(0);
			fridgeApp.refreshView();
			tts("Price filter cleared.");		
		} else if (filter.indexOf('name')>-1) {
			$('#nameCutoffHome').val('');
			fridgeApp.refreshView();
			tts("Name filter cleared.");
		} else if (filter.indexOf('category')>-1) {
			fridgeApp.refreshView();
			tts("Category filter cleared.");
		} else {
			tts("I heard clear "+ filter +" but I don't understand. You can clear a filter field by saying clear name, clear university, clear price or clear filter.");
		}
	}
	
	//speech filters for items in the home page including name, university, price, main category
	function homeItemsSpeechFilter(filter, content){
		if (filter == 'nothing') {
			tts("You can search by name, university, price and category.");
		} else if (filter == 'university') {
			var school = content;
			$('#schoolCutoffHome').val(school);
			fridgeApp.refreshView();
			tts("Here are items from "+school+" university.");
		} else if (filter == 'price') {
			var price = content;
			if (isNaN(price)){
				tts("You are entering the price filter but "+price+" is not a number. Please try again.");
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
				fridgeApp.filterMainCategory(category);
				tts("Here are items in the "+category+" category.");
			} else {
				subcategorySpeechFilter(content);
			}
		} else {
			if (filter == 'furniture' || filter == 'appliances' || filter == 'vehicles' || filter == 'electronics' || filter == 'cutlery' || filter == 'supplies' || filter == 'books' || filter == 'clothes' || filter == 'bed') {
				var category = filter;
				fridgeApp.filterMainCategory(category);
				tts("Here are items in the "+category+" category.");
			} else {
				subcategorySpeechFilter(filter+content);
			}
		}
	}
	
	function categorySpeechFilter(category){
		if (category == 'furniture' || category == 'appliances' || category == 'vehicles' || category == 'electronics' || category == 'cutlery' || category == 'supplies' || category == 'books' || category == 'clothes' || category == 'bed') {
			fridgeApp.filterMainCategory(category);
			tts("Here are items in the "+category+" category.");
		} else {
			subcategorySpeechFilter(category);
		}
	}
	
	//speech filter for a sub category for the home page items
	function subcategorySpeechFilter(subcategory){
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
		} else if (subcategory.indexOf('pen')>-1) {
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
			tts(subcategory+" is not a category. Please choose a category in the category menu and try the command again.");
		}
	}
	
	function categoryCheck(term){
		subcategory = term.toLowerCase();
		if (subcategory == 'table' || subcategory == 'chair' || subcategory == 'shelves' || subcategory == 'bookcase' || subcategory == 'drawer' || 
			subcategory == 'fridge' || subcategory == 'microwave' || subcategory == 'oven' || subcategory == 'bike' || subcategory == 'car' || 
			subcategory == 'motocycle' || subcategory == 'boat' || subcategory == 'computer' || subcategory == 'tv' || subcategory == 'phone' || 
			subcategory == 'charger' || subcategory == 'dishes' || subcategory == 'blender' || subcategory == 'mixer' || subcategory == 'scissors' || 
			subcategory == 'notebook' || subcategory == 'binder' || subcategory == 'folder' || subcategory == 'sciences' || subcategory == 'arts' || 
			subcategory == 'math' || subcategory == 'novel' || subcategory == 'shoes' || subcategory == 'shirt' || subcategory == 'pants' || 
			subcategory == 'hat' || subcategory == 'sweater' || subcategory == 'sheet' || subcategory == 'padding' || subcategory == 'comforter' ||
			subcategory == 'TV' || subcategory == 'coffee maker' || subcategory.indexOf('media')>-1 || subcategory == 'gaming systems' ||
			subcategory.indexOf('pen')>-1 ||subcategory.indexOf('pillow')>-1 || subcategory == 'furniture' || subcategory == 'appliances' || 
			subcategory == 'vehicles' || subcategory == 'electronics' || subcategory == 'cutlery' || subcategory == 'supplies' || 
			subcategory == 'books' || subcategory == 'clothes' || subcategory == 'bed'){
			
			return true;
		} else {
			return false;
		}
	}
	
	var index = 0;
	var itemList = [];
	var stopFlag = false;
	
	function viewItem(){
		if (itemList == []){
			itemList = homeCollectItemList();
		}
		if (index<=itemList.length){
			console.log("VIEWING THIS ITEM "+itemList[--index]);
			fridgeApp.passById(itemList[index]);
			var thisItem = fridgeApp.searchById(itemList[index]);

			tts("Item name is "+thisItem.name+"."+
			" It belongs to "+thisItem.category+". "+thisItem.subcategory+"."+
			" Sell by date is "+thisItem.sellBy.substring(0,10)+"."+
			" At school "+thisItem.university+"."+
			" Specific location is "+thisItem.location+".")
			tts(" Item condition is "+thisItem.condition+"."+
			" It costs "+thisItem.price+" dollars"+"."+
			" Available Quantity is "+thisItem.quantity+"."+
			thisItem.interested+" people is interested.")
			index++;
		} else {
			tts("No item to view.");
		}
	}
	
	function speechNextItem(item){
		if (item.indexOf('item')>-1 || item.indexOf('one')>-1){
			if (itemList == []) {
				itemList = homeCollectItemList();
			} else if (index >= itemList.length){
				itemList = homeCollectItemList();
				if (index >= itemList.length) {
					console.log("ITEM INDEX = "+index);
					tts("This is the end of item list. Please go to previous item or end browsing.");
				} else {
					homeChooseItem(itemList, index++, true);
				}
			} else {
				homeChooseItem(itemList, index++, true);
			}
		} else {
			tts("I heard next "+item+" and I didn't understand. You can say next item or next one to go to the next item.")
		}
	}
	
	function speechPreviousItem(item){
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
	}
	
	function speechContinueBrowseItems(item){
		itemList = homeCollectItemList();
		browseItems(item, "Browsing continued. You can always say stop browsing to stop at a certain item.");
	}
	
	function speechStartBrowseItems(infoOrNot){
		if (categoryCheck(infoOrNot.substring(1))){
			categorySpeechFilter(infoOrNot.substring(1));
		}
		itemList = homeCollectItemList();
		index = 0;
		browseItems(infoOrNot);	
	}
	
	function browseItems(infoOrNot) {
		stopFlag = false;
		if (itemList.length == 0) {
			tts('Sorry, there are no items to go over.');
		} else if (itemList.length == 1) {
			tts("There is only one item in the item list. No automatic browsing provided. Please check the item by saying next item.");
		} else if (index >= itemList.length) {
			tts("This is the end of item list. Please go back or end browsing.");
		} else { 
			//more than one item
			if (infoOrNot.indexOf('information') > -1 || infoOrNot.indexOf('info') > -1){	
				tts("Browsing with information started. You cannot give commands during the browsing.");				
				var infoInterval = setInterval(function(){
					console.log(speechSynthesis.speaking);
					if (!speechSynthesis.speaking) {
						console.log(speechSynthesis.speaking);
						homeChooseItem(itemList, index++, true);
						if (index >= itemList.length || stopFlag) {						
							clearInterval(infoInterval);
							tts("Item browsing stopped. You can continue browsing items, view this item, go to next item, go to previous item or end browsing.");
						}
					}
				},2000);							
			} else {					
				// doesn't request reading information while browsing
				tts("Browsing started. You can say stop browsing to stop at a certain item.");		
				var myInterval = setInterval(function(){
					homeChooseItem(itemList, index++, false);
					if (index >= itemList.length || stopFlag) {					
						clearInterval(myInterval);
						tts("Item browsing stopped. You can continue browsing items, view this item, go to next item, go to previous item or end browsing.");
					}
				},3000);
			}
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
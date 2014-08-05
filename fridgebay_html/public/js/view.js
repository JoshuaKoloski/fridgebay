/**
 The shoppingView is responsible for updating all of the HTML
 It is called by the shoppingApp only and the only thing it calls is jQuery
**/

var fridgeView = (function($){
    
    function refreshView(myData){    	
        refreshTableItems(myData.items);
        refreshTableUsers(myData.users);
//         console.log("the current user is " + JSON.stringify(myData.currentUser));
        //         console.log("the current user using getUser is " + JSON.stringify(fridgeApp.getUser()));
        refreshProfile(myData.currentUser);
        

        if ($.isEmptyObject(fridgeApp.getUser())) {
            $("#loginButton").html('<button class="dark_brown" onclick="fridgeApp.accessLoginPage()">Login</button>');
        } else {
            var user = fridgeApp.getUser();
            
           /* if (fridgeApp.getUser().currentItem[0] && myData.searchById(fridgeApp.getUser().currentItem[0]) != null) {
                refreshItemItems(fridgeApp.getUser().currentItem[0], myData);
            }*/

        	var newM = fridgeApp.newMessageCheck(user);
        	$("#loginButton").html('<button class="dark_brown" onclick="fridgeApp.accessLogoutPage()">Logout</button>');
            $("#postButton").html('<button class="dark_brown" onclick="fridgeApp.showView('+"'form'"+')"><span class="glyphicon glyphicon-plus"></span></button>');
            $("#notificationButton").html('<button type="button"  class="redButton" data-toggle="popover" id="notificationBtn" onclick="fridgeApp.showView('+"'message'"+')", "fridgeApp.refreshMessage('+'"'+newM+'"'+')"><span class="glyphicon glyphicon-comment" ></span></button>');
			refreshMessages(newM);
            fridgeApp.notificationPopover(newM);
            $("#profileButton").html('<button class="dark_brown" onclick="fridgeApp.showView('+"'profile'"+'), fridgeApp.refreshProfile()">'+ user.email+'  <span class="glyphicon glyphicon-user"></span></button>');
        }
    }
    function updateCategoryOptions(type){
    	
    	var furniture = {
    		table : "Table",
    		chair : "Chair",
    		shelves : "Shelves",
    		bookcase : "Bookcase",
    		drawer : "Drawer",
    		otherFurniture : "Other"
    	};
    	
    	var appliances = {
    		fridge : "Fridge",
    		microwave : "Microwave",
    		oven : "Oven",
    		coffee_maker : "Coffee Maker",
    		otherAppliances : "Other"
    	};
    	
    	var vehicles = {
    		bike : "Bike",
    		car : "Car",
    		motorcycle : "Motocycle",
    		boat : "Boat",
    		otherVehicles : "Other"
    	};
    	
    	var electronics = {
    		computer : "Computer",
    		tv : "TV",
    		media_player : "Media Player",
    		phone : "Phone",
    		charger : "Charger",
    		gaming_systems : "Gaming Systems",
    		otherElectronics : "Other"
    	};
    	
    	var cutlery = {
    		dishes : "Dishes",
    		blender : "Blender",
    		mixer : "Mixer",
    		otherCutlery : "Other"
    	};
    	
    	var supplies = {
    		scissors : "Scissors",
    		pen_pencil : "Pen/Pencil",
    		notebook : "Notebook",
    		binder : "Binder",
    		folder : "Folder",
    		otherSupplies : "Other"
    	};
    	
    	var books = {
    		sciences : "Sciences",
    		arts : "Arts",
    		math : "Math",
    		novel : "Novel",
    		otherBooks : "Other"
    		
    	};
    	
    	var clothes = {
    		shoes : "Shoes",
    		shirt : "Shirt",
    		pants : "Pants",
    		hat : "Hat",
    		sweater: "Sweater",
    		otherClothes : "Other"
    	};
    	
    	var bed = {
    		sheet : "Sheet",
    		pillow_case : "Pillow Case",
    		padding : "Padding",
    		comforter: "Comforter",
    		otherBed : "Other"
    	};
            if(type.match("post")){
		var selectSub = $("#itemSubCategory");
		$("#itemSubCategory").empty();
		if ($("#itemMainCategory").val() == 'furniture') {
			$.each(furniture, function(val, text) {
				selectSub.append(
					$('<option></option>').val(val).html(text)
				);
			});
		} else if ($("#itemMainCategory").val() == 'appliances') {
			$.each(appliances, function(val, text) {
				selectSub.append(
					$('<option></option>').val(val).html(text)
				);
			});
		} else if ($("#itemMainCategory").val() == 'vehicles') {
			$.each(vehicles, function(val, text) {
				selectSub.append(
					$('<option></option>').val(val).html(text)
				);
			});
		} else if ($("#itemMainCategory").val() == 'electronics') {
			$.each(electronics, function(val, text) {
				selectSub.append(
					$('<option></option>').val(val).html(text)
				);
			});
		} else if ($("#itemMainCategory").val() == 'cutlery') {
			$.each(cutlery, function(val, text) {
				selectSub.append(
					$('<option></option>').val(val).html(text)
				);
			});
		} else if ($("#itemMainCategory").val() == 'supplies') {
			$.each(supplies, function(val, text) {
				selectSub.append(
					$('<option></option>').val(val).html(text)
				);
			});
		} else if ($("#itemMainCategory").val() == 'books') {
			$.each(books, function(val, text) {
				selectSub.append(
					$('<option></option>').val(val).html(text)
				);
			});
		} else if ($("#itemMainCategory").val() == 'clothes') {
			$.each(clothes, function(val, text) {
				selectSub.append(
					$('<option></option>').val(val).html(text)
				);
			});
		} else if ($("#itemMainCategory").val() == 'bed') {
			$.each(bed, function(val, text) {
				selectSub.append(
					$('<option></option>').val(val).html(text)
				);
			});
		}
            }else if(type.match("edit")){
                var selectSub = $("#editSubCategory");
                $("#editSubCategory").empty();
                if ($("#editMainCategory").val() == 'furniture') {
                        $.each(furniture, function(val, text) {
                                selectSub.append(
                                        $('<option></option>').val(val).html(text)
                                );
                        });
                } else if ($("#editMainCategory").val() == 'appliances') {
                        $.each(appliances, function(val, text) {
                                selectSub.append(
                                        $('<option></option>').val(val).html(text)
                                );
                        });
                } else if ($("#editMainCategory").val() == 'vehicles') {
                        $.each(vehicles, function(val, text) {
                                selectSub.append(
                                        $('<option></option>').val(val).html(text)
                                );
                        });
                } else if ($("#editMainCategory").val() == 'electronics') {
                        $.each(electronics, function(val, text) {
                                selectSub.append(
                                        $('<option></option>').val(val).html(text)
                                );
                        });
                } else if ($("#editMainCategory").val() == 'cutlery') {
                        $.each(cutlery, function(val, text) {
                                selectSub.append(
                                        $('<option></option>').val(val).html(text)
                                );
                        });
                } else if ($("#editMainCategory").val() == 'supplies') {
                        $.each(supplies, function(val, text) {
                                selectSub.append(
                                        $('<option></option>').val(val).html(text)
                                );
                        });
                } else if ($("#editMainCategory").val() == 'books') {
                        $.each(books, function(val, text) {
                                selectSub.append(
                                        $('<option></option>').val(val).html(text)
                                );
                        });
                } else if ($("#editMainCategory").val() == 'clothes') {
                        $.each(clothes, function(val, text) {
                                selectSub.append(
                                        $('<option></option>').val(val).html(text)
                                );
                        });
                } else if ($("#editMainCategory").val() == 'bed') {
                        $.each(bed, function(val, text) {
                                selectSub.append(
                                        $('<option></option>').val(val).html(text)
                                );
                        });
                }
            }
    }

    function sortItems(items) {
        var sortedItems = items.slice();  // make a copy of items
        
        sortedItems.sort();
        sortedItems.reverse();
        var recentItems = [];
        for (var i = 0; i < 10; i++) {
            if (sortedItems[i] != null) {
                recentItems[i] = sortedItems[i];
            } else { break;}
        }
        var showComplete = $("#showCompleteCheckbox").prop("checked");
        if(showComplete){
            return sortedItems;
        } else {
            return recentItems;
        }
    }
    
    
    // redraw the table using the current model
    function refreshTableItems(myItems){    
        var rows = "";
        var rowsHome = "";
        var len = myItems.length;
        var filteredModelItems = filterModelItems(myItems);
        var filteredHomeItems = filterHomeItems(myItems);
        var sortedModelItems = sortItems(filteredModelItems);
        var sortedHomeItems = sortItems(filteredHomeItems);
        
        //console.log("filteredItems = " + JSON.stringify(filteredModelItems));
        //console.log("filteredItems = " + JSON.stringify(filteredHomeItems));
        for(var n=0; n<sortedModelItems.length; n++){ 
            var item = sortedModelItems[n];
            rows = rows + itemToRow(item);
        }
        console.log("model length= " + filteredHomeItems.length);
        for (var n = 0; n < sortedHomeItems.length; n++) {
            var item = sortedHomeItems[n];
            //console.log("item = " + JSON.stringify(item));
            rowsHome = rowsHome + homeItemToRow(item);
        }
        
        var itemTableBody = $("#itemTableBodyItems").html(rows);
        var itemTablebody = $("#homeTableBody").html(rowsHome);
        
        showNumber(len);
    }

	//Loads the item page with an items information
    function refreshItemItems(elementId, myList) {
    	var mq = fridgeApp.mediaCheck();
        var list = myList.items;
        var element = myList.searchById(elementId);

        //fridgeApp.showView('item');
        if(!mq.matches){
            $("#carouselControls").html(carousel());
        };
        
        $("#item_tableBody").html(itemItemToRow(element));
        $("#addToNest").html(itemAddToNest(element));
        $("#item_category").html(headingText(element));
        $("#item_images").html(imagesText(element));
        $("#item_status").html(statusText(element));
        $("#item_sellBy").html(sellText(element, myList));

    }
    //Loads the carousel controls onto item page
    function carousel(){
        return "<a class='left carousel-control' href='#carousel-example-generic' role='button' data-slide='prev'>" +
                "<span class='glyphicon glyphicon-chevron-left'></span>" +
                "</a>" +
                "<a class='right carousel-control' href='#carousel-example-generic' role='button' data-slide='next'>"+
                "<span class='glyphicon glyphicon-chevron-right'></span>"+
                "</a>"
    }

    

    function refreshProfile(currentUser) {
        $("#profileInfo").html(profileToRow(currentUser));
    }

    function refreshNestTable(myList, nest) {
        if (nest.length > 0) {
            $("#profile_table").html(nestToRow(myList, nest));
        } else {
            $("#profile_table").html(
                "<thead class='color'><tr>" +
                    "<th>Name</th>" +
                    "<th>Photo</th>" +
                    "<th>Price</th>" +
                    "<th>University</th>" +
                    "<th></th></tr>" +
            "</thead>");
        }
    }

    function refreshSellingTable(myList, nest) {
        if (nest.length > 0) {
            $("#profile_table").html(sellToRow(myList, nest));
        } else {
            $("#profile_table").html("<thead class='color'><tr>" +
                    "<th>Name</th>" +
                    "<th>Photo</th>" +
                    "<th>Price</th>" +
                    "<th>University</th>" +
                    "<th></th>" +
                    "<th></th>" +
                    "<th></th></tr>" +
            "</thead>")
        }
    }

    function showNumber(length) {  
        $("#showNumber").html(length);
    }

    function filterModelItems(items) {
        
        var n;
        var item;
        var newItems = [];
        var price = $("#priceCutoff").val() || 0;
        var name = $("#nameCutoff").val().toLowerCase();
        for (n = 0; n < items.length; n++) {
            item = items[n];
            if(price != 0){
                if (item.price <= price) {
                    if ((item.name.toLowerCase()).match((name))) {
                        newItems.push(item);
                    }
                }
            }else{
                if ((item.name.toLowerCase()).match((name))) {
                        newItems.push(item);
                }
            }
        }
        return newItems;
    }
    
    function filterMainCategory(myData, maincategory){
    	var items = myData.items;
    	var newItems = [];
    	for (var n = 0; n < items.length; n++) {
    		if (items[n].category.match(maincategory)) {
    			newItems.push(items[n]);
    		}
    	}
    	refreshTableItems(newItems);
    }
    
    function filterSubCategory(myData, subcategory) {
    	var items = myData.items;
        var newItems = [];
        for (var n = 0; n < items.length; n++) {
            if (items[n].subcategory.match(subcategory)) {
                newItems.push(items[n]);
            }
        }
        refreshTableItems(newItems);
    }

    function filterHomeItems(items) {
        var n;
        var item;
        var newItems = [];
        var price = $("#priceCutoffHome").val() || 0;
        var name = $("#nameCutoffHome").val().toLowerCase();
        var university = $("#schoolCutoffHome").val().toLowerCase();
        

        for (n = 0; n < items.length; n++) {
            item = items[n];
            if (item.price <= price || price==0) {
                if ((item.name.toLowerCase()).match((name))) {
                    if ((item.university.toLowerCase()).match((university))) {
                        newItems.push(item)
                    }
                }
            } 
        }
        
        return newItems;
    }
    

    // convert an item into an HTML tr element
    function itemToRow(item){
        id = item._id;
        var row = 
        "<tr><td>"+ item.name+
        "</td><td>"+ item.seller+
        "</td><td>"+ item.price+
        "</td><td>"+ item.quantity+
        "</td><td>"+ item.university+
        "</td><td>"+ item.location+
        "</td><td type='date'>"+ item.sellBy+
        "</td><td>"+ item.condition+
        "</td><td>"+ item.category+
        "</td><td>"+ item.subcategory+
        "</td><td>"+ displayImages(item.images) +
        "</td><td>"+ item.description +
        "</td><td>"+ item.status+
        "</td><td>"+ item.interested+
        "</td><td>" + "<button class='btn btn-default' type='button' sid='" + item._id + "' onclick='fridgeApp.updateNest(this), fridgeApp.deleteItem(this)'>Delete</button>" +
        "</td><td>"+"<button class='btn btn-default' type='button' sid='"+item._id+"' onclick='fridgeApp.loadEdit(this)'>Edit</button>"+
        "</td></tr>";
        return row;
    }

    //converts item into html on home table
    function homeItemToRow(item) {
        var row=
        "<div class='col-xs-6 col-s-6 col-md-6 home-item' sid ='"+item._id+"' onclick='fridgeApp.pass(this)'><div class ='thumbnail'>"+displayImage(item.images)+ 
        "<div class='caption' align='left'>"+
        "<h1>"+ item.name +
        "</h1><p> $"+ item.price +
        "</p><p> Campus: " + item.university +
        "</p></div></div></div>"
        return row;
    }
    
    //converts item into html on item table
    function itemItemToRow(item) {
        var row =
        "<tr><td><label>Item Name</label></td><td><label>" + item.name + "</label></td></tr>"+
        "<tr><td><label>University</label></td><td><label>" + item.university + "</label></td></tr>"+
        "<tr><td><label>Location</label></td><td><label>" + item.location + "</label></td></tr>"+
        "<tr><td><label>Price</label></td><td><label>$" + item.price + "</label></td></tr>"+
        "<tr><td><label>Quantity</label></td><td><label>" + item.quantity + "</label></td></tr>"+
        "<tr><td><label>Condition</label></td><td><label>" + item.condition + "</label></td></tr>"+
        "<tr><td><label>Description</label></td><td><label>" + item.description + "</label></td></tr><tr></tr><tr></tr>";
        return row;
    }

    function nestToRow(myList, nest) {
        var row="";
        for (var i = 0; i < nest.length; i++) {
            var item = myList.searchById(nest[i]);
            var itemName = item.name;
            var photo = displayImage(item.images);
            var price = item.price;
            var university = item.university;
            var id = nest[i];
            if (i == 0) {
                row = row +
                 "<thead class='color'><tr>" +
                        "<th>Name</th>" +
                        "<th>Photo</th>" +
                        "<th>Price</th>" +
                        "<th>University</th>" +
                        "<th></th></tr>" +
                "</thead>"
            }
            row=row+
            "<tbody class='color2'>"+
            "<tr class='changeImageColor'>"+
            "<td><label>"+itemName+"</label></td>"+
            "<td><label>"+photo+"</label></td>"+
            "<td><label>$"+price+"</label></td>"+
            "<td><label>"+university+"</label></td>"+
            "<td><a class='pull-right'><span class='glyphicon glyphicon-eye-open' sid='" + id + "' onclick='fridgeApp.pass(this)'></span></a></td></tr>"+
            "</tbody>"
        }

        return row;
    }

    function sellToRow(myList, nest) {
        var row = "";
        for (var i = 0; i < nest.length; i++) {
            var item = myList.searchById(nest[i]);
            var itemName = item.name;
            var photo = displayImage(item.images);
            var price = item.price;
            var university = item.university;
            var id = nest[i];
            if(i==0){
                row=row+
                "<thead class='color'><tr>" +
                        "<th>Name</th>" +
                        "<th>Photo</th>" +
                        "<th>Price</th>" +
                        "<th>University</th>" +
                        "<th></th>" +
                        "<th></th>" +
                        "<th></th></tr>" +
                "</thead>" 
            }
            row=row+
            "<tbody class='color2'>" +
            "<tr class='changeImageColor'>" +
            "<td><label>" + itemName + "</label></td>" +
            "<td><label>" + photo + "</label></td>" +
            "<td><label>$" + price + "</label></td>" +
            "<td><label>" + university + "</label></td>" +
            "<td><a class='pull-right'><span class='glyphicon glyphicon-eye-open' sid='" + id + "' onclick='fridgeApp.pass(this)'></span></a></td>" +
            "<td><a class='pull-right'><span class='glyphicon glyphicon-pencil' sid='" + id + "' onclick='fridgeApp.loadEdit(this)'></span></a></td>" +
            "<td><a class='pull-right'><span class='glyphicon glyphicon-remove' sid='" + id + "' onclick='fridgeApp.updateNest(this), fridgeApp.deleteItem(this)'></span></a></td></tr>" +
            "</tbody>"
        }

        return row;
    }

    function itemAddToNest(item) {
        return "<button id='addToNestButton' class='btn btn-warning color4' sid='"+item._id+"' onclick='fridgeApp.addToNest(this), fridgeApp.message(this)'>Add to Nest</button>";
    }
    
    function messageBox(id){
        var messageArea = "<div><textarea class='form-control' rows='3' id='"+id+"' placeholder='Want to send a message to the seller?' value=''></textarea></div> <button type='submit' class='dark_brown' sid='"+id+"' onclick='fridgeApp.submitMessage(this)'>Submit</button>";
        $("#addToNest").html(messageArea);
        console.log(messageArea);
    }

    function profileToRow(currentUser) {
        var row =
 
         "<tbody> <tr>"+
               "<td><b>Username</b></td>"+
                "<td class ='white'>"+fridgeApp.getUserName() +
               " </td></tr>"+
           "<tr>"+
                "<td><b>Email</b></td>"+
                "<td class='white'>" + fridgeApp.getUserEmail() +
            "</td></tr>"+
        "</tbody>";
        return row;
    }
    
    function imagesText(item){    
        var mq= fridgeApp.mediaCheck();
        if(!mq.matches){
            if (item.images.length == 0) {
                    return "<img src='http://atrium.ipet.gr/atrium_catalogue/images/large_noImage.gif' alt='No picture' width=600 height=450>";
            } else if (item.images.length == 1) {
                    return "<img src=http://res.cloudinary.com/hllzrkglg/image/upload/"+item.images[0]+".jpg alt='No picture' width=600>";
            } else if (item.images.length == 2) {
                    return ""+
                    "<ol class='carousel-indicators'>"+
                                    "<li data-target='#carousel-example-generic' data-slide-to=0 class='active'></li>"+
                                    "<li data-target='#carousel-example-generic' data-slide-to=1></li>"+
                            "</ol>"+
                            "<div class='carousel-inner'>"+
                                    "<div class='item active'>"+
                                            "<img src=http://res.cloudinary.com/hllzrkglg/image/upload/"+item.images[0]+".jpg alt='No picture' width=600>"+
                                    "</div>"+
                                    "<div class='item'>"+
                                            "<img src=http://res.cloudinary.com/hllzrkglg/image/upload/"+item.images[1]+".jpg alt='No picture' width=600>"+
                                    "</div>"+
                            "</div>";
            } else { //item.images.length == 3
                    return ""+
                    "<ol class='carousel-indicators'>"+
                                    "<li data-target='#carousel-example-generic' data-slide-to=0 class='active'></li>"+
                                    "<li data-target='#carousel-example-generic' data-slide-to=1></li>"+
                                    "<li data-target='#carousel-example-generic' data-slide-to=2></li>"+
                            "</ol>"+
                            "<div class='carousel-inner'>"+
                                    "<div class='item active'>"+
                                            "<img src=http://res.cloudinary.com/hllzrkglg/image/upload/"+item.images[0]+".jpg alt='No picture' width=600>"+
                                    "</div>"+ 
                                    "<div class='item'>"+
                                            "<img src=http://res.cloudinary.com/hllzrkglg/image/upload/"+item.images[1]+".jpg alt='No picture' width=600>"+
                                    "</div>"+
                                    "<div class='item'>"+
                                            "<img src=http://res.cloudinary.com/hllzrkglg/image/upload/"+item.images[2]+".jpg alt='No picture' width=600>"+
                                    "</div>"+
                            "</div>";
            }
        }else if(mq.matches){
            if(item.images.length != 0){
                images ="";
                for(i=0; i< item.images.length; i++){
                    images += showImage(item, i);
                }
                return images;
            }else{
                return "<p> No Images Available </p>"
            }
        }
    }
//      <div class="col-xs-6 col-md-3">
//     <a href="#" class="thumbnail">
//       <img data-src="holder.js/100%x180" alt="...">
//     </a>
    function showImage(item, i){
        return "<div class='border thumbnail'><a href http://res.cloudinary.com/hllzrkglg/image/upload/"+item.images[i]+".jpg>"+
            "<img src=http://res.cloudinary.com/hllzrkglg/image/upload/"+item.images[i]+".jpg alt='No picture' class='img-responsive'>"+
            "</a></div>"
    }
    
    function headingText(item) {
        var row =
        "<label>" + item.category + " -> " + item.subcategory + "</label>";
        return row;
    }
    
    function statusText(item) {
        var s;
        if (item.status){
            s="SOLD";
        } else {
            s="UNSOLD";
        }
        var row=
        "<h4 class='list-group-item-heading pos border'><label>Status: <span class='font'>" + s + "</span></label></h4>";
		
        return row;
    }

    
    function sellText(item, myList) {
        var sellBy = new Date(item.sellBy);
        var temp = sellBy.toString();
        var date = temp.slice(0, 15);
        var user = myList.searchByUserId(item.seller);
        var username = user.name;
        var row =
        "<h4 class='list-group-item-heading pos border'><label>Sell by: <span class='font'>"+date+"</span></label></h4>"+
		"<h4 class='list-group-item-heading pos border'><label>Seller: <span class='font'>" + username + "</span><label></h4>";
        return row;
    }
    
    //Displays all images for the item
    function displayImages(images){
            var imgs = "";
            for (var i = 0; i < images.length; i++) {
                    imgs += "<img src=http://res.cloudinary.com/hllzrkglg/image/upload/"+images[i]+".jpg alt='No picture' width=100>"
            }
            return imgs;
    }
    
    //Displays a single image of the item
    function displayImage(images){
            var img = "";
            if(images.length != 0){
                img += "<img class='img-responsive col-sm-3 col-md-3' src='http://res.cloudinary.com/hllzrkglg/image/upload/"+images[0]+".jpg' alt='No Image' id='homeimg'/>";
            }else{
                img += "<img class='img-responsive col-sm-3 col-md-3' src='http://www.martyranodes.com/sites/default/files/images/kits/no_0.jpg' alt='No Image'  width=100 height=100/>";
            }
            return img;
    }
    
    // redraw the table using the current model users~~~~
    function refreshTableUsers(myUsers){    
        var rows = "";
        var len = myUsers.length;

        for(var n=0; n<len; n++){ 
            var user = myUsers[n];
            rows = rows + usersToRow(user);
        }

        var itemTableBody = $("#itemTableBodyUsers").html(rows);

    }

    // convert an item into an HTML tr element
    function usersToRow(user){
        var row = 
        "<tr><td>"+ user.name+
        "</td><td>"+ user.phone+
        "</td><td>"+ user.email+
        "</td></tr>";
        return row;
    }
    function refreshMessages(newMessages){
		var mTable="";
		console.log("New Messages: " + newMessages.length);
		for (var i = 0 ;i < newMessages.length; i++) {
			var m = newMessages[i];
			var mRow = messageToRow(m);
			mTable  += mRow;
			console.log("I =" + i);
		}
		console.log("TABLE: " + mTable);
		$("#messageTable").html(mTable);
    }
    
    function messageToRow(m) {
        user = fridgeApp.findUser(m.user);
		return "<tr class='color'><td>"+ user.email + "</td><td>" + m.date + "</td><td>"+m.text+"</td><td><span sid='"+user.id+"' onclick='fridgeView.replyMessage(this)'><button type='button' class='btn btn-default '>Reply</button></span><span id='"+user.id+"'><span></td><td><button type='checkbox' onclick='fridgeView.markRead(this)'><span class='glyphicon glyphicon-envelope'></span></button></td></tr>";
    }
    function replyMessage(element) {
    	$(element).html("");
    	$("#" +element.getAttribute('sid')).html("<textarea class='form-control' placeholder='What is your reply?' id='"+ element.getAttribute('sid')+"' value=''></textarea>"+
    	"<button type='submit' class='color7' id='submission' sid='"+element.getAttribute('sid')+"' onclick='fridgeApp.submitMessage(this)'>"+
    	"Submit</button>");
   	}
    function markRead(element){
		if(! $(element).checked)
			$(element).html("<span class='glyphicon glyphicon-ok'></span>");    
		else if ($(element).checked)
			$(element).html("<span class='glyphicon glyphicon-envelope'></span>");   
    }
    
    fridgeView={
        refreshView: refreshView,
        refreshProfile: refreshProfile,
        refreshNestTable: refreshNestTable,
        refreshSellingTable: refreshSellingTable,
        filterMainCategory: filterMainCategory,
        filterSubCategory: filterSubCategory, 
        updateCategoryOptions: updateCategoryOptions,
        refreshItemItems:refreshItemItems,
        displayImage: displayImage,
        messageBox: messageBox,
        refreshMessages: refreshMessages,
        markRead:markRead,
        replyMessage: replyMessage
    };
    
    return(fridgeView);
    
}(jQuery));

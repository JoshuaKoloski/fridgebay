/**
 The shoppingView is responsible for updating all of the HTML
 It is called by the shoppingApp only and the only thing it calls is jQuery
**/

var fridgeView = (function($){
    
    function refreshView(myData){    	
        refreshTableItems(myData.items);
        refreshTableUsers(myData.users);
    }
    
    function refresh(myData, category) {
        filterCategory(myData.items, category);
    }
        
    function updateCategoryOptions(){
    	
    	var furniture = {
    		table : "Table",
    		chair : "Chair",
    		shelves : "Shelves",
    		bookcase : "Bookcase",
    		drawer : "Drawer",
    		other : "Other"
    	};
    	
    	var appliances = {
    		fridge : "Fridge",
    		microwave : "Microwave",
    		oven : "Oven",
    		coffee_maker : "Coffee Maker",
    		other : "Other"
    	};
    	
    	var vehicles = {
    		bike : "Bike",
    		car : "Car",
    		motorcycle : "Motocycle",
    		boat : "Boat",
    		other : "Other"
    	};
    	
    	var electronics = {
    		computer : "Computer",
    		tv : "TV",
    		media_player : "Media Player",
    		phone : "Phone",
    		charger : "Charger",
    		gaming_system : "Gaming System",
    		other : "Other"
    	};
    	
    	var cutlery = {
    		dishes : "Dishes",
    		blender : "Blender",
    		mixer : "Mixer",
    		other : "Other"
    	};
    	
    	var supplies = {
    		scissors : "Scissors",
    		pen_pencil : "Pen/Pencil",
    		notebook : "Notebook",
    		binder : "Binder",
    		folder : "Folder",
    		other : "Other"
    	};
    	
    	var books = {
    		sciences : "Sciences",
    		arts : "Arts",
    		math : "Math",
    		novel : "Novel",
    		other : "Other"
    		
    	};
    	
    	var clothes = {
    		shoes : "Shoes",
    		shirts : "Shirt",
    		pants : "Pants",
    		other : "Other"
    	};
    	
    	var bed = {
    		sheet : "Sheet",
    		pillowcase : "Pillowcase",
    		padding : "Padding",
    		other : "Other"
    	};
		
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
    }
    
    
    // redraw the table using the current model
    function refreshTableItems(myItems){    
        var rows = "";
        var rowsHome = "";
        var itemsArr = [];
        var len = myItems.length;
        var filteredModelItems = filterModelItems(myItems);
        var filteredHomeItems = filterHomeItems(myItems);
        //console.log("filteredItems = " + JSON.stringify(filteredModelItems));
        //console.log("filteredItems = " + JSON.stringify(filteredHomeItems));
        for(var n=0; n<filteredModelItems.length; n++){ 
            var item = filteredModelItems[n];
            rows = rows + itemToRow(item);
        }
        console.log("model length= " + filteredHomeItems.length);
        for (var n = 0; n < filteredHomeItems.length; n++) {
            var item = filteredHomeItems[n];
            itemsArr.push(item);
            console.log("item = " + JSON.stringify(item));
            rowsHome = rowsHome + homeItemToRow(item);
        }
        
        var itemTableBody = $("#itemTableBodyItems").html(rows);
        var itemTablebody = $("#homeTableBody").html(rowsHome);
        
        showNumber(len);

    }


    function refreshItemItems(id, myList) {
        var list = myList.items;
        console.log("myList[1]= " + JSON.stringify(list[1]));
        var element;
        for (var i = 0; i < list.length; i++) {
            
            if (list[i]._id == id) {
                element = list[i];
            }
        }
        
        fridgeApp.showView('item');

        var rowsItem = "";
        var heading = "";
        var status = "";
        var sell = "";

        rowsItem = rowsItem + itemItemToRow(element);
        heading = heading + headingText(element);
        status = status + statusText(element);
        sell = sell + sellText(element);

        var itemTableBody = $("#tableBody").html(rowsItem);
        var itemHeader = $("#panel_heading").html(heading);
        var itemStatus= $("#status").html(status);
        var itemSell = $("#sell_by").html(sell);
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
        console.log(name);
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
    function filterCategory(items, category) {
        var n;
        var item;
        var newItems = [];
        for (n = 0; n < items.length; n++) {
            item = items[n];
            console.log("category= " + item.subcategory);
            if (item.subcategory.match(category)) {
                newItems.push(item);
            }
        }
        refreshTableItems(newItems);
    }

    function filterHomeItems(items) {
        var n;
        var item;
        var newItems = [];
        var price = $("#priceCutoffHome").val() || 0;
        var name = $("#nameCutoffHome").val();
        var university = $("#schoolCutoffHome").val();
        

        for (n = 0; n < items.length; n++) {
            item = items[n];
            if (item.price <= price || price==0) {
                if ((item.name).match((name))) {
                    if ((item.university).match((university))) {
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
        "</td><td>"+ item.sellBy+
        "</td><td>"+ item.condition+
        "</td><td>"+ item.category+
        "</td><td>"+ item.subcategory+
        "</td><td>"+ displayImages(item.images) +
        "</td><td>"+ item.description +
        "</td><td>"+ item.status+
        "</td><td>"+ item.interested+
        "</td><td>" + "<button class='btn btn-default' type='button' sid='" + item._id + "' onclick='fridgeApp.deleteItem(this)'>Delete</button>" +
        "</td></tr>";
        return row;
    }
    
    //converts item into html on home table
    function homeItemToRow(item) {
        var row=
        "<tr id='tableRow'class='changeImageColor' sid'"+item._id+" 'onclick='fridgeApp.pass(this)'><td><label>" + 
        "</label></td><td><label>" + item.name +
        "</label></td><td><label>" + item.price +
        "</label></td><td><label>" + item.university +
        "</label></td><td><label>" + item.condition +
        "</label></td><td>"+"<button class='dark_brown' type='button' sid='" + item._id + "' onclick='fridgeApp.pass(this)'>View</button><label>" + 
        "</label></td></tr>";
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
        "<tr><td><label>Description</label></td><td><label>" + item.description + "</label></td></tr>";
        return row;
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
        "<h4 class='list-group-item-heading pos'><label>Status: " +s+"</label></h4>";
		
        return row;
    }
    
    function sellText(item) {
        var row =
        "<h4 class='list-group-item-heading pos'><label>Sell by "+item.sellBy+"</label></h4>"+
		"<p class='list-group-item-text pos'><label>Seller is "+item.seller+"</p><label>";
        return row;
    }
    
  	function displayImages(images){
  		var imgs = "";
  		for (var i = 0; i < images.length; i++) {
			imgs += "<img src=http://res.cloudinary.com/hllzrkglg/image/upload/"+images[i]+".jpg width=100>"
		}
		return imgs;
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
    
    fridgeView={
        refreshView: refreshView,
        refresh: refresh,
        updateCategoryOptions: updateCategoryOptions,
        refreshItemItems:refreshItemItems

    };
    
    return(fridgeView);
    
}(jQuery));

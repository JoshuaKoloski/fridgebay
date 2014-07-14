/**
 The shoppingView is responsible for updating all of the HTML
 It is called by the shoppingApp only and the only thing it calls is jQuery
**/

var fridgeView = (function($){
    
    function refreshView(myData){    	
        refreshTableItems(myData.items);
        refreshTableUsers(myData.users);
    }
    
    // redraw the table using the current model
    function refreshTableItems(myItems){    
        var rows = "";
        var len = myItems.length;
        var filteredItems = filterItems(myItems);
        console.log("filteredItems = "+ JSON.stringify(filteredItems));
        for(var n=0; n<filteredItems.length; n++){ 
            var item = filteredItems[n];
            rows = rows + itemToRow(item);
        }

        var itemTableBody = $("#itemTableBodyItems").html(rows);

    }

    function filterItems(items) {
        var n;
        var item;
        var newItems = [];
        var price = $("#priceCutoff").val() || 0;
        var name = $("#nameCutoff").val();
        for (n = 0; n < items.length; n++) {
            item = items[n];
            if (item.price >= price) {
                if ((item.name).match((name))) {
                    newItems.push(item);
                }
            }
            return newItems;
        }
    }

    // convert an item into an HTML tr element
    function itemToRow(item){
        var row = 
        "<tr><td>"+ item.name+
        "</td><td>"+ item.price+
        "</td><td>"+ item.catagory+
        "</td><td>"+ item.quantity+
        "</td><td>"+ item.location+
        "</td><td>"+ item.seller+
        "</td><td>" + item.sell_by+
        "</td><td>" + item.university +
        "</td></tr>";
        return row;
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
        refreshView: refreshView
    };
    
    return(fridgeView);
    
}(jQuery));

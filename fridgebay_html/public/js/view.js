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
        
        for(var n=0; n<len; n++){ 
            var item = myItems[n];
            rows = rows + itemToRow(item);
        }

        var itemTableBody = $("#itemTableBodyItems").html(rows);

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
        "</td><td>"+ item.sell_by+
        "</td></tr>";
        return row;
    }
    
    
        
    // redraw the table using the current model users~~~~
    function refreshTableUsers(myUsers){    
        var rows = "";
        var len = myUsers.length;

        for(var n=0; n<len; n++){ 
            var user = myUsers[n];
            rows = rows + usersToRow(item);
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
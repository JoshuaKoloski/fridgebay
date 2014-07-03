/**
 The shoppingView is responsible for updating all of the HTML
 It is called by the shoppingApp only and the only thing it calls is jQuery
**/

var shoppingView = (function($){
    
    function refreshView(myData){    	
        refreshTableItems(myData.items);
        refreshTableUsers(myData.users);
    }
    
    // updates the title with the user's name
    function updateTitle(user){
        var newTitle = user + "'s Super Shopping List";
        $("#title").html(newTitle);
    }
    
    function updateTotalPrice(myData){
        var numPurchases = myData.items.filter(function(x){return x.purchased;}).length;
        var totalText = "There total cost of the "+numPurchases+" purchased items is "+ myData.totalPrice();
        $("#totalprice").html(totalText);
    }
    
    function sortItems(items){
        var sortedItems = items.slice();  // make a copy of items
        sortedItems.sort(function(a,b){ return(a.action > b.action)});
        return sortedItems;
    }
    
    function filterItems(items){
        var n;
        var item;
        var newItems=[];
        var showComplete = $("#showCompleteCheckbox").prop("checked");
        var cutoff = $("#cutOffText").val() || 0;
        var wasPurchased;

        for(n=0; n<items.length; n++){
            item = items[n]
            wasPurchased = item.purchased || false;
            if (!wasPurchased ||  showComplete){
                if (item.quantity >= cutoff){
                    newItems.push(item);
                }
            }
        }
        return newItems;
    }
    
    
    // redraw the table using the current model
    function refreshTableItems(myItems){    
                var rows = "";
                var len = myItems.length;
                
                for(var n=0; n<len; n++){ 
                    var item = myItems[n];
                    rows = rows + itemToRowItems(item);
                }

                var itemTableBody = $("#itemTableBodyItems").html(rows);

    }

    // convert an item into an HTML tr element
    function itemToRowItems(item){
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
    function refreshTableUsers(myItems){    
                var rows = "";
                var len = myItems.length;
                
                for(var n=0; n<len; n++){ 
                    var item = myItems[n];
                    rows = rows + itemToRowUsers(item);
                }

                var itemTableBody = $("#itemTableBodyUsers").html(rows);

    }

    // convert an item into an HTML tr element
    function itemToRowUsers(item){
        var row = 
        "<tr><td>"+ item.name+
        "</td><td>"+ item.phone+
        "</td><td>"+ item.email+
        "</td></tr>";
        return row;
    }

    
    function editted(item) {
        if(item.edit) return "checked";
        else return "";
    }
    
    function purchased(item) {
        if(item.purchased) return "checked";
        else return "";
    }
    
    shoppingView={
        refreshView: refreshView
    };
    
    return(shoppingView);
    
}(jQuery));
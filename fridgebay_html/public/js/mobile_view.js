
var mobileFridgeView = (function($){
    
    function refreshView(myData){           
        refreshItemsHome(myData.items);
    }
    
    function header(text){
        var head = "<div data-role='panel' id ='menu'>" +
            "<ul data-role='listview'>" +
                "<li><a href='#home'>Homepage</a></li>" +
                "<li> Login </li>" +
                "<li> About </li>" +
                "<li> Help </li>" +
                "<li><a href='#contact'>Contact Us</a></li>"+
            "</ul>" +
        "</div>" +
        "<div data-role='header' id='head'>" +
            "<a href='#menu' data-icon='grid'>Menu</a>" +
            "<h1>" + text + "</h1>" +
        "</div>";
        $("#header").html(head);
    }
    var cat =[
        ["furniture", "table", "chair", "bookCase", "shelves", "drawer", "f_other"],
        ["appliances", "fridge", "microwave", "oven", "coffee_maker", "a_other"],
        ["vehicles","bike","car","motorcycle","boat","v_other"],
        ["electronics","computer","tv","media_player","phone","charger", "gaming_systems", "e_other"],
        ["cutlery", "dishes", "blender", "mixer", "c_other"]
    ];
//Tap events for the homepage
    $(document).on("pagecreate","#home",function(){
        $("#showAll").bind( "tap", function(){
            mobileFridgeApp.refresh();
            closePanel("categories");
        });  
        for(n = 0; n < cat.length; n++){
            iterateSubs(cat[n]);
        }
    });
//Iterates an array of categories and creates tap events for them 
    function iterateSubs(array){
        for(i = 0; i < array.length; i++){
            createTap(array[i])
        }
    }
//Creates a tap event for a certain id (Make sure to run it inside of the correct page)
    function createTap(id){
        return $("#"+ id).bind("tap",function(){
            mobileFridgeApp.filterCategory(id);
        });
    }
//closes panel by id
    function closePanel(id){
        $( "#" + id).panel( "close" );
    }
//Current Bugs: Filtering Categories by different Others doesn't work
    function filterCategory(myItems, category){
        var newItems = [];
        console.log("filtering category= " + category);
        for (var n = 0; n < myItems.length; n++) {
            var item = myItems[n];
            if(!category.match("other")){
                if (item.category.match(category)) {
                    newItems.push(item);
                }else if(item.subcategory.match(category)){
                    newItems.push(item);
                }
            }else{
                console.log("Other detected: Searching...")
                if(category.match("f_other")){
                    if(item.subcategory.match("otherFurniture")){
                        newItems.push(item);
                    }
                }else if(category.match("a_other")){
                    if(item.subcategory.match("otherAppliance")){
                        newItems.push(item);
                    }
                }else if(category.match("v_other")){
                    if(item.subcategory.match("otherVehicles")){
                        newItems.push(item);
                    }
                }else if(category.match("e_other")){
                    if(item.subcategory.match("otherElectronics")){
                        newItems.push(item);
                    }
                }
            }
        }
        refreshItemsHome(newItems);
        closePanel("categories");
    }
    
    function refreshItemsHome(myItems){
        var rows ="";
        var len = myItems.length;
        for(var n = len-1; n >= 0; n--){
            item = myItems[n];
            var row = itemToRow(item);
            rows += row + "\n";
        }
        $("#itemView").html(rows);
        $("#itemView").listview("refresh");
    }
    
    
    function itemToRow(item){
        var row ="<li>" + fridgeView.displayImage(item.images) +
            "<h1>"+ item.name +" </h1> "+
            " <p> $" + item.price +" </p> " +
            " <p>" +item.condition+ " </p> " +
            "<p> University: " + item.university +"</p> " +
            "</li>"
        return row;  
    }
    
    mobileFridgeView={
        header: header,
        refreshItemsHome: refreshItemsHome,
        refreshView: refreshView,
        filterCategory: filterCategory
    };
    
    return(mobileFridgeView);
    
}(jQuery));

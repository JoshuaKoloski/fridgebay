
var mobileFridgeApp = (function($) {


    // first create the model
    var myList = new Information();
    
    function loadHeader(text){
        mobileFridgeView.header(text);
    }
    
    function refresh(){
        console.log("Refreshing Home Page");
        mobileFridgeView.refreshItemsHome(myList.items);
    }
    
    function filterCategory(category){
        alert("Filtering for Selected Category");
        mobileFridgeView.filterCategory(myList.items, category);
    }
    
    function start() {
        myList.loadModel();
        console.log("Model Loaded")
//         loadHeader("FridgeBay");;
        
    }
    
    
    // here is were we decide what is visible to the outside!
    mobileFridgeApp = {
        start: start,
        loadHeader: loadHeader,
        refresh: refresh,
        filterCategory: filterCategory
    };

    return (mobileFridgeApp);

}(jQuery));
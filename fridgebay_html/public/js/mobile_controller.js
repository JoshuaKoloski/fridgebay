
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
    function start() {
        myList.loadModel();
        console.log("Model Loaded")
//         loadHeader("FridgeBay");;
        
    }
  
    // here is were we decide what is visible to the outside!
    mobileFridgeApp = {
        start: start,
        loadHeader: loadHeader,
        refresh: refresh
    };

    return (mobileFridgeApp);

}(jQuery));
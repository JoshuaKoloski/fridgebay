
var mobileFridgeApp = (function($) {


    // first create the model
    var myList = new Information();
    
    function loadHeader(text){
        mobileFridgeView.header(text);
    }
    
    function refresh(){
        mobileFridgeView.refreshItemsHome(myList.items);
    }
    function start() {
        myList.loadModel();
        loadHeader("FridgeBay");
        refresh();
    }
  
    // here is were we decide what is visible to the outside!
    mobileFridgeApp = {
        start: start,
        loadHeader: loadHeader,
        
    };

    return (mobileFridgeApp);

}(jQuery));
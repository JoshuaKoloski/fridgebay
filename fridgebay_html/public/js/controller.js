/**
 demo.js
 This provides the model and controller for the shopping list app!
 It is written entirely in JavaScript with no use of AngularJS
 but it does just jQuery to handle the ajax calls in a browser independent manner...
 and it uses jQuery to access and modify the HTML file index.html
 
 VERSION 1.0.1 -- here is where we start adding some functionality
 **/

var fridgeApp = (function($) {


    // first create the model
    var myList = new Information();
    
    var showView = function(selected) {
      window.location.hash = '#' + selected;
      $('.view').hide().filter('#' + selected + '-view').show();
    };

    function addItem(element) {
        var element = document.getElementById("newItemName");

        console.log("new item " + element.value);
        myList.addElement({
            action: element.value,
            price: 0,
            quantity: 0
        });
        element.value="";
    }
    

    function refreshView(){
        fridgeView.refreshView(myList);
    }

    function reloadModel(){
        myList.loadModel();
        refreshView();
    }
    
    function initEventListeners(){
        $(window).on('hashchange', function(event){
          var view = (window.location.hash || '').replace(/^#/, '');
          if ($('#' + view + '-view').length) {
            showView(view);
          }
        });
    }

    function start() {
        myList.loadModel();
        showView("welcome");
    }

    // here is were we decide what is visible to the outside!
    shoppingApp = {
        start: start,
        refreshView: refreshView,
        reloadModel: reloadModel,
        showView: showView
    }

    return (shoppingApp);

}(jQuery));




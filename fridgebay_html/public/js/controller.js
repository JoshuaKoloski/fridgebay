
var fridgeApp = (function($) {


    // first create the model
    var myList = new Information();
    
    var showView = function (selected) {
        console.log("VIEW IS SHOWN");
      window.location.hash = '#' + selected;
      $('.view').hide().filter('#' + selected + '-view').show();
    };
    
    function showAlert() {
        console.log("clicked");
        alert("You have 2 new messages");
    }
    function showHelp() {
        console.log("clicked");
        alert("If you want to make a new post, click 'New Post'\nIf you want to buy an item, search through the list of items and sort by categories.");
    }
    function verifySubmission(){
        showView("home");
        alert("Your Message has been submitted");
    }
    

    $(function () {
        $('#notify').popover(
        {
            trigger: 'hover',
            html: true,

            content: 'you have 1 new notification',           
        });
    });
    
    function refreshView() {
        fridgeView.refreshView(myList);
    }
    
    function refresh(category) {
        fridgeView.refresh(myList, category);
    }

    function reloadModel(){
        myList.loadModel();
        refreshView();
    }

    function pass(element) {
        console.log("element= " + element.getAttribute("sid"));
        fridgeView.refreshItemItems(element.getAttribute("sid"), myList);   
    }
    
    function deleteItem(element){
        var c = confirm("Are you sure you want to delete this item?")
        if (c) {
            console.log("CTRL Activated: Deleting item with id " + element.getAttribute("sid"));
            myList.deleteElement(element.getAttribute("sid"));
        } else {
            console.log("delete canceled");
        }
        reloadModel();
    }
    
    function encodeImageFileAsURL(divNum){

		var filesSelected = document.getElementById("inputFileToLoad_"+divNum).files;
		if (filesSelected.length > 0)
		{
			var fileToLoad = filesSelected[0];

			var fileReader = new FileReader();

			fileReader.onload = function(fileLoadedEvent) {
				var srcData = fileLoadedEvent.target.result; // <--- data: base64

				var newImage = document.createElement('img');
				newImage.src = srcData;
				if(newImage.width > newImage.height) { 
					newImage.width = 250;
				} else {
					newImage.height = 250;
				}

				document.getElementById("img_"+divNum).innerHTML = newImage.outerHTML;
				console.log("Converted Base64 version is "+document.getElementById("img_"+divNum).innerHTML);
			}
			fileReader.readAsDataURL(fileToLoad);
		}
	}
    
    function initEventListeners(){
        $(window).on('hashchange', function(event){
          var view = (window.location.hash || '').replace(/^#/, '');
          if ($('#' + view + '-view').length) {
            showView(view);
          }
        });
    }

	function getUser(){
		return myList.currentUser;
	}

    function start() {
        myList.loadModel();
        showView('home');
    }
  
    // here is were we decide what is visible to the outside!
    fridgeApp = {
        start: start,
        getUser: getUser,
        refresh: refresh,
        encodeImageFileAsURL: encodeImageFileAsURL,
        showAlert: showAlert,
        encodeImageFileAsURL: encodeImageFileAsURL,
        showHelp: showHelp,
        verifySubmission: verifySubmission,
        refreshView: refreshView,
        reloadModel: reloadModel,
        showView: showView,
        pass:pass,
        deleteItem: deleteItem
    }

    return (fridgeApp);

}(jQuery));




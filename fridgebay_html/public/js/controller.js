
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
    
    function filterMainCategory(maincategory) {
        fridgeView.filterMainCategory(myList, maincategory);
    }
    
    function filterSubCategory(subcategory) {
        fridgeView.filterSubCategory(myList, subcategory);
    }

    function reloadModel(){
        myList.loadModel();
        refreshView();
    }
    function addItem() {
    	
    	var imageArray = [];
    	
    	for (i = 0; i < 3; i++){
    		if (document.getElementById("img_"+i).innerHTML != ""){
    			imageArray[imageArray.length] = document.getElementById("img_"+i).innerHTML;
    			console.log("true");
    		} else {
    			console.log("false");
    		}

    	}
    	console.log("images = "+ imageArray);
    	
        myList.addElement({
            seller: myList.currentUser,
            images: imageArray,
            category: $("#itemMainCategory").val(),
            subcategory: $("#itemSubCategory").val(),
            name: $("#itemName").val(),
            price: $("#itemPrice").val(),
            quantity: $("#itemQuantity").val(),
            condition: $("#itemCondition").val(),
            sellBy: $("#itemSellBy").val(),
            university: $("#itemUniversity").val(),
            location: $("#itemLocation").val(),
            description: $("#itemDesc").val() 
        });
    }

    //loads edit page for an item
    function loadEdit(element){
        console.log("Loading Edit Page");
        id = element.getAttribute("sid");
        item = myList.searchById(id);
        document.getElementById("#editMainCategory").innerHTML = item.category;
        document.getElementById("#editSubCategory")= item.subCategory;
        document.getElementById("#editName") = item.name;
        document.getElementById("#editPrice") = item.price;
        document.getElementById("#editQuantity") = item.quantity;
        document.getElementById("#editCondition")= item.condition;
        document.getElementById("#ediSellBy") = item.sellBy;
        document.getElementById("#editUniversity") = item.university;
        document.getElementById("#editLocation") = item.location;
        document.getElementById("#editDesc") = item.description;
        showView("edit");
    }
    function updateItem(element){
        console.log("CTRL Activated: Updating item with id " + element.getAttribute("sid"));
        loadEdit(element);
        myList.updateElement({
            images: imageArray,
            category: $("#editMainCategory").val(),
            subcategory: $("#editSubCategory").val(),
            name: $("#editName").val(),
            price: $("#editPrice").val(),
            quantity: $("#editQuantity").val(),
            condition: $("#editCondition").val(),
            sellBy: $("#editSellBy").val(),
            university: $("#editUniversity").val(),
            location: $("#editLocation").val(),
            description: $("#editDesc").val() 
        });
        reloadModel();
    }
    
    function imageTextAlign(){
        $(document).ready(function(){
            var coordinates = $("#nestImage").offset();
            console.log("Image Coordinates:{Top: "+ coordinates.top + ", Left: " + coordinates.left + "} ");
            coordinates.top += 17;
            coordinates.left += 65;
            console.log("Text Coordinates:{Top: "+ coordinates.top + ", Left: " + coordinates.left + "} ");
            $("#showNumber").offset({top: coordinates.top, left: coordinates.left});
        });
    }
    
    function pass(element) {
        console.log("element= " + element.getAttribute("sid"));
        fridgeView.refreshItemItems(element.getAttribute("sid"), myList);   
    }
    
    function passById(id) {
        console.log("element= " + id);
        fridgeView.refreshItemItems(id, myList);   
    }
        
    function bringToTop() {
    	$("body, html").animate({ 
            scrollTop: 0
        }, 600);
    }
       
    function deleteItem(element){
        var c = confirm("Are you sure you want to delete this item?")
        if (c) {
            console.log("CTRL Activated: Deleting item with id " + element.getAttribute("sid"));
            myList.deleteElement(element.getAttribute("sid"));
        } else {
            console.log("delete canceled");
        }
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
	
	function searchById(id){
		return myList.searchById(id);
	}
	
    function start() {
        myList.loadModel();
        showView('home');
        imageTextAlign();
        fridgeSpeech.enableSpeech("speech loaded");
        bringToTop();
    }
    
    // here is were we decide what is visible to the outside!
    fridgeApp = {
        start: start,
        getUser: getUser,
        filterMainCategory: filterMainCategory,
        filterSubCategory: filterSubCategory,
        encodeImageFileAsURL: encodeImageFileAsURL,
        showAlert: showAlert,
        encodeImageFileAsURL: encodeImageFileAsURL,
        showHelp: showHelp,
        verifySubmission: verifySubmission,
        refreshView: refreshView,
        reloadModel: reloadModel,
        showView: showView,
        deleteItem: deleteItem,
        updateItem: updateItem,
        pass: pass,
        passById: passById,
        getUser: getUser,
        searchById: searchById,
        deleteItem: deleteItem,
        imageTextAlign: imageTextAlign,
    }

    return (fridgeApp);

}(jQuery));




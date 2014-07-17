
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
        id = element.getAttribute("sid");
        item = myList.searchById(id);
        $("#editMainCategory") = item.category;
        $("#editSubCategory")= item.subCategory;
        $("#editName") = item.name;
        $("#editPrice") = item.price;
        $("#editQuantity") = item.quantity;
        $("#editCondition")= item.condition;
        $("#ediSellBy") = item.sellBy;
        $("#editUniversity") = item.university;
        $("#editLocation") = item.location;
        $("#editDesc") = item.description;
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
            sellBy: $("#ediSellBy").val(),
            university: $("#editUniversity").val(),
            location: $("#editLocation").val(),
            description: $("#editDesc").val() 
        });
        reloadModel();
    function pass(element) {
        console.log("element= " + element.getAttribute("sid"));
        fridgeView.refreshItemItems(element.getAttribute("sid"), myList);
    }
    function deleteItem(element){
        myList.deleteElement(element.getAttribute("sid"));
        reloadModel();
        alert("Item was successfully deleted");
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

    function start() {
        myList.loadModel();
        showView("welcome");
    }
  
    // here is were we decide what is visible to the outside!
    fridgeApp = {
        start: start,
        refresh: refresh,
        addItem: addItem,
        encodeImageFileAsURL: encodeImageFileAsURL,
        showAlert: showAlert,
        showHelp: showHelp,
        verifySubmission: verifySubmission,
        refreshView: refreshView,
        reloadModel: reloadModel,
        showView: showView,
<<<<<<< HEAD
        deleteItem: deleteItem,
        updateItem: updateItem
=======
        pass:pass,
        deleteItem: deleteItem
>>>>>>> 6d4d26f410c230859334b0da0a2668d402b8218d
    }

    return (fridgeApp);

}(jQuery));




var fridgeApp = (function ($) {


    // first create the model
    var myList = new Information();
    //Checks if browser was opened on a laptop or phone
    var mediaCheck = function () {
        var mq = window.matchMedia("(max-width: 500px)");
        return mq;
    }

    var showView = function (selected) {
        console.log("VIEW IS SHOWN");
        window.location.hash = '#' + selected;
        $('.view').hide().filter('#' + selected + '-view').show();
    };

    var setView = function () {
        var v = window.location.hash.substring(1);
        if (v == "")
            v = "home";
        showView(v);
    }

    function showAlert() {
        console.log("clicked");
        alert("You have 2 new messages");
    }
    function showHelp() {
        console.log("clicked");
        alert("If you want to make a new post, click 'New Post'\nIf you want to buy an item, search through the list of items and sort by categories.");
    }
    function verifySubmission() {
        showView("home");
        alert("Your Message has been submitted");
    }

    function accessLogoutPage() {
        window.location = 'auth/logout';
    }
    function accessLoginPage() {
        window.location = 'auth/google/'
    }
    function refreshNestTable() {
        fridgeView.refreshNestTable(getUser().interestList);
        $("#showNestNumber").html(getUser().interestList.length);
        $("#dropdown_button").text("Interested In");
    }

    function refreshSellingTable() {
        fridgeView.refreshNestTable(getUser().sellingList);
        $("#showNestNumber").html(getUser().sellingList.length);
        $("#dropdown_button").text("Selling");
    }
    function showViewProfile() {
        showView('profile');
        refreshProfile();
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

    function reloadModel() {
        myList.loadModel();
        refreshView();
    }

    function addItem() {

        var imageArray = [];

        for (i = 0; i < 3; i++) {
            if (document.getElementById("img_" + i).innerHTML != "") {
                imageArray[imageArray.length] = document.getElementById("img_" + i).innerHTML;
                console.log("true");
            } else {
                console.log("false");
            }

        }
        console.log("images = " + imageArray);

        var el = myList.addElement({
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

        alert("el: " + JSON.stringify(el));
        //getUser().sellingList.push()
    }

    //loads edit page for an item
    function loadEdit(element) {
        var id = element.getAttribute("sid");
        var item = myList.searchById(id);
        $("#submission").attr("sid", id);
        document.getElementById("editMainCategory").value = item.category;
        $(document).ready(fridgeView.updateCategoryOptions('edit'));
        document.getElementById("editSubCategory").value = item.subcategory;
        document.getElementById("editName").value = item.name;
        document.getElementById("editPrice").value = item.price;
        document.getElementById("editQuantity").value = item.quantity;
        document.getElementById("editCondition").value = item.condition;
        document.getElementById("editSellBy").value = item.sellBy;
        document.getElementById("editUniversity").value = item.university;
        document.getElementById("editLocation").value = item.location;
        document.getElementById("editDesc").innerHTML = item.description;
        showView("edit");
    }
    function updateItem(element) {
        var item = {
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
        };
        myList.updateElement(element.getAttribute("sid"), item);
        reloadModel();
        showView("home");
        alert("Item has been successfully edited.")
    }

    function imageTextAlign() {
        $(document).ready(function () {
            var coordinates = $("#nestImage").offset();
            console.log("Image Coordinates:{Top: " + coordinates.top + ", Left: " + coordinates.left + "} ");
            coordinates.top += 17;
            coordinates.left += 65;
            console.log("Text Coordinates:{Top: " + coordinates.top + ", Left: " + coordinates.left + "} ");
            $("#showNumber").offset({ top: coordinates.top, left: coordinates.left });
        });
    }

    function pass(element) {
        console.log("element= " + element.getAttribute("sid"));
        fridgeView.refreshItemItems(element.getAttribute("sid"), myList);
        // return myList.searchById(element.getAttribute("sid"));
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

    function deleteItem(element) {
        var c = confirm("Are you sure you want to delete this item?")
        if (c) {
            console.log("CTRL Activated: Deleting item with id " + element.getAttribute("sid"));
            myList.deleteElement(element.getAttribute("sid"));
        } else {
            console.log("delete canceled");
        }
    }

    function encodeImageFileAsURL(divNum) {

        var filesSelected = document.getElementById("inputFileToLoad_" + divNum).files;
        if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];

            var fileReader = new FileReader();

            fileReader.onload = function (fileLoadedEvent) {
                var srcData = fileLoadedEvent.target.result; // <--- data: base64

                var newImage = document.createElement('img');
                newImage.src = srcData;
                if (newImage.width > newImage.height) {
                    newImage.width = 250;
                } else {
                    newImage.height = 250;
                }

                document.getElementById("img_" + divNum).innerHTML = newImage.outerHTML;
                console.log("Converted Base64 version is " + document.getElementById("img_" + divNum).innerHTML);
            }
            fileReader.readAsDataURL(fileToLoad);
        }
    }

    function initEventListeners() {
        $(window).on('hashchange', function (event) {
            var view = (window.location.hash || '').replace(/^#/, '');
            if ($('#' + view + '-view').length) {
                showView(view);
            }
        });
    }

    function getUser() {
        var profile = JSON.stringify(myList.currentUser.profile)
        var name = JSON.stringify(myList.currentUser.name);
        var email = JSON.stringify(myList.currentUser.email) + "";
        console.log("the email returned by getUserEmail is " + getUserEmail());
        return myList.currentUser;
    }

    function searchById(id) {
        return myList.searchById(id);
    }

    function getUserName() {
        return myList.currentUser.name;
    }
    function getUserEmail() {
        return myList.currentUser.email;
    }
    function getUserId() {
        console.log("id: " + myList.currentUser._id);
        return myList.currentUser._id;
    }
    function getNestNumber() {
        return myList.currentUser.interestList.length;
    }
    function addToNest(element) {
        var item = myList.searchById(element.getAttribute("sid"));
        console.log("searching for item returns " + JSON.stringify(item))
        var user = getUser();
        var id = getUserId();
        user.interestList.push(item);
        var nest = user.interestList;

        var newUser = {
            openID: user.openID,
            profile: user.profile,
            name: getUserName(),
            email: getUserEmail(),
            phone: user.phone,
            interestList: nest,
        };

        myList.updateCurrentUser(id, newUser);
        refreshView();
        refreshNestTable();
        console.log("user nest: " + user.interestList.length);
    }

    function setSeller() {
        $("#itemSeller").val(getUserId());
        //console.log("vale: " + $("#itemSeller").val());
    }

    function checkItems(user, item) {
        var count = 0;
        for (var i = 0; i < user.sellingList.length;i++){
            if (user.sellingList[i]._id == item._id) {
                count++;
            }
        }
       // alert("count is equal to: " + count);
        return count;
    }

    function updateSellingList() {
        var user = getUser();
        var id = getUserId();

        for (var i = 0; i < myList.items.length; i++) {
            //var item = myList.searchById(myList.items[i].seller);
            if (id == myList.items[i].seller && checkItems(user, myList.items[i])<1) {
                user.sellingList.push(myList.items[i]);
                var nest = user.sellingList;
                var newUser = {
                    openID: user.openID,
                    profile: user.profile,
                    name: getUserName(),
                    email: getUserEmail(),
                    phone: user.phone,
                    sellingList: nest,
                };
                myList.updateCurrentUser(id, newUser);
            }
        }
        refreshView();
        refreshSellingTable();

    }

    function refreshProfile() {
        fridgeView.refreshProfile(myList.currentUser);
    }

    function start() {
        mediaCheck();
        setView();
        myList.loadModel();
        imageTextAlign();
        fridgeSpeech.enableSpeech("speech loaded");
        bringToTop();
    }

    // here is were we decide what is visible to the outside!
    fridgeApp = {
        start: start,
        getUser: getUser,
        setSeller: setSeller,
        getUserName: getUserName,
        getUserEmail: getUserEmail,
        getNestNmber: getNestNumber,
        getUserId: getUserId,
        addToNest: addToNest,
        checkItems: checkItems,
        showViewProfile: showViewProfile,
        refreshNestTable: refreshNestTable,
        refreshSellingTable: refreshSellingTable,
        refreshProfile: refreshProfile,
        updateSellingList: updateSellingList,
        filterMainCategory: filterMainCategory,
        filterSubCategory: filterSubCategory,
        accessLogoutPage: accessLogoutPage,
        accessLoginPage: accessLoginPage,
        encodeImageFileAsURL: encodeImageFileAsURL,
        showAlert: showAlert,
        showHelp: showHelp,
        verifySubmission: verifySubmission,
        refreshView: refreshView,
        reloadModel: reloadModel,
        showView: showView,
        deleteItem: deleteItem,
        updateItem: updateItem,
        pass: pass,
        passById: passById,
        searchById: searchById,
        imageTextAlign: imageTextAlign,
        loadEdit: loadEdit,
        mediaCheck: mediaCheck
    }

    return (fridgeApp);

}(jQuery));


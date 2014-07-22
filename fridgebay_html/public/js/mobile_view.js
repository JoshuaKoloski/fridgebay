
var mobileFridgeView = (function($){
    
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
    
    function refreshItemsHome(myItems){
        var rows ="";
        for(var n=0; n<myItems.length; n++){ 
            var item = myItems[n];
            rows = rows + itemToRow(item);
        }
        $("#itemView").html(rows);
    }
    
    function itemToRow(item){
        var row = "<li><img src='cartoon_owl.png'>"+
            "<h1>+"item.name"+</h1>"+
            "<p>"+ item.price +"<p>" +
            "<p>"+item.condition+"</p>"+
            "</li>";
        return row;
    }
    mobileFridgeView={
        header: header,
        refreshItemsHome: refreshItemsHome
    };
    
    return(mobileFridgeView);
    
}(jQuery));

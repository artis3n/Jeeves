/**
 The shoppingView is responsible for updating all of the HTML
 It is called by the shoppingApp only and the only thing it calls is jQuery
**/

var shoppingView = (function($){
    
    function refreshView(myData){
        refreshTable(myData.items);
        updateTitle(myData.user);
        updateTotalPrice(myData);
        
        
    }
    
    
    // updates the title with the user's name
    function updateTitle(user){
        var newTitle = user + "'s Super Shopping List";
        $("#title").html(newTitle);
    }
    
    function updateTotalPrice(myData){
        var numPurchases = myData.items.filter(function(x){return x.purchased;}).length;
        var totalText = "There total cost of the "+numPurchases+" purchased items is "+ myData.totalPrice();
        $("#totalprice").html(totalText);
    }
    
    function sortItems(items){
        var sortedItems = items.slice();  // make a copy of items
        sortedItems.sort(function(a,b){ return(a.action > b.action)});
        return sortedItems;
    }
    
    function filterItems(items){
        var n;
        var item;
        var newItems=[];
        var showComplete = $("#showCompleteCheckbox").prop("checked");
        var cutoff = $("#cutOffText").val() || 0;
        var wasPurchased;

        for(n=0; n<items.length; n++){
            item = items[n]
            wasPurchased = item.purchased || false;
            if (!wasPurchased ||  showComplete){
                if (item.quantity >= cutoff){
                    newItems.push(item);
                }
            }
        }
        return newItems;
    }
    
    
    // redraw the table using the current model
    function refreshTable(myItems){    
                var rows = "";
                var len = myItems.length;
                var filteredItems = filterItems(myItems);
                var sortedItems = sortItems(filteredItems);
                console.log("filteredItems = "+ JSON.stringify(filteredItems));
                console.log("sortedItems = "+JSON.stringify(sortedItems));
                
                for(var n=0; n<sortedItems.length; n++){ 
                    var item = sortedItems[n];
                    rows = rows + itemToRow(item);
                }

                var itemTableBody = $("#itemTableBody").html(rows);

    }

    // convert an item into an HTML tr element
    function itemToRow(item){
        var row = 
        "<tr><td>"+item.action+
        "</td><td>"+ 
            "<input type='text' value='"+item.price+"' sid='"+item.id+"' onchange='shoppingApp.editPrice(this)'>"+
        "</td><td>"+
            "<input type='text' value='"+item.quantity+"' sid='"+item.id+"' onchange='shoppingApp.editQuantity(this)'>"+
        "</td><td>"+item.quantity * item.price +
        "</td><td> <input type='checkbox' sid='"+item.id+"' onclick='shoppingApp.purchaseItem(this)' "+purchased(item)+ "> "+
        "</td><td> <input type='checkbox' sid='"+item.id+"' onclick='shoppingApp.handleDeleteItem(this)'> "+  
        "</td></tr>";
        return row;
    }
    

    
    function editted(item) {
        if(item.edit) return "checked";
        else return "";
    }
    
    function purchased(item) {
        if(item.purchased) return "checked";
        else return "";
    }
    
    shoppingView={
        refreshView: refreshView
    };
    
    return(shoppingView);
    
}(jQuery));
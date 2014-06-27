/**
 demo.js
 This provides the model and controller for the shopping list app!
 It is written entirely in JavaScript with no use of AngularJS
 but it does just jQuery to handle the ajax calls in a browser independent manner...
 and it uses jQuery to access and modify the HTML file index.html
 
 VERSION 1.0.1 -- here is where we start adding some functionality
 **/

var shoppingApp = (function($) {


    // first create the model
    var myList = new ShoppingList();
    
    var showView = function(selected) {
      window.location.hash = '#' + selected;
      $('.view').hide().filter('#' + selected + '-view').show();
    };


    function handleDeleteItem(element) {
        console.log("deleting item");
        console.log(" with id " + element.getAttribute("sid"));
        myList.deleteElement(element.getAttribute("sid"));

    }

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
    
    function editPrice(element){
        var itemId = element.getAttribute("sid");
        var itemVal = element.value;
        var item;
        console.log("item "+itemId+" has value "+itemVal);
        item = myList.getElement(itemId);
        item.price = itemVal;
        myList.updateElement(item.id,item);
        refreshView();
        
    }
    
    function editQuantity(element){
        var itemId = element.getAttribute("sid");
        var itemVal = element.value;
        var item;
        console.log("item "+itemId+" has value "+itemVal);
        item = myList.getElement(itemId);
        item.quantity = itemVal;
        myList.updateElement(item.id,item);
        refreshView();
        
    }

    function purchaseItem(element) {
        var itemId = element.getAttribute("sid");
        var item;
        console.log("purchasing item "+itemId);
        item = myList.getElement(itemId);
        item.purchased= !item.purchased;
        myList.updateElement(item.id,item);
        refreshView();
    }

    function editItem(element) {
        console.log("editing item "+element.getAttribute("sid"));
    }

    function refreshView(){
        shoppingView.refreshView(myList);
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
        console.log("myList = " + JSON.stringify(myList));
        shoppingView.refreshView(myList);
        showView("welcome");


    }

    // here is were we decide what is visible to the outside!
    shoppingApp = {
        start: start,
        addItem: addItem,
        handleDeleteItem: handleDeleteItem,
        refreshView: refreshView,
        purchaseItem: purchaseItem,
        editItem: editItem,
        reloadModel: reloadModel,
        editPrice: editPrice,
        editQuantity: editQuantity,
        showView: showView
    }

    return (shoppingApp);

}(jQuery));




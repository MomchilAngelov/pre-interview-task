$(document).ready(function(){
	"uses strict";

	function get_current_bill(){
		return parseInt($("#total").text());
	}

	function set_current_bill(new_value){
		$("#total").text(new_value);
	}

	function not_in_list(item){
		if (item.parent().attr('data-basket') == "0"){
			return true;			
		} else {
			return false;
		}
	}

	function get_price(item){
		var price = item.siblings(".price").text();
		return parseInt(price);
	}

	function add_to_list(item){
		var price = item.siblings(".price").text();
		var name = item.siblings(".name").text();


		var parent_div = $("<div />");
		parent_div.addClass("visualise-item item");
		parent_div.attr("handler-id", item.parent().attr("id"));


		var name_paragraph = $("<p />");
		name_paragraph.text("Име на продукта: " + name);
		name_paragraph.addClass("name");

		var price_paragraph = $("<p />");
		price_paragraph.text("Цена на продукта: " + price);
		price_paragraph.addClass("price");

		var quantity = $("<p />");
		quantity.addClass("quantity")
		quantity.text("1");

		parent_div.append(name_paragraph);
		parent_div.append(price_paragraph);
		parent_div.append(quantity);

		$("#visualise").append(parent_div);
		item.parent().attr("data-basket", "1");

		set_current_bill(get_current_bill() + get_price(item));
	}

	function increment(item){
		//Get the current count, so we can +1 it
		var curr = item.parent().attr("data-basket");
		next = parseInt(curr) + 1;
		item.parent().attr('data-basket', next);
		
		//Update the Shoping cart
		$("[handler-id='" + item.parent().attr("id") + "']").children(".quantity").text(next);
	
		//Update the total price paid
		set_current_bill(get_current_bill() + get_price(item));
	}

	function add_remove_button(item){
		var remove_button = $("<button />");
		remove_button.text("Remove From Basket");
		remove_button.addClass("remove");

		item.parent().append(remove_button);
	}

	function decrement(item){
		var curr = item.parent().attr("data-basket");
		next = parseInt(curr) - 1;
		item.parent().attr('data-basket', next);
		
		//Update the Shoping cart
		$("[handler-id='" + item.parent().attr("id") + "']").children(".quantity").text(next);

		set_current_bill(get_current_bill() - get_price(item));
	}

	function remove_remove_button(item){
		item.remove();
	}

	function remove_from_shopping_list(item){
		$("[handler-id='" + item.parent().attr("id") + "']").remove();		
	}

	function last(item){
		if (item.parent().attr("data-basket") == "1"){
			return true;
		} else {
			return false;
		}
	}

	function nothing_selected(){
		var data = $("[data-basket]");
		for (var i = data.length - 1; i >= 0; i--) {
			if($(data[i]).attr("data-basket") != "0"){
				return false;
			}
		}
		return true;
	}

	function too_much_of_sort(){
		var data = $("[data-basket]");
		for (var i = data.length - 1; i >= 0; i--) {
			if(parseInt($(data[i]).attr("data-basket")) > 5){
				return true;
			}
		}
		return false;
	}

	function get_shortage_item(){
		var data = $("[data-basket]");
		for (var i = data.length - 1; i >= 0; i--) {
			if(parseInt($(data[i]).attr("data-basket")) > 5){
				return $(data[i]).children(".name").text();
			}
		}
	}

	function make_ajax(){
		var all_data = {};
		$(".visualise-item").each(function( i ){
			data = {};
			data['name'] = $(this).children(".name").text();
			data['price'] = $(this).children(".price").text();
			data['quantity'] = $(this).children(".quantity").text();
			all_data[i] = data;
		});
		all_data['total'] = get_current_bill();
		console.log(all_data);

		var createPromise = $.ajax({
			url: "http://example.org/",
			method: "POST",
			data: all_data,
			dataType: "json",
			contentType: "application/json; charset=utf-8"
		}).then(function(responce){
			console.log(responce);
			alert("Transaction successfull! :з");
		});
	}

	function attach_handlers(){
		$(".add").click(function(){
			if(not_in_list($(this))){
				add_to_list($(this));
				add_remove_button($(this));
			} else {
				increment($(this));
			}
		});

		$(document).on("click", ".remove", function(){
			if(last($(this))){
				decrement($(this));
				remove_from_shopping_list($(this));
				remove_remove_button($(this));
			} else {
				decrement($(this));
			}
		});

		$("#confirm").click(function(){
			if (nothing_selected()){
				alert("Your shopping basket is empty!");
			} else if (too_much_of_sort()){
				var item= get_shortage_item();
				alert("Тhe selected quantity for product "+item+" is out of stock");
			} else {
				make_ajax();
			}
		});
	}

	attach_handlers();

});
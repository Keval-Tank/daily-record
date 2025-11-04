var menu = [
    { name: "Dish1", price: 5 },
    { name: "Dish2", price: 6 },
    { name: "Dish3", price: 7 },
    { name: "Dish4", price: 8 }
];
// type Address = {
//     street : string
//     city : string
// }
// type Person = {
//     name : string,
//     age : number,
//     isStudent : boolean
//     address : Address
// }
// const person1 : Person = {
//     name : "p1",
//     age : 23,
//     isStudent : false,
//     address : {
//         street : "str 1",
//         city : "city 1"
//     }
// }
var nextOrderId = 1;
var cashInRegister = 100;
var orderQueue = [];
function addNewDish(name, price) {
    var newDish = { name: name, price: price };
    menu.push(newDish);
}
function placeOrder(dish_name) {
    var selected_dish = menu.find(function (dish) { return dish.name === dish_name; });
    if (!selected_dish) {
        console.log('This dish is not available');
        return;
    }
    cashInRegister += selected_dish.price;
    var orderObj = { orderId: nextOrderId, selectedDish: selected_dish, status: "ordered" };
    nextOrderId++;
    orderQueue.push(orderObj);
    return orderObj;
}
function completeOrder(id) {
    var completedOrder = orderQueue.find(function (order) { return order.orderId === id; });
    if (!completedOrder) {
        console.log('Order not found');
        return;
    }
    completedOrder.status = "completed";
    return completedOrder;
}
addNewDish("Dish8", 900);
console.log(menu);
placeOrder("Dish2");
placeOrder("Dish8");
placeOrder("Dish5");
completeOrder(2);
completeOrder(1);
console.log(orderQueue);

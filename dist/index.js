"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const menu = [
    { id: 1, name: "Dish1", price: 5 },
    { id: 2, name: "Dish2", price: 6 },
    { id: 3, name: "Dish3", price: 7 },
    { id: 4, name: "Dish4", price: 8 }
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
let nextOrderId = 1;
let nextDishId = 5;
let cashInRegister = 100;
const orderQueue = [];
// omit returns a type with removed 'key' from a type, given in argument 
function addNewDish(dishObj) {
    const newDish = Object.assign({ id: nextDishId++ }, dishObj);
    menu.push(newDish);
    return newDish;
}
function placeOrder(dish_name) {
    const selected_dish = menu.find((dish) => dish.name === dish_name);
    if (!selected_dish) {
        console.log('This dish is not available');
        return;
    }
    cashInRegister += selected_dish.price;
    const orderObj = { orderId: nextOrderId, selectedDish: selected_dish, status: "ordered" };
    nextOrderId++;
    orderQueue.push(orderObj);
    return orderObj;
}
function completeOrder(id) {
    const completedOrder = orderQueue.find((order) => order.orderId === id);
    if (!completedOrder) {
        console.log('Order not found');
        return;
    }
    completedOrder.status = "completed";
    return completedOrder;
}
function getDish(identifier) {
    if (typeof identifier === 'number') {
        const dish = menu.find((dish) => dish.id === identifier);
        if (!dish) {
            console.error('Dish not found');
            return;
        }
        return dish;
    }
    else if (typeof identifier === 'string') {
        const dish = menu.find((dish) => dish.name === identifier);
        if (!dish) {
            console.error('Dish not found');
            return;
        }
        return dish;
    }
    else {
        console.error('Invalid Identifier');
        return;
    }
}
function updateDish(id, data) {
    let found = false;
    menu.forEach((dish) => {
        if (dish.id === id) {
            Object.assign(dish, data);
            found = true;
        }
    });
    if (!found) {
        console.error('Dish Not found!');
    }
    else {
        console.log(menu);
    }
}
const arr1 = [1, 2, 3, 4, 5];
const arr2 = ['string1', 'string2', 'string3'];
const arr3 = [{ name: "p1", age: 34 }, { name: "p2", age: 43 }];
function getLastItem(array) {
    return array[array.length - 1];
}
const a = {
    keval: 2,
    kabir: 5,
    "jay": 10
};
console.log(a);
// const set = new Set<string>(['1', '2', '1', '3']);
// set.add('1');
// set.add('4');
// set.delete('1');
// console.log(set)
// console.log(getLastItem<T1>(arr3))
// addNewDish({name : "newDish", price : 5})
// console.log(menu)
// console.log(typeof Dish)
// updateDish(2, {price : 10});
// addNewDish({id : 5, name : "Dish5", price : 30});
// console.log(menu)
// placeOrder("Dish2")
// placeOrder("Dish9")
// placeOrder("Dish5")
// completeOrder(2)
// completeOrder(1)
// console.log(orderQueue)
// console.log(getDish(6))
// addNewDish('Dish5', 5);
// addNewDish('Dish6', 6);
// console.log(menu);
//# sourceMappingURL=index.js.map
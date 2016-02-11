'use strict'

let fs = require('fs');

String.prototype.splitInt = function (token) {
  return this.split(' ').map((e) => parseInt(e));
}

function parseGrid(input, line) {
  var [rows, cols, drones, turns, maxPayload] = line.splitInt(' ');
  input.grid = {rows, cols, drones, turns, maxPayload};
}

function parseProducts(input, line) {
  let products = line.splitInt(' ');
  input.products = products;
}

function parseWarehouses(input, lines) {
  let whCount = lines[3];
  for (let i = 0; i < whCount; i++) {
    let startIdx = 4 + i * 2;
    let [r, c] = lines[startIdx].splitInt(' ');
    let quantities = lines[startIdx + 1].splitInt(' ');
    input.warehouses.push({i, r, c, quantities});
  }
  return whCount;
}

function parseOrders(input, lines) {
  let ordersCount = lines[0];
  for (let i = 0; i < ordersCount; i++) {
    let startIdx = 1 + i * 3;
    let [r, c] = lines[startIdx].splitInt(' ');
    let productsRaw = lines[startIdx + 2].splitInt(' ');
    let quantities = new Array(input.products.length).fill(0);
    productsRaw.forEach(prodIndex => quantities[prodIndex]++);
    input.orders.push({i, r, c, quantities});
  }
}

module.exports = function (filepath, cb) {

  let input = {
    grid: null,
    products: null,
    warehouses: [],
    orders: []
  };

  fs.readFile(filepath, (err, data) => {
    if (err) throw err;
    let lines = data.toString().split('\n');
    parseGrid(input, lines[0]);
    parseProducts(input, lines[2]);
    let whCount = parseWarehouses(input, lines);
    parseOrders(input, lines.slice(4 + whCount * 2));
    cb(input);
  });

}

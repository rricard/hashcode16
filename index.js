'use strict'

let fs = require('fs');
let filename = process.argv[2];

if (!filename) {
  console.err('Must provide filepath as arg');
}

let input = {
  grid: null,
  products: null,
  warehouses: [],
  orders: []
};

String.prototype.splitInt = function (token) {
  return this.split(' ').map((e) => parseInt(e));
}

function parseGrid(line) {
  var [rows, cols, drones, turns, maxPayload] = line.splitInt(' ');
  input.grid = {rows, cols, drones, turns, maxPayload};
}

function parseProducts(line) {
  let products = line.splitInt(' ');
  input.products = products;
}

function parseWarehouses(lines) {
  let whCount = lines[3];
  for (let i = 0; i < whCount; i++) {
    let startIdx = 4 + i * 2;
    let [r, c] = lines[startIdx].splitInt(' ');
    let quantities = lines[startIdx + 1].splitInt(' ');
    input.warehouses.push({i, r, c, quantities});
  }
  return whCount;
}

function parseOrders(lines) {
  let ordersCount = lines[0];
  for (let i = 0; i < ordersCount; i++) {
    let startIdx = 1 + i * 3;
    let [r, c] = lines[startIdx].splitInt(' ');
    let productsRaw = lines[startIdx + 2].splitInt(' ');
    let products = new Array(input.products.length).fill(0);
    productsRaw.forEach(prodIndex => products[prodIndex]++);
    input.orders.push({i, r, c, products});
  }
}

fs.readFile(filename, (err, data) => {
  if (err) throw err;
  let lines = data.toString().split('\n');
  parseGrid(lines[0]);
  parseProducts(lines[2]);
  let whCount = parseWarehouses(lines);
  parseOrders(lines.slice(4 + whCount * 2));
  console.log(JSON.stringify(input));
});

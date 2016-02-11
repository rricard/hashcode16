'use strict'

let parser = require('./parser'),
    exportSolution = require('./export-solution'),
    nearestOrder = require('./nearest-order');

let filepath = process.argv[2];

if (!filepath) {
  console.err('Must provide filepath as arg');
}

parser(filepath, input => exportSolution(nearestOrder(input.grid,
                                                      input.warehouses,
                                                      input.products,
                                                      input.orders
                                                      )));

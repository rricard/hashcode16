"use strict";

const ALPHA = 1;

const BETA = 1;

const MAX_WAITING = 1000;

function betterWarehouse(pScore, d) {
  return d == 0 ? pScore : ALPHA * pScore / d;
}

function betterOrder(pScore, d) {
  return d == 0 ? pScore : BETA * pScore / d;
}

function scoreQuantity(weight, q) {
  return q;
}

function euclideanDist(p1, p2) {
  return Math.round(
    Math.sqrt(Math.pow(p1.r - p2.r, 2) + Math.pow(p1.c - p2.c, 2))
  );
}

function initDrones(nd, initW) {
  return new Array(nd).map(() => {
    r: initW.r,
    c: initW.c,
    idle: 0,
    products: [],
    nextOrder: null
  });
}

// {r, c, idle, products[{n, type}]}

module.exports = function(map, warehouses, productTypes, orders) {
  let waiting = 0;
  let drones = initDrones(map.nd, warehouse[0]);
  let commands = [];
  while(orders.length > 0 && waiting < MAX_WAITING) {
    drones.forEach(drone => {
      // Case #1: Idle drone without an order (=> MUST LOAD, CHOOSE AN O&W)
      if(drone.idle < 1 && !drone.nextOrder) {
        // 1. Choose the best warehouse
        let chosenW = null;
        let chosenWScore = 0;
        warehouses.forEach(w => {
          const pScore = w.quantities.reduce((q, type) => scoreQuantity(productTypes[type], q));
          const wScore = betterWarehouse(pScore, euclideanDist(w, drone));
          if(wScore > chosenWScore) {
            chosenWScore = wScore;
            chosenW = w;
          }
        });
        // 2. Choose the best order from this warehouse
        let chosenO = null;
        let chosenOScore = 0;
        orders.filter(o => {
          return o.quantities.filter((q, type) => q > chosenW.quantities[type]).length < 1;
        }).forEach(o => {
          const pScore = o.quantities.reduce((q, type) => scoreQuantity(productTypes[type], q));
          const oScore = betterOrder(pScore, euclideanDist(o, chosenW));
          if(oScore > chosenOScore) {
            chosenOScore = oScore;
            chosenO = o;
          }
        });
        drone.order = chosenO;
        if(drone.order) {
          // TODO: launch a LOAD action
        } else {
          // TODO: WAIT
          waiting += 1;
        }
      }
      // Case #2: Idle drone with an order, AUTO
      else if(drone.idle < 1 && drone.nextOrder) {
        // TODO: launch a DELIVER action
      }
      // Case #3: Not idle, AUTO
      else {
        drone.idle -= 1;
      }
    });
  }
  return commands;
}

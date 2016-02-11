"use strict";

module.exports = function (commands) {
  for(let command of commands) {
    console.log(command.drone + " " + command.type + " " + command.args.join(" "));
  }
}

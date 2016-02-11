"use strict";

module.exports = function (commands) {
  console.log(commands.length);
  for(let command of commands) {
    console.log(command.drone + " " + command.type + " " + command.args.join(" "));
  }
}

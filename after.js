var Q = require("q");

function test_1 () {
  console.log("1");
  setTimeout(function() {
}, 3000);
}
function test_2 () {
  console.log("2");
}

var test_1_1 = Q.denodeify(test_1);
var promise = test_1_1();
promise.done(test_2());

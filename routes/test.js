var util = require('util');
function Base() {
    this.name = 'base';
    this.base = 1991;
    that = this;
    this.sayHello = function () {
        console.log('Hello ' + this.name);
    };
}
Base.prototype = {
    showName: function () {
        console.log(that.name);
    }
}
function Sub() {
    that.name = 'jackey';
}
Sub.prototype={
    show:function () {
        console.log('sdasd');
    }
}
util.inherits(Sub, Base);
var objBase = new Base();
var objSub = new Sub();
objSub.show()



"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
exports.default = (0, vue_1.defineComponent)({
    template: " <h1>Hi {{ name }}</h1> <p>{{ message }}</p> ",
    style: "h1 {font-size: 2rem;}",
    setup: function (props) {
        var message = (0, vue_1.computed)(function () { return "Welcome to my app ".concat(props.name); });
        return { message: message };
    }
});

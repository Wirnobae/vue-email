"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
exports.default = (0, vue_1.defineComponent)({
    template: " <h1>Hi {{ name }}</h1> ",
    style: "h1 {font-size: 2rem;}",
    props: {
        show: Boolean,
        name: String,
    },
    methods: {
        do: function () {
            console.log('Doing...');
        }
    }
});

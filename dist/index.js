"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("./client"));
const partials_1 = require("./prebuilts/partials");
new client_1.default({ intents: 46975, partials: partials_1.myPartials }).init(__dirname);
//# sourceMappingURL=index.js.map
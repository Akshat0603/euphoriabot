"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const client_1 = __importDefault(require("./client"));
const partials_1 = require("./prebuilts/partials");
process.on("uncaughtException", (error) => {
    const date = new Date().toString();
    (0, fs_1.appendFileSync)(`error.log`, `\n${date}\nUnhandled Exception: ${error.message}\n${error.stack}\n\n`);
    process.exit(1);
});
new client_1.default({ intents: 46975, partials: partials_1.myPartials }).init(__dirname);
//# sourceMappingURL=index.js.map
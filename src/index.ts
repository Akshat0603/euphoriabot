import { appendFileSync } from "fs";
import myClient from "./client";
import { myPartials } from "./prebuilts/partials";

process.on("uncaughtException", (error) => {
	const date = new Date().toString();
	appendFileSync(
		`error.log`,
		`\n${date}\nUnhandled Exception: ${error.message}\n${error.stack}\n\n`
	);
	process.exit(1);
});

new myClient({ intents: 46975, partials: myPartials }).init(__dirname);

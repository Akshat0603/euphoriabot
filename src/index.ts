import myClient from "./client";
import { myPartials } from "./Utilities/partials";

new myClient({ intents: 46975, partials: myPartials }).init(__dirname);

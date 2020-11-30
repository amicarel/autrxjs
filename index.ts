import { of } from "rxjs";
import { map } from "rxjs/operators";

// vaffanculo
// culone

const source = of("World").pipe(map(x => `Hello ${x}!`));

source.subscribe(console.log);

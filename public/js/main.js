import { init as arrival } from "./arrival.js";
import { init as direction } from "./direction.js";
import { init as drive } from "./drive.js";
import { init as seats } from "./seats.js";
import { init as stepper } from "./stepper.js";
import { init as trip } from "./trip.js";

// The steppers come first: what follows reads the counts they hold.
stepper();
seats();
direction();
arrival();
trip();
drive();

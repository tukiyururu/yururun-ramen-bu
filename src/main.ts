import {Hellow} from "./hellow";

global.greeter = (): void => {
  const hellow = new Hellow("World");
  hellow.say();
  hellow.constSay();
};

import {RamenBuConst} from "./ramen-bu-const";

export class Hellow {
  private person: string;

  public constructor(person: string) {
    this.person = person;
  }

  public say(): void {
    Logger.log(`Hellow, ${this.person}!`);
  }

  public constSay(): void {
    Logger.log(`Hellow, ${RamenBuConst.HASH_TAG}!`);
  }
}

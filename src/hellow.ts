export class Hellow {
  private person: string;

  public constructor(person: string) {
    this.person = person;
  }

  public say(): void {
    Logger.log(`Hellow, ${this.person}!`);
  }
}

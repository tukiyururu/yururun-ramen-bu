export {};

declare global {
  function setProperty(): void
  function setCallback(request: object): GoogleAppsScript.HTML.HtmlOutput;
  function getAuthorizeUrl(): void;
  function setRamenBu(): void;
  function setAtTrigger(): void;
  function hashTagRetweet(): void;
  function dailyUpdate(): void;
}

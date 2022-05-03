export {};

declare global {
  function setProperty(): void
  function setCallback(request: object): GoogleAppsScript.HTML.HtmlOutput;
  function getAuthorizeUrl(): void;
  function setSheet(): void;
  function hashTagRetweet(): void;
  function dailyUpdate(): void;
}

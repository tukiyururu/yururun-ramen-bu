export {};

declare global {
  function setProperty(): void
  function setCallback(request: object): GoogleAppsScript.HTML.HtmlOutput;
  function getAuthorizeUrl(): void;
}

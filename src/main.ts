import {Twitter} from "./twitter";

const twitter = new Twitter(global.setCallback.name);

global.setCallback = (request: object) => {
  return twitter.setCallback(request);
};

global.getAuthorizeUrl = () => {
  twitter.getAuthorizeUrl();
};

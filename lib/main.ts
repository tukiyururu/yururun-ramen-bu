import * as BigNumber from "bignumber.js";
import { Twitter } from "./twitter";
import { Sheet } from "./sheet";

const twtr = new Twitter({
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    callbackFunction: "twitterAuthorizeCallback"
});
const rtField: string = "A2";
const cntField: string = "B2";
const dailyFunc: string = "twitterDailyUpdate";

global.setDailyTrigger = () => {
    const triggerDay = new Date();
    triggerDay.setHours(23);
    triggerDay.setMinutes(59);
    ScriptApp.newTrigger(dailyFunc)
        .timeBased().at(triggerDay).create();
};

global.twitterAuthorizeCallback = (request: object) => {
    return twtr.callback(request);
};

global.twitterAuthorizeUrl = () => {
    twtr.authorizeUrl();
};

global.twitterAuthorizeClear = () => {
    twtr.clear();
};

global.twitterDailyUpdate = () => {
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
        if (trigger.getHandlerFunction() === dailyFunc) {
            ScriptApp.deleteTrigger(trigger);
        }
    }

    const count = +Sheet.getValue(cntField);
    Sheet.setValue(cntField, "0");

    let tweet: string = `本日確認できた #${process.env.HASH_TAG} の活動は、${count}回でした。`;
    if (count < 3) {
        tweet += "ちょっと少ない？　明日はラーメン部活動をがんばりましょう！";
    } else if (count < 5) {
        tweet += "みなさん、この調子でラーメン部活動をがんばっていきましょう！！";
    } else if (count < 10) {
        tweet += "今日は活発でしたね！　みなさん、明日からも元気よくラーメン部活動をがんばっていきましょう！！！";
    } else {
        tweet += "ラーメン部活動は永遠なり。この調子で #ゆるる幼稚園ラーメン部 を語り継いでいきましょう！";
    }

    twtr.update({
        status: tweet
    });
    Logger.log(`[TWEET] ${tweet}`);
};

global.twitterHashtagRetweet = () => {
    const params: TwitterParams = {
        count: "200"
    };
    const lstId = Sheet.getValue(rtField);
    let statuses = twtr.homeTimeline(params);
    if (!statuses) {
        return;
    }
    Sheet.setValue(rtField, statuses[0].id_str);

    const reg = new RegExp(`#${process.env.HASH_TAG}`);
    let tmpId: string = lstId;
    let flag: boolean = false;
    const result: TwitterParams[] = [];

    while (statuses) {
        for (const status of statuses) {
            if (!status.retweeted_status) {
                tmpId = status.id_str;
                if (lstId === tmpId) {
                    flag = true;
                    break;
                }

                if (status.user.id_str !== process.env.USER_ID && status.text.match(reg)) {
                    result.push({
                        id: tmpId,
                        name: status.user.screen_name
                    });
                }
            }
        }

        if (flag) {
            break;
        }

        const big = new BigNumber(tmpId);
        params.max_id = big.minus(1).toFixed(0);
        statuses = twtr.homeTimeline(params);
    }

    const num = result.length;
    const count = +Sheet.getValue(cntField);
    Sheet.setValue(cntField, `${count + num}`);

    for (let i = num - 1; i >= 0; i--) {
        const r = result[i];
        twtr.retweet(r.id);
        twtr.favorite({
            id: r.id
        });
        Logger.log(`[RT&Fav] https://twitter.com/${r.name}/status/${r.id}`);
        Utilities.sleep(3000);
    }
};

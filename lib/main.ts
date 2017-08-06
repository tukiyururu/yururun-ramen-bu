import * as BigNumber from "bignumber.js";
import { Twitter } from "./twitter";
import { Sheet } from "./sheet";

const twtr = new Twitter("twitterAuthorizeCallback");
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

    const count = Sheet.getCount();
    Sheet.setCount(0);

    let tweet: string = `本日確認できた #${process.env.HASH_TAG} の活動は、${count}回でした。`;
    if (count < 1) {
        tweet += "0回……。このままでは廃部の危機です。みなさんラーメン部員としての自覚を持ってください！";
    } else if (count < 4) {
        tweet += "ちょっと少ない？　明日はラーメン部活動をがんばりましょう！";
    } else if (count < 7) {
        tweet += "みなさん、この調子でラーメン部活動をがんばっていきましょう！！";
    } else if (count < 10) {
        tweet += "今日は活発でしたね！　みなさん、明日からも元気よくラーメン部活動をがんばっていきましょう！！！";
    } else if (count < 20) {
        tweet += `ラーメン部活動は永遠なり。この調子で #${process.env.HASH_TAG} を語り継いでいきましょう！`;
    } else if (count < 30) {
        tweet += `今ここに、千年 #${process.env.HASH_TAG} 王国への扉が開かれた！！！！　みんなで伝説の王国へ行こう！`;
    } else {
        tweet += `ーーそして、#${process.env.HASH_TAG} は神話となった。［ゆるる幼稚園黙示録 第6章13節］`;
    }

    if (process.env.NODE_ENV !== "development") {
        const status = twtr.update({ status: tweet });
        if (status) {
            Logger.log(`[TWEET] https://twitter.com/${status.user.screen_name}/status/${status.id_str}`);
        }
    }

    const ids = twtr.followerIds({
        count: 100,
        stringify_ids: true,
        user_id: process.env.USER_ID
    });

    if (ids) {
        const lookup = twtr.lookup({ user_id: ids.ids.join(",") });
        if (lookup) {
            for (const lkup of lookup) {
                const connect = lkup.connections;
                if (
                    !connect.includes("following")
                 && !connect.includes("following_requested")
                ) {

                    if (process.env.NODE_ENV !== "development") {
                        twtr.follow({ user_id: lkup.id_str });
                        Utilities.sleep(3000);
                    }
                    Logger.log(`[FOLLOW] https://twitter.com/${lkup.screen_name}`);
                }
            }
        }
    }
};

global.twitterHashtagRetweet = () => {
    const params: TwitterParams = { count: 200 };
    let statuses = twtr.homeTimeline(params);
    if (!statuses) {
        return;
    }
    const lstId = Sheet.getRetweet();
    Sheet.setRetweet(statuses[0].id_str);
    if (process.env.NODE_ENV === "development") {
        Logger.log(`[LST]: https://twitter.com/a/status/${lstId}`);
    }

    let tmpId: string = lstId;
    let big = new BigNumber(tmpId);
    const reg = new RegExp(`^(.*?[\\s　]+?|)#${process.env.HASH_TAG}([\\s　]+?.*|)$`);
    const result: TwitterParams[] = [];

    flag: while (statuses) {
        for (const status of statuses) {
            tmpId = status.id_str;
            if (process.env.NODE_ENV === "development") {
                Logger.log(`[TMP]: https://twitter.com/${status.user.screen_name}/status/${tmpId}`);
            }

            big = new BigNumber(tmpId);
            if (big.lessThanOrEqualTo(lstId)) {
                break flag;
            }

            if (
                !status.retweeted_status
             && status.user.id_str !== process.env.USER_ID
             && status.text.match(reg)
            ) {

                result.push({
                    id: tmpId,
                    name: status.user.screen_name
                });
            }
        }

        params.max_id = big.minus(1).toFixed(0);
        statuses = twtr.homeTimeline(params);
    }

    const num = result.length;
    const count = Sheet.getCount();
    Sheet.setCount(count + num);

    for (let i = num - 1; i >= 0; i--) {
        const rst = result[i];

        if (process.env.NODE_ENV !== "development") {
            twtr.retweet(rst.id);
            twtr.favorite({ id: rst.id });
            Utilities.sleep(3000);
        }
        Logger.log(`[RT&Fav] https://twitter.com/${rst.name}/status/${rst.id}`);
    }
};

Array.prototype.includes = function(obj: any) {
    if (this.indexOf(obj) === -1) {
        return false;
    }
    return true;
};

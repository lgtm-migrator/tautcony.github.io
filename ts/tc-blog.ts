import "@babel/polyfill";

import Nav from "./Lib/navbar";
import Quote from "./Lib/quote";
import Title from "./Lib/title";
// import CoreValue from "./Lib/corevalue";
import tagcloud from "./Lib/tagcloud";
import brightnessInit from "./Lib/brightness";
import bubbleBg from "./Lib/bubbleBg";
import Archive from "./archive";
import pageInit from "./page";
import postInit from "./post";
import * as aboutInit from "./about";
require("../less/tc-blog.less");

import * as pangu from "../js/pangu.js/browser/pangu";

document.addEventListener("DOMContentLoaded", () => {
    const nav = new Nav();
    const title = new Title(["_(:3 」∠)_", "_(・ω・｣∠)_", "_(:з)∠)_", "_(┐「ε:)_", "_(:3」∠❀", "_(:зゝ∠)_", "_(:3」[＿]", "ヾ(:3ﾉｼヾ)ﾉｼ", "(¦3ꇤ[▓▓]", "_( -ω-` )⌒)_"]);
    const quote = new Quote(".copyright", "quote");
    // new CoreValue().Init();
    const bubble = new bubbleBg("#bubble_bg");

    brightnessInit();
    nav.Init();
    title.Init();
    quote.Init(10 ** 4);
    bubble.init();

    // tslint:disable-next-line: no-unused-expression
    new Archive();
    pageInit();
    postInit();
    aboutInit.qrInit();
    aboutInit.konInit();

    const config = {
        color: { start: "#bbbbee", end: "#0085a1" },
        size: { start: 1, end: 1.1, unit: "em" }
    };
    tagcloud(document.querySelectorAll("#tag_cloud a"), config);

    // tslint:disable-next-line: no-unsafe-any
    pangu.autoSpacingPage();
});

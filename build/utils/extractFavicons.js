"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFavicons = void 0;
var constants_1 = require("../constants");
function extractFavicons($, baseUrl) {
    var favicons = [];
    $(constants_1.ICON_LINK_TAGS).each(function () {
        var href = $(this).attr("href");
        if (href)
            favicons.push(new URL(href, baseUrl).href);
    });
    return favicons;
}
exports.extractFavicons = extractFavicons;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractImages = void 0;
var constants_1 = require("../constants");
function extractImages($) {
    var images = [];
    $(constants_1.OG_IMAGE).each(function () {
        var src = $(this).attr(constants_1.META_CONTENT);
        if (src)
            images.push(src);
    });
    $(constants_1.OG_IMAGE_URL).each(function () {
        var src = $(this).attr(constants_1.META_CONTENT);
        if (src)
            images.push(src);
    });
    if (!images.length) {
        $("*[class*='VideoThumbnail']").each(function () {
            var src = $(this).attr("src");
            if (src)
                images.push(src);
        });
    }
    if (!images.length) {
        $("img").each(function () {
            var src = $(this).attr("src");
            if (src)
                images.push(src);
        });
    }
    return images;
}
exports.extractImages = extractImages;

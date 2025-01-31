"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var constants_1 = require("./constants");
var axiosInstance_1 = require("./axiosInstance");
var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var MainExtractor = /** @class */ (function () {
    function MainExtractor(url, options) {
        var _this = this;
        this.fetchHTML = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, headers, timeout, maxRetries, retryDelay, attempt, response, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.options || {}, headers = _a.headers, timeout = _a.timeout;
                        maxRetries = 3;
                        retryDelay = 1000;
                        attempt = 0;
                        _b.label = 1;
                    case 1:
                        if (!(attempt < maxRetries)) return [3 /*break*/, 7];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 6]);
                        attempt++;
                        return [4 /*yield*/, axiosInstance_1.axiosInstance.get(this.url, {
                                headers: headers !== null && headers !== void 0 ? headers : {
                                    "user-agent": constants_1.USER_AGENT,
                                    "Accept-Language": constants_1.ACCEPT_LANGUAGE,
                                    "Access-Control-Allow-Origin": constants_1.ACCESS_CONTROL_ALLOW_ORIGIN,
                                    Accept: constants_1.ACCEPT,
                                    "Content-Type": constants_1.CONTENT_TYPE,
                                },
                                timeout: timeout !== null && timeout !== void 0 ? timeout : 3000,
                            })];
                    case 3:
                        response = _b.sent();
                        return [2 /*return*/, response.data.toString()];
                    case 4:
                        error_1 = _b.sent();
                        if (attempt >= maxRetries) {
                            throw error_1;
                        }
                        return [4 /*yield*/, delay(retryDelay)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        this.getDescription = function () {
            return (_this.cheerioApi(constants_1.OG_DESCRIPTION).attr(constants_1.META_CONTENT) ||
                _this.cheerioApi(constants_1.META_DESCRIPTION).attr(constants_1.META_CONTENT) ||
                "");
        };
        this.getMediaType = function () {
            return _this.cheerioApi(constants_1.OG_TYPE).attr(constants_1.META_CONTENT) || "";
        };
        this.getSiteName = function () {
            return _this.cheerioApi(constants_1.OG_SITE_NAME).attr(constants_1.META_CONTENT) || "";
        };
        this.scanObject = function (obj, predicate, thisKey) {
            if (thisKey === void 0) { thisKey = null; }
            if (typeof obj !== "object" || obj === null)
                return undefined;
            if (typeof obj === "object" && predicate(obj, thisKey)) {
                return obj;
            }
            ;
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    var result = _this.scanObject(obj[k], predicate, k);
                    if (result !== undefined)
                        return result;
                }
            }
            return undefined;
        };
        this.getTitle = function () {
            return (_this.cheerioApi(constants_1.OG_TITLE).attr(constants_1.META_CONTENT) ||
                _this.cheerioApi(constants_1.TITLE_TAG).text() ||
                _this.cheerioApi(constants_1.META_TITLE).attr(constants_1.META_CONTENT) ||
                "");
        };
        this.url = url;
        this.cheerioApi = (0, cheerio_1.load)("");
        this.options = options;
    }
    MainExtractor.prototype.getBaseUrl = function () {
        var parts = this.url.split("/");
        return parts[0] + "//" + parts[2];
    };
    MainExtractor.prototype.getlinkPreviewData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var html, baseUrl, specialTitle, specialDescription, specialImage, specialMediaType, specialFavIcon, tiktokData, youtubeBotData, title, description, siteName, images, favicons, keywords, mediaType, contentType, charset, error_2;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.fetchHTML()];
                    case 1:
                        html = _d.sent();
                        if (html) {
                            this.cheerioApi = (0, cheerio_1.load)(html);
                        }
                        baseUrl = this.getBaseUrl();
                        specialTitle = "";
                        specialDescription = "";
                        specialImage = "";
                        specialMediaType = "";
                        specialFavIcon = "";
                        if (!baseUrl.includes("tiktok.com")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fetchTikTokData()];
                    case 2:
                        tiktokData = _d.sent();
                        specialDescription = tiktokData.description;
                        specialImage = tiktokData.image;
                        specialMediaType = tiktokData.mediaType;
                        specialFavIcon = tiktokData.favIcon;
                        return [3 /*break*/, 5];
                    case 3:
                        if (!baseUrl.includes("youtube.com")) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.extractYoutubeBotData()];
                    case 4:
                        youtubeBotData = _d.sent();
                        specialTitle = youtubeBotData.title;
                        specialDescription = youtubeBotData.description;
                        specialImage = youtubeBotData.image;
                        _d.label = 5;
                    case 5:
                        title = specialTitle || this.getTitle();
                        description = specialDescription || this.getDescription();
                        siteName = this.getSiteName();
                        images = __spreadArray([specialImage], this.getImages(), true).filter(Boolean);
                        favicons = __spreadArray([specialFavIcon], this.getFavicons(), true).filter(Boolean);
                        keywords = this.getKeywords();
                        mediaType = specialMediaType || this.getMediaType();
                        contentType = ((_c = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.common) === null || _c === void 0 ? void 0 : _c["Content-Type"]) || "";
                        charset = contentType ? contentType.split("charset=")[1] : "";
                        return [2 /*return*/, {
                                url: this.url,
                                title: title,
                                siteName: siteName,
                                description: description,
                                mediaType: mediaType,
                                contentType: contentType,
                                images: images,
                                favicons: favicons,
                                charset: charset,
                                keywords: keywords,
                            }];
                    case 6:
                        error_2 = _d.sent();
                        throw error_2;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MainExtractor.prototype.getFavicons = function () {
        var _this = this;
        var favicons = [];
        this.cheerioApi(constants_1.ICON_LINK_TAGS).each(function (_, element) {
            var href = _this.cheerioApi(element).attr("href");
            if (href)
                favicons.push(new URL(href, _this.getBaseUrl()).href);
        });
        return favicons;
    };
    MainExtractor.prototype.getImages = function () {
        var _this = this;
        var images = [];
        this.cheerioApi(constants_1.OG_IMAGE).each(function (_, element) {
            var src = _this.cheerioApi(element).attr(constants_1.META_CONTENT);
            if (src)
                images.push(src);
        });
        this.cheerioApi(constants_1.OG_IMAGE_URL).each(function (_, element) {
            var src = _this.cheerioApi(element).attr(constants_1.META_CONTENT);
            if (src)
                images.push(src);
        });
        if (!images.length) {
            this.cheerioApi("*[class*='VideoThumbnail']").each(function (_, element) {
                var src = _this.cheerioApi(element).attr("src");
                if (src)
                    images.push(src);
            });
        }
        if (!images.length) {
            this.cheerioApi("img").each(function (_, element) {
                var src = _this.cheerioApi(element).attr("src");
                if (src)
                    images.push(src);
            });
        }
        return images;
    };
    MainExtractor.prototype.getKeywords = function () {
        var keywords = this.cheerioApi(constants_1.OG_KEYWORDS).attr(constants_1.META_CONTENT) ||
            this.cheerioApi(constants_1.META_KEYWORDS).attr(constants_1.META_CONTENT) ||
            "";
        return keywords ? keywords.split(",") : [];
    };
    MainExtractor.prototype.extractYoutubeBotData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var title, description, image;
            var _this = this;
            return __generator(this, function (_a) {
                title = this.getTitle();
                description = "";
                image = "";
                if (title.replace(/youtube/gi, "").replace(/[^A-Z0-9]+/gi, "").trim().length > 0) {
                    // Disable everyting because it's not in anti-bot mode
                    return [2 /*return*/, { title: "", description: "", image: "" }];
                }
                else {
                    this.cheerioApi("#player-placeholder").each(function (_, element) {
                        var style = _this.cheerioApi(element).attr("style");
                        console.log("player-placeholder style", style);
                        var backgroundImageMatch = style === null || style === void 0 ? void 0 : style.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
                        if (backgroundImageMatch) {
                            image = backgroundImageMatch[1];
                        }
                    });
                    this.cheerioApi("script").each(function (_, element) {
                        var _a, _b;
                        var scriptContent = _this.cheerioApi(element).text();
                        if (scriptContent.match(/^\s*(var|let|const)\s+ytInitialData\s*=\s*[{]/)) {
                            console.log("Found ytInitialData");
                            var ytInitialData = scriptContent
                                .replace(/^\s*(var|let|const)\s+ytInitialData\s*=\s*/, "")
                                .replace(/\s*;?$/, "");
                            var obj = JSON.parse(ytInitialData);
                            var objTitle = _this.scanObject(obj, function (o, k) {
                                var _a;
                                return k === "playerOverlayVideoDetailsRenderer" && ((_a = o.title) === null || _a === void 0 ? void 0 : _a.simpleText);
                            });
                            if ((_a = objTitle === null || objTitle === void 0 ? void 0 : objTitle.title) === null || _a === void 0 ? void 0 : _a.simpleText) {
                                title = objTitle.title.simpleText;
                            }
                            var objAuthor = _this.scanObject(obj, function (o, k) {
                                var _a;
                                return k === "videoDescriptionInfocardsSectionRenderer" && ((_a = o.sectionTitle) === null || _a === void 0 ? void 0 : _a.simpleText);
                            });
                            if ((_b = objAuthor === null || objAuthor === void 0 ? void 0 : objAuthor.sectionTitle) === null || _b === void 0 ? void 0 : _b.simpleText) {
                                description = 'YouTube video by ' + objAuthor.sectionTitle.simpleText;
                            }
                            var objDescription = _this.scanObject(obj, function (o, k) {
                                return k === "attributedDescriptionBodyText" && o.content;
                            });
                            if (objDescription === null || objDescription === void 0 ? void 0 : objDescription.content) {
                                description = objDescription.content;
                                if (description.length > 160) {
                                    description = description.substring(0, 157) + "...";
                                }
                            }
                        }
                    });
                    return [2 /*return*/, { title: title, description: description, image: image }];
                }
                return [2 /*return*/];
            });
        });
    };
    MainExtractor.prototype.fetchTikTokData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var description, image, mediaType, favIcon, appContext, json, key, tdata, tikTokoembedLink, _a, headers, timeout, tiktokData;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        description = "";
                        image = "";
                        mediaType = "";
                        favIcon = "https://github.com/edapess/link-previewer/blob/master/src/assets/tiktokpreview.jpeg";
                        appContext = this.cheerioApi("#__UNIVERSAL_DATA_FOR_REHYDRATION__").text();
                        json = JSON.parse(appContext);
                        key = Object.keys(json)[0];
                        tdata = json[key];
                        tikTokoembedLink = tdata["seo.abtest"].canonical;
                        if (!tikTokoembedLink.includes("/video/")) return [3 /*break*/, 2];
                        _a = this.options || {}, headers = _a.headers, timeout = _a.timeout;
                        return [4 /*yield*/, axiosInstance_1.axiosInstance.get("".concat(constants_1.TIK_TOK_BASE).concat(tikTokoembedLink), {
                                headers: headers !== null && headers !== void 0 ? headers : {
                                    "user-agent": constants_1.USER_AGENT,
                                    "Accept-Language": constants_1.ACCEPT_LANGUAGE,
                                    "Access-Control-Allow-Origin": constants_1.ACCESS_CONTROL_ALLOW_ORIGIN,
                                    Accept: constants_1.ACCEPT,
                                    "Content-Type": constants_1.CONTENT_TYPE,
                                },
                                timeout: timeout !== null && timeout !== void 0 ? timeout : 3000,
                            })];
                    case 1:
                        tiktokData = _c.sent();
                        description = (_b = tiktokData === null || tiktokData === void 0 ? void 0 : tiktokData.data) === null || _b === void 0 ? void 0 : _b.title;
                        image = tiktokData.data.thumbnail_url;
                        mediaType = tiktokData.data.type;
                        return [3 /*break*/, 3];
                    case 2:
                        image = favIcon;
                        _c.label = 3;
                    case 3: return [2 /*return*/, { description: description, image: image, mediaType: mediaType, favIcon: favIcon }];
                }
            });
        });
    };
    return MainExtractor;
}());
exports.default = MainExtractor;

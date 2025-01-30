import { CheerioAPI, load } from "cheerio";
import {
  ACCEPT,
  ACCEPT_LANGUAGE,
  ACCESS_CONTROL_ALLOW_ORIGIN,
  CONTENT_TYPE,
  ICON_LINK_TAGS,
  META_CONTENT,
  META_DESCRIPTION,
  META_KEYWORDS,
  META_TITLE,
  OG_DESCRIPTION,
  OG_IMAGE,
  OG_IMAGE_URL,
  OG_KEYWORDS,
  OG_SITE_NAME,
  OG_TITLE,
  OG_TYPE,
  TIK_TOK_BASE,
  TITLE_TAG,
  USER_AGENT,
} from "./constants";

import { axiosInstance } from "./axiosInstance";
import { TOptions } from "./types/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default class MainExtractor {
  private cheerioApi: CheerioAPI;
  private url: string;
  private options?: TOptions;

  constructor(url: string, options?: TOptions) {
    this.url = url;
    this.cheerioApi = load("");
    this.options = options;
  }
  protected getBaseUrl(): string {
    const parts = this.url.split("/");
    return parts[0] + "//" + parts[2];
  }

  public async getlinkPreviewData(): Promise<{
    url: string;
    title: string;
    siteName: string;
    description: string;
    mediaType: string;
    contentType: any;
    images: string[];
    favicons: string[];
    charset: any;
    keywords: string[];
  }> {
    try {
      const html = await this.fetchHTML();
      if (html) {
        this.cheerioApi = load(html);
      }
      const baseUrl = this.getBaseUrl();
      
      let specialTitle = "";
      let specialDescription = "";
      let specialImage = "";
      let specialMediaType = "";
      let specialFavIcon = "";

      if (baseUrl.includes("tiktok.com")) {
        const tiktokData = await this.fetchTikTokData();
        specialDescription = tiktokData.description;
        specialImage = tiktokData.image;
        specialMediaType = tiktokData.mediaType;
        specialFavIcon = tiktokData.favIcon;
      } else if (baseUrl.includes("youtube.com")) {
        // Extract youtube data only if it's in anti-bot mode
        const youtubeBotData = await this.extractYoutubeBotData();
        specialTitle = youtubeBotData.title;
        specialDescription = youtubeBotData.description;
        specialImage = youtubeBotData.image;
      }

      const title = specialTitle || this.getTitle();
      const description = specialDescription || this.getDescription();
      const siteName = this.getSiteName();
      const images = [specialImage, ...this.getImages()].filter(Boolean);
      const favicons = [specialFavIcon, ...this.getFavicons()].filter(Boolean);

      const keywords = this.getKeywords();
      const mediaType = specialMediaType || this.getMediaType();
      const contentType = this.options?.headers?.common?.["Content-Type"] || "";

      const charset = contentType ? contentType.split("charset=")[1] : "";

      return {
        url: this.url,
        title,
        siteName,
        description,
        mediaType,
        contentType,
        images,
        favicons,
        charset,
        keywords,
      };
    } catch (error) {
      throw error;
    }
  }

  protected fetchHTML = async (): Promise<string | undefined> => {
    const { headers, timeout } = this.options || {};
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second delay between retries
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        attempt++;
        let response = await axiosInstance.get(this.url, {
          headers: headers ?? {
            "user-agent": USER_AGENT,
            "Accept-Language": ACCEPT_LANGUAGE,
            "Access-Control-Allow-Origin": ACCESS_CONTROL_ALLOW_ORIGIN,
            Accept: ACCEPT,
            "Content-Type": CONTENT_TYPE,
          },
          timeout: timeout ?? 3000,
        });
        return response.data.toString();
      } catch (error) {
        if (attempt >= maxRetries) {
          throw error;
        }
        await delay(retryDelay);
      }
    }
  };

  protected getDescription = (): string => {
    return (
      this.cheerioApi(OG_DESCRIPTION).attr(META_CONTENT) ||
      this.cheerioApi(META_DESCRIPTION).attr(META_CONTENT) ||
      ""
    );
  };
  protected getFavicons(): string[] {
    const favicons: string[] = [];
    this.cheerioApi(ICON_LINK_TAGS).each((_, element) => {
      const href = this.cheerioApi(element).attr("href");
      if (href) favicons.push(new URL(href, this.getBaseUrl()).href);
    });
    return favicons;
  }

  protected getImages(): string[] {
    const images: string[] = [];

    this.cheerioApi(OG_IMAGE).each((_, element) => {
      const src = this.cheerioApi(element).attr(META_CONTENT);
      if (src) images.push(src);
    });

    this.cheerioApi(OG_IMAGE_URL).each((_, element) => {
      const src = this.cheerioApi(element).attr(META_CONTENT);
      if (src) images.push(src);
    });

    if (!images.length) {
      this.cheerioApi("*[class*='VideoThumbnail']").each((_, element) => {
        const src = this.cheerioApi(element).attr("src");
        if (src) images.push(src);
      });
    }

    if (!images.length) {
      this.cheerioApi("img").each((_, element) => {
        const src = this.cheerioApi(element).attr("src");
        if (src) images.push(src);
      });
    }

    return images;
  }
  protected getKeywords(): string[] {
    const keywords =
      this.cheerioApi(OG_KEYWORDS).attr(META_CONTENT) ||
      this.cheerioApi(META_KEYWORDS).attr(META_CONTENT) ||
      "";
    return keywords ? keywords.split(",") : [];
  }
  protected getMediaType = (): string => {
    return this.cheerioApi(OG_TYPE).attr(META_CONTENT) || "";
  };
  protected getSiteName = (): string => {
    return this.cheerioApi(OG_SITE_NAME).attr(META_CONTENT) || "";
  };
  private scanObject = (obj: any, predicate: (obj: any, key: string | null) => boolean, thisKey: string | null = null): any => {
    if (typeof obj !== "object" || obj === null) return undefined;
    if (typeof obj === "object" && predicate(obj, thisKey)) {
      return obj;
    };
    for (const k in obj) {
      if (obj.hasOwnProperty(k)) {
        const result = this.scanObject(obj[k], predicate, k);
        if (result !== undefined) return result;
      }
    }
    return undefined;
  };
  protected async extractYoutubeBotData(): Promise<{
    title: string;
    description: string;
    image: string;
  }> {
    let title = this.getTitle();
    let description = "";
    let image = "";
    if (title.replace(/youtube/gi, "").replace(/[^A-Z0-9]+/gi, "").trim().length > 0) {
      // Disable everyting because it's not in anti-bot mode
      return { title: "", description: "", image: "" };
    } else {
      this.cheerioApi("#player-placeholder").each((_, element) => {
        const style = this.cheerioApi(element).attr("style");
        console.log("player-placeholder style", style);
        const backgroundImageMatch = style?.match(/background-image:\s*url\(['"]?(.*?)['"]?\)/);
        if (backgroundImageMatch) {
          image = backgroundImageMatch[1];
        }
      });
      this.cheerioApi("script").each((_, element) => {
        const scriptContent = this.cheerioApi(element).text();
        if (scriptContent.match(/^\s*(var|let|const)\s+ytInitialData\s*=\s*[{]/)) {
          console.log("Found ytInitialData");
          const ytInitialData = scriptContent
            .replace(/^\s*(var|let|const)\s+ytInitialData\s*=\s*/, "")
            .replace(/\s*;?$/, "");
            const obj = JSON.parse(ytInitialData);
            const objTitle = this.scanObject(obj, (o, k) => {
              return k === "playerOverlayVideoDetailsRenderer" && o.title?.simpleText;
            });
            if (objTitle?.title?.simpleText) {
              title = objTitle.title.simpleText;
            }
            const objAuthor = this.scanObject(obj, (o, k) => {
              return k === "videoDescriptionInfocardsSectionRenderer" && o.sectionTitle?.simpleText;
            });
            if (objAuthor?.sectionTitle?.simpleText) {
              description = 'YouTube video by ' + objAuthor.sectionTitle.simpleText;
            }
            const objDescription = this.scanObject(obj, (o, k) => {
              return k === "attributedDescriptionBodyText" && o.content;
            });
            if (objDescription?.content) {
              description = objDescription.content;
              if (description.length > 160) {
                description = description.substring(0, 157) + "...";
              }
            }

        }
      });
      return { title, description, image };
    }
  }
  protected async fetchTikTokData(): Promise<{
    description: string;
    image: string;
    mediaType: string;
    favIcon: string;
  }> {
    let description = "";
    let image = "";
    let mediaType = "";
    const favIcon =
      "https://github.com/edapess/link-previewer/blob/master/src/assets/tiktokpreview.jpeg";

    const appContext = this.cheerioApi(
      "#__UNIVERSAL_DATA_FOR_REHYDRATION__"
    ).text();
    const json = JSON.parse(appContext);
    const key = Object.keys(json)[0];
    const tdata = json[key];
    const tikTokoembedLink = tdata["seo.abtest"].canonical;

    if (tikTokoembedLink.includes("/video/")) {
      const { headers, timeout } = this.options || {};
      const tiktokData = await axiosInstance.get(
        `${TIK_TOK_BASE}${tikTokoembedLink}`,

        {
          headers: headers ?? {
            "user-agent": USER_AGENT,
            "Accept-Language": ACCEPT_LANGUAGE,
            "Access-Control-Allow-Origin": ACCESS_CONTROL_ALLOW_ORIGIN,
            Accept: ACCEPT,
            "Content-Type": CONTENT_TYPE,
          },
          timeout: timeout ?? 3000,
        }
      );
      description = tiktokData?.data?.title;
      image = tiktokData.data.thumbnail_url;
      mediaType = tiktokData.data.type;
    } else {
      image = favIcon;
    }

    return { description, image, mediaType, favIcon };
  }

  protected getTitle = (): string => {
    return (
      this.cheerioApi(OG_TITLE).attr(META_CONTENT) ||
      this.cheerioApi(TITLE_TAG).text() ||
      this.cheerioApi(META_TITLE).attr(META_CONTENT) ||
      ""
    );
  };
}

# Link Previewer
`@edapess/link-previewer` is a simple tool for extracting link preview data from web pages, including titles, descriptions, images, and more. This package is especially useful for applications that need to display rich link previews, such as social media platforms or messaging apps.

# Features
- Extracts title, description, site name, images, favicons, and more from web pages.
- Supports fetching data from TikTok links specifically.
- Customizable request headers and timeouts.
- Built with TypeScript for type safety.

# Installation
Install the package using npm or yarn:

```bash
npm install @edapess/link-previewer
```
or
```bash
yarn add @edapess/link-previewer
```
# Usage
To use the link-previewer, import the getLinkPreviewData function and call it with the URL you want to preview. You can also pass optional headers and timeout settings.

# Example

```javascript
import { getLinkPreviewData } from '@edapess/link-previewer';

const fetchPreviewData = async (url) => {
  try {
    const data = await getLinkPreviewData(url, {
      headers: {
        'user-agent': 'your-user-agent',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 5000,
    });

    console.log(data);
  } catch (error) {
    console.error('Error fetching link preview data:', error);
  }
};

fetchPreviewData('https://example.com');
```
# Response Format
The ```getLinkPreviewData``` function returns a promise that resolves to an object containing the following properties:

- `url`: The URL of the page.
- `title`: The title of the page.
- `siteName`: The name of the site.
- `description`: The description of the page.
- `mediaType`: The type of media (e.g., "website", "video").
- `contentType`: The content type of the response.
- `images`: An array of image URLs.
- `favicons`: An array of favicon URLs.
- `charset`: The character set of the page.
- `keywords`: An array of keywords from the page.
# Example Response
```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "siteName": "Example",
  "description": "This domain is for use in illustrative examples in documents.",
  "mediaType": "website",
  "contentType": "text/html; charset=UTF-8",
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "favicons": ["https://example.com/favicon.ico"],
  "charset": "UTF-8",
  "keywords": ["example", "domain", "illustrative"]
}
```
# Options
The `getLinkPreviewData` function accepts an options object with the following properties:

- `headers`: Custom headers to use when making the request. Default headers include user-agent, Accept-Language, Access-Control-Allow-Origin, and Accept.
- `noHeaders`: If set to true, no headers will be sent with the request. Defaults to false.
- `timeout`: The request timeout in milliseconds. Defaults to 3000.
# Contributing
Contributions are welcome! If you find a bug or have a feature request, please open an issue on GitHub.

# License
This project is licensed under the MIT License. See the LICENSE file for details.






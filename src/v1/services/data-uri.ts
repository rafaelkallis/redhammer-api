/**
 * @file data uri service
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

const base64ImageBodyRegex = /^data:([\w\/]+);([\w-]+),([\w\/+=]+)$/;

const dataURI = {
  /**
   * Decodes a given data URI and returns the media type, encoding and payload
   */
  decode(
    data: string
  ): { mediaType: string; encoding: string; payload: Buffer } | false {
    try {
      data = decodeURIComponent(data);
    } catch (e) {
      return false;
    }
    const matches = base64ImageBodyRegex.exec(data);
    if (!matches) {
      return false;
    }
    const [, mediaType, encoding, rawPayload] = matches;
    if (encoding !== "base64") {
      return false;
    }
    const payload = Buffer.from(rawPayload, encoding);
    return { mediaType, encoding, payload };
  }
};

const dataURIService = dataURI;

export { dataURI, dataURIService };

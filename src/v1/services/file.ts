/**
 * @file file service
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import aws from "aws-sdk";
import { config } from "../../config";

const s3 = new aws.S3({
  accessKeyId: config.S3_ACCESS_KEY_ID,
  secretAccessKey: config.S3_SECRET_ACCESS_KEY
});

const isS3UrlRegex = /^https:\/\/([A-Za-z0-9-]+)\.s3(\.)?([a-z0-9-]+)?\.amazonaws.com\/([A-Za-z0-9-_]+)$/;
const isBase64UrlRegex = /^([A-Za-z0-9-_]+)$/;

export const file = {
  /**
   * Uploads the given payload and return a url.
   */
  async upload(
    key: string,
    payload: Buffer,
    ContentType: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: config.S3_BUCKET,
        Key: key,
        Body: payload,
        ContentType
      };

      s3.upload(params, (err: Error | null, data: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data.Location);
      });
    });
  },

  /**
   * Deletes object with the given key or url.
   */
  async delete(keyOrUrl: string): Promise<void> {
    let Key: string;

    const s3UrlRegexMatcher = isS3UrlRegex.exec(keyOrUrl);
    if (s3UrlRegexMatcher) {
      // @ts-ignore
      const [, urlS3Bucket, , urlS3Region, urlKey] = s3UrlRegexMatcher;
      if (urlS3Bucket !== config.S3_BUCKET) {
        // TODO: throw error instead?
        return;
      }
      Key = urlKey;
    } else if (isBase64UrlRegex.test(keyOrUrl)) {
      Key = keyOrUrl;
    } else {
      // TODO: throw error instead?
      return;
    }
    return new Promise((resolve, reject) => {
      const params = { Bucket: config.S3_BUCKET, Key };

      s3.deleteObject(params, (err: Error | null, data: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data.Location);
      });
    });
  }
};

export const fileService = file;

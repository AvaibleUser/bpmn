import { s3 } from "bun";

export class S3Controller {
  private bucket = process.env.S3_BUCKET;
  private region = process.env.S3_REGION;
  private url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/`;

  async store(filename: string, data: File) {
    filename = `${filename}.${data.type.split("/")[1]}`;
    await s3.write(filename, data, { type: data.type });
    return this.url + filename;
  }

  async delete(filename: string) {
    await s3.delete(filename);
  }
}

export const s3Controller = new S3Controller();

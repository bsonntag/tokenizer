import Jimp from "jimp";
import multiparty from "multiparty";
import nextConnect from "next-connect";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default nextConnect()
  .use(async (request, response, next) => {
    const form = new multiparty.Form();
    await form.parse(request, function (error, fields, files) {
      if (error) return next(error);
      request.body = fields;
      request.files = files;
      next();
    });
  })
  .post(async (request, response) => {
    const source = await Jimp.read(request.files.image[0].path);
    const mask = await Jimp.read("./public/mask.png");
    const border = await Jimp.read("./public/border.png");

    source
      .resize(256, 256)
      .mask(mask.resize(256, 256), 0, 0)
      .composite(border.resize(256, 256), 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 1,
        opacityDest: 1,
      })
      .getBuffer(Jimp.MIME_PNG, (error, buffer) => {
        response.setHeader("Content-Type", "image/png");
        response.status(200).send(buffer);
      });
  });

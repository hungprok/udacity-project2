import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { Request, Response } from "express";

(async () => {

  const app = express();
  const port = process.env.PORT || 8082;

  app.use(bodyParser.json());

  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  app.get("/filteredimage", async (req: Request, res: Response) => {
    let image_url: string = req.query.image_url;
    if (!image_url) {
      res.status(400).send('Bad request: url for image is required')
    }
    filterImageFromURL(image_url).then(result => {
      res.status(200).sendFile(result,
        function (err) {
          if (!err) {
            deleteLocalFiles([result]);
          } else {
            res.send(err.message)
          }
        }
      );
    }).catch(err => {
      console.log(err);
      res.status(400).send('Image is not valid');
    }) // TypeError: failed to fetch (the text may vary)
      ;
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
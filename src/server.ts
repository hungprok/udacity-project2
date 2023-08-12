import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  const app = express();
  const port = process.env.PORT || 8082;

  app.use(bodyParser.json());

  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  app.get("/filteredimage", async (req, res) => {
    let image_url = req.query.image_url;
    if (!image_url) {
      res.status(400).send('Bad request: url for image is required')
    }
    filterImageFromURL(image_url).then(result => {
      res.sendFile(result,
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
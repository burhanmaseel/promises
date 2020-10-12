const https = require("https");
const RSVP = require("rsvp");

exports.getTitles = async (req, res) => {
   let address = req.query.address;
   if (!Array.isArray(req.query.address)) {
      address = [req.query.address];
   }
   const promises = address.map(url => {
      return new RSVP.Promise((resolve, reject) => {
         https.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
               data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
               title = url + " - " + data.split("<title>").pop().split("</title>")[0];
               resolve(title);
            });

         }).on("error", (err) => {
            let title = url + " - NO RESPONSE";
            resolve(title);
         });
      });
   });

   RSVP.all(promises).then(titles => {
      res.status(200).render('index', {
         titles: titles
      });
   }).catch(err => {
      if (err) {
         console.log(err);
      }
   })

}

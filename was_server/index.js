const express = require("express");
const next = require("next");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const axios = require('axios');

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();


axios.defaults.baseURL = 'https://relive.pt/wp-json'

axios.post('/jwt-auth/v1/token', { username: 'sergioferras97', password: process.env.PASS })
  .then(res => {
    axios.defaults.headers.common = { 'Authorization': `Bearer ${res.data.token}` }
  })
  .catch(e => console.log("WTF", e))


app
  .prepare()
  .then(() => {
    const server = express();

/*     server.set('views', __dirname + '/views');
    server.set('view engine', 'jsx');
    server.engine('jsx', require('express-react-views').createEngine()); */

    /* const showRoutes = require("./routes/index.js"); */

    server.use(bodyParser.json()); // for parsing application/json
    server.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
    server.use(cookieParser()); 
    /* server.use("/api", showRoutes(server)); */

/*     server.post('/api', (req, res) => {
      handle(req, res, req.url)
    }); */

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`> Ready on ${PORT}`);
    });
  })
  .catch(ex => {
    console.log(ex.stack);
    process.exit(1);
  });

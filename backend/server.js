const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

//////// CONFIGURATION ///////////

// insert your own ssl certificate and keys
/* const options = {
    key: fs.readFileSync(path.join(__dirname,'..','ssl','key.pem'), 'utf-8'),
    cert: fs.readFileSync(path.join(__dirname,'..','ssl','cert.pem'), 'utf-8')
} */

const port = process.env.PORT || 8000;

////////////////////////////

require("./routes")(app);

// const httpsServer = httpolyglot.createServer(options, app)
const io = require("socket.io")(server);
require("./socketController")(io);

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

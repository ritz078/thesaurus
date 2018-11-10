const next = require("next");
const translate = require("google-translate-query");
const iso = require("iso-639-1");
const codes = iso.getAllCodes();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
var ts = require("thesaurus-service");

io.on("connection", function(socket) {
  let streamTs;
  socket.on("get.synonyms", query => {
    if (streamTs) streamTs.destroy();
    streamTs = ts.stream(query); // streamTs is a Readable stream
    let body = [];

    // Readable streams emit 'data' events once a listener is added
    streamTs.on("data", chunk => {
      // pagination
      if (body.length === 50) {
        socket.emit(
          "synonyms",
          body.map(datum => ({
            ...datum,
            query
          }))
        );
        body = [];
      }
      body.push(chunk);
    });

    // the 'end' event indicates that the entire body has been received
    streamTs.on("end", () => {
      try {
        socket.emit(
          "synonyms",
          body.map(datum => ({
            ...datum,
            query
          }))
        );
        socket.emit("complete");
      } catch (er) {
        // uh oh! bad json!
        console.log("bad json");
      }
    });

    streamTs.on("error", console.log);
  });

  socket.on("get.synonyms.lang", function(query) {
    const promises = codes.map(code => translate(query, { to: code }));

    Promise.all(promises.map(p => p.catch(() => undefined)))
      .then(responses => {
        socket.emit(
          "synonyms.lang",
          responses
            .map(
              (resp, i) =>
                resp && {
                  lang: iso.getName(codes[i]),
                  query,
                  word: resp.text
                }
            )
            .filter(Boolean)
        );
      })
      .catch(err => {
        console.error(err);
      });
  });
});

nextApp.prepare().then(() => {
  app.get("/api/:word", (req, _res) => {
    const promises = codes.map(code =>
      translate(req.params.word, { to: code })
    );

    Promise.all(promises.map(p => p.catch(() => undefined)))
      .then(responses => {
        _res.json(
          responses
            .map(
              (resp, i) =>
                resp && {
                  ...resp,
                  lang: iso.getName(codes[i])
                }
            )
            .filter(Boolean)
        );
      })
      .catch(err => {
        console.error(err);
      });
  });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

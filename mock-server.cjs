const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(jsonServer.bodyParser);

// login endpoint simulation
server.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "demo@home24.de" && password === "password") {
    res.jsonp({
      id: 1,
      email: "demo@home24.de",
      name: "Demo User",
      token: "fake-jwt-token",
    });
  } else {
    res.status(400).jsonp({ message: "Invalid email or password" });
  }
});

server.use((req, res, next) => {
  setTimeout(next, 300);
});

server.use("/api", router);

const PORT = 3001;
server.listen(PORT, () => {
  console.info(`JSON Server is running on port ${PORT}`);
  console.info(`Home24 BXP API is running on http://localhost:${PORT}/api`);
});

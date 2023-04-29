const express = require("express");
const app = express();
const config = require("./config");
const Routes = require("./v1/routes");
const db = require("./models");
const { swaggerUi, specs } = require("./config/swaggerConfig");
const fileUpload = require("express-fileupload");
const cors = require('cors');

const PORT = process.env.PORT || config.PORT;
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// add cors to avoid issue
app.use(cors());
// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "uploads/temp/",
  })
);

// verison one all routes
app.use("/api/v1/", Routes);

app.get("/", (req, res) => res.send("Hello World!"));

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.log("Middleware Error Handling");
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  res.status(errStatus).json({
    message: errMsg,
  });
});

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.listen(PORT, () => console.log(`workign on ${PORT} port`));

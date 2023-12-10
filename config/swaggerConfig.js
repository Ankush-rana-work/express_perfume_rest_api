import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import config from "../config/index.js";

const {PORT} = config;
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a perfume product API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Ankush Rana",
        url: "",
        email: "ankush0094@email.com",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
      },
    ],
  },
  apis: ["./v1/controllers/*.js"],
};

const specs = swaggerJSDoc(options);
export { swaggerUi, specs };

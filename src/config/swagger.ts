import path from "path";
import swaggerJSDoc, { type Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "Auth va Tasks CRUD uchun API hujjati",
    },
    tags: [
      { name: "Auth", description: "Autentifikatsiya endpointlari" },
      { name: "Tasks", description: "Task CRUD endpointlari" },
    ],
    servers: [
      {
        url: "https://node-todo-vv2s.onrender.com",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AuthRegisterInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "user@mail.com" },
            password: { type: "string", example: "123456" },
            name: { type: "string", example: "Ismoiljon" },
          },
        },
        AuthLoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "user@mail.com" },
            password: { type: "string", example: "123456" },
          },
        },
        RefreshTokenInput: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string", example: "eyJ..." },
          },
        },
        TaskCreateInput: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", example: "Documentation yozish" },
            status: {
              type: "string",
              enum: ["TODO", "IN_PROGRESS", "DONE"],
              example: "TODO",
            },
          },
        },
        TaskUpdateInput: {
          type: "object",
          properties: {
            title: { type: "string", example: "Documentationni tugatish" },
            status: {
              type: "string",
              enum: ["TODO", "IN_PROGRESS", "DONE"],
              example: "DONE",
            },
          },
        },
      },
    },
  },
  apis: [path.join(process.cwd(), "src/modules/**/*.routes.ts")],
};

export const swaggerSpec = swaggerJSDoc(options);

import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import path from "path";

config();

const SSL_CERT = "-----BEGIN CERTIFICATE-----THESECRETNEEDSTOBEPASTEDHERE-----END CERTIFICATE-----";

const isCompiled = path.extname(__filename).toLowerCase() === ".js";

const sslConfig =
  process.env.DATABASE_HOST != "localhost" ? { ca: SSL_CERT } : null;

const entitiesPath = isCompiled ? "dist/models" : "src/models";
const migrationsPath = isCompiled ? "dist/migrations" : "src/migrations";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: 5432,
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "root",
  database: process.env.DATABASE_NAME || "chatapp",
  synchronize: false,
  logging: false,
  ssl: sslConfig,
  entities: [`${entitiesPath}/*.${isCompiled ? "js" : "ts"}`],
  migrationsTableName: "migrations",
  migrations: [`${migrationsPath}/*.${isCompiled ? "js" : "ts"}`],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

export default AppDataSource;

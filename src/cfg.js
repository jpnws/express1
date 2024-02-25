import config from "config";

/**
 * Build the configuration object for the application. The configuration object
 * is built by merging the default configuration with the environment-specific
 * configuration.
 */
export const getConfig = () => {
  // Detect the environment. Default to "default" if not set.
  const appEnv = process.env.NODE_ENV || "default";
  // Get the environment-specific configuration.
  const envConfig = getEnvConfig(appEnv);
  // Get the default configuration.
  const defaultConfig = config.get("default");
  // Get the production environment configuration.
  const prodEnvConfig = getProdEnvConfig(appEnv);
  // Merge the default and environment-specific configuration.
  const conf = {
    app: {
      ...defaultConfig.app,
      ...envConfig.app,
      ...prodEnvConfig.app,
    },
    db: {
      ...defaultConfig.db,
      ...envConfig.db,
      ...prodEnvConfig.db,
    },
  };
  return conf;
};

/**
 * Get the environment-specific configuration.
 */
const getEnvConfig = (appEnv) => {
  if (config.has(appEnv)) {
    return config.get(appEnv);
  }
  return {};
};

/**
 * Get the production environment configuration.
 */
const getProdEnvConfig = (appEnv) => {
  if (appEnv === "production") {
    return {
      app: {
        baseUrl: process.env.APP_APPLICATION__BASE_URL,
      },
      db: {
        host: process.env.APP_DATABASE__HOST,
        port: process.env.APP_DATABASE__PORT,
        database: process.env.APP_DATABASE__DATABASE_NAME,
        user: process.env.APP_DATABASE__USERNAME,
        password: process.env.APP_DATABASE__PASSWORD,
      },
    };
  }
  return {};
};

/**
 * Build the postgres connection configuration WITHOUT the database name.
 */
export const withoutDb = (dbConfig) => {
  return {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    ssl: dbConfig.ssl,
  };
};

/**
 * Build the postgres connection configuration WITH the database name.
 */
export const withDb = (dbConfig) => {
  return {
    ...withoutDb(dbConfig),
    database: dbConfig.database,
  };
};

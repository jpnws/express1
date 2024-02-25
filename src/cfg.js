import config from "config";

export const getConfig = () => {
  const appEnv = process.env.NODE_ENV;

  let envConfig;
  try {
    envConfig = config.get(appEnv);
  } catch (error) {
    console.warn(`No configuration found for ${appEnv}, using default.`);
    envConfig = {};
  }

  const defaultConfig = config.get("default");
  const conf = {
    app: { ...defaultConfig.app, ...envConfig.app },
    db: { ...defaultConfig.db, ...envConfig.db },
  };

  return conf;
};

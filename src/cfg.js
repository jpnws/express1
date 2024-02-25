import config from "config";

export const getConfig = () => {
  const appEnv = process.env.NODE_ENV || "local";

  let envConfig;
  try {
    envConfig = config.get(appEnv);
  } catch (error) {
    // console.warn(`No configuration found for ${appEnv}, using default.`);
    envConfig = {};
  }

  const defaultConfig = config.get("default");
  const conf = { ...defaultConfig, ...envConfig };
  return conf;
};

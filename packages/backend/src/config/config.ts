if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const getFromEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env variable ${key}`);
  }
  return value;
};

export const config = {
  app: {
    port: getFromEnv("API_PORT"),
  },
  mongo: {
    url: `mongodb://${getFromEnv("MONGODB_HOST")}:${getFromEnv("MONGODB_PORT")}`,
    user: getFromEnv("MONGODB_USER"),
    pass: getFromEnv("MONGODB_PASS"),
  },
  secret: {
    jwt: getFromEnv("JWT_SECRET"),
    gptRefresh: getFromEnv("GPT_REFRESH_SECRET"),
  },
  gptApi: {
    refreshUrl: getFromEnv("GPT_REFRESH_URL"),
    url: getFromEnv("GPT_API_URL"),
  },
};

import mongoose from "mongoose";

import config from "../config";

export default async () => {
  const mongoURI = config.DEV_MONGODB_CONNECTION_URI;
  const options = {
    autoCreate: true,
  };
  const connection = await mongoose.connect(mongoURI, options);

  return connection;
};

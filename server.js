import app from "./src/app.js";
import { APP_ENV, APP_URL, PORT } from "./src/constants.js";
import mongoConnect from "./src/db/mongodb.js";
app.listen(PORT, () => {
  console.log(
    `Server is running on ${
      APP_ENV === "development" ? `http://localhost:${PORT}` : `${APP_URL}`
    }/api/v1`
  );
  mongoConnect();
});

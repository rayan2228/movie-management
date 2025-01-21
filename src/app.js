import e from "express";
import errorHandler from "./middlewares/errorhandler.middleware";

const app = e();

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use(errorHandler);
export default app;
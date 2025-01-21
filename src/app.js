import e from "express";
import errorHandler from "./middlewares/errorhandler.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ORIGIN_URLS } from "./constants";
const app = e();

app.use(e.json({ limit: "16mb" }));
app.use(e.urlencoded({ extended: true, limit: "16mb" }));
app.use(e.static("public"));
app.use(cookieParser());
app.use(
    cors({
        origin: ORIGIN_URLS,
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use(errorHandler);
export default app;
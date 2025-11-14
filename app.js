import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));

app.use(express.urlencoded({extended: true, limit:"16kb"}));

app.use(express.static("public"));

app.use(cookieParser());

// routes
//import userRouter from "./routes/user.routes.js";
import listingRouter from "./src/routes/listing.routes.js";

app.get("/", (req, res)=>{
    res.send("API is running...");
});
app.use("/api/v1/listings", listingRouter);

//routes decleration
//app.use("/api/v1/users", userRouter);

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({ message });
});

export { app }

import connectDB from "./src/db/index.db.js"
import { app } from "./app.js";

import "dotenv/config";

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("Error on app", error);
            throw error;
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.log("Mongodb Connection failed !!!", err)
    });
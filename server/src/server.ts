import "dotenv/config";
import app from "./app/app.js";
import connectDB from "./app/db/config.js";

connectDB();

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

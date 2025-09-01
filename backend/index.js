import { app } from "./app.js";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config({
	path: "./.env",
});
//implement cors 
app.use(cors());
connectDB()
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(
				` ⚙️ Server is running on port http://localhost:${process.env.PORT}`
			);
		});
	})
	.catch((error) => {
		console.error(` ❌ fail to connect: ${error.message}`);
		process.exit(1);
	});

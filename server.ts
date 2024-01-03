import "dotenv/config";
import express, { Application, Request, Response } from "express";
import router from "./src/routes"

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (_req: Request, res: Response) => {
    return res.send("welcome to the REST-API");
});

// Routes
app.use(router);


app.listen(PORT, () => console.log(`Server running on port ${PORT} `));

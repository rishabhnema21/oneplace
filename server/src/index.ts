import express from "express"
import cors from "cors"
import { ENV } from "./config/env"
import { clerkMiddleware } from '@clerk/express'
import userRoutes from "./routes/user.routes"
import productRoutes from "./routes/products.routes"
import commentRoutes from "./routes/comments.routes"

const app = express();

app.use(cors({origin: ENV.CLIENT_URL}));
app.use(clerkMiddleware())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to OnePlace",
        endpoints: {
            users: "/api/users",
            products: "/api/products",
            comments: "/api/comments"
        }
    });
})

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

app.listen(ENV.PORT, () => {
    console.log(`app is starting with port ${ENV.PORT}`);
})
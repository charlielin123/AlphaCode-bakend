import express from "express";
import appSetup from "./startup/appSetup ";
import routerStartup from "./startup/routerStartup";

const app = express();

appSetup(app);
app.use(routerStartup);

export default app;
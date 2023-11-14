import express from "express";
import appSetup from "./startup/appSetup ";
import routerStartup from "./startup/routerStartup";

const app = express();

appSetup(app);
app.use("/api", (req, res) => {
  res.send('fuck you')
})
app.use(routerStartup);

const app2 = express();
app2.use("/survey", (req, res) => {
  res.send('survey')
});

app.listen(8087, () => {
  console.log("server start");
})
export default app;
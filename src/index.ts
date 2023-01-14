import express from "express";

import { router as mapsRouter } from './routes/map';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.raw({ type: "application/vnd.custom-type" }));
app.use(express.text({ type: "text/html" }));

app.use("/maps", mapsRouter)

app.get("/", async (req, res) => {
  res.send(
    `
  <h1>cavmapr API</h1>
  <h2>Available Routes</h2>
  <pre>
    GET, POST /maps
    GET, PUT, DELETE /maps/:id
  </pre>
  `.trim(),
  );
});

app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

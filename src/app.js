const express = require("express");
const app = express();
const PORT = 3000;

app.use("/hello", (req, res) => {
  res.send("Hello from the server");
});

app.use((req, res) => {
  res.send("The server is running...");
});

app.listen(PORT, () => {
  console.log("Server is listening on ", PORT);
});

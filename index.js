require('./light');
const app = require("express")();

app.use("/", (req, res) => {
  const name = "Ravi"
  res.send(name);
});

app.listen(3000, () => {
  console.log("running");
});

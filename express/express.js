const port = 3001;
const app = require("./expressApp");
app.listen(port, () => {
  console.log(`Kafka Minecraft backend app listening at http://localhost:${port}`);
});

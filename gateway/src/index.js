const app = require("./server");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
}); 
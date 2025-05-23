import app from "./app"
import "./utils/LogUtils"

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}.`);
});

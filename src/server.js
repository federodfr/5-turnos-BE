import app from "./app.js";
import config from "./config/env.config.js"

const PORT = config.port;
const NODE_ENV = config.nodeEnv;

app.listen(PORT, () => {
    console.log(`Servidor HTTP en http://localhost:${PORT} (${NODE_ENV})`);
});
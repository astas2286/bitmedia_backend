const express = require('express');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const cors = require('cors');
const { connectToMongoDB } = require('./utils/db');
const { init } = require('./websocket');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middlewares/errorHandler');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

connectToMongoDB();

app.use('/api', apiRoutes);
app.use(errorHandler); 
const server = createServer(app);
init(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

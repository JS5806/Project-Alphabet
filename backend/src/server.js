const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const cosmeticRoutes = require('./routes/cosmeticRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cosmetics', cosmeticRoutes);

// DB Sync and Start Server
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('Error: ' + err));
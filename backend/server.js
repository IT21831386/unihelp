const express = require('express');
const cors = require('cors');
require('dotenv').config();

const noticeRoutes = require('./routes/noticeRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/notices', noticeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (Permanent JSON File Storage Active)`);
});

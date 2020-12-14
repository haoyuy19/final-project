const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/viewJobs', require('./routes/api/viewJobs'));
app.use('/api/rank', require('./routes/api/rank'));
app.use('/api/recruiters', require('./routes/api/recruiters'));
app.use('/api/authRecruiters', require('./routes/api/authRecruiters'));
app.use('/api/recruiterProfile', require('./routes/api/recruiterProfile'));
app.use('/api/jobs', require('./routes/api/jobs'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

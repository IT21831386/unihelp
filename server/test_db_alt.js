const mongoose = require('mongoose');
const uri = 'mongodb+srv://db_user:Tharaka123@cluster0.ibmrkeg.mongodb.net/unihelp?retryWrites=true&w=majority';

mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB (ibmrkeg)');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILURE: Connection error (ibmrkeg):', err.message);
    process.exit(1);
  });

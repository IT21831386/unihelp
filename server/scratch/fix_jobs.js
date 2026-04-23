require('mongoose').connect('mongodb+srv://db_user:tharaka123@cluster0.xhawcbe.mongodb.net/unihelp?retryWrites=true&w=majority').then(async (db) => {
  const result = await db.connection.db.collection('jobs').updateOne(
    { title: 'ui ux enginner' },
    { 
      $set: { 
        title: 'UI/UX Engineer', 
        description: 'We are looking for a creative UI/UX Engineer to join our team at WSO2. You will be responsible for designing and implementing beautiful user interfaces for our global products.' 
      } 
    }
  );
  console.log('Fixed typo and placeholder. Matched:', result.matchedCount, 'Modified:', result.modifiedCount);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/Job');

const dummyLinks = [
  'https://careers.codegen.lk/frontend-developer',
  'https://jobs.virtusa.com/backend-developer',
  'https://careers.syscolabs.com/fullstack',
  'https://internships.wso2.com/software-engineering',
  'https://careers.ifs.com/devops-engineer',
  'https://jobs.99x.io/qa-automation',
  'https://rootcodelabs.com/careers/mobile-dev',
  'https://calcey.com/jobs/data-engineer',
  'https://elegantmedia.com/careers/ui-ux',
  'https://careers.pearson.lk/cloud-architect',
  'https://zone24x7.com/careers/ml-engineer',
  'https://slcert.gov.lk/careers/security-analyst',
  'https://arimac.digital/careers/react-native',
  'https://intellectdesign.com/jobs/python-dev',
  'https://careers.dialog.lk/database-admin',
  'https://wavenet.lk/careers/tech-lead',
  'https://developerstarter.com/jobs/wordpress',
  'https://millenniumitesp.com/careers/systems-engineer',
  'https://emblasoftware.com/jobs/angular-dev',
  'https://axiatadigitallabs.com/careers/sre',
  'https://jobs.virtusa.com/java-developer',
  'https://sliit.lk/careers/it-support',
  'https://tradefinex.org/careers/blockchain-dev',
  'https://creativesoftware.com/jobs/api-specialist',
  'https://bhashalanka.com/careers/game-dev-intern',
];

async function addLinks() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/unihelp'
    );
    console.log('Connected to MongoDB');

    const jobs = await Job.find().sort({ createdAt: -1 });
    console.log(`Found ${jobs.length} jobs`);

    for (let i = 0; i < jobs.length; i++) {
      const link = dummyLinks[i] || `https://example.com/apply/${i + 1}`;
      await Job.findByIdAndUpdate(jobs[i]._id, { link });
    }

    console.log(`✅ Updated ${jobs.length} jobs with dummy links`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addLinks();

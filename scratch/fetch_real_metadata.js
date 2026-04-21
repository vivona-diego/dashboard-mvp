
const axios = require('axios');

const baseURL = 'https://saasanalytic.fleetcostcare.com/';
const names = [
  "Jobs_By_Status",
  "jobs_profit_by_invoice",
  "jobs_profit_loss",
  "Quotes_By_Status",
  "quote_profit_forecast",
  "Preventive_Maintenance",
  "WO_Dashboard",
  "Job_Revenue_Forecast",
  "Equipment",
  "Quote_Revenue_Forecast"
];

async function fetchMetadata() {
  try {
    console.log('Attempting login...');
    const loginRes = await axios.post(`${baseURL}api/auth/login`, {
      username: 'demo',
      password: 'demo1234'
    });

    const token = loginRes.data.data.token;
    console.log('Login successful. Fetching datasets...');

    const results = {};
    for (const name of names) {
      process.stdout.write(`Fetching ${name}... `);
      try {
        const res = await axios.get(`${baseURL}api/bi/datasets/${name}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        results[name] = res.data.data.dataset || res.data.data;
        console.log('Done');
      } catch (e) {
        results[name] = { error: e.message };
        console.log('Failed');
      }
    }

    const fs = require('fs');
    fs.writeFileSync('real_metadata.json', JSON.stringify(results, null, 2));
    console.log('All results saved to real_metadata.json');
  } catch (err) {
    console.error('Fatal error:', err.message);
  }
}

fetchMetadata();

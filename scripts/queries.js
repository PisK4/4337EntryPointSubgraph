const axios = require('axios');
const fs = require('fs');

const dataArray = [];

axios.post('https://api.studio.thegraph.com/query/49058/4337entrypoint/v0.0.1',{
    query: `
    {
        accountDeployeds(
          first: 5
          orderBy: blockTimestamp
          orderDirection: desc
        ) {
          userOpHash
          sender
          factory
          paymaster
          blockNumber
          blockTimestamp
          transactionHash
        }
      
      }`
}).then((result) => {
    for (const resultGet of result.data.data.accountDeployeds) {
        console.log(resultGet);
        dataArray.push(resultGet);
    }
    const data = JSON.stringify(dataArray, null, 2);
    fs.writeFile('./scripts/output.json', data, (err) => {
        if (err) throw err;
    });
}).catch((error) => {
    console.log(error);
});
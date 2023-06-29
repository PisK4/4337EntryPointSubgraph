import pkg from '@apollo/client';
import fs from 'fs';
import moment from 'moment';
const { ApolloClient, InMemoryCache, gql } = pkg;  

const APIURL = 'https://api.studio.thegraph.com/query/49058/4337entrypoint/v0.0.1'
const tokensQuery = 
    `
    query (
      $first: Int, 
      $orderBy: BigInt, 
      $orderDirection: String){
      accountDeployeds(
        first: $first, 
        orderBy: $orderBy, 
        orderDirection: $orderDirection
      ) {
        sender
        paymaster
        factory
        paymaster
        userOpHash
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
    `
const client = new ApolloClient({  
        uri: APIURL,  cache: new InMemoryCache(),
})

client.query({ 
       query: gql(tokensQuery),  
       variables: {
        first: 5,
        orderBy: 'blockTimestamp',
        orderDirection: 'desc'
      }
}).then(
    (data) => {
      const accountDeployeds = data.data.accountDeployeds.map((deployed) => {
        const UTCtime = moment.utc(deployed.blockTimestamp * 1000).utcOffset(480).format('YYYY-MM-DD HH:mm:ss');
        const transactionUrl = `https://mumbai.polygonscan.com/tx/${deployed.transactionHash}`;
        return {
          ...deployed,
          "dataAnalyzed":{
            "UTC": UTCtime,
            "transactionUrl" : transactionUrl
          }
          
        };
      });
      const accountDeployedsString = JSON.stringify(accountDeployeds, null, 2);
          fs.writeFile('./uitils/eventLog.json', accountDeployedsString, (err) => {
          if (err) throw err;
      });
      console.log('Subgraph data: ', accountDeployedsString)
    }
    )  
    .catch((err) => {    
        console.log('Error fetching data: ', err)  
})


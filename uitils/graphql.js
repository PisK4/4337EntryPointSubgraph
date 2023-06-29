import pkg from '@apollo/client';
const { ApolloClient, InMemoryCache, gql } = pkg;  
import fs from 'fs';


const APIURL = 'https://api.studio.thegraph.com/query/49058/4337entrypoint/v0.0.1'
const tokensQuery = 
    `
    query {
      accountDeployeds(
        first: 2
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
    }
    `
const client = new ApolloClient({  
        uri: APIURL,  cache: new InMemoryCache(),
})

client.query({ 
       query: gql(tokensQuery),  
}).then(
    (data) => {
      const dataString = data.data.accountDeployeds 
      const accountDeployeds = JSON.stringify(dataString, null, 2);
      fs.writeFile('./uitils/output2.json', accountDeployeds, (err) => {
          if (err) throw err;
      });
      console.log('Subgraph data: ', dataString)
    }
    )  
    .catch((err) => {    
        console.log('Error fetching data: ', err)  
})


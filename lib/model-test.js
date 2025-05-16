export async function fetchPrediction(inputValues) {
  const url = "https://fyp-risk-intelligence-faqjt.eastus.inference.ml.azure.com/score";
  const apiKey = "8OCyIIRpn7JB3wZdobcsfhtn1msSXD9cDvhvzAXuBSpa5xBxEVudJQQJ99BCAAAAAAAAAAAAINFRAZML35J5";
  
  if (!apiKey) {
      throw new Error("A key should be provided to invoke the endpoint");
  }
  
  const requestHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
      "azureml-model-deployment": "risk-folder-1022-1"
  });
  
  // Default values for the fields not provided by frontend
  const requestBody = {
      ProductPrice: 1500.0,
      QuantityOrdered: 2000,
      OrderTotalPrice: 3000000.0,
      ProductCategory: 0,
      DiscountAmount: 0,
      PaymentMethod: 0,
      OrderMonth: 11,
      CustomerTenureMonths: 24,
      PreviousRefundedOrders_CustomerHistory: 0,
      PreviousSuccessfulOrders_ProductHistory: 50,
      PreviousFailedOrders_ProductHistory: 5,
      PreviousRefundedOrders_ProductHistory: 0,
      PreviousTotalOrders_ProductHistory: 57,
      
      // Fields from frontend input
      ...inputValues
  };
  
  try {
      const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: requestHeaders
      });
      
      if (!response.ok) {
          throw new Error(`Request failed with status code ${response.status}`);
      }
      
      const json = await response.json();
      return json['probabilities'][0][1];
  } catch (error) {
      return { error: error.message };
  }
}




// // Request data goes here
// // The example below assumes JSON formatting which may be updated
// // depending on the format your endpoint expects.
// // More information can be found here:
// // https://docs.microsoft.com/azure/machine-learning/how-to-deploy-advanced-entry-script
// const requestBody = `{
    
//     "ProductPrice": 1500.0,
//     "QuantityOrdered": 2000,
//     "OrderTotalPrice": 3000000.0,
//     "ProductCategory": 0,
//     "DiscountAmount":0, //
//     "PaymentMethod": 0, //
//     "OrderMonth": 11,
//     "CustomerTenureMonths": 24,
//     "MinOrderValue_CustomerHistory": 100.0,
//     "MaxOrderValue_CustomerHistory": 500.0,
//     "AvgOrderValue_CustomerHistory": 250.0,
//     "PreviousSuccessfulOrders_CustomerHistory": 10,
//     "PreviousFailedOrders_CustomerHistory": 100,
//     "PreviousRefundedOrders_CustomerHistory": 0, //
//     "PreviousSuccessfulOrders_ProductHistory": 50,
//     "PreviousFailedOrders_ProductHistory": 5,
//     "PreviousRefundedOrders_ProductHistory": 0, //
//     "PreviousTotalOrders_ProductHistory": 57
//   }
// `;

// const requestHeaders = new Headers({"Content-Type" : "application/json"});

// // Replace this with the primary/secondary key, AMLToken, or Microsoft Entra ID token for the endpoint
// const apiKey = "8OCyIIRpn7JB3wZdobcsfhtn1msSXD9cDvhvzAXuBSpa5xBxEVudJQQJ99BCAAAAAAAAAAAAINFRAZML35J5";
// if (!apiKey)
// {
// 	throw new Error("A key should be provided to invoke the endpoint");
// }
// requestHeaders.append("Authorization", "Bearer " + apiKey)

// // This header will force the request to go to a specific deployment.
// // Remove this line to have the request observe the endpoint traffic rules
// requestHeaders.append("azureml-model-deployment", "risk-folder-1022-1");

// const url = "https://fyp-risk-intelligence-faqjt.eastus.inference.ml.azure.com/score";

// fetch(url, {
//   method: "POST",
//   body: requestBody,
//   headers: requestHeaders
// })
// 	.then((response) => {
// 	if (response.ok) {
// 		return response.json();
// 	} else {
// 		// Print the headers - they include the request ID and the timestamp, which are useful for debugging the failure
// 		console.debug(...response.headers);
// 		console.debug(response.body)
// 		throw new Error("Request failed with status code" + response.status);
// 	}
// 	})
// 	.then((json) => console.log(json['probabilities'][0][1]))
// 	.catch((error) => {
// 		console.error(error)
// 	});

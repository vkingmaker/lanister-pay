# Lannister Pay
Lannister Pay is a Nigerian Naira (NGN) implementation of a fee processing service for a fictional Payment Processor (LannisterPay). A custom fee configuration spec is sent to `/fee` endpoint to describe applicable fees which enables the application compute the `/compute-transaction-fee` to compute a corresponding charges for a users transaction.

### To test the application (Locally)
- Pull the project from the remote repository by running `<>`
- Open the project with your favourite code editor.
- install `node packages` by running `npm i` or `yarn install` on your terminal at the root of the projects folder
- Run `npm run dev` or `npm run start` to start up the server. (You might need to install redis globaly if you haven't already)
- Test using any API application tester you are most comfortable with by call the endpoints below.

### Testing the deployed version
-	Launch any API application tester you are most comfortable with
- Call the endpoints below with the corresponsing `HTTP` methods and payload to test.

### Endpoints
-	`HTTP POST /fees` - This endpoint should accept data containing a valid fee configuration spec.

#### Sample post data
```
{
    "FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
}
```
#### Expected response
```
HTTP 200 OK
{
  "status": "ok"
}
```

- `HTTP POST /compute-transaction-fee` - This endpoint should accept a single transaction payload and use the data you stored from the HTTP POST /fees endpoint described above to compute the fee applicable to the transaction.


#### Sample post data
```
{
    "ID": 91203,
    "Amount": 5000,
    "Currency": "NGN",
    "CurrencyCountry": "NG",
    "Customer": {
        "ID": 2211232,
        "EmailAddress": "anonimized29900@anon.io",
        "FullName": "Abel Eden",
        "BearsFee": true
    },
    "PaymentEntity": {
        "ID": 2203454,
        "Issuer": "GTBANK",
        "Brand": "MASTERCARD",
        "Number": "530191******2903",
        "SixID": 530191,
        "Type": "CREDIT-CARD",
        "Country": "NG"
    }
}
```

#### Expected response

```
HTTP 200 OK
{
    "AppliedFeeID": "LNPY1223",
    "AppliedFeeValue": 120,
    "ChargeAmount": 5120,
    "SettlementAmount": 5000
}
```

#### Sample post data (invalid)
```
{
    "ID": 91204,
    "Amount": 3500,
    "Currency": "USD", //The application only supports Nigerian Naira
    "CurrencyCountry": "US",
    "Customer": {
        "ID": 4211232,
        "EmailAddress": "anonimized292200@anon.io",
        "FullName": "Wenthorth Scoffield",
        "BearsFee": false
    },
    "PaymentEntity": {
        "ID": 2203454,
        "Issuer": "WINTERFELLWALLETS",
        "Brand": "",
        "Number": "AX0923******0293",
        "SixID": "AX0923",
        "Type": "WALLET-ID",
        "Country": "NG"
    }
}
```

#### Expected response
```
HTTP 422
{
  "Error": "No fee configuration for USD transactions."
}
```
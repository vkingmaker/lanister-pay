require('dotenv').config();
const request = require("supertest"),
			app = require("../app"),
			Response = require("../utils/constants/Response");

test("Should create the configuration specs", async () => {
	const response = await request(app).post(`${process.env.APP_URL}/fees`).send({
		"FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
	})
	.expect('Content-Type', /json/)
	.expect(Response.HTTP_OK);

	expect(response.body).toMatchObject({
		status: "ok"
	});
});

test("Should compute corresponding charges", async () => {
	let response = await request(app).post(`${process.env.APP_URL}/compute-transaction-fee`).send({
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
	})
	.expect(Response.HTTP_OK)
	.expect('Content-Type', /json/)

	expect(response.body).toMatchObject({
		"AppliedFeeID": "LNPY1223",
		"AppliedFeeValue": 120,
		"ChargeAmount": 5120,
		"SettlementAmount": 5000
	});


	response = await request(app).post(`${process.env.APP_URL}/compute-transaction-fee`).send({
		"ID": 91204,
		"Amount": 3500,
		"Currency": "NGN",
		"CurrencyCountry": "NG",
		"Customer": {
			"ID": 4211232,
			"EmailAddress": "anonimized292200@anon.io",
			"FullName": "Wenthorth Scoffield",
			"BearsFee": false
		},
		"PaymentEntity": {
			"ID": 2203454,
			"Issuer": "AIRTEL",
			"Brand": "",
			"Number": "080234******2903",
			"SixID": "080234",
			"Type": "USSD",
			"Country": "NG"
		}
	})
	.expect(Response.HTTP_OK)
	.expect('Content-Type', /json/);

	expect(response.body).toMatchObject({
		"AppliedFeeID": "LNPY1221",
    "AppliedFeeValue": 49,
    "ChargeAmount": 3500,
    "SettlementAmount": 3451
	});

	response = await request(app).post(`${process.env.APP_URL}/compute-transaction-fee`).send({
		"ID": 91204,
    "Amount": 3500,
    "Currency": "USD",
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
	})
	.expect(Response.HTTP_UNPROCESSABLE_ENTITY)
	.expect('Content-Type', /json/);

	expect(response.body).toEqual({
		"Error": "No fee configuration for USD transactions."
	});
});
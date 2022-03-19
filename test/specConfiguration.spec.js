require('dotenv').config();
const request = require("supertest"),
			app = require("../app"),
			Response = require("../utils/constants/Response");

test("Should create the configuration specs", async () => {
	const response = await request(app).post(`${process.env.APP_URL}/fees`).send({
		"FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"
	})
	.expect('Content-Type', /json/)
	.expect(Response.HTTP_CREATED);

	expect(response.body).toMatchObject({
		status: "ok"
	});
});
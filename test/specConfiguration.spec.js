require('dotenv').config();
const request = require("supertest"),
			app = require("../app"),
			Response = require("../utils/constants/Response");

test("Should create the configuration specs", async () => {
	const response = await request(app).post(`${process.env.APP_URL}/fees`).send({
		"FeeConfigurationSpec": `
		ENAA4401 NGN * *(*) : APPLY PERC 3.8\n\
		ENAA4402 NGN LOCL *(*) : APPLY FLAT_PERC 20:1.4\n\
		ENAA4403 NGN * USSD(GLOBACOM) : APPLY FLAT 150\n\
		ENAA4404 NGN * BANK-ACCOUNT(*) : APPLY FLAT 40\n\
		ENAA4405 NGN * BANK-ACCOUNT(UBA) : APPLY FLAT_PERC 15:2\n\
		ENAA4406 NGN INTL CREDIT-CARD(*) : APPLY PERC 5.0\n\
		ENAA4407 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 2.5\n\
		ENAA4408 NGN INTL DEBIT-CARD(539983) : APPLY PERC 5.5`
	})
	.expect(Response.HTTP_CREATED)
	.expect('Content-Type', /json/);

	expect(response.body).toMatchObject({
		status: "ok"
	});
});
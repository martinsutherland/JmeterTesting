@apiTest @all
Feature: Automated API Test using restassured

	Scenario: GET employee data
		Given the "reqres" endpoint is available
		When I set the endpoint
		And I GET the endpoint with the parameter "2"
		Then I should get 200 back
		And The response Json matches the Json file: "ReqresResponseData.Json"
		
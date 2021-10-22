package API.stepdefinitions;

import API.requests.ApiBasePage;
import API.requests.JsonParsing;
import com.google.gson.JsonElement;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.thucydides.core.annotations.Steps;
import org.junit.Assert;

import java.io.FileNotFoundException;
import java.io.IOException;


public class APISteps {

	@Steps
	private static ApiBasePage apiBasePage;
	@Steps
	private static JsonParsing jsonParsing;

	@When("^I GET the endpoint$")
	public void iGetTheEndpoint() {
		apiBasePage.getEndpoint();
	}

	@When("^I GET the endpoint with the parameter \"([^\"]*)\"$")
	public void iGetTheEndpointWithParameter(String parameter) {
		apiBasePage.getEndpointWithParam(parameter);
	}

	@When("^I POST the endpoint with the JSON file: \"([^\"]*)\"$")
	public void iPostToTheEndPoint(String fileName) throws FileNotFoundException {
		JsonElement jsonElement = jsonParsing.getJsonFromFile("requestData/" + fileName);
		apiBasePage.postEndpoint(jsonElement);
	}

	@Then("^I should get (\\d+) back$")
	public void iShouldGetBack(int responseCode) {
		apiBasePage.checkStatusCode(responseCode);
	}

	@When("^I set the endpoint$")
	public void iSetTheEndpoint() {
		apiBasePage.setEndpoint();
	}

	@Then("^The response Json matches the Json file: \"([^\"]*)\"$")
	public void checkResponseJsonIsCorrect(String fileName) throws IOException {
		String expectedJson = jsonParsing.getJsonFromFile("responseData/" + fileName).toString();
		String actualJson = apiBasePage.getResponseBody();

		Assert.assertEquals(expectedJson, actualJson);
	}

	@Given("^the \"([^\"]*)\" endpoint is available$")
	public void theEndpointIsAvailable(String name) {
		apiBasePage.restEndpointIsAvailable(name);
	}


}

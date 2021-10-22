package API.requests;

import com.google.gson.JsonElement;
import io.restassured.RestAssured;
import net.serenitybdd.core.environment.EnvironmentSpecificConfiguration;
import net.thucydides.core.annotations.Step;

import net.thucydides.core.util.EnvironmentVariables;
import org.junit.Assert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static net.serenitybdd.rest.SerenityRest.*;


public class ApiBasePage {

    private static final Logger LOGGER = LoggerFactory.getLogger(ApiBasePage.class);

    EnvironmentVariables environmentVariables;

    @Step
    public int getResponseStatusCode() {
        return then().extract().statusCode();
    }

    @Step
    public String getResponseBody() {
        return then().extract().response().asString();
    }

    public static String endpointRoot;

    @Step
    public void getEndpoint() {
        given()
                .log().all()
                .when()
                .get(endpointRoot);
    }

    @Step
    public void getEndpointWithParam(String parameter) {
        given()
                .log().all()
                .when()
                .get(endpointRoot + "/" + parameter);
    }

    @Step
    public void postEndpoint(JsonElement json) {
        given().header("Content-Type", "application/json")
                .log().all()
                .when()
                .body(json.toString())
                .post(endpointRoot);
    }

    @Step
    public void setEndpoint() {
        RestAssured.baseURI = endpointRoot;
    }

    @Step
    public void checkStatusCode(int code) {
        Assert.assertEquals(getResponseStatusCode(), code);

    }

    @Step
    public void restEndpointIsAvailable(String name) {
        String locator = name.replace(' ', '.') + ".endpoint";
        LOGGER.info(locator);
        endpointRoot = EnvironmentSpecificConfiguration.from(environmentVariables).getProperty(locator);
        Assert.assertNotNull(endpointRoot);
        LOGGER.info(endpointRoot);
    }

}


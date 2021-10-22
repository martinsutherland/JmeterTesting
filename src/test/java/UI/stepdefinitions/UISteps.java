package UI.stepdefinitions;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.And;
import net.thucydides.core.annotations.Steps;
import UI.pages.BasePage;
import UI.pages.DuckDuckGoPage;


public class UISteps {

    @Steps
    DuckDuckGoPage duckDuckGoPage;
    @Steps
    BasePage basePage;

    @Given("^I navigate to duckduckgo$")
    public void navigateToDuckDuckGo() {
        duckDuckGoPage.open();
    }

    @When("^I enter \"([^\"]*)\" in the search field$")
    public void searchFor(String text) {
        duckDuckGoPage.enterSearchText(text);
    }

    @And("^I press the search button$")
    public void pressButton() {
        duckDuckGoPage.clickSearchButton();
    }
    @Then("^I select the first link$")
    public void clickFirstLinkFromResults() {
        duckDuckGoPage.clickFirstLink();
    }
    @Then("^The header is \"([^\"]*)\"$")
    public void checkPageHeader(String pageHeader) {
        basePage.checkHeader(pageHeader);
    }
}


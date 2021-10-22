package UI.pages;


import net.thucydides.core.annotations.DefaultUrl;
import net.thucydides.core.pages.PageObject;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

@DefaultUrl("page:webdriver.base.url")
public class DuckDuckGoPage extends PageObject {

    @FindBy(css = "#search_form_input_homepage")
    WebElement searchBox;

    @FindBy(css = "#search_button_homepage")
    WebElement searchButton;

    @FindBy(css = "#r1-0 > div > h2 > a.result__a.js-result-title-link")
    WebElement firstLink;
    public void enterSearchText(String text) {
        searchBox.sendKeys(text);
    }

    public void clickSearchButton() {
        searchButton.click();
    }

    public void clickFirstLink() {
        firstLink.click();
    }
}

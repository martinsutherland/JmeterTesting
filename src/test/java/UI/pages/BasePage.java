package UI.pages;


import net.thucydides.core.pages.PageObject;
import org.junit.Assert;
import org.openqa.selenium.By;

public class BasePage extends PageObject {

    public void checkHeader(String text) {
        Assert.assertEquals(getDriver().findElement(By.tagName("h1")).getText(), text);
    }

}

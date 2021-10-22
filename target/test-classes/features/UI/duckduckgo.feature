@UITest @all
Feature: Duckduckgo automated test
  Description: Testing the cucumber selenium framework.

  Scenario: Navigating to duck duck go and search for the gov.uk website
    Given I navigate to duckduckgo
    When I enter "HM Revenue & Customs - GOV.UK" in the search field
    And I press the search button
    And I select the first link
    Then The header is "HM Revenue & Customs"


@Jmeter @Performance
Feature: Run a simple performance test using a give JMX file

  Scenario: Performance testing using a preconfigured JMX file
    When the following volumetrics are used for the JMX file: "View Results Tree.jmx"
      | concurrent users | ramp up | loops | duration | start up delay | delay between calls | url       |
      | 800               | 2       | 2     | 2        | 12             | 500                 | https://computer-database.gatling.io/computers |
    Then the JMX file: "View Results Tree.jmx" is executed

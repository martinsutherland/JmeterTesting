# Quickstart Instructions
NOTE: Full in depth instructions can be found in the readme’s in the documentation package of your framework.
## Selenium & Rest Assured
### Installation/Setup
1.	Extract the zip file delivered with this email
2.	Open cmd or terminal, navigate to your unzipped framework
3.	Run - “mvn validate”
### Run commands
* 	Run all the tests - “mvn clean verify -Denvironment=default”
* 	Run specific test by tag - “mvn clean verify -Dcucumber.filter.tags=”UITest” -Denvironment=default”
* 	Run all but ignore specific tests by tag - “mvn clean verify -Dcucumber.filter.tags=”not UITest” -Denvironment=default”
## Jmeter
### Installation/Setup
1. Create a .jmx file for your performance test case using the Jmeter GUI
2. Export the .jmx file and drop it into src/test/resources/jmeter/outputs directory
3. Specify your .jmx file name and required volumetrics for testing in the JmeterPerformanceTest.feature file
### Run commands
* 	To run your jmx file with the specified volumetrics run – “mvn clean verify -Dcucumber.filter.tags=”@Jmeter” -Denvironment=default” (The output of your performance test run will be stored in src/test/resources/jmeter/outputs)

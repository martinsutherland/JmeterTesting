package jmeter.stepdefinitions;


import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import org.apache.jmeter.engine.StandardJMeterEngine;
import org.apache.jmeter.report.dashboard.ReportGenerator;
import org.apache.jmeter.reporters.ResultCollector;
import org.apache.jmeter.reporters.Summariser;
import org.apache.jmeter.save.SaveService;
import org.apache.jmeter.util.JMeterUtils;
import org.apache.jorphan.collections.HashTree;
import java.io.*;
import java.time.LocalDateTime;
import org.eclipse.jgit.api.Git;


import static org.apache.jmeter.JMeter.JMETER_REPORT_OUTPUT_DIR_PROPERTY;


public class JmeterSteps {

	@Given("^the JMX file: \"([^\"]*)\" is executed$")
	public void theTestIsExecuted(String fileName) throws Exception {
		File dir = new File("src/test/resources/Jmeter/bin/report-template/sbadmin2-1.0.7");
		if(!dir.exists()) {
			Git.cloneRepository()
					.setURI("https://github.com/Ryan-2i/JmeterReporting")
					.setDirectory(new File("src/test/resources/Jmeter/bin/report-template/sbadmin2-1.0.7"))
					.call();
		}

		String outputPath = "src/test/resources/jmeter/outputs/" + LocalDateTime.now().toString().replace(":", ".");
		File file = new File(outputPath);
		file.mkdirs();

		StandardJMeterEngine jmeter = new StandardJMeterEngine();

		JMeterUtils.loadJMeterProperties("src/test/resources/jmeter/bin/jmeter.properties");
		JMeterUtils.setJMeterHome("src/test/resources/jmeter");
		JMeterUtils.initLocale();

		SaveService.loadProperties();

		HashTree testPlanTree = SaveService.loadTree(new File("src/test/java/jmeter/jmx/" + fileName));

		Summariser summer = null;
		String summariserName = JMeterUtils.getPropDefault("summariser.name", "summary");
		if (summariserName.length() > 0) {
			summer = new Summariser(summariserName);
		}
		String logFile = outputPath + "/result.jtl";
		ResultCollector logger = new ResultCollector(summer);
		logger.setFilename(logFile);

		testPlanTree.add(testPlanTree.getArray()[0], logger);

		jmeter.configure(testPlanTree);
		jmeter.run();

		JMeterUtils.setProperty(JMETER_REPORT_OUTPUT_DIR_PROPERTY, outputPath);
		ReportGenerator generator = new ReportGenerator(logFile, null);
		generator.generate();

	}

	@Given("^the following volumetrics are used for the JMX file: \"([^\"]*)\"$")
	public void useVolumetrics(String fileName, DataTable volumetrics) throws IOException {
		File inputJMX = new File("src/test/java/jmeter/jmx/" + fileName);
		BufferedReader br = null;
		String newString = "";
		StringBuilder strTotale = new StringBuilder();

		try {

			FileReader reader = new FileReader(inputJMX);


			br = new BufferedReader(reader);
			while ((newString = br.readLine()) != null) {
			    //Replace values in pre made JMX file with values from cucumber feature
				newString = newString.replaceAll("<stringProp name=\"ThreadGroup.num_threads\">([^\"]*)</stringProp>", "<stringProp name=\"ThreadGroup.num_threads\">"+volumetrics.asList().get(7)+"</stringProp>");
				newString = newString.replaceAll("<stringProp name=\"ThreadGroup.ramp_time\">([^\"]*)</stringProp>\n", "<stringProp name=\"ThreadGroup.ramp_time\">"+volumetrics.asList().get(8)+"</stringProp>");
				newString = newString.replaceAll("<stringProp name=\"LoopController.loops\">([^\"]*)</stringProp>", "<stringProp name=\"LoopController.loops\">"+volumetrics.asList().get(9)+"</stringProp>");
				newString = newString.replaceAll("<stringProp name=\"ThreadGroup.duration\">([^\"]*)</stringProp>", "<stringProp name=\"ThreadGroup.duration\">"+volumetrics.asList().get(10)+"</stringProp>");
				newString = newString.replaceAll("<stringProp name=\"ThreadGroup.delay\">([^\"]*)</stringProp>", "<stringProp name=\"ThreadGroup.delay\">"+volumetrics.asList().get(11)+"</stringProp>");
				newString = newString.replaceAll("<stringProp name=\"ConstantTimer.delay\">([^\"]*)</stringProp>", "<stringProp name=\"ConstantTimer.delay\">"+volumetrics.asList().get(12)+"</stringProp>");
				newString = newString.replaceAll("<stringProp name=\"HTTPSampler.domain\">([^\"]*)</stringProp>", "<stringProp name=\"HTTPSampler.domain\">"+volumetrics.asList().get(13)+"</stringProp>");

				strTotale.append(newString);
			}

		} catch (IOException e) {
			e.printStackTrace();
		}
		finally {
			try {
				br.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		FileWriter writer = new FileWriter(inputJMX);
		writer.write(String.valueOf(strTotale));
		writer.close();

	}
	}

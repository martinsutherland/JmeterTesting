package API.requests;

import com.google.gson.*;

import java.io.FileNotFoundException;
import java.io.FileReader;

public class JsonParsing {

    public JsonElement getJsonFromFile (String fileName) throws JsonIOException, JsonSyntaxException, FileNotFoundException{

        JsonParser parser = new JsonParser();
        JsonElement jsonElement = parser.parse(new FileReader("src/test/java/API/testData/" + fileName));

        return jsonElement;

    }


}
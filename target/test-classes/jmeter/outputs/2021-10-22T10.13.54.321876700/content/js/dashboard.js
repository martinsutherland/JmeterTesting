/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 5.035128805620609, "KoPercent": 94.96487119437938};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.027615144418423106, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8785714285714286, 500, 1500, "POST data-0"], "isController": false}, {"data": [0.24285714285714285, 500, 1500, "POST data-1"], "isController": false}, {"data": [0.009375, 500, 1500, "POST data"], "isController": false}, {"data": [0.021875, 500, 1500, "With Parameter"], "isController": false}, {"data": [0.0, 500, 1500, "Home"], "isController": false}, {"data": [0.08152173913043478, 500, 1500, "Home-0"], "isController": false}, {"data": [0.059782608695652176, 500, 1500, "Home-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5124, 4866, 94.96487119437938, 1454.8575331772079, 91, 10513, 204.0, 4141.0, 6162.25, 9375.75, 270.89611419508327, 101.45222045995243, 54.60520337694951], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST data-0", 70, 0, 0.0, 326.95714285714297, 94, 1546, 177.0, 797.9, 977.0000000000002, 1546.0, 8.409418548774628, 1.921683535559827, 2.4062105808505527], "isController": false}, {"data": ["POST data-1", 70, 49, 70.0, 412.4857142857142, 98, 1237, 178.5, 1015.1999999999999, 1071.9, 1237.0, 8.417508417508417, 8.462719644360268, 1.1426110058922558], "isController": false}, {"data": ["POST data", 1600, 1579, 98.6875, 219.85062499999972, 91, 2619, 163.0, 352.9000000000001, 623.0, 1409.4100000000005, 188.56806128461992, 68.64192785061874, 55.075362772539776], "isController": false}, {"data": ["With Parameter", 1600, 1560, 97.5, 306.15624999999983, 92, 1756, 156.0, 928.9000000000001, 1141.8499999999958, 1269.0, 177.63961363384036, 71.37243949150661, 24.633618296880204], "isController": false}, {"data": ["Home", 1600, 1593, 99.5625, 3876.8593750000023, 441, 10513, 3639.0, 7774.9, 8848.849999999999, 9773.0, 90.86262706570504, 31.127271122011468, 16.23747976886819], "isController": false}, {"data": ["Home-0", 92, 0, 0.0, 3386.956521739129, 460, 9131, 3323.5, 5884.800000000001, 8446.449999999999, 9131.0, 5.46253414083838, 0.8001758995368722, 0.9335385494596842], "isController": false}, {"data": ["Home-1", 92, 85, 92.3913043478261, 508.0760869565217, 102, 1206, 325.0, 1028.5, 1082.6499999999999, 1206.0, 11.059021517009255, 5.496054776715951, 1.5011757723284047], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["429/Too Many Requests", 4866, 100.0, 94.96487119437938], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5124, 4866, "429/Too Many Requests", 4866, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["POST data-1", 70, 49, "429/Too Many Requests", 49, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["POST data", 1600, 1579, "429/Too Many Requests", 1579, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["With Parameter", 1600, 1560, "429/Too Many Requests", 1560, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Home", 1600, 1593, "429/Too Many Requests", 1593, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-1", 92, 85, "429/Too Many Requests", 85, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

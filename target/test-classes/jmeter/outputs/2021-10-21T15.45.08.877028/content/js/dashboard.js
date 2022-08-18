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

    var data = {"OkPercent": 6.732976281560826, "KoPercent": 93.26702371843918};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03997704667176741, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8972602739726028, 500, 1500, "POST data-0"], "isController": false}, {"data": [0.1917808219178082, 500, 1500, "POST data-1"], "isController": false}, {"data": [0.008125, 500, 1500, "POST data"], "isController": false}, {"data": [0.0425, 500, 1500, "With Parameter"], "isController": false}, {"data": [0.0021875, 500, 1500, "Home"], "isController": false}, {"data": [0.18085106382978725, 500, 1500, "Home-0"], "isController": false}, {"data": [0.13829787234042554, 500, 1500, "Home-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5228, 4876, 93.26702371843918, 1634.6342769701653, 89, 16379, 302.0, 6141.100000000008, 8193.75, 13399.130000000001, 257.258143883476, 101.95241379416396, 51.97357697323098], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST data-0", 73, 0, 0.0, 290.5616438356165, 91, 2585, 121.0, 670.8000000000003, 833.2999999999998, 2585.0, 6.096033402922756, 1.3930388830897704, 1.7442751826722338], "isController": false}, {"data": ["POST data-1", 73, 59, 80.82191780821918, 159.39726027397262, 91, 649, 116.0, 302.0000000000001, 483.79999999999995, 649.0, 6.781865477517651, 5.151902464232627, 0.9205852552489782], "isController": false}, {"data": ["POST data", 1600, 1586, 99.125, 347.30812499999917, 89, 2877, 135.5, 893.8000000000002, 1437.9499999999998, 2279.0700000000006, 131.14754098360658, 46.49334016393443, 38.33784259733607], "isController": false}, {"data": ["With Parameter", 1600, 1530, 95.625, 210.51249999999953, 90, 1041, 126.0, 455.9000000000001, 534.8999999999996, 631.99, 131.5681276210838, 60.51539629759066, 18.244798947454978], "isController": false}, {"data": ["Home", 1600, 1580, 98.75, 4350.766875, 390, 16379, 3202.5, 9489.6, 12150.249999999989, 15245.070000000002, 84.14409676571127, 30.755427458585327, 15.386649930975546], "isController": false}, {"data": ["Home-0", 141, 0, 0.0, 4516.609929078012, 399, 15972, 4408.0, 8901.8, 11977.600000000004, 15210.120000000023, 7.463476603853483, 1.0932827056426, 1.2754964899163668], "isController": false}, {"data": ["Home-1", 141, 121, 85.81560283687944, 159.14184397163115, 92, 642, 113.0, 294.6, 487.0000000000005, 637.8000000000002, 11.599210266535044, 7.496298124383021, 1.574502174851925], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["429/Too Many Requests", 4876, 100.0, 93.26702371843918], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5228, 4876, "429/Too Many Requests", 4876, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["POST data-1", 73, 59, "429/Too Many Requests", 59, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["POST data", 1600, 1586, "429/Too Many Requests", 1586, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["With Parameter", 1600, 1530, "429/Too Many Requests", 1530, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Home", 1600, 1580, "429/Too Many Requests", 1580, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Home-1", 141, 121, "429/Too Many Requests", 121, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

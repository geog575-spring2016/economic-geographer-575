//use queue.js to parallelize asynchronous data loading
d3_queue.queue()
    .defer(d3.csv, "data/test_data1.csv") //load attributes from csv
    .defer(d3.csv, "data/test_data2.csv") //load choropleth spatial data
    .await(callback);

function callback(error, csv1, csv2) {
	console.log(csv1);
	console.log(csv2);
}
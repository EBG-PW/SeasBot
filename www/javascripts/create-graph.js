/*
 * Parse the data and create a graph with the data.
 */
function parseData(createGraph) {
	Papa.parse("./data/trashC.csv", {
		download: true,
		complete: function(results) {
			createGraph(results.data, "1");
			createGraph(results.data, "2");
		}
	});
}

function createGraph(data, id) {
	var years = [];
	let Done, Build
	if(id === "1"){
		Done = ["Trash removed in thousend pounds"];
		Build = ["Difference since last measuring in thousend pounds"]
		for (var i = 1; i < data.length; i++) {
			years.push(data[i][0]);
			Done.push(data[i][1]*1000);
			Build.push(data[i][2]);
		}
	}else{
		Done = ["Trash removed in KG"];
		Build = ["Difference since last measuring in KG"]
		for (var i = 1; i < data.length; i++) {
			years.push(data[i][0]);
			Done.push(((data[i][1]*1000)*0.45359237).toFixed(2));
			Build.push(((data[i][2])*0.45359237).toFixed(2));
		}
	}
	

	var chart = c3.generate({
		bindto: `#chart${id}`,
	    data: {
	        columns: [
				Done,
				Build
	        ]
	    },
	    axis: {
	        x: {
	            type: 'category',
	            categories: years,
	            tick: {
	            	multiline: false,
                	culling: {
                    	max: 15
                	},
					beginAtZero: true,
            	}
	        }
	    },
	    zoom: {
        	enabled: true
    	},
	    legend: {
	        position: 'right'
	    }
	});
}

parseData(createGraph);
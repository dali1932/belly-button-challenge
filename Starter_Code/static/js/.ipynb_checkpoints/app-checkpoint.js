//Get the endpoint
const metadata = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

//Fetch the Json Data
d3.json(metadata).then(function(data) {
    console.log(data);
});

// Build the metadata panel

function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {       // get the metadata field
      var metadata = data.metadata;
  // Filter the metadata for the object with the desired sample number
      var selectedSample = metadata.filter((item) => item.id == sample)[0];
  // Use d3 to select the panel with id of `#sample-metadata`
      var panel = d3.select("#sample-metadata");
// Use `.html("") to clear any existing metadata
      panel.html("");
// Inside a loop, you will need to use d3 to append new
      Object.entries(selectedSample).forEach(([key, value]) => {
            panel.append("p").text(`${key}: ${value}`);
        });
    });
}
// tags for each key-value in the filtered metadata.

// function to build both charts
function buildCharts(sample){    
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
        // Get the samples field
        var samples = data.samples;
        // Filter the samples for the object with the desired sample number
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // Get the otu_ids, otu_labels, and sample_values
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
                                                    
        // Build a Bubble Chart
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        }];

    // Render the Bubble Chart
        var bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            showlegend: false,
            height: 600,
            width: 1200,
            xaxis: { title: 'OTU ID' },
            hovermode: 'closest'
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
     // Build a Bar Chart
    var barData = [{
        y: yticks,
        // Don't forget to slice and reverse the input data appropriately
        x: sample_values.slice(0,10).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: 'bar',
        orientation: 'h',
    }];
    var barlayout = [{
        title: "Top 10 Bacteria Cultures Found",
    }];
    // Render the Bar Chart
    Plotly.newPlot('bar',barData, barlayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      // Get the names field
      var names = data.names;
      // Use d3 to select the dropdown with id of `#selDataset`
      let dropdownMenu = d3.select('#selDataset');
      
    // Use the list of sample names to populate the select options
      names.forEach((name) => {
          dropdownMenu.append("option")
          .text(name)
          .property("value", name);
      });
      // Function for event listener
      dropdownMenu.on("change", function() {
        let newSample = d3.select(this).property('value');
        optionChanged(newSample);
  });
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    // Get the first sample from the list
    let first_sample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);
  });
}
  // Build charts and metadata panel each time a new sample is selected
function optionChanged(newSample) {
    console.log("New sample selected:", newSample);
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
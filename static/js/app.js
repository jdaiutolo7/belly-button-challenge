// Insert url to read samples.json with the D3 library
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard
function init() {
  
  // Use D3 library to select the dropdown menu
  let dropDown = d3.select("#selDataset");

  // Use D3 library to sample names and populate the dropdown menu
  d3.json(url).then((data) => {
    
    // Set a variable for the sample names
    let names = data.names;

    // Add samples and log the value for each iteration
    names.forEach((id) => {
      console.log(id);
      
      // Append each name as an option to the dropdown menu    
      dropDown.append("option").text(id).property("value", id);

    });

    // Set the first name of the list
    let first_sample = names[0];
      console.log(first_sample);

    // Build the initial plots
    buildMetadata(first_sample);
    buildBar(first_sample);
    buildBubble(first_sample);
    buildGuage(first_sample);  
     
  });

};

// Make demographic info panel
function buildMetadata(sample) {

// Use D3 library to get the json data
  d3.json(url).then((data) => {
    
    // Collect all metadata
    let metadata = data.metadata;

    // Filter metadata based on the value of the sample
    let value = metadata.filter(meta => meta.id == sample);
    console.log(value)

    // Get the first value from the array
    let data_value = value[0];

    // Clear the metadata
    d3.select("#sample-metadata").html("");

    // Use Object.entries to add each key/value pair to the panel
    Object.entries(data_value).forEach(([key,value]) => {

      // Log the individual key/value pairs as they are being appended to the metadata panel
      console.log(key,value);

      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);

    });   

  });
  
};

// BAR CHART //
function buildBar(sample) {

  // Use D3 library to get the json data
  d3.json(url).then((data) => {

    // Retrieve all sample data
    let data_samples = data.samples;

    // Filter based on value of sample
    let value = data_samples.filter(result => result.id == sample);

    // Get the first value from the array
    let data_value = value[0];

    // Get the otu_ids, lables, and sample values
    let otu_ids = data_value.otu_ids;
    let otu_labels = data_value.otu_labels;
    let sample_values = data_value.sample_values;

     // Log the data to the console
    console.log(otu_ids,otu_labels,sample_values);

     // Set top ten items to display in descending order
     let xdata = sample_values.slice(0,10).reverse();
     let ydata = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
     let labels = otu_labels.slice(0,10).reverse();

     // Set up the trace for bar chart
     let bar_trace = {
      x: xdata,
      y: ydata,
      text: labels,
      type: "bar",
      orientation: 'h'
     };

     // Plot the bar chart
     Plotly.newPlot("bar",[bar_trace]);

  });

};

// BUBBLE CHART //
function buildBubble(sample) {

  // Use D3 library to get the json data
  d3.json(url).then((data) => {

    // Retrieve all sample data
    let data_samples = data.samples;

    // Filter based on value of sample
    let value = data_samples.filter(result => result.id == sample);

    // Get the first value from the array
    let data_value = value[0];

    // Get the otu_id, lables, and sample values
    let otu_ids = data_value.otu_ids;
    let otu_labels = data_value.otu_labels;
    let sample_values = data_value.sample_values;

    // Log the data to the console
    console.log(otu_ids,otu_labels,sample_values);
     
     // Set up the trace for bubble chart
     let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Blues"
      }

     };
     
     // Set up the layout
     let layout = {
      title: "Bacteria per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
  };

     // Plot the bubble chart
     Plotly.newPlot("bubble",[bubble_trace],layout);

  });

};

// Function that updates the dashboard when a new sample is selected
function optionChanged(new_sample) {

  // Log the new value
  console.log(new_sample);

  // Call all the functions
  buildMetadata(new_sample);
  buildBar(new_sample);
  buildBubble(new_sample);
  buildGuage(new_sample);
};

// call the initialize funcion
init();
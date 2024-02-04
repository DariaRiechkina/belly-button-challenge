// Read samples.json using D3.js
var {
    metadata,
    samples,
    names
  } = [];
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    // Extract necessary data from the JSON
    samples = data.samples;
    names = data.names;
    metadata = data.metadata;
    // Create dropdown menu for sample selection
    var dropdown = d3.select("#selDataset");
    dropdown.selectAll("option")
      .data(samples)
      .enter()
      .append("option")
      .attr("value", function(d) {
        return d.id;
      })
      .text(function(d) {
        return d.id;
      });
    // Initial update with the first individual ID
    updateCharts(names[0]);
    // Event listener for dropdown change
    dropdown.on("change", function() {
      var selectedID = d3.select(this).property("value");
      updateCharts(selectedID);
    });
  });
  // Function to update charts based on selected sample ID
  function updateCharts(selectedID) {
    updateBarChart(selectedID);
    updateBubbleChart(selectedID);
    updateDemographicInfo(selectedID);
  }
  // Update horizontal bar chart
  // Use selectedSample.sample_values, selectedSample.otu_ids, and selectedSample.otu_labels
  // to create the bar chart
  function updateBarChart(selectedID) {
    var sample = samples.find(sample => sample.id === selectedID);
    var top10_sample_values = sample.sample_values.slice(0, 10).reverse();
    var top10_otu_ids = sample.otu_ids.slice(0, 10).map(id => "OTU " + id).reverse();
    var top10_otu_labels = sample.otu_labels.slice(0, 10).reverse();
    var trace = {
      x: top10_sample_values,
      y: top10_otu_ids,
      text: top10_otu_labels,
      type: "bar",
      orientation: "h"
    };
    var layout = {
      title: "Top 10 OTUs",
      xaxis: {
        title: "Sample Values"
      }
    };
    var data = [trace];
    Plotly.newPlot("bar", data, layout);
    // Update bubble chart
    // Use selectedSample.otu_ids, selectedSample.sample_values,
    // selectedSample.otu_labels, and any other necessary data
    // to create the bubble chart
  }
  
  function updateBubbleChart(selectedID) {
    var sample = samples.find(sample => sample.id === selectedID);
    // Create the bubble chart data
    var trace = {
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      mode: 'markers',
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids,
        colorscale: 'Earth',
        opacity: 0.6
      }
    };
    var layout = {
      title: 'Bubble Chart for Sample ' + selectedID,
      xaxis: {
        title: 'OTU IDs'
      },
      yaxis: {
        title: 'Sample Values'
      }
    };
    var data = [trace];
    // Update the bubble chart
    Plotly.newPlot('bubble', data, layout);
  }
  
  function updateDemographicInfo(selectedID) {
    var sampleMetadata = metadata.find(metadata => metadata.id === parseInt(selectedID));
    var demographicInfoPanel = d3.select("#sample-metadata");
    // Clear existing content
    demographicInfoPanel.html("");
    // Append demographic info to the panel
    Object.entries(sampleMetadata).forEach(([key, value]) => {
      demographicInfoPanel.append("p").text(`${key}: ${value}`);
    });
  }
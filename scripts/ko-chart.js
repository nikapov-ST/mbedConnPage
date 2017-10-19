/***** ko-chart.js *****/
/*global ko, Chart */

(function(ko, Chart) {
  var drawChartJs = function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var ctx = element.getContext('2d'),
        type = ko.unwrap(allBindings.get('chartType')),
        data = ko.unwrap(allBindings.get('chartData')),
        options = ko.unwrap(allBindings.get('chartOptions')) || {},
        base64Image = allBindings.get('chartJsAsBase64Image'),
        legend = allBindings.get('chartJsLegend'),
        legendTemplate = ko.unwrap(allBindings.get('chartJsLegendTemplate')),
        segmentClick = ko.unwrap(allBindings.get('segmentClick')),
        barClick = ko.unwrap(allBindings.get('barClick')),
        lineClick = ko.unwrap(allBindings.get('lineClick'));

		console.log("type=", type, ", options=", options, ", data=", data);
    
    	if(typeof legendTemplate !== "undefined" && legendTemplate !== null) {
      	options.legendTemplate = legendTemplate;
      }
      if(typeof base64Image !== "undefined") {
      	options.onAnimationComplete = function() {
        	console.log("In onAnimationComplete");
      		//console.log("Setting new image: ", $(element)[0].chart.toBase64Image());
          //console.log("Image from canvas: ", $(element)[0].getCanvasImage());
          //console.log("$(element)[0]=", $(element)[0]);
          //console.log("$(element)[0].toDataURL()=", $(element)[0].toDataURL());
					//base64Image($(element)[0].chart.toBase64Image());
          //console.log($('canvas')[0].toDataURL());
          base64Image($element.chart.toBase64Image())
				};
      }

			// Dispose of the chart if the DOM object is disposed
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
          $(element).chart.destroy();
          delete $(element).chart;
        });

      var newChart = new Chart(ctx)[type](data, options);
      var $element = $(element)[0];

			// Delete the chart if one already exists
      if($element.chart) {
      	$element.chart.destroy();
      	delete $element.chart;
      }

      $element.chart = newChart;
      //* Remove existing click binding
      if ($element.click) {
        $element.removeEventListener('click', $element.click);
        delete($element.click);
      }
      console.log("*** Drawing Chart: type=" + type);
      $element.chart.update(0);

      //* Add segment click binding
      switch (type) {
        case "Pie":
        case "Doughnut":
          if (segmentClick) {
            $element.click = function(evt) {
              var activePoints = newChart.getSegmentsAtEvent(evt);
              segmentClick(activePoints[0], newChart);
            };
          }
          break;
        case "Bar":
          if (barClick) {
            $element.click = function(evt) {
              barClick(newChart.getBarsAtEvent(evt), newChart);
            };
          }
          break;
        case "Line":
          if (lineClick) {
            $element.click = function(evt) {
              lineClick(newChart.getPointsAtEvent(evt), newChart);
            };
          }
          break;
        default:
          break;
      }
      $element.addEventListener('click', $element.click);
      // If a image or legend bindings exist, update these
      /*
      if(base64Image) {
      	console.log("Setting new image: ", newChart.toBase64Image());
      	base64Image(newChart.toBase64Image());        
      } // NB: Moved to onAnimationComplete function (see options) as it was returning an empty image */
      if(legend) {
      	legend(newChart.generateLegend());
      }
  };
  ko.bindingHandlers.barClick = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      if (!allBindings.has('chartData')) {
        throw Error('chartType must be used in conjunction with chartData and (optionally) chartOptions');
        return;
      }
      var chartType = allBindings.get('chartType');
      if (chartType !== 'Bar') {
        throw Error('barClick can only be used with chartType Bar');
        return;
      }
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    	drawChartJs(element, valueAccessor, allBindings, viewModel, bindingContext);
    }
  };
  ko.bindingHandlers.chartJsAsBase64Image = {
  	init: function() {},
    update: function(element, valueAccessor) {
    	if(typeof $(element)[0].chart !== "undefined") {
      	var value = valueAccessor();
        value($(element)[0].chart.toBase64Image());
      }
    }
  },
  ko.bindingHandlers.chartJsLegendTemplate = {
  	init: function() {},
    update: function(element, valueAccessor, allBindings) {
    	if(typeof $(element)[0].chart !== "undefined") {
      	drawChartJs(element, valueAccessor, allBindings);
      }
    }
  },
  ko.bindingHandlers.chartJsLegend = {
  	init: function() {},
    update: function() {
    	/*
    	if(typeof $(element)[0].chart !== "undefined") {
      	var value = valueAccessor();
        value($(element)[0].chart.generateLegend());
      } //*/
    }
  },
  ko.bindingHandlers.lineClick = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      if (!allBindings.has('chartData')) {
        throw Error('chartType must be used in conjunction with chartData and (optionally) chartOptions');
        return;
      }
      var chartType = allBindings.get('chartType');
      if (chartType !== 'Line') {
        throw Error('lineClick can only be used with chartType Line');
        return;
      }
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    	drawChartJs(element, valueAccessor, allBindings, viewModel, bindingContext);
    }
  };
  ko.bindingHandlers.segmentClick = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      if (!allBindings.has('chartData')) {
        throw Error('chartType must be used in conjunction with chartData and (optionally) chartOptions');
        return;
      }
      var chartType = allBindings.get('chartType');
      if (chartType !== 'Pie' && chartType !== 'Doughnut') {
        throw Error('segmentClick can only be used with chartType Pie or Donut');
        return;
      }
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    	drawChartJs(element, valueAccessor, allBindings, viewModel, bindingContext);
    }
  };
  ko.bindingHandlers.chartType = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      if (!allBindings.has('chartData')) {
        throw Error('chartType must be used in conjunction with chartData and (optionally) chartOptions');
      }
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      drawChartJs(element, valueAccessor, allBindings, viewModel, bindingContext);
    }
  };

  ko.bindingHandlers.chartData = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      if (!allBindings.has('chartType')) {
        throw Error('chartData must be used in conjunction with chartType and (optionally) chartOptions');
      }
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      drawChartJs(element, valueAccessor, allBindings, viewModel, bindingContext);
    }
  };

  ko.bindingHandlers.chartOptions = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      if (!allBindings.has('chartData') || !allBindings.has('chartType')) {
        throw Error('chartOptions must be used in conjunction with chartType and chartData');
      }
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    	drawChartJs(element, valueAccessor, allBindings, viewModel, bindingContext);
    }
  };

})(ko, Chart);
/***** End of ko-chart.js *****/

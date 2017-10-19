function KoModel(data) {
  var self = this;
  
  self.selectedEndpoint = ko.observable();
  self.availableEndpoints = ko.observableArray ([]);
  
  self.selectedEndpoint.subscribe(function(newValue) {
    console.log('changed to' + newValue);
    self.changeButtonsVisibility();
  }, self);

  self.resourceTemp = "3303/0/5700";
  self.resourcePressure = "3300/0/5700";
  self.resourceHumidity = "3304/0/5700";
  self.resourceButton = "3200/0/5501";

  self.tempData = ko.observable({labels: [], datasets: [{ label: "Temperature Dataset", fillColor: "rgba(220,220,220,0.2)", strokeColor: "rgba(220,220,220,1)", pointColor: "rgba(220,220,220,1)", pointStrokeColor: "#fff", pointHighlightFill: "#fff", pointHighlightStroke: "rgba(220,220,220,1)",data: []}]});
  self.pressureData = ko.observable({labels: [], datasets: [{ label: "Pressure Dataset", fillColor: "rgba(220,220,220,0.2)", strokeColor: "rgba(220,220,220,1)", pointColor: "rgba(220,220,220,1)", pointStrokeColor: "#fff", pointHighlightFill: "#fff", pointHighlightStroke: "rgba(220,220,220,1)",data: []}]});
  self.humidityData = ko.observable({labels: [], datasets: [{ label: "Humidity Dataset", fillColor: "rgba(220,220,220,0.2)", strokeColor: "rgba(220,220,220,1)", pointColor: "rgba(220,220,220,1)", pointStrokeColor: "#fff", pointHighlightFill: "#fff", pointHighlightStroke: "rgba(220,220,220,1)",data: []}]});
  self.buttonData = ko.observable({labels: [], datasets: [{ label: "Button Dataset", fillColor: "rgba(220,220,220,0.2)", strokeColor: "rgba(220,220,220,1)", pointColor: "rgba(220,220,220,1)", pointStrokeColor: "#fff", pointHighlightFill: "#fff", pointHighlightStroke: "rgba(220,220,220,1)",data: []}]});
  
  self.isServiceRunning = {};

  self.testData = ko.observableArray ([]);
  self.startButton;
  self.stopButton;

  self.startButton = document.getElementById('start-button');
  self.stopButton = document.getElementById('stop-button');

  
  self.getEndpoints = function() {
    cloud.getEndpoints().then(function (data) {
      console.log("function response: " + JSON.stringify(data));
      self.availableEndpoints.removeAll();
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          self.availableEndpoints.push(data[key].name);
        }
      }
    });
  };

  self.getEndpointInfo = function() {
    if(self.selectedEndpoint() && self.selectedEndpoint().length > 0 ){
      console.log("" + self.selectedEndpoint());
      cloud.getEndpointInfo("" + self.selectedEndpoint()).then(function (data) {
        console.log("function response: " + JSON.stringify(data));
        
      });
    }
    else{
      alert("Please select endpoint first!");
    }
  };
  
  self.registerNotificationChannel = function() {
    if(self.selectedEndpoint() && self.selectedEndpoint().length > 0 ){
      console.log("" + self.selectedEndpoint());
      cloud.registerNotificationChannel().then(function (data) {
        console.log("function response: " + JSON.stringify(data));
        
      });
    }
    else{
      alert("Please select endpoint first!");
    }
    
  };
  
  
  self.startNotificationService = function(path) {
    if(self.selectedEndpoint() && self.selectedEndpoint().length > 0 ){
      params = {
        "endpoint": self.selectedEndpoint(),
        "path": path
      }
      cloud.startNotificationService(params).then(function (data) {
        // To get resources as soon as service for the resource has started
        //self.getResource(path);
      });
    }
    else{
      alert("Please select endpoint first!");
    }
  };

  self.stopNotificationService = function(path) {
    if(self.selectedEndpoint() && self.selectedEndpoint().length > 0 ){
      params = {
        "endpoint": self.selectedEndpoint(),
        "path": path
      }
      cloud.stopNotificationService(params).then(function (data) {
        console.log("function response: " + JSON.stringify(data));
      });
    }
    else{
      alert("Please select endpoint first!");
    }
  };

  self.parseResource = function(data, path){
    values = [];
    var labels = [];
    var i = 1;
    self.testData.removeAll();
    for(var key in data){
      if(data.hasOwnProperty(key)){
        d = new Date(data[key].time);
        
        labels.push(d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
        values.push(data[key].payload);
        self.testData.push(data[key].payload);
        i++;
      }
    }
    
    if(path == self.resourceTemp){
      console.log('showing for temp!');
      self.tempData({
        labels: labels,
        datasets: [{
          label: "Button resource dataset",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: values
        }]
      });
    }
    else if(path == self.resourcePressure){
      console.log('showing for pressure!');
      self.pressureData({
        labels: labels,
        datasets: [{
          label: "Button resource dataset",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: values
        }]
      });
    }
    else if(path == self.resourceButton){
      console.log('showing for button!');
      self.buttonData({
        labels: labels,
        datasets: [{
          label: "Button resource dataset",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: values
        }]
      });
    }
    else if(path == self.resourceHumidity){
      console.log('showing for humidity!');
      self.humidityData({
        labels: labels,
        datasets: [{
          label: "Button resource dataset",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: values
        }]
      });
    }
  };

  self.getResource = function(path) {
    params = {
      endpoint: self.selectedEndpoint(),
      path: path
    }
    cloud.getResource(params).then(function (data) {
      //console.log("function response: " + JSON.stringify(data));
      self.parseResource(data, path);
    });
    if(self.isServiceRunning[self.selectedEndpoint()]){
      setTimeout(self.getResource, 1000, path);
    }
  };

  self.getAllResources = function() {
    params = {
      endpoint: self.selectedEndpoint()
    }
    cloud.getAllResources(params).then(function (data) {
      //console.log("function response: " + JSON.stringify(data));
      for(var key in data){
        if(data.hasOwnProperty(key)){
          self.parseResource(data[key], key.substring(1));
        }
      }
    });
    if(self.isServiceRunning[self.selectedEndpoint()]){
      setTimeout(self.getAllResources, 1000);
    }
  };

  self.startTempNotificationService = function() {
    self.startNotificationService(self.resourceTemp);
  };

  self.stopTempNotificationService = function() {
    self.stopNotificationService(self.resourceTemp);
  };

  self.getTemperatureResource = function() {
    self.getResource(self.resourceTemp);
  };
  
  self.startPressureNotificationService = function() {
    self.startNotificationService(self.resourcePressure);
  };

  self.stopPressureNotificationService = function() {
    self.stopNotificationService(self.resourcePressure);
  };

  self.getPressureResource = function() {
    self.getResource(self.resourcePressure);
  };

  self.startButtonNotificationService = function() {
    self.startNotificationService(self.resourceButton);
  };

  self.stopButtonNotificationService = function() {
    self.stopNotificationService(self.resourceButton);
  };

  self.getButtonResource = function() {
    self.getResource(self.resourceButton);
  };
  
  self.startService = function(){
    self.isServiceRunning[self.selectedEndpoint()] = true;
    self.startNotificationService(self.resourceTemp);
    self.startNotificationService(self.resourcePressure);
    self.startNotificationService(self.resourceHumidity);
    self.startNotificationService(self.resourceButton);
    self.getAllResources();
    self.changeButtonsVisibility();
  };

  self.stopService = function(){
    self.isServiceRunning[self.selectedEndpoint()] = false;
    self.stopNotificationService(self.resourceTemp);
    self.stopNotificationService(self.resourcePressure);
    self.stopNotificationService(self.resourceHumidity);
    self.stopNotificationService(self.resourceButton);
    self.changeButtonsVisibility();
  };

  self.changeButtonsVisibility = function(){
    if(self.isServiceRunning[self.selectedEndpoint()]){
      self.startButton.style.visibility = "hidden";
      self.stopButton.style.visibility = "visible";
    }
    else{
      self.startButton.style.visibility = "visible";
      self.stopButton.style.visibility = "hidden";
    }
  };
  /*
  self.changeButtonsVisibility = function(obj, event){
    console.log('yayay!');
    self.changeButtonsVisibility();
  };
  */
};

$(document).ready(function() {
  var data = {};
  var koModel = new KoModel(data);
  ko.applyBindings(koModel);

  document.getElementById('stop-button').style.visibility = "hidden";
});
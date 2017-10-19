function Cloud() {
    self = this;
    this.mbed_server = "https://api.connector.mbed.com/v2";
    
    //this.notification_server = "http://18.221.102.101:53576";
    
    this.notification_server = "http://192.168.1.20:8082";
    this.notification_server_out = "http://93.62.59.68:53576";
    this.notification_path = "/notification";

    //this.notification_server = "http://13.59.209.66:53576";
    
    //this.key = "KGC48Y04jRsJgYG4Uwnx1dmMfhVImYwy49sc87PafmJDJLdmvexESLhy4J0AeLmbwvbE5kMfIoy9PDSYVoTSvl55Kue3InElCB7N";
    // new
    //this.key = "hPDJSltBhMi9l73Lf1I6S9lXKnIFrVIPfRnwJvq8Ak88AKiY2J87q4nUG2RzOfKd0qAbgd53Iq65Op2qPewv06JssDPJMUsa14mn";
    this.key = "P6JGPZM7Oa0pZRsJ8bhHLCHU1kjygeFSzmyeEZmKn5OMfak3Ichsms9aKH6VllncYCNMyqBLkhweMwg2FExZBxZuo2fRU6QOTQcY";

    this.authorization = "Bearer " + this.key;
    this.headers = {
        "Authorization": this.authorization,
        //"Access-Control-Allow-Origin": "*"
    }
}

Cloud.prototype.getEndpoints = function () {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: self.mbed_server + "/endpoints",
        type: "get",
        contentType: "application/json",
        dataType:"json",
        headers: self.headers,
      }).done(function (result) {
        resolve(result);
      });
    });
  };

Cloud.prototype.getEndpointInfo = function (endpoint) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: self.mbed_server + "/endpoints/" + endpoint,
        type: "get",
        contentType: "application/json",
        headers: self.headers,
      }).done(function (result) {
        console.log(result);
        resolve(result);
      });
    });
  };


Cloud.prototype.registerNotificationChannel = function (endpoint) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: self.mbed_server + "/notification/callback",
        type: "put",
        contentType: "application/json",
        data: JSON.stringify(
          {
            "url": (self.notification_server_out ?  self.notification_server_out : self.notification_server) +  self.notification_path,
            "headers" : {
              "Authorization" : "auth"
            }
          }),
        headers: self.headers,
      }).done(function (result) {
        console.log(result);
        resolve(result);
      });
    });
  };


  Cloud.prototype.startNotificationService = function (params) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: self.notification_server +  "/start/" + params.endpoint + "/" + params.path,
        type: "get",
        contentType: "application/json"
      }).done(function (result) {
        console.log(result);
        resolve(result);
      });
    });
  };

  Cloud.prototype.stopNotificationService = function (params) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: self.notification_server +  "/stop/" + params.endpoint + "/" + params.path,
        type: "get",
        contentType: "application/json"
      }).done(function (result) {
        console.log(result);
        resolve(result);
      });
    });
  };

  Cloud.prototype.getResource = function (params) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: self.notification_server +  "/get_resource/" + params.endpoint + "/" + params.path,
        type: "get",
        contentType: "application/json"
      }).done(function (result) {
        console.log(result);
        resolve(result);
      });
    });
  };

  Cloud.prototype.getAllResources = function (params) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: self.notification_server +  "/get_all_resources/" + params.endpoint,
        type: "get",
        contentType: "application/json"
      }).done(function (result) {
        console.log(result);
        resolve(result);
      });
    });
  };
  
var cloud = new Cloud(); 
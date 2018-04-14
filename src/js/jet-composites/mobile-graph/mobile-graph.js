/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojpictochart', 'service-worker'],
    function(oj, ko, $) {
        'use strict';

        function ExampleComponentModel(context) {
            var self = this;
            self.composite = context.element;

            let days = { days: 10 };


            function PictoChartModel(retentionDays) {
                self.pictoChartItems = ko.observableArray([]);
                self.difference = ko.observable("7 out of 10 college students");
                self.finding = ko.observable("have sleep problems.");

                let LogData = new Service('POST', 'http://localhost:3001/readactivity', retentionDays, 'application/json');

                let logData = LogData.onLoadLogData();

                logData.done(data => {
                    //filter for mobile

                    let totalDesktopDevices = data.filter(log => {
                        if (log.mobile === false) {
                            return log;
                        };
                    });

                    let totalMobileDevices = data.filter(log => {
                        if (log.mobile === true) {
                            return log;
                        };
                    });

                    let desktops = { name: 'Logged In With Desktop', shape: 'human', count: totalDesktopDevices.length, color: '#2e2be2' };
                    let mobiles = { name: 'Logged In With Mobile', shape: 'human', count: totalMobileDevices.length };

                    self.pictoChartItems.push(desktops);
                    self.pictoChartItems.push(mobiles);

                    let totalLogs = data.length;
                    let totalDesktops = Number(totalLogs) - Number(totalMobileDevices.length);


                    let stat = `${totalDesktops} out of ${totalLogs} jde users`;
                    let find = "logged in on desktops.";

                    self.difference(stat);
                    self.finding(find);
                });

                logData.fail(function(jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                });
            };

            var pictoChartModel = new PictoChartModel(days);

            // Get Data
            context.props.then(function(propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;

                //Parse your component properties here 

            });
        };
        return ExampleComponentModel;
    });
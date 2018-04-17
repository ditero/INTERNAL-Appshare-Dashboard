/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojpictochart', 'serviceworker'],
    function(oj, ko, $) {
        'use strict';

        function MobileComponentModel(context) {
            var self = this;
            self.composite = context.element;

            let days = { days: 10 };


            self.pictoChartItems = ko.observableArray([]);
            self.difference = ko.observable("");
            self.finding = ko.observable("");

            function PictoChartModel(data) {
                self.pictoChartItems([]);


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
            };


            self.data = ko.observableArray();

            // Get Data
            context.props.then(function(propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;



                //Parse your component properties here 
                if (self.properties) {

                    // console.log(self.properties.data);

                    // console.log(self.properties)
                    setTimeout(() => {
                        new PictoChartModel(self.properties.data);
                        self.data(self.properties.data);

                        setInterval(() => {
                            if (self.properties.data !== self.data()) {
                                self.data(self.properties.data);
                                new PictoChartModel(self.properties.data);
                            }
                        }, 1000)
                    }, 1000)

                }
            });
        };
        return MobileComponentModel;
    });
/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojL10n!./resources/nls/retention-graph-strings', 'ojs/ojgauge'],
    function (oj, ko, $) {


        function RetentionGraphComponentModel(context) {
            var self = this;

            //At the start of your viewModel constructor
            var busyContext = oj.Context.getContext(context.element).getBusyContext();
            var options = {
                "description": "CCA Startup - Waiting for data"
            };
            self.busyResolve = busyContext.addBusyState(options);

            self.composite = context.element;


            // RETENTION DAYS
            self.data = ko.observableArray();
            self.noOfRententionDays = ko.observable(80);

            const RetentionGraph = function (logs) {
                console.log(logs);
            };

            if (context.properties) {
                //Parse your component properties here 
                setTimeout(() => {
                    new RetentionGraph(context.properties.data);
                    self.data(context.properties.data);

                    setInterval(() => {
                        if (context.properties.data !== self.data()) {
                            self.data(context.properties.data);
                            new RetentionGraph(context.properties.data);
                        }
                    }, 1000)
                }, 1000)
            }

            //Once all startup and async activities have finished, relocate if there are any async activities
            self.busyResolve();
        };

        return RetentionGraphComponentModel;
    });
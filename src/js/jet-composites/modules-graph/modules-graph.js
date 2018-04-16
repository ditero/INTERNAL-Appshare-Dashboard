define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojchart', 'serviceworker'],
    function(oj, ko, $) {
        'use strict';

        function ModulesComponentModel(context) {
            var self = this;
            self.composite = context.element;

            self.stackValue = ko.observable('off');

            self.orientationValue = ko.observable('vertical');

            /* chart data */
            var barSeries = [];

            let year = new Date().getFullYear();

            var barGroups = [year];

            self.barSeriesValue = ko.observableArray(barSeries);
            self.barGroupsValue = ko.observableArray(barGroups);



            // modules.done((data) => {
            function ProccessGraph(data) {
                let moduleNames = {};
                let modules = [];
                data.forEach(element => {

                    if (moduleNames[element.moduleDescription] === undefined) {
                        moduleNames[element.moduleDescription] = 1;
                    } else {
                        moduleNames[element.moduleDescription] += 1;
                    };
                });

                for (var i in moduleNames) {
                    let modName = i;
                    let modValue = moduleNames[i];

                    barSeries.push({ name: modName, items: [modValue] });
                };

                self.barSeriesValue(barSeries);
            }


            self.data = ko.observableArray();

            context.props.then(function(propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;

                //Parse your component properties here 
                setTimeout(() => {
                    new ProccessGraph(self.properties.data);
                    self.data(self.properties.data);

                    setInterval(() => {
                        if (self.properties.data !== self.data()) {
                            self.data(self.properties.data);
                            new ProccessGraph(self.properties.data);
                        }
                    }, 1000)
                }, 1000)
            });
        };

        return ModulesComponentModel;
    });
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojchart', 'serviceworker'],
    function (oj, ko, $) {
        'use strict';

        function ModulesComponentModel(context) {
            var self = this;
            self.composite = context.element;

            self.stackValue = ko.observable('off');

            self.orientationValue = ko.observable("vertical");

            self.isHorizontal = ko.observableArray([]);

            // Horizontal and Vertical Bar Graph View
            self.changeChartOrientation = ko.computed(function () {
                if (self.isHorizontal()[0] == 'Horizontal') {
                    self.orientationValue('horizontal');
                } else {
                    self.orientationValue('vertical');
                };
            }, this);

            /* chart data */
            var barSeries = [];
            let year = new Date().getFullYear();
            var barGroups = [year];
            self.barSeriesValue = ko.observableArray(barSeries);
            self.barGroupsValue = ko.observableArray(barGroups);

            function ProccessGraph(logs, config) {
                let moduleNames = {};
                let moduleIDs = {};
                let modules = [];
                barSeries = [];

                // filter for modules in log data
                logs.forEach(log => {
                    if (log.module !== "00000") {
                        if (moduleIDs[log.module] === undefined) {
                            moduleIDs[log.module] = "";
                            modules.push({
                                id: log.module,
                                description: ""
                            });
                        };
                    };
                });

                // match the log data modules with right description in config data
                modules.forEach(module => {
                    let cModule = module.id;

                    config.modules.forEach(config => {
                        if (config.id === cModule) {
                            module.description = config.description;
                        };
                    });
                });


                // count the number of logs in total for each module
                logs.forEach(log => {
                    modules.forEach(module => {
                        if (module.id === log.module) {
                            if (module.description !== "") {
                                if (moduleNames[module.description] === undefined) {
                                    moduleNames[module.description] = 1;
                                } else {
                                    moduleNames[module.description] += 1;
                                };
                            };
                        };
                    });
                });


                // assign the modules and logs onto the bar graph
                for (var i in moduleNames) {
                    let modName = i;
                    let modValue = moduleNames[i];

                    barSeries.push({
                        name: modName,
                        items: [modValue]
                    });
                };

                self.barSeriesValue(barSeries);
            }


            // log and config data store
            self.data = ko.observableArray();
            self.configData = ko.observableArray();

            context.props.then(function (propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;

                //Parse your component properties here 
                setTimeout(() => {
                    new ProccessGraph(self.properties.data, self.properties.config);
                    self.data(self.properties.data);
                    self.configData(self.properties.config);
                    setInterval(() => {
                        if (self.properties.data !== self.data()) {
                            self.data(self.properties.data);
                            self.configData(self.properties.config);
                            new ProccessGraph(self.properties.data, self.properties.config);
                        }
                    }, 1000)
                }, 1000)
            });
        };

        return ModulesComponentModel;
    });
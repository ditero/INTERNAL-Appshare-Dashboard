define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojchart', 'ojs/ojdialog', 'serviceworker'],
    function (oj, ko, $) {
        'use strict';

        function ModulesComponentModel(context) {
            var self = this;
            self.composite = context.element;

            self.stackValue = ko.observable('off');

            self.orientationValue = ko.observable("vertical");

            self.isHorizontal = ko.observableArray([]);

            // log and config data store
            self.data = ko.observableArray();
            self.configData = ko.observableArray();

            // Horizontal and Vertical Bar Graph View
            self.changeChartOrientation = ko.computed(function () {
                if (self.isHorizontal()[0] == 'Horizontal') {
                    self.orientationValue('horizontal');
                } else {
                    self.orientationValue('vertical');
                };
            }, this);

            // Modal and User per Day Graph
            $(document).ready(() => {
                $("#barChart").on("click", (e) => {
                    try {
                        let attributes = e.target.attributes["aria-label"].value;
                        let splitLabel = attributes.split(";");
                        let name = splitLabel[0].split(": ");

                        let module = name[1];

                        if (module) {
                            self.handleOpen(module);
                            ProccessGraphLine(self.data(), module);
                        }
                    } catch (error) {
                        //   
                    }


                });
            });

            self.sliderValue = ko.observable(400);

            self.openAnimationEffect = ko.observable("flipIn");

            self.startAnimationListener = function (event) {
                var ui = event.detail;
                if (!$(event.target).is(".oj-dialog")) return;

                if ("open" === ui.action) {
                    event.preventDefault();
                    var action = self.openAnimationEffect();
                    var options = {
                        "duration": self.sliderValue() + "ms"
                    };
                    if ("none" === action)
                        ui.endCallback();
                    else
                        oj.AnimationUtils[action](ui.element, options).then(ui.endCallback);
                } else if ("close" === ui.action) {
                    event.preventDefault();
                    ui.endCallback();
                }
            };

            self.handleOpen = function (module) {
                document.querySelector("#dialog1").open();
            };
            self.handleOKClose = function () {
                document.querySelector("#dialog1").close();
            };

            /////////////////////////////////////////////////////////////////////
            self.lineTitle = ko.observable();

            self.orientationValueLine = ko.observable("vertical");

            self.isHorizontalLine = ko.observableArray([]);

            self.changeLineChartOrientation = ko.computed(function () {
                if (self.isHorizontalLine()[0] == 'Horizontal') {
                    self.orientationValueLine('horizontal');
                } else {
                    self.orientationValueLine('vertical');
                };
            }, this);

            /* line chart data */
            var lineSeries = [];
            var keepData = [];
            let counter = 0;
            // let days = new Date().getFullYear();

            var lineGroups = [];

            self.lineSeriesValue = ko.observableArray(lineSeries);
            self.lineGroupsValue = ko.observableArray(lineGroups);

            const setDefaultData = () => {
                self.lineSeriesValue();
                self.lineGroupsValue();
                lineSeries = [];
                lineGroups = [];
                keepData = [];
                counter = 0;
            };

            function ProccessGraphLine(data, module) {
                setDefaultData();

                self.lineTitle(module);

                let daysObj = {};

                // console.log(self.lineGroupsValue());
                data.forEach(log => {
                    var daysDates = new Date(log.datetime);
                    if (log.moduleDescription === module) {
                        if (daysObj[daysDates.toDateString()] === undefined) {
                            daysObj[daysDates.toDateString()] = {
                                value: 1,
                                description: module
                            };
                            let date = daysDates.toDateString();
                        } else {
                            let oldVal = daysObj[daysDates.toDateString()].value;
                            let newVal = oldVal + 1;
                            daysObj[daysDates.toDateString()] = {
                                value: newVal,
                                description: module
                            };
                        }
                    }


                });

                for (var i in daysObj) {
                    let dayName = daysObj[i].description;
                    let dayValue = daysObj[i].value;
                    keepData.push(dayValue)
                    lineGroups.push(i)

                    lineSeries.push({
                        items: keepData
                    });

                    counter++;
                };
                self.lineSeriesValue(lineSeries);
                self.lineGroupsValue(lineGroups);
            }

            ////////////////////////////////////////////////////////////////////

            /* bar chart data */
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


                try {
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

                } catch (error) {
                    // filter for modules in log data
                    logs.forEach(log => {
                        if (log.module !== "00000") {
                            if (moduleNames[log.moduleDescription] === undefined) {
                                moduleNames[log.moduleDescription] = 1;
                            } else {
                                moduleNames[log.moduleDescription] += 1
                            };
                        };
                    });
                }


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
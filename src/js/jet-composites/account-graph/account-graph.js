/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'promise', 'ojs/ojtable', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojarraydataprovider', 'serviceworker'],
    function(oj, ko, $) {
        'use strict';

        function AccountGraphicsComponentModel(context) {
            var self = this;
            self.composite = context.element;

            self.logArray = ko.observableArray([]);
            self.dataprovider = new ko.observable(new oj.ArrayDataProvider(self.logArray, { idAttribute: 'accountId' }));

            /// ACCOUNTS FUNCTION
            const AccountFunctions = () => {
                const modifyData = (logData) => {
                    let Accounts = [];

                    logData.forEach(log => {
                        Accounts.push({ accountId: log._id, account: log.account, user: log.user, server: log.server, aisVersion: log.aisVersion, action: log.action });
                    });

                    return Accounts;
                };

                return {
                    modifyData
                };
            };


            /// ACTION CHART
            self.dataLabelPositionValue = ko.observable('outsideSlice');
            self.pieSeriesValue = ko.observableArray([]);

            const ActionChart = () => {
                const initialiseChart = (logData) => {
                    let filterData = modifyData(logData);
                };

                const modifyData = (logData) => {
                    let actions = {};
                    let pieSeries = [];

                    logData.forEach(log => {
                        if (actions[log.action] === undefined) {
                            actions[log.action] = 1;
                        } else {
                            actions[log.action] += 1;
                        };
                    });

                    for (var action in actions) {
                        let actionName = action;
                        let actionValue = actions[action];

                        let actionObj = { name: actionName, items: [actionValue], pieSliceExplode: 0 };
                        pieSeries.push(actionObj);
                    };

                    self.pieSeriesValue(pieSeries);
                };
                return {
                    initialiseChart
                }
            }

            let actionChart = ActionChart();

            self.hiddenCategories = ko.observableArray([]);

            self.data = ko.observableArray();

            context.props.then(function(propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;

                setTimeout(() => {
                    actionChart.initialiseChart(self.properties.data);
                    self.data(self.properties.data);

                    setInterval(() => {
                        if (self.properties.data !== self.data()) {
                            actionChart.initialiseChart(self.properties.data);
                            self.data(self.properties.data);
                        }
                    }, 1000)
                }, 1000)
            });
        };
        return AccountGraphicsComponentModel;
    });
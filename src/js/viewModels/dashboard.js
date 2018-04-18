/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'serviceworker', 'ojs/ojknockout', 'ojs/ojselectcombobox', 'ojs/ojmasonrylayout', 'jet-composites/modules-graph/loader', 'jet-composites/account-graph/loader', 'jet-composites/mobile-graph/loader', 'jet-composites/server-graph/loader', 'jet-composites/mobile-graph/loader', 'jet-composites/total-logs/loader'],
    function(oj, ko, $) {

        function DashboardViewModel() {
            var self = this;
            self.nowrap = ko.observable(false);

            /// REMOVED COMPONENT DATA BUT KEPT IN CASE NEEDED
            // self.value = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
            // self.max = ko.observable((new Date().toISOString()));

            // let retentionDays = { days: 20 };
            // self.agreement = ko.observableArray();
            // self.noOfDays = ko.computed(function() {
            //     let diff = Math.abs(new Date() - new Date(self.value()));

            //     let days = diff / (1000 * 60 * 60 * 24);

            //     return days.toFixed() + " days";
            // });
            ///////////////////////////////////////////////////

            // Filter Functionality
            self.val = ko.observable();
            self.customers = ko.observableArray([]);

            self.logs = ko.observableArray();

            var rawData = [];

            self.selectedValue = (event) => {
                event.preventDefault();
                let option = event.detail.value;
                let filteredData = [];

                if (option) {
                    if (option === "All Customers") {
                        self.logs(rawData);
                    } else {
                        rawData.filter(log => {
                            // console.log(log.appCustomer);
                            if (log.appCustomer === option) {
                                filteredData.push(log);
                            };
                        });
                        self.logs(filteredData);
                    }
                };
            };

            serviceworker.getLogData("GET", "http://localhost:3001/readactivity").done((logs) => {
                self.logs(logs);
                rawData = logs;
                self.customers([]);
                self.customers.push({ "value": "All Customers", "label": "All Customers", disabled: false });
                let customerList = {};

                self.logs().forEach(log => {
                    if (customerList[log.appCustomer] === undefined) {
                        customerList[log.appCustomer] = 1;
                        self.customers.push({ "value": log.appCustomer, "label": log.appCustomer, disabled: false });
                    };
                });
            });

            self.chemicals = [{
                    name: 'logs',
                    sizeClass: 'oj-masonrylayout-tile-3x1'
                }, {
                    name: 'mobile',
                    sizeClass: 'oj-masonrylayout-tile-3x1'
                },
                {
                    name: 'filterData',
                    sizeClass: 'oj-masonrylayout-tile-2x1'
                }, {
                    name: 'modules',
                    sizeClass: 'oj-masonrylayout-tile-4x3'
                },
                {
                    name: 'accounts',
                    sizeClass: 'oj-masonrylayout-tile-4x4'
                }
            ];

            // $(document).ready(() => {
            //     $('#mobile').append("<mobile-graph></mobile-graph>");
            // })

            self.handleBindingsApplied = function(info) {
                $('#modules').append($('#moduleGraph'));
                $('#accounts').append($('#accountGraph'));
                $('#mobile').append($('#mobileGraph'));
                $('#filterData').append($('#filterCustomers'));
                $("#logs").append($("#totalLogs"))
            };
        }


        return new DashboardViewModel();
    }
);
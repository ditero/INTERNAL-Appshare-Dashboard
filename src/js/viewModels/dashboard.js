/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'serviceworker', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojdatetimepicker', 'ojs/ojvalidation-datetime', 'ojs/ojtimezonedata', 'ojs/ojlabel', 'ojs/ojmasonrylayout', 'jet-composites/modules-graph/loader', 'jet-composites/account-graph/loader', 'jet-composites/mobile-graph/loader', 'jet-composites/server-graph/loader', 'jet-composites/mobile-graph/loader', 'jet-composites/total-logs/loader'],
    function(oj, ko, $) {

        function DashboardViewModel() {
            var self = this;
            self.nowrap = ko.observable(false);

            self.value = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
            self.max = ko.observable((new Date().toISOString()));

            self.logs = ko.observableArray();
            let retentionDays = { days: 10 };

            self.handleOpen = function() {
                document.querySelector("#percentDialog").open();
            };
            self.handleOKClose = function() {
                let diff = Math.abs(new Date() - new Date(self.value()));

                let days = diff / (1000 * 60 * 60 * 24);
                let retentionDays = { days: days.toFixed() };

                self.logs([])
                serviceworker.getLogData("POST", "http://localhost:3001/readactivity", retentionDays).done((logs) => {
                    self.logs(logs);
                });

                document.querySelector("#percentDialog").close();
            };


            serviceworker.getLogData("POST", "http://localhost:3001/readactivity", retentionDays).done((logs) => {
                self.logs(logs);
            });






            // let LogData = new Service('POST', '', retentionDays, 'application/json');


            // self.logs = LogData.onLoadLogData();
            // console.log(self.logs)

            // self.logs() = logData.done(data => {
            //     //filter for mobile
            //     return data;
            //     self.logs(data);
            // });

            // logData.fail(function(jqXHR, textStatus) {
            //     alert("Request failed: " + textStatus);
            // });


            self.chemicals = [{
                    name: 'mobile',
                    sizeClass: 'oj-masonrylayout-tile-3x1'
                },
                {
                    name: 'logs',
                    sizeClass: 'oj-masonrylayout-tile-2x1'
                },
                {
                    name: 'modules',
                    sizeClass: 'oj-masonrylayout-tile-4x3'
                },
                {
                    name: 'accounts',
                    sizeClass: 'oj-masonrylayout-tile-4x4'
                },
                {
                    name: 'servers',
                    sizeClass: 'oj-masonrylayout-tile-4x2'
                },
                {
                    name: 'mobile',
                    sizeClass: 'oj-masonrylayout-tile-3x1'
                }
            ];

            // $(document).ready(() => {
            //     $('#mobile').append("<mobile-graph></mobile-graph>");
            // })

            self.handleBindingsApplied = function(info) {
                $('#modules').append($('#moduleGraph'));
                $('#accounts').append($('#accountGraph'));
                $('#mobile').append($('#mobileGraph'));
                $('#servers').append($('#serverGraph'));
                $("#logs").append($("#totalLogs"))
            };
        }


        return new DashboardViewModel();
    }
);
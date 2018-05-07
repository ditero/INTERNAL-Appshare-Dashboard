define(['ojs/ojcore', 'knockout', 'jquery', 'serviceworker', 'ojs/ojknockout', 'ojs/ojlabel', 'ojs/ojformlayout', 'ojs/ojselectcombobox', 'ojs/ojdatetimepicker', 'ojs/ojtimezonedata', 'ojs/ojlabel', 'jet-composites/modules-graph/loader', 'jet-composites/account-graph/loader', 'jet-composites/mobile-graph/loader', 'jet-composites/log-dates/loader', 'jet-composites/mobile-graph/loader', 'jet-composites/total-logs/loader'],
    function(oj, ko, $) {

        function DashboardViewModel() {
            var self = this;
            self.nowrap = ko.observable(false);

            /// REMOVED COMPONENT DATA BUT KEPT IN CASE NEEDED ///
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

            ///   LOG DATE
            self.dayValue = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
            let counter = 0;
            self.selectedDay = (event) => {
                event.preventDefault();
                if (counter > 0) {
                    let date = event.detail.value;
                    let modifiedDate = new Date(date).toLocaleDateString();

                    // call filter function 
                    dateFilter(modifiedDate);
                };
                counter++;
            };
            ////////////////////

            self.isSmall = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(
                oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY));

            // For small screens: labels on top
            // For medium screens and up: labels inline
            self.labelEdge = ko.computed(function() {
                return this.isSmall() ? "top" : "start";
            }, this);

            // Filter Functionality
            self.val = ko.observable();
            self.isDisabled = ko.observable(false);
            self.accounts = ko.observableArray([]);
            self.logs = ko.observableArray();
            var rawData = [];

            self.selectedValue = (event) => {
                event.preventDefault();
                let option = event.detail.value;

                // check if param exist in url
                let url = new URL(window.location);

                if (url["search"]) {
                    getParams(url["search"]);
                } else {
                    accountFilter(option);
                };
            };

            // retreiving data from backend service
            serviceworker.getLogData("GET", "//localhost:3001/readactivity").done((logs) => {
                self.logs(logs);
                rawData = logs;
                self.accounts([]);
                self.accounts.push({ "value": "All Accounts", "label": "All Accounts", disabled: false });
                let accountList = {};

                self.logs().forEach(log => {
                    if (accountList[log.account] === undefined) {
                        if (log.account !== "") {
                            accountList[log.account] = 1;
                            let fChar = log.account.substring(1, 0).toUpperCase();
                            let oChar = log.account.slice(1);
                            self.accounts.push({ "value": fChar + oChar, "label": fChar + oChar, disabled: false });
                        };
                    };
                });
            });

            const getParams = (url) => {
                try {
                    let urlSplit = url.split("=");
                    let account = urlSplit[1].replace(/%20/g, " ");

                    urlFilter(account);
                } catch (error) {
                    console.log('Detected Blank Params');
                    urlFilter("");
                };
            };

            // URL Customer Filter
            const urlFilter = (account) => {
                accountFilter(account, true);
            };

            const accountFilter = (accountOption, queryDetected = false) => {
                let filteredData = [];

                if (accountOption) {
                    let account = accountOption.toLowerCase();
                    if (account === "all accounts") {
                        self.logs(rawData);
                    } else {
                        rawData.filter(log => {
                            if (log.account.toLowerCase() === account) {
                                filteredData.push(log);
                            };
                        });
                        self.logs(filteredData);
                    };
                };

                try {
                    if (queryDetected) {
                        let fChar = filteredData[0]["account"].substring(1, 0).toUpperCase();
                        let oChar = filteredData[0]["account"].slice(1);
                        self.val(fChar + oChar);
                        self.isDisabled(true);
                    };
                } catch (error) {
                    console.log("No Data Found");
                }

            };

            const dateFilter = (dateOption) => {
                let filteredData = [];

                if (dateOption) {
                    let date = dateOption;
                    if (date === "all days") {
                        self.logs(rawData);
                    } else {
                        rawData.filter(log => {
                            let logDate = log.datetime;
                            let modifiedLogDate = new Date(logDate).toLocaleDateString();
                            if (modifiedLogDate === date) {
                                filteredData.push(log);
                            };
                        });
                        self.logs(filteredData);
                    };
                };
            };
        };
        return new DashboardViewModel();
    });
''
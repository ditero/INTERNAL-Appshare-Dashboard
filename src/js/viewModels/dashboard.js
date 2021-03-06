define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "serviceworker",
  "ojs/ojknockout",
  "ojs/ojlabel",
  "ojs/ojcheckboxset",
  "ojs/ojformlayout",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojbutton",
  "ojs/ojtimezonedata",
  "ojs/ojlabel",
  "jet-composites/modules-graph/loader",
  "jet-composites/account-graph/loader",
  "jet-composites/mobile-graph/loader",
  "jet-composites/mobile-graph/loader",
  "jet-composites/total-logs/loader",
  'jet-composites/retention-graph/loader',
], function (oj, ko, $) {
  function DashboardViewModel() {
    var self = this;
    self.nowrap = ko.observable(false);

    $("body").css("overflow", "hidden");

    // LOADING
    self.loadingValue = ko.observable("Loading...");

    ///   LOG DATE
    // Filter Functionality
    self.dayValue = ko.observable(
      oj.IntlConverterUtils.dateToLocalIso(new Date())
    );
    self.orderByDate = ko.observable([]);
    let counter = 0;
    self.val = ko.observable();
    self.isDisabled = ko.observable(false);
    self.accounts = ko.observableArray([]);
    self.logs = ko.observableArray();
    self.configLogs = ko.observable();
    
    self.noOfRententionDays = ko.observable(31);
    // console.log(self.configLogs(serviceworker));
    var rawData = [];

    self.selectedValue = event => {
      event.preventDefault();
      let option = event.detail.value;

      // check if param exist in url
      let url = new URL(window.location);

      if (url["search"]) {
        getParams(url["search"], option);
      } else {
        if (self.orderByDate().length > 0) {
          let modifiedDate = new Date(self.dayValue()).toLocaleDateString();

          dateFilter(modifiedDate, option);
        } else {
          accountFilter(option);
        };
      };
    };

    self.selectedDay = event => {
      event.preventDefault();
      if (self.orderByDate().length > 0) {
        if (counter > 0) {
          let date = event.detail.value;
          let modifiedDate = new Date(date).toLocaleDateString();

          // call filter function
          dateFilter(modifiedDate, self.val());
        }
      }
      counter++;
    };

    self.isSmall = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(
      oj.ResponsiveUtils.getFrameworkQuery(
        oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
      )
    );

    // For small screens: labels on top
    // For medium screens and up: labels inline
    self.labelEdge = ko.computed(function () {
      return this.isSmall() ? "top" : "start";
    }, this);

    // pull in config data
    serviceworker
      .getConfigData("GET", "//appsharebackend.steltix.com/readconfig")
      .done(config => {
        let gauge = Number(config.activityRetentionDays);
        self.configLogs(gauge);

        console.log(self.configLogs());
      });


    ///////////////////////////////////////

    // retreiving data from backend service
    serviceworker
      .getLogData("GET", "//appsharebackend.steltix.com/readactivity")
      .done(logs => {
        loading('data');

        self.logs(logs);
        rawData = logs;
        self.accounts([]);
        self.accounts.push({
          value: "All Accounts",
          label: "All Accounts",
          disabled: false
        });
        let accountList = {};

        self.logs().forEach(log => {
          if (!log.account) {
            log.account = "Unregistered Account";
          };
          if (accountList[log.account] === undefined) {
            accountList[log.account] = 1;
            let fChar = log.account.substring(1, 0).toUpperCase();
            let oChar = log.account.slice(1);
            self.accounts.push({
              value: fChar + oChar,
              label: fChar + oChar,
              disabled: false
            });
          };
        });
      });

    const getParams = (url, query) => {
      try {
        let urlSplit = url.split("=");
        let account = urlSplit[1].replace(/%20/g, " ");

        if (account.length > 0) {
          urlFilter(account);
        } else {
          accountFilter(query, false);
        }
      } catch (error) {
        console.log("Detected Blank Params");
        urlFilter("");
      }
    };

    // URL Customer Filter
    const urlFilter = account => {
      accountFilter(account, true);
    };

    const accountFilter = (accountOption, queryDetected = false) => {
      let filteredData = [];

      if (accountOption) {
        if (accountOption.length > 0) {
          let account = accountOption.toLowerCase();
          if (account === "all accounts") {
            self.logs(rawData);
          } else {
            rawData.filter(log => {
              if (log.account.toLowerCase() === account) {
                filteredData.push(log);
              }
            });
            self.logs(filteredData);
          }
        }
      }

      try {
        if (queryDetected) {
          let fChar = filteredData[0]["account"].substring(1, 0).toUpperCase();
          let oChar = filteredData[0]["account"].slice(1);
          self.val(fChar + oChar);
          self.isDisabled(true);
        }
      } catch (error) {
        console.log("No Data Found");
      }

      if (self.orderByDate().length > 0) {
        let modifiedDate = new Date(self.dayValue()).toLocaleDateString();

        dateFilter(modifiedDate, accountOption);
      };
    };

    self.orderByDateFunc = () => {
      if (self.orderByDate().length > 0) {
        let modifiedDate = new Date(self.dayValue()).toLocaleDateString();
        dateFilter(modifiedDate, self.val());
      } else {
        accountFilter(self.val());
      }
      return true;
    };

    const dateFilter = (dateOption, queryAccount) => {
      let filteredData = [];
      let queryAcc = queryAccount.toLowerCase();

      if (dateOption) {
        let date = dateOption;
        if (date === "all days" && queryAcc === 'all accounts') {
          self.logs(rawData);
        } else if (date !== 'all days' && queryAcc === 'all accounts') {
          rawData.filter(log => {
            let logDate = log.datetime;
            let modifiedLogDate = new Date(logDate).toLocaleDateString();

            if (modifiedLogDate === date) {
              filteredData.push(log);
            };
          });
          self.logs(filteredData);
        } else if (date !== 'all days' && queryAcc !== 'all accounts') {
          rawData.filter(log => {
            let logDate = log.datetime;
            let modifiedLogDate = new Date(logDate).toLocaleDateString();

            if (modifiedLogDate === date && log.account.toLowerCase() === queryAcc) {
              filteredData.push(log);
            };
          });
          self.logs(filteredData);
        };
      }
    };

    // const retentionFilter = (retentionDays, queryAccount) => {
    //   let filteredData = [];
    //   let queryAcc = queryAccount.toLowerCase();



    //   if (retentionDays) {
    //     let days = retentionDays;
    //     if (days === "all days" && queryAcc === 'all accounts') {
    //       self.logs(rawData);
    //     } else if (date !== 'all days' && queryAcc === 'all accounts') {
    //       rawData.filter(log => {
    //         let logDate = log.datetime;
    //         let modifiedLogDate = new Date(logDate).toLocaleDateString();

    //         if (modifiedLogDate === date) {
    //           filteredData.push(log);
    //         };
    //       });
    //       self.logs(filteredData);
    //     } else if (date !== 'all days' && queryAcc !== 'all accounts') {
    //       rawData.filter(log => {
    //         let logDate = log.datetime;
    //         let modifiedLogDate = new Date(logDate).toLocaleDateString();

    //         if (modifiedLogDate === date && log.account.toLowerCase() === queryAcc) {
    //           filteredData.push(log);
    //         };
    //       });
    //       self.logs(filteredData);
    //     };
    //   }
    // };

    const loading = (message) => {
      switch (message) {
        case "components":
          self.loadingValue("Loading Dashboard Components...");
          break;
        case "data":
          self.loadingValue("Loading Dashboard Data...");
          break;
        case "finished":
          self.loadingValue("Finished...");
          break;
        default:
          break;
      };
    };

    $(document).ready(function () {
      let totalLogs = $("#totalLogs");
      const loader = setInterval(function () {
        if (self.logs().length > 0) {
          loading('components');
          setTimeout(function () {
            clearInterval(loader);
            $("#overlay").fadeOut('slow');
            loading('finished');
            $("body").css("overflow", "auto");

          }, 5000);
        };
      }, 500);
    });

  }
  return new DashboardViewModel();
});
("");

define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojselectcombobox', 'ojs/ojvalidation-number', 'ojs/ojgauge'],
    function(oj, ko, $) {
        'use strict';

        function LogDatesComponentModel(context) {
            var self = this;
            self.composite = context.element;

            self.data = ko.observableArray();



            context.props.then(function(propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;

                //Parse your component properties here 
                setTimeout(() => {
                    self.data(self.properties.data);

                    setInterval(() => {
                        if (self.properties.data !== self.data()) {
                            self.data(self.properties.data);
                        }
                    }, 1000)
                }, 1000)
            });
        };

        return LogDatesComponentModel;
    });
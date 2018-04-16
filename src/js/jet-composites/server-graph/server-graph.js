/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojpictochart', 'ojs/ojlegend'],
    function(oj, ko, $) {
        'use strict';

        function ServerComponentModel(context) {
            var self = this;
            self.composite = context.element;
            var data = {
                "January": [39, 42, 42, 56, 49, 22, 23, 21, 33, 23, 37, 39, 36, 32, 35, 43, 32, 42, 42, 40, 36, 40, 39, 39, 42, 31, 30, 34, 36, 38, 26],
                "February": [36, 34, 26, 43, 42, 27, 40, 37, 29, 40, 34, 40, 21, 32, 25, 21, 27, 33, 27, 19, 32, 43, 38, 24, 37, 32, 30, 29],
                "March": [31, 39, 37, 45, 40, 27, 38, 49, 54, 53, 59, 47, 43, 51, 44, 52, 57, 39, 43, 38, 47, 43, 38, 45, 49, 62, 46, 40, 46, 54, 47],
                "April": [51, 67, 64, 60, 61, 63, 62, 45, 43, 56, 57, 66, 68, 65, 72, 64, 71, 80, 64, 57, 65, 69, 52, 52, 62, 64, 62, 71, 78, 67]
            };
            var colorHandler = new oj.ColorAttributeGroupHandler();
            var legendItems = [];
            var temp = ["10-20°F", "20-30°F", "30-40°F", "40-50°F", "50-60°F", "60-70°F", "70-80°F"];
            var colors = ["267db3", "47bdef", "6ddbdb", "a2bf39", "fad55c", "ffb54d", "ed6647", "ed6647"];

            var getPictoItems = function(month, monthIndex) {
                var pictoItems = [];
                var values = data[month];
                var firstDay = (new Date(2015, monthIndex, 1)).getDay();
                var pointer = 0;
                for (var i = 0; i < values.length; i++) {
                    var val = values[i];
                    if (pointer < firstDay) {
                        pictoItems.push({ name: '', color: 'rgba(0,0,0,0)' });
                        pointer++;
                        i--;
                    } else
                        pictoItems.push({ name: month + ' ' + (i + 1) + " (" + val + "°F)", color: "#" + colors[Math.floor(val / 10) - 1] });
                }
                return pictoItems;
            }

            for (var i = 0; i < temp.length; i++) {
                legendItems.push({ text: temp[i], color: "#" + colors[i] });
            };

            self.janItems = ko.observableArray(getPictoItems('January', 0));
            self.febItems = ko.observableArray(getPictoItems('February', 1));
            self.marItems = ko.observableArray(getPictoItems('March', 2));
            self.aprilItems = ko.observableArray(getPictoItems('April', 3));
            self.legendSections = ko.observableArray([{ items: legendItems }]);

            self.tooltipFunction = function(dataContext) {
                return { 'insert': dataContext.name };
            }

            context.props.then(function(propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;

                //Parse your component properties here 

            });
        };

        return ServerComponentModel;
    });
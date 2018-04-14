/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojchart', 'ojs/ojtoolbar'],
    function(oj, ko, $) {
        'use strict';

        function ServerComponentModel(context) {
            var self = this;
            self.composite = context.element;
            var getEvents = function(index) {
                var start = new Date(2015, 6, 1).getTime();
                var end = new Date(2015, 6, 31).getTime();
                var items = [];
                var numEvents = Math.random() * 100;
                for (var i = 0; i < numEvents; i++) {
                    items.push({ y: index, x: new Date(start + Math.random() * (end - start)).toISOString() });
                }
                return items;
            }

            self.eventNames = {
                format: function(value) {
                    if (value == 5)
                        return 'Reverse Proxy Hits';
                    else if (value == 4)
                        return 'Server Requests';
                    else if (value == 3)
                        return 'Server Running';
                    else if (value == 2)
                        return 'Server Failing';
                    else if (value == 1)
                        return 'Cache Miss';
                    else
                        return 'Builds';
                }
            }

            self.seriesValue = [
                { items: getEvents(5), name: self.eventNames.format(5), color: 'rgba(38,125,179,0.35)' },
                { items: getEvents(4), name: self.eventNames.format(4), color: 'rgba(104,193,130,0.35)' },
                { items: getEvents(3), name: self.eventNames.format(3), color: 'rgba(250,213,92,0.35)' },
                { items: getEvents(2), name: self.eventNames.format(2), color: 'rgba(237,102,71,0.35)' },
                { items: getEvents(1), name: self.eventNames.format(1), color: 'rgba(133,97,200,0.35)' },
                { items: getEvents(0), name: self.eventNames.format(0), color: 'rgba(109,219,219,0.35)' }
            ];

            self.refObjValue = [];
            for (var i = 0; i < self.seriesValue.length; i++) {
                self.refObjValue.push({ type: 'line', color: 'rgba(196,206,215,1)', value: i + 0.5 });
            }







            context.props.then(function(propertyMap) {
                //Store a reference to the properties for any later use
                self.properties = propertyMap;

                //Parse your component properties here 

            });
        };

        return ServerComponentModel;
    });
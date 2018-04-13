/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmasonrylayout', 'jet-composites/modules-graph/loader', 'jet-composites/account-graph/loader'],
    function(oj, ko, $) {

        function DashboardViewModel() {
            var self = this;
            self.nowrap = ko.observable(false);

            self.chemicals = [{
                    name: '3x2',
                    sizeClass: 'oj-masonrylayout-tile-4x3'
                },
                {
                    name: '2x3',
                    sizeClass: 'oj-masonrylayout-tile-4x4'
                },
                {
                    name: '2x1',
                    sizeClass: 'oj-masonrylayout-tile-4x1'
                }
            ];

            // $(document).ready(() => {
            //     $('#mobile').append("<mobile-graph></mobile-graph>");
            // })

            self.handleBindingsApplied = function(info) {
                $('#3x2').append($('#moduleGraph'));
                $('#2x3').append($('#accountGraph'));
                // $('#mobile').append($('#mobileGraph'));

            };
        }


        return new DashboardViewModel();
    }
);
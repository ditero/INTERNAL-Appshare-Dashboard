/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojmasonrylayout', 'jet-composites/modules-graph/loader', 'jet-composites/account-graph/loader', 'jet-composites/mobile-graph/loader', 'jet-composites/server-graph/loader'],
    function(oj, ko, $) {

        function DashboardViewModel() {
            var self = this;
            self.nowrap = ko.observable(false);

            self.chemicals = [{
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
            };
        }


        return new DashboardViewModel();
    }
);
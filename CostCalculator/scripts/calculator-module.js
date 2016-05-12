(function () {
    'use strict';

    angular
    .module('calculatorModule', [])
    .controller('CalulatorCtrl', ['$scope',
        function ($scope) {
            $scope.Total = 0;
            $scope.CurrentStep = 1;
            $scope.HighestStep = 1;
            $scope.NumberPhoneLines = 0;
            $scope.MexicoAndCanada = false;
            $scope.$watch('NumberPhoneLines', function (newValue, oldValue) {
                if (newValue !== oldValue && (oldValue >= 20 && newValue < 20)) {
                    $scope.CurrentDataPlanType = 'Individual';
                    $scope.CurrentDataPlans = getPlansOfType($scope.CurrentDataPlanType);
                }
            });

            $scope.TotalPhoneLinePrice = 0;

            $scope.AllDataPlans = [
                {
                    Name: 'Individual',
                    Plans: [
                        { ID: 1, Name: 'Up to 1GB 4G LTE Data per line', Html: '1GB<br>INCL', Price: 0 },
                        { ID: 2, Name: 'Up to 3GB 4G LTE Data per line', Html: '3GB', Price: 10 },
                        { ID: 3, Name: 'Up to 5GB 4G LTE Data per line', Html: '5GB', Price: 20 },
                        { ID: 4, Name: 'Unlimited 4G LTE Data per line', Html: 'UNL', Price: 30 }
                    ]
                },
                {
                    Name: 'Shared',
                    Plans: [
                        { ID: 1, Name: '100GB/Pooled 4G LTE Data', Html: '$4.75/GB<br>100GB Min', Price: 475 },
                        { ID: 2, Name: '500GB/Pooled 4G LTE Data', Html: '$4.50/GB<br>500GB Min', Price: 2250 },
                        { ID: 3, Name: '1TB/Pooled 4G LTE Data', Html: '$4.25/GB<br>1TB Min', Price: 4250 }
                    ]
                }
            ];
            $scope.OptionalDataPlans = [
                    { ID: 1, Name: '1GB', Html: '1GB<br>INCL', Price: 0 },
                    { ID: 2, Name: '3GB', Html: '3GB', Price: 10 },
                    { ID: 3, Name: '5GB', Html: '5GB', Price: 20 }
            /*{ ID: 4, Name: 'Unlimited', Html: 'UNL', Price: 30 }*/
                ];

            $scope.CurrentDataPlanType = 'Individual';
            $scope.CurrentDataPlans = getPlansOfType($scope.CurrentDataPlanType);
            $scope.$watch('CurrentDataPlanType', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.CurrentDataPlans = getPlansOfType(newValue);
                    $scope.DataPlan = $scope.CurrentDataPlans.Plans[0];
                    $scope.GetDataPlansPrice();
                }
            });

            $scope.DataPlan = $scope.CurrentDataPlans.Plans[0];
            $scope.TotalDataPlanPrice = $scope.NumberPhoneLines * $scope.DataPlan.Price;

            $scope.NumberOptionalItems = 0;
            $scope.TotalOptionalItemsPrice = 0;

            $scope.OptionalDataPlan = $scope.OptionalDataPlans[0];
            $scope.TotalOptionalDataPlanPrice = $scope.NumberOptionalItems * $scope.OptionalDataPlan.Price;

            $scope.UserDataHandler = {
                Name: "",
                Phone: '',
                Email: '',
                Zip: '',
                Comments: ''
            };
            $scope.ShowSubmit = false;

            $scope.GoNextStep = function () {
                $scope.CurrentStep += 1;

                // show the submit form if it is the current step
                // once the form is shown we don't go back and hide it
                if ($scope.CurrentStep === 4) {
                    $scope.ShowSubmit = true;
                }

                if ($scope.HighestStep < $scope.CurrentStep) {
                    $scope.HighestStep = $scope.CurrentStep;
                }
            };

            $scope.GoStep = function (stepNumber) {
                if ($scope.step1Form.$valid && $scope.step2Form.$valid && $scope.step3Form.$valid && stepNumber <= $scope.HighestStep) {
                    $scope.CurrentStep = stepNumber;
                }
            };

            $scope.GetPhoneLinesPrice = function () {
                var numLines = $scope.NumberPhoneLines;

                // the total phone line cost changes depending on how many lines the user has added
                if (numLines === 1) {
                    $scope.TotalPhoneLinePrice = 50;
                } else if (numLines === 2) {
                    $scope.TotalPhoneLinePrice = 50 + 30;
                } else if (numLines > 2 && numLines <= 10) {
                    $scope.TotalPhoneLinePrice = 50 + 30;
                    $scope.TotalPhoneLinePrice += (numLines - 2) * 10;
                } else if (numLines > 10 && numLines < 20) {
                    $scope.TotalPhoneLinePrice = numLines * 16;
                } else if (numLines >= 20 && numLines <= 999) {
                    $scope.TotalPhoneLinePrice = numLines * 15;
                } else if (numLines >= 1000) {
                    $scope.TotalPhoneLinePrice = (999 * 15) + ((numLines - 999) * 10);
                }

                if ($scope.MexicoAndCanada && numLines > 10) {
                    $scope.TotalPhoneLinePrice += (1 * (numLines - 10));
                }

                $scope.GetDataPlansPrice();
            };

            $scope.GetDataPlansPrice = function () {
                var numPhones = $scope.CurrentDataPlans.Name === 'Shared' ? 1 : $scope.NumberPhoneLines;
                $scope.TotalDataPlanPrice = $scope.DataPlan.Price * numPhones;
                getTotal();

                return false;
            };

            $scope.GetOptionalItemsPrice = function () {
                var numOptionalLines = typeof $scope.NumberOptionalItems !== 'undefined' ? $scope.NumberOptionalItems : 0;
                // each optional item costs $10
                $scope.TotalOptionalItemsPrice = numOptionalLines * 10;

                $scope.TotalOptionalDataPlanPrice = numOptionalLines * $scope.OptionalDataPlan.Price;

                getTotal();
            };

            $scope.isNumber = angular.isNumber;

            function getTotal() {
                $scope.Total = (typeof $scope.TotalPhoneLinePrice !== 'undefined' && !isNaN($scope.TotalPhoneLinePrice) ? $scope.TotalPhoneLinePrice : 0) +
                                (typeof $scope.TotalDataPlanPrice !== 'undefined' && !isNaN($scope.TotalDataPlanPrice) ? $scope.TotalDataPlanPrice : 0) +
                                (typeof $scope.TotalOptionalItemsPrice !== 'undefined' && !isNaN($scope.TotalOptionalItemsPrice) ? $scope.TotalOptionalItemsPrice : 0) +
                                (typeof $scope.TotalOptionalDataPlanPrice !== 'undefined' && !isNaN($scope.TotalOptionalDataPlanPrice) ? $scope.TotalOptionalDataPlanPrice : 0);
            }

            function getPlansOfType(planType) {
                for (var i = 0, len = $scope.AllDataPlans.length; i < len; i++) {
                    if ($scope.AllDataPlans[i].Name === planType) {
                        return $scope.AllDataPlans[i];
                    }
                }
            }

            $scope.AddLine = function (amount) {
                $scope.NumberPhoneLines += amount;
                $scope.GetPhoneLinesPrice();
            };

            $scope.AddOptionalItem = function (amount) {
                $scope.NumberOptionalItems += amount;
                $scope.GetOptionalItemsPrice();
            };

            // initialize data
            $scope.GetPhoneLinesPrice();
            $scope.GetDataPlansPrice();
            $scope.GetOptionalItemsPrice();
        }
    ])
    .directive('focusMe', function ($timeout) {
        return {
            scope: { trigger: '@focusMe' },
            link: function (scope, element) {
                scope.$watch('trigger', function (value) {
                    if (value === "true") {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    });
})();
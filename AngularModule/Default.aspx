<%@ Page Title="T-Mobile Cost Calculator | T-Mobile" Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Tmobile.Explore.Web.CostCalculator.Default" %>
<%@ OutputCache CacheProfile="DefaultCacheProfile" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <tmo:ResourceManager ID="ResourceManager1" CombineWithHeader="true" runat="server">
        <tmo:Script Source="~/CostCalculator/styles/main.css" runat="server" />
    </tmo:ResourceManager>
    <tmo:ResourceManager ID="ResourceManagerFooter" CombineWithFooter="True" runat="server">
        <tmo:Script ID="Script1" Source="~/CostCalculator/scripts/angular.min.js" runat="server"/>
        <tmo:Script ID="Script2" Source="~/CostCalculator/scripts/angular-sanitize.min.js" runat="server"/>
        <tmo:Script ID="Script3" Source="~/CostCalculator/scripts/calculator-module.js" runat="server" />
        <tmo:Script ID="Script4" Source="~/CostCalculator/scripts/main.js" runat="server" />
    </tmo:ResourceManager>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="BodyContent" runat="server">
    <div class="app" ng-app="costCalculator" >
        <div class="container" ng-controller="CalulatorCtrl" ng-cloak>
            <div class="header">
                <div class="title">
                    <h1>Plan</h1><div class="calculatorImage"></div><h3>Estimator</h3>
                </div>
                <hr/>
                <div class="subHeader">
                    <span class="headerText">Total plan</span><span class="price">{{ (+Total) | currency }}</span>
                </div>
            </div>
            <div class="steps">
                <div class="step first" ng-class="{ active: CurrentStep === 1, passed: HighestStep > 1 }">
                    <form name="step1Form">
                        <div class="header" ng-click="GoStep(1)">
                            <div class="title" ng-class="{ hasData: NumberPhoneLines != undefined && NumberPhoneLines !== 0 }">
                                <div class="stepNum"><span>1</span></div>
                                <span class="text" ng-if="NumberPhoneLines > 0 "><ng-pluralize count="NumberPhoneLines" when="{ '1': '{{ NumberPhoneLines }} Phone Line', 'other': '{{ NumberPhoneLines }} Phone Lines'}"></ng-pluralize></span>
                                <span class="text" ng-if="NumberPhoneLines <= 0 || !isNumber(NumberPhoneLines)">Enter Number of Phone Lines</span>
                            </div>
                            <div class="edit"><span>{{ TotalPhoneLinePrice | currency }}</span> <a class="no-select"></a></div>
                        </div>
                        <div class="content">
                            <div class="row-fluid" ng-show="step1Form.numberOfLines.$invalid">
                                <div class="span12">
                                    <span class="error errorAbove">Please enter a valid number between 1-5000</span>
                                </div>
                            </div>
                            <div class="row-fluid">
                                <div class="span12">
                                    <div class="selector">
                                        <div class="leftButton no-select" ng-click="AddLine(-1);"></div>
                                        <input name="numberOfLines" type="number" min="0" max="5000" ng-model="NumberPhoneLines" ng-change="GetPhoneLinesPrice()" >
                                        <div class="rightButton no-select" ng-click="AddLine(1);"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="row-fluid">
                                <div class="span12">
                                    <div class="mexicoAndCanada no-select">
                                        <input type="checkbox" name="MexicoAndCanada" id="MexicoAndCanada" ng-click="GetPhoneLinesPrice();" ng-model="MexicoAndCanada"/><label for="MexicoAndCanada"></label>
                                        <span class="text">Add Mexico and Canada on all lines</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row-fluid">
                                <div class="span12">
                                    <button type="submit" class="continue no-select" ng-click="GoNextStep(); GetPhoneLinesPrice()" ng-disabled="step1Form.$invalid">Next</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="step" ng-class="{ active: CurrentStep === 2, passed: HighestStep > 2 }">
                    <form name="step2Form">
                        <div class="header" ng-click="GoStep(2)">
                            <div class="title" ng-class="{ hasData: TotalDataPlanPrice != undefined }"><div class="stepNum"><span>2</span></div><span class="text">{{ DataPlan.Name }}</span></div>
                            <div class="edit" ng-show="HighestStep > 1"><span>{{ +TotalDataPlanPrice | currency }}</span> <a class="no-select"></a></div>
                        </div>
                        <div class="content">
                            <div class="row-fluid">
                                <div class="span8 offset2">
                                    <div class="row-fluid dataPlans" ng-class="{shared: CurrentDataPlanType === 'Shared'}">
                                        <div class="span3" ng-class="{ selected: DataPlan === plan, last: $last }" ng-repeat="plan in CurrentDataPlans.Plans" ng-click="$parent.DataPlan = plan; GetDataPlansPrice()">
                                            <span ng-bind-html="plan.Html"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row-fluid" ng-show="NumberPhoneLines > 19">
                                <div class="span12">
                                    <div class="sharedPlans">
                                        <p class="extraBottomMargin">- or -</p>
                                        <p class="no-select" ng-click="CurrentDataPlanType = 'Shared'" ng-show="CurrentDataPlanType === 'Individual'">Share data among all lines (Simple Choice Pooled) ></p>
                                        <p class="no-select" ng-click="CurrentDataPlanType = 'Individual'" ng-show="CurrentDataPlanType === 'Shared'">Get data per line (Simple Choice Plan) ></p>
                                    </div>
                                </div>
                            </div>
                            <div class="row-fluid">
                                <div class="span12">
                                    <button type="submit" class="continue no-select" ng-click="GoNextStep(); GetDataPlansPrice()">Next</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="step last" ng-class="{ active: CurrentStep === 3, passed: HighestStep > 3 }">
                    <form name="step3Form">
                        <div class="header" ng-click="GoStep(3)">
                            <div class="title" ng-class="{ hasData: NumberOptionalItems != undefined && NumberOptionalItems > 0 }">
                                <div class="stepNum"><span>3</span></div>
                                <span class="text" ng-if="NumberOptionalItems > 0"><ng-pluralize count="NumberOptionalItems" when="{ '1': '{{ NumberOptionalItems }} Additional Tablet/Hotspot', 'other': '{{ NumberOptionalItems }} Additional Tablets/Hotspots'}"></ng-pluralize></span>
                                <span class="text" ng-if="NumberOptionalItems <= 0 || !isNumber(NumberOptionalItems)">Add Optional Tablet/Hotspot</span>
                            </div>
                            <div class="edit" ng-show="HighestStep > 2"><span>{{ TotalOptionalItemsPrice + TotalOptionalDataPlanPrice | currency }}</span>  <a class="no-select"></a></div>
                        </div>
                        <div class="content">
                            <div class="row-fluid">
                                <div class="span12">
                                    <span class="stepText">Enter number of lines</span>
                                    <div class="selector">
                                        <div class="leftButton no-select" ng-click="AddOptionalItem(-1);"></div>
                                        <input type="number" name="numberOptionalItems" min="0" max="500" ng-model="NumberOptionalItems" ng-change="GetOptionalItemsPrice()" >
                                        <div class="rightButton no-select" ng-click="AddOptionalItem(1);"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="row-fluid" ng-show="step3Form.numberOptionalItems.$invalid">
                                <div class="span12">
                                    <span class="error">Please enter a valid number between 1-500</span>
                                </div>
                            </div>
                            <hr/>
                            <div class="row-fluid">
                                <div class="span6 offset3">
                                    <div class="row-fluid dataPlans last" id="dataPlans-3">
                                        <div class="span4" ng-class="{ selected: OptionalDataPlan === plan, last: $last}" ng-repeat="plan in OptionalDataPlans" ng-click="$parent.OptionalDataPlan = plan; GetOptionalItemsPrice()">
                                            <span ng-bind-html="plan.Html"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row-fluid">
                                <div class="span12">
                                    <button type="submit" class="continue no-select" ng-click="GoNextStep(); GetOptionalItemsPrice()" ng-disabled="step3Form.$invalid">Contact a Rep</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="legalStep" ng-show="ShowSubmit">
                    <p class="price right-align">{{ (+Total) | currency }}</p>
                    <p><strong>Ready to buy? Let’s talk business.</strong></p>
                    <p>Enter your information and one of our sales reps will contact you.</p>
                </div>
                <div class="submitStep" data-step="4" ng-show="ShowSubmit">
                    <iframe src="https://go.pardot.com/l/27512/2015-03-10/3g74mf" height="600" scrolling="no" width="470"></iframe>
                    <p class="legal">Plus taxes & fees. Credit approval, deposit & $20 SIM starter kits may be req’d. See plan for details. Coverage not available in some areas. For Simple Choice Pooled, usage applied to individ. line data allocation first, then to any remaining shared data on other Simple Choice Pooled lines on acct. Usage in excess of total shared data rounded up & charged at per gigabyte rate.</p>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
 
'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">QueueIonic documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-14bac5fa49561491fb9c80a8225bd376"' : 'data-target="#xs-components-links-module-AppModule-14bac5fa49561491fb9c80a8225bd376"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-14bac5fa49561491fb9c80a8225bd376"' :
                                            'id="xs-components-links-module-AppModule-14bac5fa49561491fb9c80a8225bd376"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ContainerModule.html" data-type="entity-link" >ContainerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ContainerModule-174dd1c62c726885b61d3a54ae56bdc0"' : 'data-target="#xs-components-links-module-ContainerModule-174dd1c62c726885b61d3a54ae56bdc0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ContainerModule-174dd1c62c726885b61d3a54ae56bdc0"' :
                                            'id="xs-components-links-module-ContainerModule-174dd1c62c726885b61d3a54ae56bdc0"' }>
                                            <li class="link">
                                                <a href="components/QueueContainerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QueueContainerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TaskContainerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskContainerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-ContainerModule-174dd1c62c726885b61d3a54ae56bdc0"' : 'data-target="#xs-pipes-links-module-ContainerModule-174dd1c62c726885b61d3a54ae56bdc0"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-ContainerModule-174dd1c62c726885b61d3a54ae56bdc0"' :
                                            'id="xs-pipes-links-module-ContainerModule-174dd1c62c726885b61d3a54ae56bdc0"' }>
                                            <li class="link">
                                                <a href="pipes/ClassPriorityPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClassPriorityPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/TaskHeightPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskHeightPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link" >MaterialModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PresentationalModule.html" data-type="entity-link" >PresentationalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PresentationalModule-3b989d06b4937bacf4d8d817b061e168"' : 'data-target="#xs-components-links-module-PresentationalModule-3b989d06b4937bacf4d8d817b061e168"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PresentationalModule-3b989d06b4937bacf4d8d817b061e168"' :
                                            'id="xs-components-links-module-PresentationalModule-3b989d06b4937bacf4d8d817b061e168"' }>
                                            <li class="link">
                                                <a href="components/DateTimeEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DateTimeEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GoalEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GoalEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ItemEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ItemEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MetricsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MetricsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MilestoneEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MilestoneEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShowAwardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ShowAwardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TaskEntryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaskEntryComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedModule-e916bc366d201b34243f7649c67dd514"' : 'data-target="#xs-pipes-links-module-SharedModule-e916bc366d201b34243f7649c67dd514"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-e916bc366d201b34243f7649c67dd514"' :
                                            'id="xs-pipes-links-module-SharedModule-e916bc366d201b34243f7649c67dd514"' }>
                                            <li class="link">
                                                <a href="pipes/DisablePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DisablePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FactorTranslatePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FactorTranslatePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/HoursSumPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HoursSumPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/TimeTranslatePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TimeTranslatePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/Tab1PageModule.html" data-type="entity-link" >Tab1PageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-Tab1PageModule-e2e5628ab5922b0bb40d8d1ae5a5406f"' : 'data-target="#xs-components-links-module-Tab1PageModule-e2e5628ab5922b0bb40d8d1ae5a5406f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-Tab1PageModule-e2e5628ab5922b0bb40d8d1ae5a5406f"' :
                                            'id="xs-components-links-module-Tab1PageModule-e2e5628ab5922b0bb40d8d1ae5a5406f"' }>
                                            <li class="link">
                                                <a href="components/Tab1Page.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Tab1Page</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/Tab1PageRoutingModule.html" data-type="entity-link" >Tab1PageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/Tab2PageModule.html" data-type="entity-link" >Tab2PageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-Tab2PageModule-a021d72962c8eebd4e872c11c70d7290"' : 'data-target="#xs-components-links-module-Tab2PageModule-a021d72962c8eebd4e872c11c70d7290"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-Tab2PageModule-a021d72962c8eebd4e872c11c70d7290"' :
                                            'id="xs-components-links-module-Tab2PageModule-a021d72962c8eebd4e872c11c70d7290"' }>
                                            <li class="link">
                                                <a href="components/Tab2Page.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Tab2Page</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/Tab2PageRoutingModule.html" data-type="entity-link" >Tab2PageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/Tab3PageModule.html" data-type="entity-link" >Tab3PageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-Tab3PageModule-de17d3dba82c49fbfb0f489ce693881e"' : 'data-target="#xs-components-links-module-Tab3PageModule-de17d3dba82c49fbfb0f489ce693881e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-Tab3PageModule-de17d3dba82c49fbfb0f489ce693881e"' :
                                            'id="xs-components-links-module-Tab3PageModule-de17d3dba82c49fbfb0f489ce693881e"' }>
                                            <li class="link">
                                                <a href="components/Tab3Page.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Tab3Page</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/Tab3PageRoutingModule.html" data-type="entity-link" >Tab3PageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TabsPageModule.html" data-type="entity-link" >TabsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TabsPageModule-6c5a35fb7e0150b592581aac3ea16acf"' : 'data-target="#xs-components-links-module-TabsPageModule-6c5a35fb7e0150b592581aac3ea16acf"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TabsPageModule-6c5a35fb7e0150b592581aac3ea16acf"' :
                                            'id="xs-components-links-module-TabsPageModule-6c5a35fb7e0150b592581aac3ea16acf"' }>
                                            <li class="link">
                                                <a href="components/TabsPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TabsPageRoutingModule.html" data-type="entity-link" >TabsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/WelcomeSliderPageModule.html" data-type="entity-link" >WelcomeSliderPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-WelcomeSliderPageModule-db70f9d7355a5c1cc8f9a0cd706dc2d8"' : 'data-target="#xs-components-links-module-WelcomeSliderPageModule-db70f9d7355a5c1cc8f9a0cd706dc2d8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-WelcomeSliderPageModule-db70f9d7355a5c1cc8f9a0cd706dc2d8"' :
                                            'id="xs-components-links-module-WelcomeSliderPageModule-db70f9d7355a5c1cc8f9a0cd706dc2d8"' }>
                                            <li class="link">
                                                <a href="components/WelcomeSliderPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WelcomeSliderPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/WelcomeSliderPageRoutingModule.html" data-type="entity-link" >WelcomeSliderPageRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CompletionTime.html" data-type="entity-link" >CompletionTime</a>
                            </li>
                            <li class="link">
                                <a href="classes/Goal.html" data-type="entity-link" >Goal</a>
                            </li>
                            <li class="link">
                                <a href="classes/Metrics.html" data-type="entity-link" >Metrics</a>
                            </li>
                            <li class="link">
                                <a href="classes/Task.html" data-type="entity-link" >Task</a>
                            </li>
                            <li class="link">
                                <a href="classes/Variation.html" data-type="entity-link" >Variation</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BackendService.html" data-type="entity-link" >BackendService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BadgeService.html" data-type="entity-link" >BadgeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommentsService.html" data-type="entity-link" >CommentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TaskManagementService.html" data-type="entity-link" >TaskManagementService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Achievement.html" data-type="entity-link" >Achievement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Badge.html" data-type="entity-link" >Badge</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BadgeStatus.html" data-type="entity-link" >BadgeStatus</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Idea.html" data-type="entity-link" >Idea</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Queue.html" data-type="entity-link" >Queue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Settings.html" data-type="entity-link" >Settings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
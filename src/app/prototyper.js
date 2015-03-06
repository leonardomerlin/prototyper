'use strict';

angular.module('prototyper', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'treeControl'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'app/main/about.html',
        controller: 'MainController'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'app/main/contact.html',
        controller: 'MainController'
      })
      .state('dnd', {
        url: '/dnd',
        templateUrl: 'app/dnd/iframe-outter.html',
        controller: 'DnDController'
      });

    $urlRouterProvider.otherwise('/');
  })
;

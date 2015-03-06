'use strict';

var CONST = {
  BLOCK_CLASS: 'protoBlock',
  BLOCK_TEMPLATE: function(){
    return  '<{tag} id="{id}"' +
            ' class="' + CONST.BLOCK_CLASS + ' {class}"' +
            ' style="{style}">' +
              '<p>{innerHTML}</p>' +
              '{children}' +
            '</{tag}>'
  }
};

angular.module('prototyper')

.directive('domroot',
          ['$rootScope', '$compile', 'blockFactory',
  function ($rootScope, $compile,   blockFactory) {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        domModel: "="
      },
      template: '<div></div>', // Stromg or function or path_to.html
      controller: ['$scope', function($scope){

        var component = $scope.domModel,
            raw = CONST.BLOCK_TEMPLATE();

        // raw.split('{tag}').join((component.tag || 'div'));
        raw = raw.replace(/\{tag\}/g, (component.tag || 'div'));
        raw = raw.replace(/\{id\}/g, (component.id || ''));
        raw = raw.replace(/\{class\}/g, (component.class || ''));
        raw = raw.replace(/\{innerHTML\}/g, (component.name || ''));

        if(component.children && component.children.length > 0){
          raw = raw.replace(/\{children\}/g, '<domroot ng-repeat="n in node.children" dom-model="n"></domroot>');
        }else{
          raw = raw.replace(/\{children\}/g, '');
        }

        this.template = $compile(raw);
      }],
      compile: function(element, attrs) {
        return function ( scope, element, attrs, dommodelController ) {

          scope.$watch("domModel", function updateNodeOnRootScope(newValue) {

            if (angular.isArray(newValue)) {
              // typeof newValue === Array

              if (angular.isDefined(scope.node) && angular.equals(scope.node.children, newValue)){
                // node.children === newValue
                return;
              }

              scope.node = {};
              scope.synteticRoot = scope.node;
              scope.node.children = newValue;
            } else {
              // typeof newValue !== Array
              if (angular.equals(scope.node, newValue)){
                // node === newValue
                return;
              }
              scope.node = newValue;
            }
          });

          //Rendering template for a root node
          dommodelController.template( scope, function(clone) {

            if(!clone.attr('draggable')){
              clone.attr('draggable', 'true');

              element.bind('dragstart', blockFactory.handleDragStart);
              element.bind('dragend', blockFactory.handleDragEnd);
              element.bind('dragenter', blockFactory.handleDragEnter);
              element.bind('dragover', blockFactory.handleDragOver);
              element.bind('dragleave', blockFactory.handleDragLeave);
              element.bind('drop', blockFactory.handleDrop);
              element.bind('click', blockFactory.handleClick);
            }

            element.html('').append( clone );
          });

          // save the transclude function from compile (which is not bound to a scope as apposed to the one from link)
          // we can fix this to work with the link transclude function with angular 1.2.6. as for angular 1.2.0 we need
          // to keep using the compile function
          // scope.$blockTransclude = childTranscludeFn;
        };
      }
    }
}]);

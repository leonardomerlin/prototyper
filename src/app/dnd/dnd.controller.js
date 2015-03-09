'use strict';

angular.module('prototyper')

  .controller('DnDController',
            ['$rootScope', '$scope', 'uuid', 'blockFactory',
    function ($rootScope,   $scope,   uuid,  blockFactory) {
      logGroup('DnDController');
      // Descomente quando usar jQuery
      jQuery.event.props.push('dataTransfer');

      $scope.sharedObj = {};

      var component1 = new blockFactory.Component({
          'name' : 'My Component 1',
          'tag': 'div',
          'class': 'well',
          // 'innerHTML': 'Texto',
          'innerHTML': '<treechild></treechild>',
          // 'raw':'<div class="well" dnd-draggable="" dnd-droppable></div>',
          'children': [{
            'id': uuid.new(),
            'name' : 'My Component 1.1',
            'tag': 'div',
            'class': 'alert alert-success',
            'raw':'<div class="alert alert-success" dnd-draggable="" dnd-droppable></div>',
            'children': [{
              'id': uuid.new(),
              'name' : 'My Component 1.1.1',
              'tag': 'div',
              'class': 'panel panel-success',
              'raw':'<div class="alert alert-success" dnd-draggable="" dnd-droppable></div>',
              'children': []
            }]
          }]
      });
      blockFactory.add(component1);

      blockFactory.add(new blockFactory.Component({
          'name' : 'My Component 2',
          'tag': 'div',
          'class': 'alert alert-success',
          'innerHTML': 'Texto',
          // 'raw':'<div class="alert alert-success" dnd-draggable="" dnd-droppable></div>',
          'children': []
      }));

      $scope.rootComponent = blockFactory.getRootComponent();
      $scope.selectedComponent = blockFactory.getSelectedComponent();

      $scope.treeModel = $scope.rootComponent;

      $scope.treeOptions = {
        nodeChildren: 'children',
        dirSelectable: true,
        injectClasses: {
          ul: 'tree-list',
          li: 'tree-item',
          liSelected: 'tree-item-isSelected',
          iExpanded: 'tree-item-iconExpanded',
          iCollapsed: 'tree-item-iconCollapsed',
          iLeaf: 'tree-item-iconLeaft',
          label: 'tree-label-custom',
          labelSelected: 'tree-label-isSelected'
        }
      }

      $scope.addChild = function() {
        log('addChild');

        // blockFactory.add({ 'name' : 'Max', 'tag': 'div', 'children' : []});

        // log($scope.rootComponent);
        $scope.rootComponent.style = ':host {background: green;}';

      };

      $scope.showSelected = function(e) {
        log('showSelected', e);
      };

      // $scope.dropped = function(dragEl, dropEl) {
      $scope.dropped = function() {
        log('dropped called');

        var dragEl = $rootScope.dragEl;
        var dropEl = $rootScope.dropEl;
        // return false;
      }

      // on load
      // var canvas = $('#canvas');
      // log('canvas', canvas);
      logGroupEnd();
  }])

  .directive('dndDraggable', [
             '$rootScope', 'uuid',
    function ($rootScope,   uuid) {
    return {
      // A = attribute, E = Element, C = Class and M = HTML Comment
      restrict:'A',
      link: function(scope, element, attrs, controller) {
        var _el = angular.element(element);

        _el.attr('draggable', 'true');

        // create uuid, if necessary
        var id = _el.attr("id");
        if (!id) {
          id = uuid.new();
          _el.attr("id", id);
        }

        element.bind('dragstart', function(e){
          log('[EVENT] dragstart');

          if (e.stopPropagation) {
            e.stopPropagation(); // Necessary. Allows us to drop.
          }

          e.dataTransfer.setData('elId', id);
          e.dataTransfer.setData('text', 'aaa');

          $rootScope.$emit('drag-started', _el);
        });

        element.bind('dragend', function(e){
          log('[EVENT] dragend');

          if (e.stopPropagation) {
            e.stopPropagation(); // Necessary. Allows us to drop.
          }

          $rootScope.$emit('drag-ended', _el);
        });
      }
    };
  }])

  .directive('dndDroppable',
            ['$rootScope', '$compile', 'uuid',
    function ($rootScope, $compile, uuid) {
    return {
      // A = attribute, E = Element, C = Class and M = HTML Comment
      restrict: 'A',
      scope: {
        onDrop: '&'
      },
      link: function(scope, element, attrs, controller){
        var _el = angular.element(element);

        var id = _el.attr("id");
        if (!id) {
            id = uuid.new();
            _el.attr("id", id);
        }

        element.bind('dragover', function(e) {
          // log('dragover');

          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
          }

          e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
          return false;
        });

        element.bind('dragenter', function(e) {
          log('dragenter');

          // this / e.target is the current hover target.
          angular.element(e.target).addClass('drag-hover');
        });

        element.bind('dragleave', function(e) {
          log('dragleave');

          angular.element(e.target).removeClass('drag-over');  // this / e.target is previous target element.
        });

        element.bind('drop', function(e) {
          log('drop');

          if (e.preventDefault) {
            e.preventDefault();
          }

          if (e.stopPropagation) {
            e.stopPropagation();
          }

          // var data = e.dataTransfer.getData('text');
          var dest = document.getElementById(id);
          // var dest = _el[0];
          var elId = e.dataTransfer.getData('elId');
          var src = document.getElementById(elId);
          // src = angular.element(src);

          // pass parameters by rootScope
          $rootScope.dragEl = src;
          $rootScope.dropEl = dest;

          var droppedEl = angular.element(dest);

          // var rawHtml = src.data('raw');
          var rawHtml = src.dataset.raw;
          var compiledEl = ($compile(rawHtml)(scope));
          compiledEl.data('template-id', elId);
          log('compiledEl', compiledEl);
          droppedEl.append(compiledEl);

          scope.onDrop();
        });

        $rootScope.$on('drag-started', function(el) {
            log('drag-started fired');

            //TODO: if, target is compatible...
            // var el = document.getElementById(id);
            angular.element(el).addClass('drag-target');
        });

        $rootScope.$on('drag-ended', function(el) {
            log('drag-ended fired');
            // var el = document.getElementById(id);
            var _el = angular.element(el);
            _el.removeClass('drag-target');
            _el.removeClass('drag-over');
        });
      }
    };
  }]);

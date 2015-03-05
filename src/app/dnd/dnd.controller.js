'use strict';

angular.module('prototyper')

  .factory('uuid', function() {
    var svc = {
      new: function() {
        function _p8(s) {
          var p = (Math.random().toString(16)+"000000000").substr(2,8);
          return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
      },

      empty: function() {
        return '00000000-0000-0000-0000-000000000000';
      }
    };

    return svc;
  })

  .controller('DnDCtrl', ['$rootScope', '$scope', '$compile', function ($rootScope, $scope, $compile) {
    console.log('DnDCtrl...');
    $scope.sharedObj = {};

    // Descomente quando usar jQuery
    // jQuery.event.props.push('dataTransfer');

    // $scope.dropped = function(dragEl, dropEl) {
    $scope.dropped = function() {
      console.log('dropped called');

      var dragEl = $rootScope.dragEl;
      var dropEl = $rootScope.dropEl;

      // function referenced by the drop target
      //this is application logic, for the demo we just want to color the grid squares
      //the directive provides a native dom object, wrap with jqlite

      //clear the previously applied color, if it exists
      // var bgClass = drop.attr('data-color');
      // if (bgClass) {
      //   drop.removeClass(bgClass);
      // }

      //add the dragged color
      // bgClass = drag.attr("data-color");
      // drop.addClass(bgClass);
      // drop.attr('data-color', bgClass);

      //if element has been dragged from the grid, clear dragged color
      // if (drag.attr("x-lvl-drop-target")) {
      //   drag.removeClass(bgClass);
      // }
      // return false;
    }
  }])

  .directive('dndDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
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

        _el.bind('dragstart', function(e){
          console.log('dragstart');

          e.dataTransfer.setData('elId', id);
          e.dataTransfer.setData('text', 'aaa');

          $rootScope.$emit('drag-started', _el);
        });

        _el.bind('dragend', function(e){
          console.log('dragend');
          $rootScope.$emit('drag-ended', _el);
        });

        // var helper = attrs.helper || 'clone';
        // var revert = attrs.revert || false;

        // element.draggable({
        //   helper: helper,
        //   revert: revert,
        //   // iframeFix: true,
        //   cursor: 'move'
        // });
      }
    };
  }])

  // .directive('dndDroppableIframe', function($compile) {
  //   return {
  //     // A = attribute, E = Element, C = Class and M = HTML Comment
  //     restrict: 'A',
  //     link: function(scope,element, attrs, controller){

  //       if (element.prop('tagName') !== 'IFRAME') { return; }

  //       element.load(function(){
  //         var contents = element.contents();
  //         var body = contents.find('body');

  //         body.attr('dnd-droppable', '');
  //         $compile(body)(scope);

  //       });
  //     }
  //   };
  // })

  .directive('dndDroppable', ['$rootScope', '$compile', 'uuid', function($rootScope, $compile, uuid) {
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

        _el.bind('dragover', function(e) {
          console.log('dragover');

          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
          }

          // e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
          return false;
        });

        _el.bind('dragenter', function(e) {
          console.log('dragenter');

          // this / e.target is the current hover target.
          angular.element(e.target).addClass('drag-hover');
        });

        _el.bind('dragleave', function(e) {
          console.log('dragleave');

          angular.element(e.target).removeClass('drag-over');  // this / e.target is previous target element.
        });

        _el.bind('drop', function(e) {
          console.log('drop');

          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
          }

          if (e.stopPropagation) {
            e.stopPropagation(); // Necessary. Allows us to drop.
          }

          // var data = e.dataTransfer.getData('text');
          var dest = document.getElementById(id);
          // var dest = _el[0];
          var elId = e.dataTransfer.getData('elId');
          var src = document.getElementById(elId);
          // src = angular.element(src);
          console.log('src', src);

          // pass parameters by rootScope
          $rootScope.dragEl = src;
          $rootScope.dropEl = dest;

          var droppedEl = angular.element(dest);
          console.log('droppedEl', droppedEl);

          // var rawHtml = src.data('raw');
          var rawHtml = src.dataset.raw;
          console.log('rawHtml', rawHtml);

          var compiledEl = ($compile(rawHtml)(scope));
          console.log('compiledEl', compiledEl);

          compiledEl.data('raw', rawHtml);

          droppedEl.append(compiledEl);

          scope.onDrop();
        });

        $rootScope.$on('drag-started', function(el) {
            console.log('drag-started fired');

            // var el = document.getElementById(id);
            angular.element(el).addClass('drag-target');
        });

        $rootScope.$on('drag-ended', function(el) {
            console.log('drag-ended fired');
            // var el = document.getElementById(id);
            var _el = angular.element(el);
            _el.removeClass('drag-target');
            _el.removeClass('drag-over');
        });

        // greed => nao propaga o evento de drop.
        // var greedy = attrs.greedy || true;

        // element.droppable({
        //   activeClass:'drop-active',
        //   hoverClass:'drop-hover',
        //   greedy:greedy,
        //   drop: function (event, ui) {
        //     var draggedEl = angular.element(ui.draggable); //.parent();
        //     // var draggedEl = angular.element(ui.draggable).parent();
        //     var droppedEl = angular.element(this);
        //     var rawHtml = angular.element(ui.draggable).data('raw');

        //     var compiledEl = ($compile(rawHtml)(scope));

        //     compiledEl.appendTo(droppedEl);

        //     compiledEl.droppable();
        //     compiledEl.draggable({
        //       // helper: 'clone',
        //       revert: false,
        //       cursor: 'move'
        //     });
        //   }
        // });
      }
    };
  }]);

'use strict';

angular.module('prototyper')
.service('blockFactory',
          ['$compile', 'uuid',
  function( $compile,   uuid  ) {
    logGroup('blockFactory');

    var Component = function(tag, name){
      this.id = uuid.new();
      this.tag = tag;
      this.name = name;
      this.children = [];
    };

    Component.prototype.toString = function (){
      return JSON.stringfy({id: this.id, tag: this.tag, name: this.name, children: this.children.length});
    };

    var selectedComponent = null;

    var rootComponent = new Component('root', 'root');


    function getBlockElement(target){
      var $element = angular.element(target);
      return $element.hasClass(CONST.BLOCK_CLASS) ? $element : $element.parent('.'+CONST.BLOCK_CLASS);
    }

    var service = {

      add: function (newComponent) {
        if(!newComponent.id){
          newComponent.id = uuid.new();
        }
        rootComponent.children.push(newComponent);
        return null;
      },

      remove: function (component){
        var result = null;

        return result; // null, if not found
      },

      move: function (src, dest){

      },

      customSearch: function customSearch (callback, component){
        var found = callback(component);
        if(!found){
          if(component && component.children && component.children.length > 0){

          }
        }
      },

      findByIdCustom: function findComponentByIdCustom (id, callback, parentComponent){

        if(!parentComponent){
          return findComponentByIdCustom(id, callback, rootComponent);
        }

        if(parentComponent.id === id){
          if(callback){
            return callback(parentComponent);
          }else{
            return parentComponent;
          }
        }

        if(parentComponent.children && parentComponent.children.length > 0){

          var found = null, childrenComponent = null;

          for (var i = parentComponent.children.length - 1; i >= 0; i--) {

            childrenComponent = parentComponent.children[i];
            found = findComponentByIdCustom(id, null, childrenComponent);

            if( found ) {
              return callback ? callback(found, parentComponent, i) : found;
            }
          };
        }

        return callback ? callback() : null;
      },

      findById: function findComponentById (id){
        // this === service
        return this.findByIdCustom(id, function(component, parentComponent, index){
          // debug('findComponentById, component', component);
          // debug('findComponentById, parentComponent', parentComponent);
          // debug('findComponentById, index', index);
          return component;
        });
      },

      getRootComponent: function () {
        return rootComponent;
      },

      getSelectedComponent: function () {
        return selectedComponent;
      },


      handleDragStart: function (e){
        debug('[EVENT] dragstart');

        if (e.stopPropagation) {
          e.stopPropagation(); // Necessary. Allows us to drop.
        }

        // get id from source
        e.dataTransfer.setData('elementId', e.target.id);

        // $rootScope.$emit('dragstart', _el);
      },

      handleDragEnd: function (e){
        debug('[EVENT] dragend');

        if (e.stopPropagation) {
          e.stopPropagation(); // Necessary. Allows us to drop.
        }

        // $rootScope.$emit('dragend', _el);
      },

      handleDragOver: function (e){
        // debug('[EVENT] dragover');

        if (e.preventDefault) {
          e.preventDefault(); // Necessary. Allows us to drop.
        }

        if (e.stopPropagation) {
          e.stopPropagation(); // Necessary. Allows us to drop.
        }

        // $rootScope.$emit('dragover', _el);
      },

      handleDragEnter: function (e){
        // debug('[EVENT] dragenter');

        if (e.stopPropagation) {
          e.stopPropagation(); // Necessary. Allows us to drop.
        }

        // $rootScope.$emit('dragenter', _el);
      },

      handleDragLeave: function (e){
        // debug('[EVENT] dragleave');

        if (e.stopPropagation) {
          e.stopPropagation(); // Necessary. Allows us to drop.
        }

        // $rootScope.$emit('dragleave', _el);
      },

      handleDrop: function (e){
        debug('[EVENT] drop', e);

        if (e.stopPropagation) {
          e.stopPropagation();
        }

        if (e.stopPropagation) {
          e.stopPropagation();
        }

        var elementId = e.dataTransfer.getData('elementId');
        var srcElement = angular.element(document.getElementById(elementId));
        debug('[EVENT] drop src', srcElement);

        var destElement = getBlockElement(e.target);
        debug('[EVENT] drop dest', destElement);


        var hasSrcAndDest = (srcElement.length === 1 && destElement.length === 1);
        if(!hasSrcAndDest){
          warn('[EVENT] drop: src or dest not found.');
          return;
        }

        var srcId = srcElement.attr('id');
        var destId = destElement.attr('id');

        if(srcId === destId){
          debug('[EVENT] drop. SRC === DEST');
          return;
        }

        var srcElModel = service.findById(srcId);
        var destElModel = service.findById(destId);
        // info('[EVENT] drop find src', srcElModel);
        // info('[EVENT] drop find dest', destElModel);

        service.move(srcElModel, destElModel);
        // $rootScope.$emit('drop', _el);
      },

      handleClick: function (e){
        debug('[EVENT] click', e);

        if (e.stopPropagation) {
          e.stopPropagation();
        }

        if (e.stopPropagation) {
          e.stopPropagation();
        }

        var $block = getBlockElement(e.target);
        var clickedComponent = service.findById($block.attr('id'));

        if(clickedComponent){
          selectedComponent = clickedComponent;
        }
      }
    };

    logGroupEnd();

    return service;
}]);

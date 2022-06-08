'use strict';

module.exports = function(electronApp, menuState) {
  return [{
    label: 'Toggle SpectrumColorpicker',
    accelerator: 'Alt+P',
    enabled: () => menuState.bpmn,
    action: function() {
      return true;
    },
    action: function() {
      electronApp.emit('menu:action', 'togglePickr');
    }
  }];
};

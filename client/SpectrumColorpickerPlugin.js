'use strict';

/*
 * FROM https://npm.io/package/@simonwep/pickr
 * FROM https://npm.io/package/tinycolor2
 * FROM https://icons8.com/icon/pack/editing/metro
 */
 
var domify = require('min-dom/lib/domify');
var tinycolor = require('tinycolor2');
var Pickr = require('@simonwep/pickr');


function PickrPlugin(eventBus, bpmnRules, editorActions, canvas, commandStack) {
  var self = this;
  this.commandStack = commandStack;

  editorActions.register({
    togglePickr: function() {
      self.toggle(canvas);
    }
  });

  eventBus.on('selection.changed', function(e) {
    self.selectedElement = e.newSelection[0];
	self.selectedElements = e.newSelection;
    //var color = PickrPlugin.prototype._getColor(self.selectedElement);
  });
}

PickrPlugin.prototype._getColorFill = function(element) {
  if (element != null && element.businessObject != null) {
    var businessObject = element.businessObject;
    if (businessObject.di != null && businessObject.di.fill != null) {
      return businessObject.di.fill;
    }
  }
  return null;
}

PickrPlugin.prototype._getColorStroke = function(element) {
  if (element != null && element.businessObject != null) {
    var businessObject = element.businessObject;
    if (businessObject.di != null && businessObject.di.stroke != null) {
      return businessObject.di.stroke;
    }
  }
  return null;
}

PickrPlugin.prototype.toggle = function(canvas) {
  if (this.isActive) {
    this.pickr.destroyAndRemove();
    document.getElementById('pickr').remove();
    this.pickr = null;
    this.isActive = false;
  } else {
    this.isActive = true;
    this.addPickr(canvas.getContainer().parentNode);
  }
};

PickrPlugin.prototype.addPickr = function(container) {
  var self = this;
  var pickrColor = '#FF0000';
 
   var rectangleFrame = '<img id="btn_pickrStroke" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAAAiklEQVRIie3WsQrCQBBF0cNa+GMuKJr/b6wS8w1iEbTIKiuYbgKie2Fg2eI+pnrDL3LEBWfkQG8uzgEH5XFfefqEW+AWS2yYV5zKnALlXeXdPT+vZaJ5edMK8o+0oBbUglrQPwTxXhNdoLeuicxct2s37JiwDdxiiYn5cBgwqpowgFycPfaB3i/hASDATMWn/hImAAAAAElFTkSuQmCC"/>';
   var pipette = '<img id="btn_pickrPickColor" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAABbklEQVRIibXUv0ubURTG8Y8/Wp0sugjt3F0Crnbt4lgoydaxqLRIKIKbs3+Him0ROkinjJm6CA61gpBJwVJQWgxS43BvSAhvkvd98+aBu9xz7/Pl3HPuoThNYh2nuEcDu5grkGEaB2glrBM8myoIsoc3feKLeJLXvIy1aHAoOZPu1cgD+dBlcJ4C0sJdVshGSuOkOmXSVU7Q+6ygSg7IPiayQJ7iW0bIZxk7bhbH8fJv7OD/EMih0Pq5IaW4/24A7NeomZR64oNga0VB2trpAyqngXQX/g+W+5xbwnUC5FMayIx0mZRivBXPV3ApTPChmtSZwmkz+S48cyZtx8s3AyC9mWSGvEATD3g9LghsRoMv44RALZq8TYgtFwV5JXy8v5jvia3itgjIS53xX417C0JmR0LN2lN4Ji8EzqLRV2GcV/FP5/M1sSW0/kiqR8OLCGsJz1jDRzwfFdDWAn7oZHCJlaLMk2B1/BRqVrgeAdb3yn6SALjXAAAAAElFTkSuQmCC"/>';
   var fillColor = '<img id ="btn_pickrFillColor" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAAB7ElEQVRIieXWzYtNcRzH8ZfnGXkYEckCxbBAWEgpRuyUlYUmGkKatY3JUlazIQt/gNiIsvHMYialKEVRoknjqcyQEjGmsTjf4xz3nnvn3MtGPvXbfJ/ev+/5fc/vHP4XzcMhnMdDDOEbBrDsbwBa0YsvGKuxXmH5n0L6otgorkm62o5HYR/JwdqbBfVEkWdYFbYZ6A/7AFbGBsbwGiuaAd2LAltrQJaEvSUHexPwhvQ4kjdiYq5YHpKqBdfD/wEnsKgs6FQk9mFOdLQDi2vEt+KGbEi+4zTaxgPNx2AkvcUxrMakgtiFmFIAS89ucz3QbNxXPc6fcRcXcQZXw/4UswJ2syJnBAeKINOiWHomnTiL5wXg/NoW+a24VeEbRVcl6Eg4B1Uf/Fx0YBe6cSlin2BmLm46blfAvspeFWRjvLuo3QItwOQCexs+VsAeYEIakI72hpKgIk3FZcWPeEs6UZuwRjKiV5qEXMDOGv5fk7tOcjuP4WgTkLSTYRzEccmLnHb0Ip/QiR8Nwioh63O+pXgnG4rftKcBWD1IqsOyW6NKe0vAykBIPqCj+FRrt10RUAQrC0n1Hi/rBezLwXpjd+2yu60MhOSq6h8vaL/sMebXUEmIgJwsE9iBO5L/iGGcU31N1VM31jYQ/4/oJ2sAuLbbBqD0AAAAAElFTkSuQmCC"/>';
   var drag = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAABEUlEQVRIieXWMU4DMRCF4Y9AAkq4EwhRUiBuAzSIC9BQQwPZSCBREAoaUDgXSSg2RrDyLnHirXjSa+zx/PKM12vStIsJHtBLXLu0+vjAfOEndHNDNheJ5xXfYSMn6CoCCT7PBTnCrAE0xWEO0H0DJHj4V5LU+s5XXd9JBK2sGOgYozVyDnHQFLClPF2h8TFVe1MXM8WlSGn7eF4ySUrMI3bCxABvkSS5/Bpg7y1CgkedWB1b0IyydJMWdzPGdiAO8FIJiCn1MNyK3PBdXGcCfeK0Zv5bJyjWAA2xXx38H3ddVYX6UoXxulInaU/Z3NZ/fHDWALrIBaFs+k0EUmihz12/X0JjLb7tesrvpPDjWllGX3IcvacjOopwAAAAAElFTkSuQmCC"/>';
   var auto = '<img id="btn_pickrAuto" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAABnElEQVRIia2WvUoDQRCAvwSDGBAsLVQk2KbRNp0WaiGS17CxS2kaf7H3AYJVOi18gtQigqXIhYhe5w9YqKzFTWCzzu5d7jIw5GZ2Zr7dvbndAOwCz4DJqQOpoUnbNgYFIDZMgxjbYVzHmKLlt11/uQAgJF9ZZzSJ8Zbtn/Ik+graUgrAAU6BGTvYWM8hkCtufBo4czNcSNxlznw1MBbfhtjrwK/oqiffp31gywc6F98bsA+8i33mxNltHNLIB5oGrp3gW0abJyvEAMb3HS3y/+W+Aj8W5MCTq4rW3kvAA1ABPoFDYBa480CugBdgHtgJwbSt65F014Ljd7frA6jKWFVs3/apoIoyIe2ddGSsLr+dcUFZIIakbUvAjcRth0B5r4lYVr4m9orYsRZfBvZILr5xpQt8yyoAmmJ3c9QCbXaiDRmvkayqJnZDi089CNHf35MUnrMAAPckq3oEln0FTwIgV49kzG2SpviPlZyRghpMAw3buef4hyd7PQ2kwfJ0ZKazTr3vJykG53+YSJ/iK4rsghoEkq8/KgjZ/AMpNiptfAVdUgAAAABJRU5ErkJggg=="/>';
   var rectangleFilled = '<img id="btn_pickrFill" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAAAKUlEQVRIie3NMQEAAAjDsIJ/z+BiBzQGAtcUMImoE4mRkZGRkZGR0V8LvzYBK1k0VjUAAAAASUVORK5CYII="/>';
   
  var markup = '<section id="pickr" class="colorpickr-container">'+
  '<div id="tools1">'+pipette+fillColor+'</div>'+
  '<div id="pickrheader">'+drag+'</div>'+
  '<div id="tools2">'+rectangleFrame+auto+rectangleFilled+'</div></section>';
  
  var pickrElement = domify(markup);
  container.appendChild(pickrElement);
  

  var newElement = document.createElement('div');
  pickrElement.appendChild(newElement);
  newElement.setAttribute("id", "pickrwrapper");
  newElement.setAttribute("class", "pickr");
  

  this.pickr = new Pickr({
    el: newElement,
    container: newElement,
    default: pickrColor,
    theme: 'classic',
    lockOpacity: false,
    showAlways: true,
    useAsButton: true,

    swatches: [
      'rgba(244, 67, 54, 1)',
      'rgba(233, 30, 99, 1)',
      'rgba(156, 39, 176, 1)',
      'rgba(103, 58, 183, 1)',
      'rgba(63, 81, 181, 1)',
      'rgba(33, 150, 243, 1)',
      'rgba(3, 169, 244, 1)',
      'rgba(0, 188, 212, 1)',
      'rgba(0, 150, 136, 1)',
      'rgba(76, 175, 80, 1)',
      'rgba(139, 195, 74, 1)',
      'rgba(205, 220, 57, 1)',
      'rgba(255, 235, 59, 1)',
      'magenta'
    ],

    components: {
      preview: true,
      opacity: true,
      hue: true,

      interaction: {
        hex: true,
        rgba: true,
        hsva: true,
        input: true,
        clear: true,
        save: false
      }
    }
  });


  this.pickr.on('save', (color, instance) => {    
    if (self.selectedElements != null) {
      var strokeString = "#000000FF";
      if (color!=null) {
         strokeString = tinycolor(color.toHEXA().toString()).darken(30).toString();
      }
      
	  self.selectedElements.forEach(function(selElem) {
	    self.commandStack.execute('element.setColor', {
          elements: [selElem],
          colors: { fill: color!=null?color.toHEXA().toString():"#FFFFFFFF", stroke: strokeString }
        });
	  });
    };
  });
  
  dragElement(pickrElement);
  
  setButtons(this.pickr, self);
  
};



function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	} else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    pos3 = parseInt(e.clientX);
    pos4 = parseInt(e.clientY);
	document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
	return false;
  }

  function elementDrag(e) {
	e = e || window.event;
    pos1 = pos3 - parseInt(e.clientX);
    pos2 = pos4-parseInt(e.clientY);
	pos3 = parseInt(e.clientX);
	pos4 = parseInt(e.clientY);
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


function setButtons(pickr, self) {
  var elmnt_btn_pickrStroke = document.getElementById("btn_pickrStroke");
  var elmnt_btn_pickrAuto = document.getElementById("btn_pickrAuto");
  var elmnt_btn_pickrFill = document.getElementById("btn_pickrFill");
  
  self.mode_pickrFill = false;
  self.mode_pickrStroke = false;
  self.mode_pickrAuto = false;
  
  togglePickrMode("btn_pickrAuto");
  
  function togglePickrMode(btn) {
    self.mode_pickrFill = (btn === "btn_pickrFill");
    self.mode_pickrStroke = (btn === "btn_pickrStroke");
    self.mode_pickrAuto = (btn === "btn_pickrAuto");
    
    if (!self.mode_pickrStroke) elmnt_btn_pickrStroke.removeAttribute("class");
    if (!self.mode_pickrAuto) elmnt_btn_pickrAuto.removeAttribute("class");
    if (!self.mode_pickrFill) elmnt_btn_pickrFill.removeAttribute("class");
    
    if (self.mode_pickrStroke) elmnt_btn_pickrStroke.setAttribute("class", "active");
    if (self.mode_pickrAuto) elmnt_btn_pickrAuto.setAttribute("class", "active");
    if (self.mode_pickrFill) elmnt_btn_pickrFill.setAttribute("class", "active");
  }
  
  
  document.getElementById("btn_pickrFillColor").onclick = fillColor;  
  
  function fillColor(e) {
    //console.log("btn_pickrFillColor");
    
    var strokeString = "#000000FF";
    var fillString = "#FFFFFFFF";
    
    if (self.colorFill != null)  fillString = self.colorFill;
    if (self.colorStroke != null)  strokeString = self.colorStroke;
    
    if (pickr.getColor() != null) {
      if (!self.mode_pickrStroke){
    	fillString = pickr.getColor().toHEXA().toString();
      } else {
        strokeString = pickr.getColor().toHEXA().toString();
      }
    }
    
    if (self.selectedElements != null) {
      if (self.mode_pickrAuto) {
        var tmpHSV = tinycolor(fillString).toHsv();
        tmpHSV.s = 1; // saturation to max.
        
        strokeString = "#" + tinycolor(tmpHSV).toHex();
      }
      
	  self.selectedElements.forEach(function(selElem) {
	    self.commandStack.execute('element.setColor', {
          elements: [selElem],
          colors: { fill: fillString, stroke: strokeString }
        });
	  });
    };
    
    return false;
  }


  document.getElementById("btn_pickrPickColor").onclick = pickColor;
  
  function pickColor(e) {
    // console.log("btn_pickrPickColor");

	var colorFill = PickrPlugin.prototype._getColorFill(self.selectedElement);
	self.colorFill = colorFill!=null?colorFill:'white';
    if (pickr != null) {
      if (!self.mode_pickrStroke) pickr.setColor(self.colorFill, true);
    }
    
    var colorStroke = PickrPlugin.prototype._getColorStroke(self.selectedElement);
    self.colorStroke = colorStroke!=null?colorStroke:'black'
    if (pickr != null) {
      if (self.mode_pickrStroke) pickr.setColor(self.colorStroke, true);
    }
    
    return false;
  }


  document.getElementById("btn_pickrStroke").onclick = setStroke;
  
  function setStroke(e) {
    // console.log("btn_pickrStroke");
    
    if (!self.mode_pickrStroke) self.colorFill = pickr.getColor().toHEXA().toString();
    if (pickr != null && self.colorStroke) {
      pickr.setColor(self.colorStroke, true);
    }
        
    togglePickrMode("btn_pickrStroke");
    
    return false;
  }


  document.getElementById("btn_pickrAuto").onclick = setAuto;
  
  function setAuto(e) {
    // console.log("btn_pickrAuto");
    
    if (self.mode_pickrStroke) self.colorStroke = pickr.getColor().toHEXA().toString();
    if (pickr != null && self.colorFill) {
      pickr.setColor(self.colorFill, true);
    }
    togglePickrMode("btn_pickrAuto");
    
    return false;
  }


  document.getElementById("btn_pickrFill").onclick = setFill;
  
  function setFill(e) {
    // console.log("btn_pickrFill");
    
    if (self.mode_pickrStroke) self.colorStroke = pickr.getColor().toHEXA().toString();
    if (pickr != null && self.colorFill) {
      pickr.setColor(self.colorFill, true);
    }
    togglePickrMode("btn_pickrFill");
    
    return false;
  }
}

PickrPlugin.$inject = [ 'eventBus', 'bpmnRules', 'editorActions', 'canvas', 'commandStack' ];

module.exports = {
  __init__: [ 'spectrumColorpickrPlugin' ],
  spectrumColorpickrPlugin: [ 'type', PickrPlugin ]
};

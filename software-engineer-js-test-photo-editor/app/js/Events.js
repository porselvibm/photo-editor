/**
 This file holds content of the document and functionality for image editing with listed features

1 - Move image using move left and right button
2 - Scaling image using scale 50% and 200% button
4 - Save current image with its position and scaling (on local storage) by submit button
5 - Import saved image with its actual positioning and scaling by using import button
7 - 'Import' button fetched the previously saved data from a JSOn file and rendered 
     variable with image and is set on canvas as saved.
8 - Reset to clear the loaded image data

**/

import AppView from "./render";
import DataLog  from "./DataLog";
import { STATIC_DATA } from "./Constants";
export default class Events extends AppView {
  constructor() {
    super();
    this.importButton = document.getElementById("import");
    this.importButton.onclick = this.importJson.bind(this);
  }
  scalePhoto(scale) {
    this.scale += Number(scale);
    this.draw(this.context.canvas, this.img, this.x, this.y, this.scale);
  }
  movePhoto(x, y) {
    this.x += Number(x);
    this.y += Number(y);
    this.draw(this.context.canvas, this.img, this.x, this.y, this.scale);
  }
  // Method to load saved object from local storage and validate accordingly
  importJson() {
    const imgLoaded = JSON.parse(localStorage.getItem(STATIC_DATA.IMAGE_LOAD_KEY));
    if (imgLoaded) {
      this.img.src = imgLoaded.src;
      this.printDescription = JSON.parse(
        localStorage.getItem(STATIC_DATA.STORAGE_KEY)
      );
      this.file.name = localStorage.getItem(STATIC_DATA.FILE_NAME_KEY);
      this.scale = Number(localStorage.getItem(STATIC_DATA.SCALE_KEY));
      this.x = Number(localStorage.getItem(STATIC_DATA.X_CORD_KEY));
      this.y = Number(localStorage.getItem(STATIC_DATA.Y_CORD_KEY));
      this.renderImage();
      DataLog("");
      DataLog(JSON.stringify(this.printDescription));
    } else {
      DataLog("");
      DataLog(STATIC_DATA.NO_IMG_TEXT);
    }
  }

  submit() {
    localStorage.setItem(
      STATIC_DATA.STORAGE_KEY,
      JSON.stringify(this.printDescription)
    );    
    DataLog("");
    DataLog(JSON.stringify(printDescription));
  }

  reset () {
    this.clearCanvas(this.canvas);
    this.removeImage();
    this.removeActionButtons();
  }

  /** 
   * Initializing DOM controls from index.html
  **/
  bindControls() {
    this.generateButton = document.getElementById("submit");
    this.generateButton.onclick = this.submit.bind(this);
    this.movePhotoLeftButton = document.getElementById("move-left");
    this.movePhotoLeftButton.onclick = this.movePhoto.bind(this, -50, 0);
    this.movePhotoRightButton = document.getElementById("move-right");
    this.movePhotoRightButton.onclick = this.movePhoto.bind(this, +50, 0);
    this.scalePhotoDownButton = document.getElementById("scale-down");
    this.scalePhotoDownButton.onclick = this.scalePhoto.bind(this, -0.5);
    this.scalePhotoUpButton = document.getElementById("scale-up");
    this.scalePhotoUpButton.onclick = this.scalePhoto.bind(this, +0.5);
    this.importButton = document.getElementById("import");
    this.importButton.onclick = this.importJson.bind(this);
    this.generateButton2 = document.getElementById("reset");
    this.generateButton2.onclick = this.reset.bind(this);
  }
}

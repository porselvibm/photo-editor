import DataLog from "./DataLog";
import { STATIC_DATA } from "./Constants";
import convertToPixel from "./Converter";
export default class AppView {
  constructor() {
    this.fileSelector = document.getElementById("fileSelector");
    this.fileSelector.addEventListener(
      "change",
      this.fileSelectorOnChange.bind(this)
    );
    this.imageContainer = document.getElementById("imageContainer");
    this.debugContainer = document.getElementById("debugContainer");
    this.buttonsDiv = document.getElementById("actionButtons");

    this.referrerContainer_x = document.getElementById("referrerContainer").offsetWidth;
    this.referrerContainer_y = document.getElementById("referrerContainer").offsetHeight;

    // canvas size defining from 15" x 10" 
    this.canvas = document.getElementById("canvas");
    this.canvas.width = convertToPixel(STATIC_DATA.CANVAS_WIDTH);
    this.canvas.height = convertToPixel(STATIC_DATA.CANVAS_HEIGHT);

    this.context = this.canvas.getContext("2d");
    this.img = new Image();
    this.printDescription;
    this.scale = 1;
    this.x = 0;
    this.y = 0;
    this.file = {};
    this.context.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  fileSelectorOnChange(e) {
    // clear image and canvas box
    this.removeImage();
    this.clearCanvas(this.canvas);
    DataLog("");

    // get all selected Files
    let files = e.target.files;
    for (let i = 0; i < files.length; ++i) {
      this.file = files[i];
      switch (this.file.type) {
        case "image/jpeg":
        case "image/png":
        case "image/gif":
          let reader = new FileReader();
          reader.onload = () => {
            // create HTMLImageElement holding image data
            this.img.src = reader.result;
            localStorage.setItem(
              STATIC_DATA.IMAGE_LOAD_KEY,
              JSON.stringify({
                naturalWidth: this.img.naturalWidth,
                naturalHeight: this.img.naturalHeight,
                src: reader.result,
              })
            );
            this.renderImage();
          };
          reader.readAsDataURL(this.file);
          // process just one file.
          return;
        default:
          DataLog(`${STATIC_DATA.INVALID_IMG_TEXT} ${this.file.name}`);
      }
    }
  }
  draw(canvas, img, x, y, scale) {
    this.clearCanvas(canvas);
    let imgWidth = 0;
    let imgHeight = 0;

    imgWidth = img.width * scale;
    imgHeight = img.height * scale;

    let cover = this.canvasPosition(
      imgWidth,
      imgHeight,
      canvas.width,
      canvas.height,
      x,
      y
    );
    cover.offsetLeft = x;
    cover.offsetTop = y;

    const fitCanvas =
      cover.width * scale >= this.canvas.width &&
      cover.height * scale >= this.canvas.height;

    this.context.drawImage(
      img,
      cover.offsetLeft,
      cover.offsetTop,
      fitCanvas ? cover.width * scale : cover.width,
      fitCanvas ? cover.height * scale : cover.height
    );

    this.printDescription = {
      canvas: {
        width: STATIC_DATA.CANVAS_WIDTH,
        height: STATIC_DATA.CANVAS_HEIGHT,
        photo: {
          id: this.file.name,
          width: img.width,
          height: img.height,
          x: x,
          y: y,
        },
      },
    };

    this.setlocalStorage(scale, x, y);
  }

  clearCanvas(canvas) {
    this.context.clearRect(0, 0, canvas.width, canvas.height);
  }

  removeImage() {
    this.imageContainer.innerHTML = "";
  }

  removeActionButtons(e) { 
    this.buttonsDiv.removeChild(this.buttonsDiv.childNodes[0]);
    this.buttonsDiv.removeChild(this.buttonsDiv.childNodes[1]);
    this.buttonsDiv.removeChild(this.buttonsDiv.childNodes[2]);
    this.buttonsDiv.removeChild(this.buttonsDiv.childNodes[3]);
    this.buttonsDiv.appendChild(this.buttonsDiv.childNodes[4]);
    this.buttonsDiv.appendChild(this.buttonsDiv.childNodes[5]);
    this.buttonsDiv.removeChild(this.buttonsDiv.childNodes[6]);
    e.preventDefault();
  }

  setlocalStorage(scale, x, y) {
    localStorage.setItem(
      STATIC_DATA.STORAGE_KEY,
      JSON.stringify(this.printDescription)
    );
    localStorage.setItem(
      STATIC_DATA.FILE_NAME_KEY,
      JSON.stringify(this.file.name)
    );
    localStorage.setItem(STATIC_DATA.SCALE_KEY, scale);
    localStorage.setItem(STATIC_DATA.X_CORD_KEY, x);
    localStorage.setItem(STATIC_DATA.Y_CORD_KEY, y);
  }

  renderImage() {
    while (this.imageContainer.childNodes.length > 0)
      this.imageContainer.removeChild(this.imageContainer.childNodes[0]);

    this.imageContainer.appendChild(this.img);

    this.img.onload = () => {
      this.draw(this.context.canvas, this.img, this.x, this.y, this.scale);
      this.showActionButtons();
    };
  }

  showActionButtons() {
    const buttonsDiv = document.getElementById("actionButtons");

    buttonsDiv.innerHTML = `<button id="move-left">Move left</button>
      <button id="move-right">Move right</button>
      <button id="scale-down">Scale 50%</button>
      <button id="scale-up">Scale 200%</button>
      <button id="import">Import</button>
      <button id="reset">Reset</button>
      <button id="submit">Submit</button>
      `;
    this.bindControls();
  }

  canvasPosition(
    contentWidth,
    contentHeight,
    containerWidth,
    containerHeight,
    offsetLeft,
    offsetTop
  ) {
    let contentRatio = contentWidth / contentHeight;
    let containerRatio = containerWidth / containerHeight;
    let resultHeight;
    let resultWidth;
    offsetLeft = offsetLeft === undefined ? 0.5 : offsetLeft;
    offsetTop = offsetTop === undefined ? 0.5 : offsetTop;
    if (contentRatio > containerRatio) {
      resultHeight = containerHeight;
      resultWidth = containerHeight * contentRatio;
    } else {
      resultWidth = containerWidth;
      resultHeight = containerWidth / contentRatio;
    }
    return {
      width: resultWidth,
      height: resultHeight,
      offsetLeft: (containerWidth - resultWidth) * offsetLeft,
      offsetTop: (containerHeight - resultHeight) * offsetTop,
    };
  }
}

function loadJSONFile(filePath) {
  return fetch(filePath).then(res => res.json());
}

function scanQR(selector) {
  return new Promise(async (resolve) => {
    const element = document.querySelector(selector);
    element.style.display = 'block';

    // Scan QR
    const scanner = new Instascan.Scanner({ video: element, mirror: false });
    scanner.addListener('scan', async (result) => {
      let parsedNum;
      try {
        parsedNum = parseInt(result);
      } catch (e) {
        resolve(-1);
      }
      // Hide again
      element.style.display = 'none';
      await scanner.stop();
      resolve(parsedNum);
    });

    const cameras = await Instascan.Camera.getCameras();
    scanner.start(cameras[cameras.length - 1]);
    /* const cameras = (await navigator.mediaDevices.enumerateDevices()).filter(device => device.kind === 'videoinput');
    const constraints = {
      video: {
        deviceId: cameras[cameras.length - 1].deviceId,
        height: window.innerHeight / 2
      },
      audio: false
    };
    navigator.getUserMedia(constraints, (stream) => {
      element.srcObject = stream;
      element.onloadedmetadata = () => {
        element.play();
      };
    }); */
  });
}

class ScavengerHunt {
  constructor({
        onShowPlaceInformation = () => {},
        onShowHint = () => {},
        onNotify = () => {},
        qrCameraContainer = '#app',
        waitForBtnClick,
        dataFolder = 'data'
      } = {}
    ) {
    this.onShowPlaceInformation = onShowPlaceInformation;
    this.onShowHint = onShowHint;
    this.qrCameraContainer = qrCameraContainer;
    this.waitForBtnClick = waitForBtnClick;
    this.onNotify = onNotify;
    this.dataFolder = dataFolder;

    const metaPath = `${dataFolder}/meta.json`;
    this.setup(metaPath);
  }

  async setup(metaPath) {
    const metaData = await loadJSONFile(metaPath);
    this.scavengerHunt({ jsonPath: metaData.entryHint });
  }

  async scavengerHunt({ jsonPath }) {
    const currentHint = await loadJSONFile(jsonPath);

    if (!currentHint.hint) {
      // Show place information
      this.onShowPlaceInformation(currentHint.placeInformation);
      await this.waitForBtnClick();
      this.scavengerHunt({ jsonPath: `${this.dataFolder}/${currentHint.nextHint}.json` });
    } else {
      // Show hint information
      this.onShowHint(currentHint.hint);
      await this.waitForBtnClick();
      const qrCodeValue = await scanQR(this.qrCameraContainer);
      if (qrCodeValue === currentHint.id) {
        this.onShowPlaceInformation(currentHint.placeInformation);
        await this.waitForBtnClick();
        if (currentHint.nextHint) {
          this.scavengerHunt({ jsonPath: `${this.dataFolder}/${currentHint.nextHint}.json` })
        } else {
          this.onNotify({ title: 'Congrats!', body: 'You arrived at the end of this scavenger hunt!' })
        }
      } else {
        await this.onNotify({ title: 'Wrong QR', body: 'This is the wrong QR code. Keep searching for the correct one!' });
        this.scavengerHunt({ jsonPath });
      }
    }
  }
}
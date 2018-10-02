function loadJSONFile(filePath) {
  return fetch(filePath).then(res => res.json());
}

function scanQR(selector) {
  return new Promise(async (resolve, reject) => {
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

    try {
      const cameras = await Instascan.Camera.getCameras();
      if (cameras.length === 0) {
        reject();
        return;
      }
      await scanner.start(cameras[cameras.length - 1]);
    } catch (e) {
      reject(e);
      return;
    }
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
      let qrCodeValue = null;

      try {
        qrCodeValue = await scanQR(this.qrCameraContainer);
      } catch (e) {
        this.onNotify({
          title: 'Camera error',
          content: `
            Was not able to access the device camera.
            You must accept the according dialog.
            Maybe your device doesn't support camera access.
          `,
          btnContent: 'Reload',
          action: () => window.location.reload()
        });
        return;
      }

      if (qrCodeValue === currentHint.id) {
        this.onShowPlaceInformation(currentHint.placeInformation);
        await this.waitForBtnClick();
        if (currentHint.nextHint) {
          this.scavengerHunt({ jsonPath: `${this.dataFolder}/${currentHint.nextHint}.json` })
        } else {
          this.onNotify({ title: 'Congrats!', content: 'You arrived at the end of this scavenger hunt!' })
        }
      } else {
        await this.onNotify({ title: 'Wrong QR', content: 'This is the wrong QR code. Keep searching for the correct one!' });
        this.scavengerHunt({ jsonPath });
      }

    }
  }
}
const USER_PROGRESS_KEY = 'user-progress';

function saveProgress(currentHintId, status) {
  localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify({ currentHintId, status }));
}

function loadJSONFile(filePath) {
  return fetch(filePath).then(res => res.json());
}

function scanQR({ video: selector }) {
  return new Promise(async (resolve, reject) => {
    const element = document.querySelector(selector);
    element.style.display = 'block';

    // Scan QR
    const scanner = new UniversalQrScanner({ video: element  });
    scanner.addEventListener('scan', async (result) => {
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

    /* try {
      const cameras = await Instascan.Camera.getCameras();
      if (cameras.length === 0) {
        reject('No camera found!');
        return;
      }
      await scanner.start(cameras[cameras.length - 1]);
    } catch (e) {
      reject(e);
      return;
    } */
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
    const userProgress = JSON.parse(
      localStorage.getItem(USER_PROGRESS_KEY)
    );

    if (userProgress && userProgress.currentHintId) {
      this.scavengerHunt({
        jsonPath: `${this.dataFolder}/${userProgress.currentHintId}.json`,
        initialStatus: userProgress.status
      });
    } else {
      const metaData = await loadJSONFile(metaPath);
      this.scavengerHunt({ jsonPath: metaData.entryHint });
    }
  }

  async showWelcome(currentHint) {
    // It is the initial start hint
    // Show place information
    this.onShowPlaceInformation(currentHint.placeInformation);
    await this.waitForBtnClick();
    this.scavengerHunt({ jsonPath: `${this.dataFolder}/${currentHint.nextHint}.json` });
  }

  async showHint(currentHint) {
    // Save progress
    saveProgress(currentHint.id, 'hint');
    // Show hint information
    this.onShowHint(currentHint.hint);
    await this.waitForBtnClick();
  }

  async scanQR(currentHint) {
    let qrCodeValue = null;

    try {
      qrCodeValue = await scanQR({ video: this.qrCameraContainer });
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
      return -1;
    }

    if (qrCodeValue === currentHint.id) {
      return true;
    } else {
      return false;
    }
  }

  async scavengerHunt({ jsonPath, initialStatus = 'hint' }) {
    const currentHint = await loadJSONFile(jsonPath);

    const showPlaceInfo = async (hint) => {
      this.onShowPlaceInformation(currentHint.placeInformation);
      saveProgress(currentHint.id, 'placeInfo');
      await this.waitForBtnClick();
      if (currentHint.nextHint) {
        this.scavengerHunt({ jsonPath: `${this.dataFolder}/${currentHint.nextHint}.json` })
      } else {
        this.onNotify({ title: 'Congrats!', content: 'You arrived at the end of this scavenger hunt!' })
      }
    }

    if (initialStatus === 'placeInfo') {
      await showPlaceInfo();
      return;
    }

    if (!currentHint.hint) {
      await this.showWelcome(currentHint);
    } else {
      await this.showHint(currentHint);
      const status = await this.scanQR(currentHint);

      if (status) {

        showPlaceInfo();

      } else if (status !== -1) {
        await this.onNotify({ title: 'Wrong QR', content: 'This is the wrong QR code. Keep searching for the correct one!' });
        this.scavengerHunt({ jsonPath });
      }

    }
  }
}
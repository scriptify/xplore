async function scanQR() {
  return 1;
}

class ScavengerHunt {
  constructor({
      metaPath = 'data/meta.json',
      onShowPlaceInformation = () => {},
      onShowHint = () => {} } = {},
      qrCameraContainer = '#app'
    ) {
    this.onShowPlaceInformation = onShowPlaceInformation;
    this.onShowHint = onShowHint;
    this.qrCameraContainer = qrCameraContainer;
    this.setup(metaPath);
  }

  async setup(metaPath) {
    this.scavengerHunt({ jsonPath: metaPath });
  }

  async scavengerHunt({ jsonPath }) {
    const currentHint = await fetch(jsonPath).then(res => res.json());
    if (!currentHint.hint) {
      this.onShowPlaceInformation(currentHint.placeInformation);
    } else {
      this.onShowHint(currentHint.hint);
      const qrCodeValue = await scanQR();
      // CONTINUE HERE
    }
  }
}
function missingParam(paramName) {
  throw new Error(`Missing parameter: '${paramName}'`);
}

class UniversalQrScanner {
  constructor({ video = missingParam('video element') }) {
    this.video = video;
    this.events = {};
    this.tick = this.tick.bind(this);
    this.setup();
  }

  setup() {
    const { video } = this;
    // Use facingMode: environment to attemt to get the front camera on phones
    document.querySelector('body').insertAdjacentHTML('beforeend', `
      <canvas hidden id="universalQrCodeScannerCanvas" style="width: 100%;"></canvas>
    `);
    this.canvas = document.querySelector('#universalQrCodeScannerCanvas');
    this.canvasCtx = this.canvas.getContext('2d');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then((stream) => {
      video.srcObject = stream;
      video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
      video.play();
      this.animFrameId = requestAnimationFrame(this.tick);
    });
  }

  execEvents(type, payload) {
    if (this.events[type]) {
      this.events[type].forEach(cb => cb(payload));
    }
  }

  tick() {
    const { video, canvas, canvasCtx } = this;
    if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoHeight !== 0 && video.videoWidth !== 0) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        this.execEvents('scan', code.data);
      }
    }

    if (!this.hasStopped)
      requestAnimationFrame(this.tick);
  }

  addEventListener(type, cb = missingParam('callback function (2°)')) {
    if (this.events[type])
      this.events[type].push(cb);
    else
      this.events[type] = [cb];
  }

  stop() {
    this.hasStopped = true;
    if (this.canvas)
      this.canvas.remove();
    if (this.animFrameId)
      cancelAnimationFrame(this.animFrameId);
  }
}
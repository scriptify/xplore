const app = {
  rootElem: null
};

function testApp() {
  

  const html = `
    ${
        createInformationTile({
            title: '<img src="logo.svg" />',
            backgroundImg: 'https://source.unsplash.com/random/800x800',
            texts: [
                {
                    content: `
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                        At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
                        no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum 
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                        At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
                        no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum 
                    `,
                },
                {
                    content: `
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                        At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
                        no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum 
                    `,
                    img: 'https://source.unsplash.com/random/500x500'
                }
            ]
        })
    }
    ${
        createButton({ text: 'Start' })
    }
  `;

  $app.innerHTML = html;
}

function onShowPlaceInformation(placeInformation) {
  app.rootElem.innerHTML = `
    ${
      createInformationTile(placeInformation)
    }
    ${
      createButton({ text: 'Next hint' })
    }
  `;
}

function onShowHint(hint) {
 app.rootElem.innerHTML = `
    ${
      createInformationTile(hint)
    }
    ${
      createButton({ text: 'Scan QR' })
    }
  `;
}

function onNotify({ action = () => {}, ...notification }) {
  const notificationHTML = createNotification(notification);
  app.rootElem.insertAdjacentHTML('beforeend', notificationHTML);
  const $notificationBtn = document.querySelector('#notificationBtn');
  $notificationBtn.addEventListener('click', () => {
    const $notificationContainer = document.querySelector('#notificationContainer');
    action();
    $notificationContainer.remove();
  }); 
}

function waitForBtnClick() {
  return new Promise((resolve, reject) => {
    const btnToClick = document.querySelector('#mainButton');
    if (!btnToClick) {
      reject('No button found!');
      return;
    }
    btnToClick.addEventListener('click', resolve);
  });
}

window.addEventListener('load', () => {
  app.rootElem = document.querySelector('#app');
  new ScavengerHunt({
    onShowPlaceInformation,
    onShowHint,
    waitForBtnClick,
    onNotify,
    qrCameraContainer: '#camera',
    dataFolder: 'data'
  });
});

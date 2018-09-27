function testApp() {
  const $app = document.querySelector('#app');

  const html = `
    ${
        createInformationTile({
            title: 'Hello!',
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

window.addEventListener('load', () => {
  testApp();
  const sh = new ScavengerHunt({
    onShowPlaceInformation: placeInformation => console.log('place info', placeInformation),
    onShowHint: hint => console.log('hint', hint),
  });
});
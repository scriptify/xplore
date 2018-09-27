function createInformationTile({ title, backgroundImg, texts = [{ content: 'fdgfdg', img: '' }] }) {
  return `
    <div class="main-container main-container--background" style="${ backgroundImg ? `background-image: url('${backgroundImg}')` : '' }">
      <div class="main-container__overlay">
        <h1 class="main-container__title">
          ${title}
        </h1>
        <div class="main-container__divider"></div>
        ${
          texts.map(textObj => `
            <p class="main-container__text">
              ${textObj.img ? `<img src="${textObj.img}" />` : ''}
              <div class="main-container__text__content">
                ${textObj.content} 
              </div>
            </p>
          `)
        }
      </div>
    </div>
  `;
}

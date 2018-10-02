function createNotification({ title, content, btnContent = 'OK' }) {
  return `
    <div class="center" id="notificationContainer">
      <div class="notification">
        <h2 class="notification__title">${title}</h2>
        <p class="notification__content">${content}</p>
        <button class="notification__btn" id="notificationBtn">${btnContent}</button>
      </div>
    </div>
  `;
}

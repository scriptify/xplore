function createNotification({ title, content, btnContent = 'OK' }) {
  return `
    <div class="center">
      <div class="notification">
        <h2 class="notification__title">${title}</h2>
        <p class="notification__content">${content}</p>
        <button class="notification__btn">${btnContent}</button>
      </div>
    </div>
  `;
}

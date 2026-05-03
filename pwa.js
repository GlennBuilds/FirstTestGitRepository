(function () {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    const isGitHubPagesPath = window.location.pathname === '/Balkan2026'
      || window.location.pathname.startsWith('/Balkan2026/');
    const basePath = isGitHubPagesPath ? '/Balkan2026/' : '/';
    navigator.serviceWorker.register(`${basePath}sw.js`).catch(() => {});
  });
})();

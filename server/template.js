export default function template(helmet, content = '', sheetsRegistry, bundles, initialState = {}) {

    const css = sheetsRegistry.toString()
// Делаем из initialState строку и передаем как глобальную переменную
    const scripts = `<script>
                   window.__STATE__ = ${JSON.stringify(initialState)}
                   </script>
                   <script src="/client.js"></script>
                    <script>
                     // Если браузер поддерживает service-worker - регистрируем
                     if ('serviceWorker' in navigator) {
                       window.addEventListener('load', () => {
                         navigator.serviceWorker.register('/service-worker.js')
                           .then(registration => {
                             console.log('Service Worker is registered! ');
                           })
                           .catch(err => {
                             console.log('Registration failed  ', err);
                           });
                       });
                     }
                     </script>`

    const page = `<!DOCTYPE html>
              <html lang="en">
              <head>
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                ${helmet.link.toString()}
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta name="theme-color" content="#810051">
                <link rel="shortcut icon" href="/assets/logos/favicon.ico" type="image/x-icon">
                <link rel="icon" href="/assets/logos/favicon.ico" type="image/x-icon">
                <link rel="stylesheet" href="/assets/global.css">
                <link rel="manifest" href="/manifest.json">
              </head>
             <body>
                <div class="content">
                   <div id="app" class="wrap-inner">
                      <!--- magic happens here -->  ${content}
                   </div>
                   ${bundles.map(bundle => `<script src='/${bundle.file}'></script>`).join('\n')}
                </div>
                <style id="jss-server-side">${css}</style>
                ${scripts}
              </body>
              `
    return page
}

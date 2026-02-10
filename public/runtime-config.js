window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};
// Set API URLs without rebuilding.
// Example:
// window.__APP_CONFIG__.LOCAL_API_URL = "http://localhost:8000";
// window.__APP_CONFIG__.PROD_API_URL = "https://api.yourdomain.com";
window.__APP_CONFIG__.LOCAL_API_URL =
  window.__APP_CONFIG__.LOCAL_API_URL || "http://localhost:8000";
window.__APP_CONFIG__.PROD_API_URL =
  window.__APP_CONFIG__.PROD_API_URL || "https://api.lankapasstravel.com";
window.__APP_CONFIG__.API_URL =
  window.__APP_CONFIG__.API_URL || window.__APP_CONFIG__.LOCAL_API_URL;

function probeApi(url, timeoutMs) {
  return new Promise(function (resolve) {
    var controller = new AbortController();
    var timer = setTimeout(function () {
      controller.abort();
      resolve(false);
    }, timeoutMs);

    fetch(url, { signal: controller.signal })
      .then(function (res) {
        clearTimeout(timer);
        resolve(!!res && res.ok);
      })
      .catch(function () {
        clearTimeout(timer);
        resolve(false);
      });
  });
}

window.__APP_CONFIG_READY__ = (async function () {
  var localUrl = window.__APP_CONFIG__.LOCAL_API_URL;
  var prodUrl = window.__APP_CONFIG__.PROD_API_URL;

  if (!window.__APP_CONFIG__.API_URL) {
    window.__APP_CONFIG__.API_URL = localUrl;
  }

  if (localUrl) {
    var ok = await probeApi(localUrl + "/api/test", 1200);
    if (!ok) {
      window.__APP_CONFIG__.API_URL = prodUrl;
    }
  }
})();

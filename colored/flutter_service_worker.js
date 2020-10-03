'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "fe2b9f8670e71fe0c2b6cb24ab17ce16",
"/": "fe2b9f8670e71fe0c2b6cb24ab17ce16",
"main.dart.js": "b87d76e724ca3ba2291c74f1c0c4dd63",
"favicon.png": "e08adea7656d6ebd987fe42d62bcb75c",
"icons/Icon-192.png": "a7d5670f12c12bb7a843ab8c6af10cf4",
"icons/Icon-512.png": "34861847f7547bceba93a7962b3086e3",
"manifest.json": "f8cf68546a656247f71c4fa9c0466662",
"assets/AssetManifest.json": "09e9880eb3d47bd88a28ed82505a56ba",
"assets/NOTICES": "4aff73dc7fb3443fc6ea778e9eae014a",
"assets/FontManifest.json": "7a2ec7360d455b6bf765049608806c88",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"assets/lib/resources/mock_data/sample_palettes.json": "88278321eff255d1b4e23fd59ee8aa36",
"assets/lib/resources/mock_data/sample_color_suggestions.json": "72334c4ff14b8fd6ac04ea7e3ed5d4a1",
"assets/lib/resources/mock_data/sample_palette_suggestions.json": "def4214a4c3b67f407a423b8aaeb0665",
"assets/lib/resources/mock_data/sample_colors.json": "7455275d3fe0e8a2f567982247abceec",
"assets/lib/resources/mock_data/sample_color.json": "43778ae3420b2fe0e33fb08142ecaf23",
"assets/lib/resources/graphics/github_light.png": "d56df49a807a9fd06eb1667a84d3810e",
"assets/lib/resources/graphics/2.0x/github_light.png": "eb94bb97c3410733ce017b184d314723",
"assets/lib/resources/graphics/2.0x/logo.png": "05fe69a36315115a27120e4e5a5c579f",
"assets/lib/resources/graphics/3.0x/github_light.png": "472739dfb5857b1f659f4c4c6b4568d0",
"assets/lib/resources/graphics/3.0x/logo.png": "795c004811c0364b3b16e271fe42554d",
"assets/lib/resources/graphics/logo.png": "fe280697e1a628399f32148ecda66ab8",
"assets/lib/resources/fonts/oswald/static/Oswald-Bold.ttf": "1e582f614a86a53e085c633066c682e3",
"assets/lib/resources/fonts/oswald/static/Oswald-SemiBold.ttf": "59708ee027e9a02950bd7d57df51b4cf",
"assets/lib/resources/fonts/oswald/static/Oswald-Regular.ttf": "e1996192b98a516646ff9a8c0c0ca90c",
"assets/lib/resources/fonts/montserrat/Montserrat-Light.ttf": "409c7f79a42e56c785f50ed37535f0be",
"assets/lib/resources/fonts/montserrat/Montserrat-Bold.ttf": "ade91f473255991f410f61857696434b",
"assets/lib/resources/fonts/montserrat/Montserrat-Black.ttf": "27e3649bab7c62fa21b8837c4842e40e",
"assets/lib/resources/fonts/montserrat/Montserrat-Regular.ttf": "ee6539921d713482b8ccd4d0d23961bb",
"assets/lib/resources/fonts/montserrat/Montserrat-Italic.ttf": "a7063e0c0f0cb546ad45e9e24b27bd3b",
"assets/lib/resources/data/palettes.json": "951383bf892a805648d241d1f675d8b4",
"assets/lib/resources/data/palette_suggestions.json": "aa4359213314d015ebf8c41e24e4226d",
"assets/lib/resources/data/color_suggestions.json": "a0a0dfbee449db9d73ec07de4630cf98",
"assets/lib/resources/data/colors.json": "46fc7a9041e62b787e98a8b6f01cd0c2",
"assets/lib/resources/data/palettes_suggestions.json": "a2147dba5e1689b3dad020a60e37d07b",
"assets/fonts/MaterialIcons-Regular.otf": "a68d2a28c526b3b070aefca4bac93d25"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a 'reload' param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'reload'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

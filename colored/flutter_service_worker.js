'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "fe2b9f8670e71fe0c2b6cb24ab17ce16",
"/": "fe2b9f8670e71fe0c2b6cb24ab17ce16",
"main.dart.js": "e38bb70dbf41dc64ba476c2870f93109",
"favicon.png": "eaa4ab931235f75e3da2b291ac412782",
"icons/Icon-192.png": "a488c97da8aa2a2c60ef82930fa6fb21",
"icons/Icon-512.png": "c540c3c79331c45e2d055005cdd4b74f",
"manifest.json": "f8cf68546a656247f71c4fa9c0466662",
"assets/LICENSE": "39b31e655d66cf5fef38e28315d2ba1a",
"assets/AssetManifest.json": "16774fcb6bb77c726c83fc3f0585d130",
"assets/FontManifest.json": "a672f412921bb996d6e450988a6d1c45",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/lib/resources/mock_data/sample_color_names.json": "e242dd7401bef244692ed8cef3b636d7",
"assets/lib/resources/mock_data/sample_color.json": "43778ae3420b2fe0e33fb08142ecaf23",
"assets/lib/resources/graphics/2.0x/logo.png": "05fe69a36315115a27120e4e5a5c579f",
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
"assets/lib/resources/data/color_names.json": "cb8e115ebbc1ec1b1ec4b70ccde1b151",
"assets/lib/resources/data/color_suggestions.json": "a0a0dfbee449db9d73ec07de4630cf98",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

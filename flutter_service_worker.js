'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "main.dart.js": "e0d7792523c429561981b87f3fb53c0a",
"version.json": "426313f2f3133c2f20415344c4a22df3",
"assets/assets/images/me.png": "064edb57a7873cafe2bbda1c1b61ceff",
"assets/assets/images/bgblur.png": "3c993dc0c3fbf696c69f12511ad99b3a",
"assets/assets/images/work_avatar.png": "eb8638de63c66b409e7e997ebede0f30",
"assets/assets/images/profile_avatar.png": "e2f80a230175eb129ffce0815ed54950",
"assets/assets/images/study_avatar.png": "9f338829db8ce9c5fb6f75c71dfc1e2c",
"assets/assets/images/laptop.jpg": "80b09c89d76b9699a53c9024f969f00a",
"assets/assets/images/cinetix.png": "1d8163b07bd0689407cb15cd6b59f2ab",
"assets/assets/images/admin_panel.png": "1f1a417f432ce50e4420c83ac70ea338",
"assets/assets/images/Home%2520Page.png": "0a614baf83f714dc74693aacb2dc744c",
"assets/assets/images/todo.jpg": "68906ff38a09a42fd26cafdec2247462",
"assets/assets/images/dimsumboss.png": "70d53ea9c60119882c1b0010c69fa599",
"assets/assets/images/todo_icon.png": "fe281702cd1e1a8f44e7b59f1de62d75",
"assets/assets/images/postgre.png": "1f6037d62126a84c07242cf98be92e11",
"assets/assets/images/extjs.png": "f99e75be935727d91e840f02795c5e75",
"assets/assets/images/figmalogo.png": "c31693d10d4cdce5649e7b836aab1608",
"assets/assets/images/htmllogo.png": "c5b69133e5617d207587bd0d96267fb8",
"assets/assets/images/jslogo.png": "3f30c47245a0b35190de8c7b71696cb2",
"assets/assets/images/pslogo.png": "9d67d0888c7e09e3b9536c891aff65c0",
"assets/assets/images/flutterlogo.png": "de49e763d6c4a5167ebe338045769302",
"assets/assets/images/gmail.png": "b2d69a0ebc06324c4ac50d3f342c77af",
"assets/assets/images/instagram.png": "edc9fa83bd57ad4efc5455401dc70cc7",
"assets/assets/images/wa.png": "ee360879cfc73306a08f55f235446cfd",
"assets/assets/images/github.png": "2bc57b974de14d6000df602d9afde4aa",
"assets/assets/images/dribble.png": "c09bd464ee9fd2ba9bb25f7d24b90f50",
"assets/assets/images/website.png": "293e6c4b53aacb93f27836b72f81efe7",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "3241d1d9c15448a4da96df05f3292ffe",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "eaed33dc9678381a55cb5c13edaf241d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "ffed6899ceb84c60a1efa51c809a57e4",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/AssetManifest.json": "de05ecb540df3e4845eb7fd82633a572",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/NOTICES": "1b728f6aaf629381c299b6005d44e097",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "5a2c0526f1fe73e6f211bc7a9d15c210",
"index.html": "84eee7c85a8e62c8389532ec9a89a637",
"/": "84eee7c85a8e62c8389532ec9a89a637"
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
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
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
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
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
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
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
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}

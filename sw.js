const CACHE_NAME = "api-cache-v1"
self.addEventListener("install", (e) => {
    console.log("Installed")
})

self.addEventListener("activate", (e) => {
    console.log("Activated")
})

self.addEventListener("fetch", (e) => {
    if(e.request.method === 'GET'){
        let url = new URL(e.request.url);
        if(url.pathname.includes('/balance/')){
            e.respondWith(fetchAndCache(e));
        }
    }
})

async function fetchAndCache(e){
    let cachedResponse = await caches.match(e.request);
    let fetchedResponse = await fetch(e.request);
    let fetched = await fetchedResponse.json();
    let cached;
    if(cachedResponse){
        cached = await cachedResponse.json()
        return cached
    }else{
        let cache = await caches.open(CACHE_NAME)
        await cache.put(e.request, fetchedResponse.clone());
        console.log("From server")
        return fetched;
    }
    
    return fetched;
}
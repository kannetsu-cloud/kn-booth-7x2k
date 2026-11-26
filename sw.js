/* kn-booth offline cache  build: 1127-01 */
var V='kn-booth-1127-01';
var FILES=['shindan.html','game.html','kaizen.html','scs.html','hybrid.html','hybrid3d.html','nayami.html'];
self.addEventListener('install',function(e){
  /* cache:'reload' を付けて、ブラウザの古い控えではなく必ずサーバから取り直す */
  e.waitUntil(caches.open(V).then(function(c){
    return c.addAll(FILES.map(function(f){return new Request(f,{cache:'reload'});}));
  }).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==V;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin!==location.origin)return;
  var key=new Request(u.origin+u.pathname);
  e.respondWith(caches.open(V).then(function(c){
    return c.match(key).then(function(hit){
      var net=fetch(r).then(function(res){
        if(res&&res.ok&&res.type==='basic'){c.put(key,res.clone());}
        return res;
      }).catch(function(){return hit;});
      return hit||net;
    });
  }));
});

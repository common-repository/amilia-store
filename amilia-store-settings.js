(function() {
  var storeUrl = document.querySelector('textarea[name=amilia_store_url]'),
      storeUrlError = document.querySelector('span.store-url');

  storeUrl.onchange = function() {
    storeUrlError.innerText = Amilia.lang('please-wait');
    Amilia.validateStoreUrl(storeUrl, storeUrlError);
  };

  storeUrl.onkeydown = function(e) {
    if (e.keyCode == 13) {
      e.stopPropagation();
      storeUrl.onchange();
      return false;
    }
  }

  setTimeout(function() {
    storeUrl.onchange();
  }, 500);
  
})();
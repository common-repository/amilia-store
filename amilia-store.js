(function() {

  // window.Amilia was bootstrapped in amilia-store.php.
  // We expect it to already contain:
  // - PLUGIN_NAME: 'amilia_store'
  // - storeUrl: WordPress setting

  // Colors
  Amilia.COLORS = {g: '#40d892', dg: '#28b172', b: '#46aaf8', db: '#158ae5', o: '#fba16b', r: '#fb5b5b', y: '#fce162', steel: '#8294ab'};
  Amilia.getColor = function(hex) {
    for (var key in Amilia.COLORS)
      if (Amilia.COLORS.hasOwnProperty(key) && hex == Amilia.COLORS[key]) return key;
    return 'b';
  };
  Amilia.invertColor = function(hex) {
    if (!hex) return '#FFFFFF';
    if (hex.indexOf('#') === 0) hex = hex.slice(1);
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};
    if (colors[hex.toLowerCase()]) hex = colors[hex.toLowerCase()].slice(1);
    if (hex.length != 6) return '#FFFFFF';
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
  };

  // Icon images
  Amilia.IMAGES = ["check", "edit", "lock"];
  Amilia.getImage = function(backgroundImage) {
    backgroundImage || (backgroundImage = "");
    for (var i = 0; i < Amilia.IMAGES.length; i++)
      if (backgroundImage.indexOf(Amilia.IMAGES[i]) != -1) return Amilia.IMAGES[i];
    return Amilia.IMAGES[0];
  };

  // Localization
  Amilia.lang = function (key) {
    return Amilia.objectL10n[key] || key;
  };
  Amilia.localize = function (template) {
    return template.replace(/{([a-zA-Z0-9-_]+)}/g, function($0, $1) {
        return Amilia.lang($1);
    });
  };

  // YYYY-MM-DD date validation. Empty value is valid.
  Amilia.validateDate = function(value) {
    if (!value) return true;
    return !!value.match(/^\d{4}[./-]\d{2}[./-]\d{2}$/);
  };


  // API and URLs
  Amilia.ajaxGetJson = function(url, onSuccess, onError) {
    if (typeof onSuccess != 'function') throw 'Callback "onSuccess" must be a function.';
    onError || (onError = function() {});
    var xhr = new XMLHttpRequest();
    xhr.ontimeout = function() {
      onError(xhr);
    };
    try {
      xhr.onreadystatechange  = function() {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                  onSuccess(xhr);
              } else {
                  onError(xhr);
              }
          }
      };
      xhr.open('GET', url, true);
      xhr.timeout = 5000;
      xhr.send(null);
    } catch(e) {
      onError(xhr);
    }
    return xhr;
  };
  Amilia.validateUrl = function (url) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
  };
  Amilia.getUrlComponents = function(url) {
    var pieces = url.match(/^(http|https):\/\/www\.amilia\.(com|localhost|qa)\/(store|directory|massregistrations|jobs)\/(en|fr)\/([a-zA-z\-\_0-9]+)\//i);
    if (!pieces) return null;
    return {
      url: url,
      lang: pieces[4],
      rewriteUrl: pieces[5],
      apiUrl: pieces[1]+'://www.amilia.'+pieces[2]+'/PublicApi/'+pieces[5]+'/'+pieces[4]+'/'
    };
  };
  Amilia.validateStoreUrl = function(storeUrlEl, storeUrlErrorEl, onSuccess, onError) {
    onSuccess || (onSuccess = function() {});
    onError || (onError = function() {});

    storeUrlErrorEl.innerText = '';
    if (!Amilia.validateUrl(storeUrlEl.value)) {
      storeUrlErrorEl.innerText = Amilia.lang('error-invalid-url');
      storeUrlErrorEl.style.color = 'red';
      return;
    }

    var urlComponents = Amilia.getUrlComponents(storeUrlEl.value);
    if (!urlComponents) {
      storeUrlErrorEl.innerText = Amilia.lang('error-invalid-amilia-url');
      storeUrlErrorEl.style.color = 'red';
      return;
    }

    storeUrlErrorEl.innerText = Amilia.lang('please-wait');
    storeUrlErrorEl.style.color = 'inherit';
    Amilia.ajaxGetJson(urlComponents.apiUrl + 'Programs?archived=false&offline=false',
      function(xhr) {
        storeUrlErrorEl.innerText = Amilia.lang('store-valid-url');
        storeUrlErrorEl.style.color = 'green';
        onSuccess(urlComponents);
      },
      function(xhr) {
        storeUrlErrorEl.innerText = Amilia.lang('error-invalid-url-permission-denied');
        storeUrlErrorEl.style.color = 'red';
        onError();
      }
    );
  };
  Amilia.validateStoreUrlString = function(storeUrl, callback) {
    callback || (callback = function() {});

    if (!Amilia.validateUrl(storeUrl))
      return {
        message: Amilia.lang('error-invalid-url'),
        status: 'error'
      };

    var urlComponents = Amilia.getUrlComponents(storeUrl);
    if (!urlComponents)
      return {
        message: Amilia.lang('error-invalid-amilia-url'),
        status: 'error'
      };

    Amilia.ajaxGetJson(urlComponents.apiUrl + 'Programs?archived=false&offline=false',
      function(xhr) {
        callback({
          urlComponents: urlComponents,
          message: Amilia.lang('store-valid-url'),
          status: 'ok'
        });
      },
      function(xhr) {
        callback({
          message: Amilia.lang('error-invalid-url-permission-denied'),
          status: 'error'
        });
      }
    );

    return {
      message: Amilia.lang('please-wait'),
      status: 'ok'
    };
  };

})();
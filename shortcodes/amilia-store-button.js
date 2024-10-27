(function() {

  var TINYMCE_PLUGIN_NAME = Amilia.PLUGIN_NAME + '_button',
      SHORTCODE = 'amilia_store_table',
      IMAGES = ["check", "edit", "lock"];

  var modalTemplate = [
    '<h3>{button-title}</h3>',
    '<div>',
    '  <label>{url-label} <a class="amilia-help1" href="#">(?)</a></label>',
    '  <input type="text" name="store-url" />',
    '  <div class="input-helper store-url"></div>',
    '</div>',
    '<div>',
    '  <div class="amilia-left">',
    '    <div>',
    '      <label>{color}</label>',
    '      <select name="color">',
    '        <option value="g">{g}</option>',
    '        <option value="dg">{dg}</option>',
    '        <option selected="selected" value="b">{b}</option>',
    '        <option value="db">{db}</option>',
    '        <option value="o">{o}</option>',
    '        <option value="r">{r}</option>',
    '        <option value="y">{y}</option>',
    '        <option value="steel">{steel}</option>',
    '      </select>',
    '    </div>',
    '    <div>',
    '      <label>{image}</label>',
    '      <select name="image">',
    '        <option selected="selected" value="check">{check}</option>',
    '        <option value="edit">{edit}</option>',
    '        <option value="lock">{lock}</option>',
    '      </select>',
    '    </div>',
    '    <div>',
    '      <label>{text}</label>',
    '      <input type="text" name="text" value="{button-text-value}" />',
    '      <div class="input-helper button-text"></div>',
    '    </div>',
    '  </div>',
    '  <div class="amilia-right">',
    '    <div id="amilia-button-preview" class="amilia-button-wrapper" style="width:175px; display:inline-block;"></div>',
    '  </div>',
    '</div>',
    '<div class="amilia-buttons">',
    '  <button name="insert">{insert}</button>',
    '  <button name="update">{update}</button>',
    '  <button name="delete">{delete}</button>',
    '  <button name="cancel">{close}</button>',
    '  <a class="amilia-help2" href="#">{help}</a>',
    '  <div class="clear"></div>',
    '</div>',
    '<div class="amilia-instructions" style="display:none;">',
    '  <h3>{instructions}</h3>',
    '  <p>{instructions-p1}</p>',
    '  <p>{instructions-p3}</p>',
    '</div>'
  ].join("\n");

  var buttonTemplate = [
    '<a class="amilia-button" href="{url}" style="color:{color}; background:{backgroundColor} url(\'{imageUrl}\') no-repeat 10px 10px; border-radius:2px; font:bold 13px/16px arial; text-indent:0; height:40px; width:175px; text-decoration:none; position:relative; display:table; *display:inline-block;">',
      '<span style="display:block; *position:absolute; *top:50%; display:table-cell; vertical-align:middle; *width:175px;">',
        '<span style="display:block; *position:relative; *top:-50%; padding-left:45px;">',
          '{text}',
        '</span>',
      '</span>',
    '</a>'
  ].join('');

  tinymce.PluginManager.add(TINYMCE_PLUGIN_NAME, function(editor, url) {
    modalTemplate = Amilia.localize(modalTemplate);

    // The modal
    var mask = document.createElement("div");
    mask.className = "amilia-mask";
    document.body.appendChild(mask);
    mask.style.display = "none";

    var modal = document.createElement("div");
    modal.className = "amilia-modal";
    document.body.appendChild(modal);
    modal.innerHTML = modalTemplate;
    modal.style.display = "none";

    var storeUrl = modal.querySelector("input[name=store-url]"),
        storeUrlError = modal.querySelector('div.input-helper.store-url'),
        color = modal.querySelector("select[name=color]"),
        image = modal.querySelector("select[name=image]"),
        text = modal.querySelector("input[name=text]"),
        textError = modal.querySelector('div.input-helper.button-text'),
        preview = modal.querySelector("#amilia-button-preview"),
        insertButton = modal.querySelector("button[name=insert]"),
        updateButton = modal.querySelector("button[name=update]"),
        deleteButton = modal.querySelector("button[name=delete]"),
        cancelButton = modal.querySelector("button[name=cancel]"),
        help1 = modal.querySelector("a.amilia-help1"),
        help2 = modal.querySelector("a.amilia-help2"),
        instructions = modal.querySelector(".amilia-instructions"),
        activeButton = null,
        imagesUrl = url.replace('/shortcodes', '/images/');

    function generateRawHtml() {
      return buttonTemplate
        .replace('{url}', storeUrl.value)
        .replace('{color}', Amilia.COLORS[color.value] == 'y' ? '#494949' : '#ffffff')
        .replace('{backgroundColor}', Amilia.COLORS[color.value])
        .replace('{imageUrl}', imagesUrl + image.value + ".png")
        .replace('{text}', text.value);
    }

    function updatePreview() {
      preview.innerHTML = generateRawHtml(true);
    }

    storeUrl.onchange = function() {
      Amilia.validateStoreUrl(storeUrl, storeUrlError);
    };
    text.onchange = function() {
      textError.innerText = text.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '').length > 0 ? '' : Amilia.lang('error-invalid-button-text');
      updatePreview();
    }
    color.onchange = image.onchange = updatePreview;


    function close(e) {
      mask.style.display = "none";
      modal.style.display = "none";
    }

    insertButton.onclick = function(e) {
      editor.execCommand("mceInsertRawHTML", false, generateRawHtml() + "<p></p>");
      close();
    };
    updateButton.onclick = function(e) {
      activeButton.innerHTML = "";
      editor.execCommand("mceRemoveNode", false, activeButton);
      editor.execCommand("mceInsertRawHTML", false, generateRawHtml());
      close();
    }
    deleteButton.onclick = function(e) {
      activeButton.innerHTML = "";
      editor.execCommand("mceRemoveNode", false, activeButton);
      close();
    }
    cancelButton.onclick = close;
    mask.onclick = close;
    help1.onclick = help2.onclick = function(e) {
      e.preventDefault();
      instructions.style.display = "block";
      return false;
    }

    function getActiveButton() {
      return editor.dom.getParent(editor.selection.getNode(), "a.amilia-button");
    }

    function showModal() {
      activeButton = getActiveButton();
      if (activeButton) {
        storeUrl.value = activeButton.href;
        Amilia.validateStoreUrl(storeUrl, storeUrlError);
        color.value = Amilia.getColor(activeButton.style.backgroundColor);
        image.value = Amilia.getImage(activeButton.style.backgroundImage);
        text.value = activeButton.querySelector("span span").textContent;

        insertButton.style.display = "none";
        updateButton.style.display = "inline";
        deleteButton.style.display = "inline";
      } else {
        storeUrl.value = Amilia.storeUrl;
        Amilia.validateStoreUrl(storeUrl, storeUrlError);

        insertButton.style.display = "inline";
        updateButton.style.display = "none";
        deleteButton.style.display = "none";
      }
      mask.style.display = "block";
      modal.style.display = "block";
      modal.style.left = window.innerWidth/2 - modal.offsetWidth/2 + "px";
      updatePreview();
    }


    // The TineMCE button
    editor.addButton(TINYMCE_PLUGIN_NAME, {
      onclick: showModal,
      title: Amilia.lang('button-title'),
      image: imagesUrl + "link.svg"
    });
    editor.onNodeChange.add(function(editor, controllManager, node) {
      controllManager.setActive(TINYMCE_PLUGIN_NAME, getActiveButton() != null);
    });

    // In case the old deprecated button is present, remove it
    setTimeout(function() {
      var buttonDiv = document.querySelector('.mce-btn[aria-label="Amilia Button"]');
      if (buttonDiv) buttonDiv.style.display = "none";
    }, 10);
  });
  
})();

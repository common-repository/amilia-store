(function() {

  var TINYMCE_PLUGIN_NAME = Amilia.PLUGIN_NAME + '_iframe',
      SHORTCODE = 'amilia_store';

  var modalTemplate = [
    '<h3>{iframe-title}</h3>',
    '<div class="form-group">',
    '  <label>{url-label} <a class="amilia-help1" href="#">(?)</a></label>',
    '  <input type="text" name="store-url" />',
    '  <div class="input-helper store-url"></div>',
    '</div>',
    '<div class="form-group">',
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
    '  </div>',
    '  <div class="amilia-right">',
    '    <div id="amilia-button-preview" class="amilia-preview">{store}</div>',
    '  </div>',
    '<div class="form-group">',
    '  <label>{custom-css}</label>',
    '  <textarea name="css" placeholder="" rows="6" cols="60"></textarea>',
    '</div>',
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
    '  <p>{instructions-p2}</p>',
    '  <p>{instructions-p3}</p>',
    '  <p>{instructions-p4}</p>',
    '</div>'
  ].join('\n');


  tinymce.PluginManager.add(TINYMCE_PLUGIN_NAME, function(editor, url) {
    modalTemplate = Amilia.localize(modalTemplate);


    // The modal
    var mask = document.createElement('div');
    mask.className = 'amilia-mask';
    document.body.appendChild(mask);
    mask.style.display = 'none';

    var modal = document.createElement('div');
    modal.className = 'amilia-modal';
    document.body.appendChild(modal);
    modal.innerHTML = modalTemplate;
    modal.style.display = 'none';

    var storeUrl = modal.querySelector('input[name=store-url]'),
        storeUrlError = modal.querySelector('div.store-url'),
        color = modal.querySelector('select[name=color]'),
        css = modal.querySelector('textarea[name=css]'),
        preview = modal.querySelector('#amilia-button-preview'),
        insertButton = modal.querySelector('button[name=insert]'),
        updateButton = modal.querySelector('button[name=update]'),
        deleteButton = modal.querySelector('button[name=delete]'),
        cancelButton = modal.querySelector('button[name=cancel]'),
        help1 = modal.querySelector('a.amilia-help1'),
        help2 = modal.querySelector('a.amilia-help2'),
        instructions = modal.querySelector('.amilia-instructions'),
        activeNode = null,
        activeShortcode = null,
        imagesUrl = url.replace('/shortcodes', '/images/');

    storeUrl.onchange = function() {
      Amilia.validateStoreUrl(storeUrl, storeUrlError);
    };

    function generateShortCode() {
      return '[' + SHORTCODE + " url='{url}' color='{color}' css='{css}' version='{version}']"
        .replace('{url}', storeUrl.value)
        .replace('{color}', Amilia.COLORS[color.value])
        .replace('{css}', css.value.replace(/\r?\n|\r/g, ''))
        .replace('{version}', Amilia.pluginVersion);
    }

    function updatePreview() {
      preview.style.color = color.value == 'y' ? '#494949' : '#ffffff';
      preview.style.backgroundColor = Amilia.COLORS[color.value];
    }

    function close() {
      mask.style.display = 'none';
      modal.style.display = 'none';
    }

    color.onchange = updatePreview;
    insertButton.onclick = function(e) {
      editor.execCommand('mceInsertContent', false, generateShortCode());
      close();
    };
    updateButton.onclick = function(e) {
      activeNode.innerHTML = '';
      editor.execCommand('mceRemoveNode', false, activeNode);
      editor.execCommand('mceInsertContent', false, generateShortCode());
      close();
    }
    deleteButton.onclick = function(e) {
      activeNode.innerHTML = '';
      editor.execCommand('mceRemoveNode', false, activeNode);
      close();
    }
    cancelButton.onclick = close;
    mask.onclick = close;
    help1.onclick = help2.onclick = function(e) {
      e.preventDefault();
      instructions.style.display = 'block';
      return false;
    }

    function getActiveShortcode() {
      return wp.shortcode.next(SHORTCODE, editor.selection.getNode().innerHTML);
    }

    function showModal() {
      activeNode = editor.dom.getParent(editor.selection.getNode());
      activeShortcode = getActiveShortcode();
      if (activeShortcode) {
        storeUrl.value = activeShortcode.shortcode.attrs.named.url;
        Amilia.validateStoreUrl(storeUrl, storeUrlError);
        color.value = Amilia.getColor(activeShortcode.shortcode.attrs.named.color);
        css.value = activeShortcode.shortcode.attrs.named.css || '';

        insertButton.style.display = 'none';
        updateButton.style.display = 'inline';
        deleteButton.style.display = 'inline';
      } else {
        storeUrl.value = Amilia.storeUrl;
        Amilia.validateStoreUrl(storeUrl, storeUrlError);
        
        insertButton.style.display = 'inline';
        updateButton.style.display = 'none';
        deleteButton.style.display = 'none';
      }
      mask.style.display = 'block';
      modal.style.display = 'block';
      modal.style.left = window.innerWidth/2 - modal.offsetWidth/2 + 'px';
      updatePreview();
    }


    // The TineMCE button
    editor.addButton(TINYMCE_PLUGIN_NAME, {
      onclick: showModal,
      title: Amilia.lang('iframe-title'),
      image: imagesUrl + 'amilia-a.svg'
    });
    editor.onNodeChange.add(function(editor, controllManager, node) {
      controllManager.setActive(TINYMCE_PLUGIN_NAME, getActiveShortcode() != null);
    });

  });
  
})();

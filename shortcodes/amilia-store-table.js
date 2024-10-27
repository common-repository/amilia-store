(function() {

  var TINYMCE_PLUGIN_NAME = Amilia.PLUGIN_NAME + '_table',
      SHORTCODE = 'amilia_store_table';

  var modalTemplate = [
    '<h3>{table-title}</h3>',
    '<div class="form-group">',
    '  <label>{url-label} <a class="amilia-help1" href="#">(?)</a></label>',
    '  <input type="text" name="store-url" />',
    '  <div class="input-helper store-url"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label>{tag-label}</label>',
    '  <select name="tags[]"></select>',
    '  <div class="input-helper tags"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label>{columns}</label>',
    '  <div class="form-controls">',
    '    <label class="checkbox"><input type="checkbox" name="columns[]" value="ProgramName" />{col-ProgramName}</label>',
    '    <label class="checkbox"><input type="checkbox" name="columns[]" value="CategoryName" />{col-CategoryName}</label>',
    '    <label class="checkbox"><input type="checkbox" name="columns[]" value="SubCategoryName" />{col-SubCategoryName}</label>',
    '    <label class="checkbox"><input type="checkbox" name="columns[]" value="Name" />{col-Name}</label>',
    '    <br/>',
    '    <label class="checkbox"><input type="checkbox" name="columns[]" value="AgeSummary" />{col-AgeSummary}</label>',
    '    <label class="checkbox"><input type="checkbox" name="columns[]" value="Description" />{col-Description}</label>',
    '    <label class="checkbox"><input type="checkbox" name="columns[]" value="ShortScheduleString" />{col-ShortScheduleString}</label>',
    '    <label class="checkbox"><input type="checkbox" name="columns[]" value="LegacyLocation" />{col-LegacyLocation}</label>',
    '    <br/>',
    '    <label class="checkbox"><input type="checkbox" name="columns[]" value="SpotsRemaining" />{col-SpotsRemaining}</label>',
    '    <label class="checkbox"><input type="checkbox" name="columns[]" value="Price" />{col-Price}</label>',
    '    <label class="checkbox"><input type="checkbox" name="columns[]" value="Register" />{col-Register}</label>',
    '  </div>',
    '  <div class="input-helper"><button name="reset">{reset-to-defaults}</button></div>',
    '  <div class="input-helper reset"></div>',
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
    '  <p>{table-instructions-p2}</p>',
    '</div>'
  ].join('\n');


  tinymce.PluginManager.add(TINYMCE_PLUGIN_NAME, function(editor, url) {
    modalTemplate = Amilia.localize(modalTemplate);
    window.editor = editor;

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
        storeUrlError = modal.querySelector('div.input-helper.store-url'),
        tagsSelect = modal.querySelector('select[name="tags[]"]'),
        tagsSelectError = modal.querySelector('div.input-helper.tags'),
        columnInputs = modal.querySelectorAll('input[name="columns[]"]'),
        resetButton = modal.querySelector('button[name=reset]'),
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

    function getSelectedTags() {
      var result = [];
      for (var i = 0; i < tagsSelect.options.length; i++) {
        var option = tagsSelect.options[i];
        if (option.selected) result.push(parseInt(option.value, 10));
      }
      return result;
    }

    function getCheckedColumns() {
      var result = [];
      for (var i = 0; i < columnInputs.length; i++) {
        var checkbox = columnInputs[i];
        if (checkbox.checked) result.push(checkbox.value);
      }
      return result;
    }

    function checkColumns(columns) {
      for (var i = 0; i < columnInputs.length; i++) {
        var checkbox = columnInputs[i];
        checkbox.checked = columns.indexOf(checkbox.value) != -1;
      }
    }
    function resetCheckedColumns() {
      checkColumns(['Name', 'ShortScheduleString', 'LegacyLocation', 'Price', 'Register']);
    }
    resetButton.onclick = resetCheckedColumns;

    function fetchTagsAndConstructSelect(selectedTags) {
      selectedTags || (selectedTags = getSelectedTags());
      tagsSelectError.innerText == '';

      var urlComponents = Amilia.getUrlComponents(storeUrl.value);
      if (urlComponents == null) return;
      
      tagsSelectError.innerText == Amilia.lang('pleaseWait');
      Amilia.ajaxGetJson(urlComponents.apiUrl + 'Tags',
        function(xhr) {
          var orgTags = JSON.parse(xhr.response);

          tagsSelect.innerHTML = '';
          tagsSelectError.innerText == '';

          if (orgTags.length > 0) {
            for (var i = 0; i < orgTags.length; i++) {
              var tag = orgTags[i],
                  option = document.createElement('option');
              option.value = tag.Id;
              option.innerText = tag.Name;
              if (selectedTags.indexOf(tag.Id) != -1) option.selected = true;
              tagsSelect.appendChild(option);
            }
          } else {
            tagsSelectError.innerText = Amilia.lang('error-no-tags');
          }
        },
        function(xhr) {
          tagsSelectError.innerText == Amilia.lang('error-unexpected');
        }
      );
    }

    function validateStoreUrlAndFetchTags(selectedTags) {
      Amilia.validateStoreUrl(storeUrl, storeUrlError,
        function() {
          fetchTagsAndConstructSelect(selectedTags);
        });
    }
    storeUrl.onchange = function() {
      validateStoreUrlAndFetchTags();
    };

    function generateShortCode() {
      var tags = getSelectedTags(),
          columns = getCheckedColumns(),
          urlComponents = Amilia.getUrlComponents(storeUrl.value);
      return '[' + SHORTCODE + " url='{url}' tags='{tags}' columns='{columns}' api='{api}' version='{version}']"
        .replace('{url}', storeUrl.value)
        .replace('{tags}', tags.join(','))
        .replace('{columns}', columns.join(','))
        .replace('{api}', urlComponents ? urlComponents.apiUrl : '')
        .replace('{version}', Amilia.pluginVersion);
    }

    function close() {
      mask.style.display = 'none';
      modal.style.display = 'none';
    }

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

        var tags = (activeShortcode.shortcode.attrs.named.tags + '').split(',');
        for (var i = 0; i < tags.length; i++) tags[i] = parseInt(tags[i], 10);
        validateStoreUrlAndFetchTags(tags);

        var columns = (activeShortcode.shortcode.attrs.named.columns + '').split(',');
        checkColumns(columns);

        insertButton.style.display = 'none';
        updateButton.style.display = 'inline';
        deleteButton.style.display = 'inline';
      } else {
        storeUrl.value = Amilia.storeUrl;
        validateStoreUrlAndFetchTags();
        
        resetCheckedColumns();
        insertButton.style.display = 'inline';
        updateButton.style.display = 'none';
        deleteButton.style.display = 'none';
      }
      mask.style.display = 'block';
      modal.style.display = 'block';
      modal.style.left = window.innerWidth/2 - modal.offsetWidth/2 + 'px';
    }


    // The TineMCE button
    editor.addButton(TINYMCE_PLUGIN_NAME, {
      onclick: showModal,
      title: Amilia.lang('table-title'),
      image: imagesUrl + 'table.svg'
    });
    editor.onNodeChange.add(function(editor, controllManager, node) {
      controllManager.setActive(SHORTCODE, getActiveShortcode() != null);
    });

  });
  
})();

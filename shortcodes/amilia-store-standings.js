(function() {

  var TINYMCE_PLUGIN_NAME = Amilia.PLUGIN_NAME + '_standings',
      SHORTCODE = 'amilia_store_standings';

  var modalTemplate = [
    '<h3>{standings-title}</h3>',
    '<div class="form-group">',
    '  <label>{url-label} <a class="amilia-help" href="#">(?)</a></label>',
    '  <input type="text" name="store-url" />',
    '  <div class="input-helper store-url"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label>{select-sport} <a class="amilia-help" href="#">(?)</a></label>',
    '  <select name="sport">',
    '    <option value="soccer">{soccer}</option>',
    '    <option value="football">{football}</option>',
    '  </select>',
    '</div>',
    '<div class="form-group">',
    '  <label>{select-program} <a class="amilia-help" href="#">(?)</a></label>',
    '  <select name="program"></select>',
    '  <div class="input-helper program"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label>{select-sub-category} <a class="amilia-help" href="#">(?)</a></label>',
    '  <select name="sub-category"></select>',
    '  <div class="input-helper sub-category"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label>{show-for-tags} <a class="amilia-help" href="#">(?)</a></label>',
    '  <select name="tags[]" multiple></select>',
    '  <div class="input-helper tags"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label class="checkbox-add-on"><input type="checkbox" name="show-hidden" /> {show-hidden-activities}</label>',
    '  <div class="input-helper show-hidden"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label class="checkbox-add-on"><input type="checkbox" name="show-staff" /> {show-staff}</label>',
    '  <div class="input-helper show-staff"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label>{show} <a class="amilia-help" href="#">(?)</a></label>',
    '  <select name="show">',
    '    <option value="standings,schedule">{team-standings} & {game-schedule}</option>',
    '    <option value="standings">{team-standings}</option>',
    '    <option value="schedule">{game-schedule}</option>',
    '  </select>',
    '</div>',
    '<div class="amilia-buttons">',
    '  <button name="insert">{insert}</button>',
    '  <button name="update">{update}</button>',
    '  <button name="delete">{delete}</button>',
    '  <button name="cancel">{close}</button>',
    '  <a class="amilia-help" href="#">{help}</a>',
    '  <div class="clear"></div>',
    '</div>',
    '<div class="amilia-instructions" style="display:none;">',
    '  <h3>{instructions}</h3>',
    '  <p>{standings-instructions-p1}</p>',
    '  <p>{instructions-p1}</p>',
    '  <p>{standings-instructions-p2}</p>',
    '  <p>{standings-instructions-p3}</p>',
    '  <p>{standings-instructions-p4}</p>',
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
        sportSelect = modal.querySelector('select[name="sport"]'),
        programSelect = modal.querySelector('select[name="program"]'),
        programSelectError = modal.querySelector('div.input-helper.program'),
        subCategorySelect = modal.querySelector('select[name="sub-category"]'),
        subCategorySelectError = modal.querySelector('div.input-helper.sub-category'),
        tagsSelect = modal.querySelector('select[name="tags[]"]'),
        tagsSelectError = modal.querySelector('div.input-helper.tags'),
        showHidden = modal.querySelector('input[name=show-hidden]'),
        showStaff = modal.querySelector('input[name=show-staff]'),
        showSelect = modal.querySelector('select[name="show"]'),
        insertButton = modal.querySelector('button[name=insert]'),
        updateButton = modal.querySelector('button[name=update]'),
        deleteButton = modal.querySelector('button[name=delete]'),
        cancelButton = modal.querySelector('button[name=cancel]'),
        helps = modal.querySelectorAll('a.amilia-help'),
        instructions = modal.querySelector('.amilia-instructions'),
        activeNode = null,
        activeShortcode = null,
        imagesUrl = url.replace('/shortcodes', '/images/');

    function getSelectedProgram() {
      var programId = parseInt(programSelect.value, 10);
      return isNaN(programId) ? null : programId;
    }

    function fetchProgramsAndConstructSelect(selectedProgram) {
      selectedProgram || (selectedProgram = getSelectedProgram());
      programSelectError.innerHTML == '';

      var urlComponents = Amilia.getUrlComponents(storeUrl.value);
      if (urlComponents == null) return;
      
      programSelectError.innerHTML == Amilia.lang('pleaseWait');
      Amilia.ajaxGetJson(urlComponents.apiUrl + 'Programs?offline=true',
        function(xhr) {
          var response = JSON.parse(xhr.response) || {};
          var orgPrograms = response.Items;

          programSelect.innerHTML = '';
          programSelectError.innerHTML = '';

          if (orgPrograms.length > 0) {
            for (var i = 0; i < orgPrograms.length; i++) {
              var program = orgPrograms[i],
                  option = document.createElement('option');
              option.value = program.Id;
              option.innerText = program.Name;
              if (selectedProgram == program.Id) option.selected = true;
              programSelect.appendChild(option);
            }
          } else {
            programSelectError.innerHTML = Amilia.lang('error-no-programs');
          }
        },
        function(xhr) {
          programSelectError.innerHTML = Amilia.lang('error-unexpected');
        }
      );
    }

    function getSelectedSubCategory() {
      var subCategoryId = parseInt(subCategorySelect.value, 10);
      return isNaN(subCategoryId) ? null : subCategoryId;
    }

    function fetchSubCategoriesAndConstructSelect(selectedProgram, selectedSubCategory) {
      selectedProgram || (selectedProgram = getSelectedProgram());
      if (!selectedProgram) return;

      selectedSubCategory || (selectedSubCategory = getSelectedSubCategory());
      subCategorySelectError.innerHTML = '';

      var urlComponents = Amilia.getUrlComponents(storeUrl.value);
      if (urlComponents == null) return;
      
      subCategorySelectError.innerHTML = Amilia.lang('pleaseWait');
      Amilia.ajaxGetJson(urlComponents.apiUrl + 'Programs/' + selectedProgram + '/Activities?showHidden=true',
        function(xhr) {
          var response = JSON.parse(xhr.response) || {};
          var activities = response.Items;

          subCategorySelect.innerHTML = '<option value=""></option>';
          subCategorySelectError.innerHTML = '';

          if (activities.length > 0) {
            var usedIds = [];
            for (var i = 0; i < activities.length; i++) {
              var activity = activities[i];
              if (usedIds.indexOf(activity.SubCategoryId) >= 0) continue;
              var option = document.createElement('option');
              option.value = activity.SubCategoryId;
              option.innerText = activity.CategoryName + ' > ' + activity.SubCategoryName;
              if (selectedSubCategory == activity.SubCategoryId) option.selected = true;
              subCategorySelect.appendChild(option);
              usedIds.push(activity.SubCategoryId);
            }
          } else {
            subCategorySelectError.innerHTML = Amilia.lang('error-no-sub-categories');
          }
        },
        function(xhr) {
          subCategorySelectError.innerHTML = Amilia.lang('error-unexpected');
        }
      );
    }

    function getSelectedTags() {
      var result = [];
      for (var i = 0; i < tagsSelect.options.length; i++) {
        var option = tagsSelect.options[i];
        if (option.selected) result.push(parseInt(option.value, 10));
      }
      return result;
    }

    function fetchTagsAndConstructSelect(selectedTags) {
      selectedTags || (selectedTags = getSelectedTags());
      tagsSelectError.innerHTML == '';

      var urlComponents = Amilia.getUrlComponents(storeUrl.value);
      if (urlComponents == null) return;
      
      tagsSelectError.innerHTML == Amilia.lang('pleaseWait');
      Amilia.ajaxGetJson(urlComponents.apiUrl + 'Tags',
        function(xhr) {
          var orgTags = JSON.parse(xhr.response);

          tagsSelect.innerHTML = '';
          tagsSelectError.innerHTML == '';

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
            tagsSelectError.innerHTML = Amilia.lang('error-no-tags');
          }
        },
        function(xhr) {
          tagsSelectError.innerHTML == Amilia.lang('error-unexpected');
        }
      );
    }

    function validateStoreUrlAndFetchProgramAndTags(selectedProgram, selectedSubCategory, selectedTags) {
      Amilia.validateStoreUrl(storeUrl, storeUrlError,
        function() {
          fetchProgramsAndConstructSelect(selectedProgram);
          fetchTagsAndConstructSelect(selectedTags);
          fetchSubCategoriesAndConstructSelect(selectedProgram, selectedSubCategory);
        });
    }

    storeUrl.onchange = function() {
      validateStoreUrlAndFetchProgramAndTags();
    };

    programSelect.onchange = function() {
      fetchSubCategoriesAndConstructSelect(selectedSubCategory);
    }

    function generateShortCode() {
      var urlComponents = Amilia.getUrlComponents(storeUrl.value);
      var program = getSelectedProgram();
      var subCategory = getSelectedSubCategory();
      var tags = getSelectedTags();
      return '[' + SHORTCODE + " url='{url}' sport='{sport}' program='{program}' subcategory='{sub-category}' tags='{tags}' showhidden='{show-hidden}' showstaff='{show-staff}' show='{show}' api='{api}' version='{version}']"
        .replace('{url}', storeUrl.value)
        .replace('{sport}', sportSelect.value)
        .replace('{program}', program)
        .replace('{sub-category}', subCategory || '')
        .replace('{tags}', tags.join(','))
        .replace('{show-hidden}', showHidden.checked ? 1 : 0)
        .replace('{show-staff}', showStaff.checked ? 1 : 0)
        .replace('{show}', showSelect.value)
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
    function showHelp(e) {
      e.preventDefault();
      instructions.style.display = 'block';
      return false;
    }
    for (var i = 0; i < helps.length; i++) helps[i].onclick = showHelp;

    function getActiveShortcode() {
      return wp.shortcode.next(SHORTCODE, editor.selection.getNode().innerHTML);
    }

    function showModal() {
      activeNode = editor.dom.getParent(editor.selection.getNode());
      activeShortcode = getActiveShortcode();
      if (activeShortcode) {
        storeUrl.value = activeShortcode.shortcode.attrs.named.url;
        Amilia.validateStoreUrl(storeUrl, storeUrlError);
        sportSelect.value = activeShortcode.shortcode.attrs.named.sport || 'soccer';
        showHidden.checked = activeShortcode.shortcode.attrs.named.showhidden == 1;
        showStaff.checked = activeShortcode.shortcode.attrs.named.showstaff == 1;

        var program = activeShortcode.shortcode.attrs.named.program;
        var subCategory = activeShortcode.shortcode.attrs.named.subcategory;
        var tags = (activeShortcode.shortcode.attrs.named.tags + '').split(',');
        for (var i = 0; i < tags.length; i++) tags[i] = parseInt(tags[i], 10);
        validateStoreUrlAndFetchProgramAndTags(program, subCategory, tags);

        showSelect.value = activeShortcode.shortcode.attrs.named.show || 'standings,schedule';

        insertButton.style.display = 'none';
        updateButton.style.display = 'inline';
        deleteButton.style.display = 'inline';
      } else {
        storeUrl.value = Amilia.storeUrl;
        validateStoreUrlAndFetchProgramAndTags();
        
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
      title: Amilia.lang('standings-title'),
      image: imagesUrl + 'standings.svg'
    });
    editor.onNodeChange.add(function(editor, controllManager, node) {
      controllManager.setActive(TINYMCE_PLUGIN_NAME, getActiveShortcode() != null);
    });

  });
  
})();
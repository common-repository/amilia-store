(function() {

  var TINYMCE_PLUGIN_NAME = Amilia.PLUGIN_NAME + '_calendar',
      SHORTCODE = 'amilia_store_calendar';

  var modalTemplate = [
    '<h3>{calendar-title}</h3>',
    '<div class="form-group">',
    '  <label>{url-label} <a class="amilia-help" href="#">(?)</a></label>',
    '  <input type="text" name="store-url" />',
    '  <div class="input-helper store-url"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label>{start-view}</label>',
    '  <select name="start-view">',
    '    <option value="month">{month}</option>',
    '    <option value="agendaWeek">{week}</option>',
    '    <option value="agendaDay">{day}</option>',
    '  </select>',
    '</div>',
    '<div class="form-group">',
    '  <label>{start-date}</label>',
    '  <input type="text" name="start-date" placeholder="' + (new Date()).toISOString().substr(0,10) + '" />',
    '  <div class="input-helper start-date"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label>{start-time}</label>',
    '  <select name="start-time">',
    '    <option value="">{this-hour}</option>',
    '    <option value="06:00:00">06:00</option>',
    '    <option value="07:00:00">07:00</option>',
    '    <option value="08:00:00">08:00</option>',
    '    <option value="09:00:00">09:00</option>',
    '    <option value="10:00:00">10:00</option>',
    '    <option value="11:00:00">11:00</option>',
    '    <option value="12:00:00">12:00</option>',
    '    <option value="13:00:00">13:00</option>',
    '    <option value="14:00:00">14:00</option>',
    '    <option value="15:00:00">15:00</option>',
    '    <option value="16:00:00">16:00</option>',
    '    <option value="17:00:00">17:00</option>',
    '    <option value="18:00:00">18:00</option>',
    '    <option value="19:00:00">19:00</option>',
    '    <option value="20:00:00">20:00</option>',
    '    <option value="21:00:00">21:00</option>',
    '    <option value="22:00:00">22:00</option>',
    '    <option value="23:00:00">23:00</option>',
    '    <option value="00:00:00">00:00</option>',
    '    <option value="01:00:00">01:00</option>',
    '    <option value="02:00:00">02:00</option>',
    '    <option value="03:00:00">03:00</option>',
    '    <option value="04:00:00">04:00</option>',
    '    <option value="05:00:00">05:00</option>',
    '  </select>',
    '</div>',
    '<div class="form-group">',
    '  <label>{show-for-tags} <a class="amilia-help" href="#">(?)</a></label>',
    '  <select name="tags[]" multiple></select>',
    '  <label class="checkbox-add-on"><input type="checkbox" name="show-tags-filter" /> {show-tags-filter}</label>',
    '  <div class="input-helper tags"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label>{show-for-facilities} <a class="amilia-help" href="#">(?)</a></label>',
    '  <select name="facilities[]" multiple></select>',
    '  <label class="checkbox-add-on"><input type="checkbox" name="show-facilities-filter" /> {show-facilities-filter}</label>',
    '  <div class="input-helper facilities"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label class="checkbox-add-on"><input type="checkbox" name="show-staff" /> {show-staff}</label>',
    '  <div class="input-helper show-staff"></div>',
    '</div>',
    '<div class="form-group">',
    '  <label class="checkbox-add-on"><input type="checkbox" name="show-hidden" /> {show-hidden-activities}</label>',
    '  <div class="input-helper show-hidden"></div>',
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
    '  <p>{instructions-p1}</p>',
    '  <p>{calendar-instructions-p2}</p>',
    '  <p>{calendar-instructions-p3}</p>',
    '  <p>{calendar-instructions-p4}</p>',
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
        startView = modal.querySelector('select[name=start-view]'),
        startDate = modal.querySelector('input[name=start-date]'),
        startDateError = modal.querySelector('div.input-helper.start-date'),
        startTime = modal.querySelector('select[name=start-time]'),
        showTagsFilter = modal.querySelector('input[name=show-tags-filter]'),
        tagsSelect = modal.querySelector('select[name="tags[]"]'),
        tagsSelectError = modal.querySelector('div.input-helper.tags'),
        showFacilitiesFilter = modal.querySelector('input[name=show-facilities-filter]'),
        facilitiesSelect = modal.querySelector('select[name="facilities[]"]'),
        facilitiesSelectError = modal.querySelector('div.input-helper.facilities'),
        showStaff = modal.querySelector('input[name=show-staff]'),
        showHidden = modal.querySelector('input[name=show-hidden]'),
        insertButton = modal.querySelector('button[name=insert]'),
        updateButton = modal.querySelector('button[name=update]'),
        deleteButton = modal.querySelector('button[name=delete]'),
        cancelButton = modal.querySelector('button[name=cancel]'),
        helps = modal.querySelectorAll('a.amilia-help'),
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

    function getSelectedFacilities() {
      var result = [];
      for (var i = 0; i < facilitiesSelect.options.length; i++) {
        var option = facilitiesSelect.options[i];
        if (option.selected) result.push(parseInt(option.value, 10));
      }
      return result;
    }

    function fetchFacilitiesAndConstructSelect(selectedFacilities) {
      selectedFacilities || (selectedFacilities = getSelectedFacilities());
      facilitiesSelectError.innerHTML == '';

      var urlComponents = Amilia.getUrlComponents(storeUrl.value);
      if (urlComponents == null) return;
      
      facilitiesSelectError.innerHTML == Amilia.lang('pleaseWait');
      Amilia.ajaxGetJson(urlComponents.apiUrl + 'Facilities',
        function(xhr) {
          var orgFacilities = JSON.parse(xhr.response);

          facilitiesSelect.innerHTML = '';
          facilitiesSelectError.innerHTML == '';

          if (orgFacilities.length > 0) {
            for (var i = 0; i < orgFacilities.length; i++) {
              var facility = orgFacilities[i],
                  option = document.createElement('option');
              option.value = facility.Id;
              option.innerText = facility.FullName;
              option.title = facility.FullName;
              if (selectedFacilities.indexOf(facility.Id) != -1) option.selected = true;
              facilitiesSelect.appendChild(option);
            }
          } else {
            facilitiesSelectError.innerHTML = Amilia.lang('error-no-facilities');
          }
        },
        function(xhr) {
          facilitiesSelectError.innerHTML == Amilia.lang('error-unexpected');
        }
      );
    }

    function validateStoreUrlAndFetchTagsAndFacilities(selectedTags, selectedFacilities) {
      Amilia.validateStoreUrl(storeUrl, storeUrlError,
        function() {
          fetchTagsAndConstructSelect(selectedTags);
          fetchFacilitiesAndConstructSelect(selectedFacilities);
        });
    }

    storeUrl.onchange = function() {
      validateStoreUrlAndFetchTagsAndFacilities();
    };

    startDate.onchange = function() {
      startDateError.innerText = '';
      if (startDate.value.length == 0) return;
      if (!Amilia.validateDate(startDate.value)) startDateError.innerText = Amilia.lang('invalid-date');
    };

    function generateShortCode() {
      var urlComponents = Amilia.getUrlComponents(storeUrl.value);
      var tags = getSelectedTags();
      var facilities = getSelectedFacilities();
      return '[' + SHORTCODE + " url='{url}' view='{view}' date='{date}' time='{time}' tags='{tags}' tagsfilter='{show-tags-filter}' facilities='{facilities}' facilitiesfilter='{show-facilities-filter}' showstaff='{show-staff}' showhidden='{show-hidden}' api='{api}' version='{version}']"
        .replace('{url}', storeUrl.value)
        .replace('{view}', startView.value)
        .replace('{date}', startDate.value)
        .replace('{time}', startTime.value)
        .replace('{tags}', tags.join(','))
        .replace('{facilities}', facilities.join(','))
        .replace('{show-tags-filter}', !showTagsFilter.disabled && showTagsFilter.checked ? 1 : 0)
        .replace('{show-facilities-filter}', !showFacilitiesFilter.disabled && showFacilitiesFilter.checked ? 1 : 0)
        .replace('{show-staff}', showStaff.checked ? 1 : 0)
        .replace('{show-hidden}', showHidden.checked ? 1 : 0)
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
        var attrs = activeShortcode.shortcode.attrs.named;
        storeUrl.value = attrs.url;
        Amilia.validateStoreUrl(storeUrl, storeUrlError);
        startView.value = attrs.view || 'month';
        startDate.value = attrs.date || '';
        startTime.value = attrs.time === '' ? '' : (attrs.time || '09:00');
        showTagsFilter.checked = attrs.tagsfilter == 1;
        showFacilitiesFilter.checked = attrs.facilitiesfilter == 1;
        showHidden.checked = attrs.showhidden == 1;
        showStaff.checked = attrs.showstaff == 1;

        var tags = (attrs.tags + '').split(',');
        for (var i = 0; i < tags.length; i++) tags[i] = parseInt(tags[i], 10);
        var facilities = (attrs.facilities + '').split(',');
        for (var i = 0; i < facilities.length; i++) facilities[i] = parseInt(facilities[i], 10);
        validateStoreUrlAndFetchTagsAndFacilities(tags, facilities);

        insertButton.style.display = 'none';
        updateButton.style.display = 'inline';
        deleteButton.style.display = 'inline';
      } else {
        storeUrl.value = Amilia.storeUrl;
        validateStoreUrlAndFetchTagsAndFacilities();
        
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
      title: Amilia.lang('calendar-title'),
      image: imagesUrl + 'calendar.svg'
    });
    editor.onNodeChange.add(function(editor, controllManager, node) {
      controllManager.setActive(TINYMCE_PLUGIN_NAME, getActiveShortcode() != null);
    });

  });
  
})();
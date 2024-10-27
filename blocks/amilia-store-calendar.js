(function(wp) {
  var registerBlockType = wp.blocks.registerBlockType;
  var InspectorControls = wp.editor.InspectorControls;
  var PanelBody = wp.components.PanelBody;
  var TextControl = wp.components.TextControl;
  var ToggleControl = wp.components.ToggleControl;
  var SelectControl = wp.components.SelectControl;
  var Dashicon = wp.components.Dashicon;
  var el = wp.element.createElement;
  var withState = wp.compose.withState;
  var __ = wp.i18n.__;

  function AmiliaControl(props) {
    var attributes = props.attributes;
    var setAttributes = props.setAttributes;
    var setState = props.setState;
    var urlStatus = props.urlStatus;
    var startDateError = props.startDateError;
    var url = attributes.url === null ? window.Amilia.storeUrl : attributes.url;
    if (url != attributes.url) setAttributes({url: url});

    function onValidateUrl(result) {
      setState({
        urlStatus: result,
        orgTags: null,
        orgFacilities: null
      });
    }
    if (urlStatus === null) setState({urlStatus: Amilia.validateStoreUrlString(url, onValidateUrl)});

    var urlComponents = Amilia.getUrlComponents(url);
    var apiUrl = urlStatus && urlStatus.status == 'ok' && urlComponents ? urlComponents.apiUrl : null;
    
    var tags = null;
    try {
      tags = JSON.parse('[' + attributes.tags + ']');
    } catch (err) {}
    var orgTags = props.orgTags;
    var orgTagsMsg = props.orgTagsMsg;
    if (orgTags === null) {
      setState({
        orgTags: [{Id: null, Name: ''}],
        orgTagsMsg: apiUrl ? Amilia.lang('please-wait') : null
      });
      if (apiUrl) Amilia.ajaxGetJson(urlComponents.apiUrl + 'Tags',
        function(xhr) {
          var orgTags = JSON.parse(xhr.response);
          setState({
            orgTags: orgTags,
            orgTagsMsg: !orgTags.length ? Amilia.lang('error-no-tags') : null
          });
        },
        function(xhr) {
          setState({
            orgTagsMsg: Amilia.lang('error-unexpected')
          });
        });
    }

    var facilities = null;
    try {
      facilities = JSON.parse('[' + attributes.facilities + ']');
    } catch (err) {}
    var orgFacilities = props.orgFacilities;
    var orgFacilitiesMsg = props.orgFacilitiesMsg;
    if (orgFacilities === null) {
      setState({
        orgFacilities: [{Id: null, Name: ''}],
        orgFacilitiesMsg: apiUrl ? Amilia.lang('please-wait') : null
      });
      if (apiUrl) Amilia.ajaxGetJson(urlComponents.apiUrl + 'Facilities',
        function(xhr) {
          var orgFacilities = JSON.parse(xhr.response);
          setState({
            orgFacilities: orgFacilities,
            orgFacilitiesMsg: !orgFacilities.length ? Amilia.lang('error-no-tags') : null
          });
        },
        function(xhr) {
          setState({
            orgFacilitiesMsg: Amilia.lang('error-unexpected')
          });
        });
    }

    var inspectorControl = el(InspectorControls, {}, 
      el('h4', {}, el('span', {}, Amilia.lang('calendar-title'))),
      // url & api
      el(TextControl, {
        label: Amilia.lang('url-label'),
        value: url,
        help: urlStatus ? urlStatus.message : null,
        onChange: function(value) {
          var urlComponents = Amilia.getUrlComponents(value);
          setAttributes({
            url: value,
            api: urlComponents ? urlComponents.apiUrl : null
          });
          setState({
            urlStatus: Amilia.validateStoreUrlString(value, onValidateUrl)
          });
        }
      }),
      el('p', {className: 'input-helper'},
        urlStatus && urlStatus.status == 'error' ? el('a', {
          href: '#',
          onClick: function(e) {
            e.preventDefault();
            setState({urlStatus: Amilia.validateStoreUrlString(url, onValidateUrl)});
          }
        }, Amilia.lang('try-again')) : undefined
      ),
      // view
      el(SelectControl, {
        label: Amilia.lang('start-view'),
        value: attributes.view || 'month',
        options: [
          {value: 'month', label: Amilia.lang('month')},
          {value: 'week', label: Amilia.lang('week')},
          {value: 'day', label: Amilia.lang('day')}
        ],
        onChange: function(value) {
          setAttributes({view: value});
        }
      }),
      // start-date
      el(TextControl, {
        label: Amilia.lang('start-date'),
        value: attributes.date,
        help: startDateError,
        placeholder: (new Date()).toISOString().substr(0, 10),
        onChange: function(value) {
          var error = '';
          if (value && !Amilia.validateDate(value)) error = Amilia.lang('invalid-date');
          setState({startDateError: error});
          setAttributes({date: value});
        }
      }),
      // start-time
      el(SelectControl, {
        label: Amilia.lang('start-time'),
        value: attributes.time,
        options: [
          {value: '06:00:00', label: '06:00'},
          {value: '07:00:00', label: '07:00'},
          {value: '08:00:00', label: '08:00'},
          {value: '09:00:00', label: '09:00'},
          {value: '10:00:00', label: '10:00'},
          {value: '11:00:00', label: '11:00'},
          {value: '12:00:00', label: '12:00'},
          {value: '13:00:00', label: '13:00'},
          {value: '14:00:00', label: '14:00'},
          {value: '15:00:00', label: '15:00'},
          {value: '16:00:00', label: '16:00'},
          {value: '17:00:00', label: '17:00'},
          {value: '18:00:00', label: '18:00'},
          {value: '19:00:00', label: '19:00'},
          {value: '20:00:00', label: '20:00'},
          {value: '21:00:00', label: '21:00'},
          {value: '22:00:00', label: '22:00'},
          {value: '23:00:00', label: '23:00'},
          {value: '00:00:00', label: '00:00'},
          {value: '01:00:00', label: '01:00'},
          {value: '02:00:00', label: '02:00'},
          {value: '03:00:00', label: '03:00'},
          {value: '04:00:00', label: '04:00'},
          {value: '05:00:00', label: '05:00'}
        ],
        onChange: function(value) {
          setAttributes({time: value});
        }
      }),
      // show-hidden
      el(ToggleControl, {
        label: Amilia.lang('show-hidden-activities'),
        checked: !!attributes['show-hidden'],
        onChange: function(value) {
          setAttributes({'show-hidden': value ? 1 : 0});
        }
      }),
      el('hr'),
      // tags & show-tags-filter
      el('h3', {}, Amilia.lang('tags-label')),
      el(SelectControl, {
        label: Amilia.lang('show-for-tags'),
        multiple: true,
        value: tags,
        help: orgTagsMsg,
        options: (orgTags || []).map(function(o) {
          return {value: o.Id, label: o.Name};
        }),
        onChange: function(value) {
          setAttributes({tags: value.join(',')});
        }
      }),
      el(ToggleControl, {
        label: Amilia.lang('show-tags-filter'),
        checked: !!attributes['show-tags-filter'],
        onChange: function(value) {
          setAttributes({'show-tags-filter': value ? 1 : 0});
        }
      }),
      // facilities & show-facilities-filter
      el('h3', {}, Amilia.lang('facilities-label')),
      el(SelectControl, {
        label: Amilia.lang('show-for-facilities'),
        multiple: true,
        value: facilities,
        help: orgFacilitiesMsg,
        options: (orgFacilities || []).map(function(o) {
          return {value: o.Id, label: o.Name};
        }),
        onChange: function(value) {
          setAttributes({facilities: value.join(',')});
        }
      }),
      el(ToggleControl, {
        label: Amilia.lang('show-facilities-filter'),
        checked: !!attributes['show-facilities-filter'],
        onChange: function(value) {
          setAttributes({'show-facilities-filter': value ? 1 : 0});
        }
      }),
      // help
      el(PanelBody, {title: Amilia.lang('help'), initialOpen: false},
        el('p', {}, Amilia.lang('instructions-p1')),
        el('p', {}, Amilia.lang('calendar-instructions-p2')),
        el('p', {}, Amilia.lang('calendar-instructions-p3')),
        el('p', {}, Amilia.lang('calendar-instructions-p4'))
      )
    );

    return el('div', {
        className: 'amilia-store-block',
        style: {
          backgroundColor: '#46aaf8',
          color: Amilia.invertColor('#46aaf8')
        }
      },
      el('img', {src: Amilia.pluginUrl + 'images/amilia-a.svg', className: 'logo'}),
      el('p', {className: 'strong'}, el(Dashicon, {icon: 'calendar'}), ' ', __('Activities Calendar')),
      el('p', {className: 'italic'}, Amilia.lang('block-info')),
      inspectorControl
    );
  }

  registerBlockType('amilia-store/amilia-store-calendar', {
    title: __('Activities Calendar'),
    category: 'embed',
    icon: {
      foreground: '#46aaf8',
      src: 'calendar'
    },
    attributes: {
      url: {type: 'string', default: null},
      api: {type: 'string', default: null},
      view: {type: 'string', default: 'month'},
      date: {type: 'string', default: null},
      time: {type: 'string', default: null},
      tags: {type: 'string', default: null},
      facilities: {type: 'string', default: null},
      'show-tags-filter': {type: 'string', default: false},
      'show-facilities-filter': {type: 'string', default: false},
      'show-hidden': {type: 'string', default: false}
    },
    edit: withState({
      urlStatus: null,
      startDateError: null,
      orgTags: null,
      orgTagsMsg: null,
      orgFacilities: null,
      orgFacilitiesMsg: null
    })(AmiliaControl),
    save: function(props) {
      return null;
    }
  });

})(window.wp);

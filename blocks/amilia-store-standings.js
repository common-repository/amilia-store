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
        orgPrograms: null
      });
    }
    if (urlStatus === null) setState({urlStatus: Amilia.validateStoreUrlString(url, onValidateUrl)});

    var urlComponents = Amilia.getUrlComponents(url);
    var apiUrl = urlStatus && urlStatus.status == 'ok' && urlComponents ? urlComponents.apiUrl : null;
    
    var orgPrograms = props.orgPrograms;
    var orgProgramsMsg = props.orgProgramsMsg;
    if (orgPrograms === null) {
      setState({
        orgPrograms: [{Id: null, Name: ''}],
        orgProgramsMsg: apiUrl ? Amilia.lang('please-wait') : null
      });
      if (apiUrl) Amilia.ajaxGetJson(urlComponents.apiUrl + 'Programs',
        function(xhr) {
          var orgPrograms = JSON.parse(xhr.response).Items;
          setState({
            orgPrograms: orgPrograms,
            orgProgramsMsg: !orgPrograms.length ? Amilia.lang('error-no-programs') : null
          });
        },
        function(xhr) {
          setState({
            orgProgramsMsg: Amilia.lang('error-unexpected')
          });
        });
    }

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

    var inspectorControl = el(InspectorControls, {}, 
      el('h4', {}, el('span', {}, Amilia.lang('standings-title'))),
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
      // sport
      el(SelectControl, {
        label: Amilia.lang('select-sport'),
        value: attributes.sport,
        options: [
          {value: 'soccer', label: Amilia.lang('soccer')},
          {value: 'football', label: Amilia.lang('football')}
        ],
        onChange: function(value) {
          setAttributes({sport: value});
        }
      }),
      // show
      el(SelectControl, {
        label: Amilia.lang('show'),
        value: attributes.show,
        options: [
          {value: 'standings,schedule', label: Amilia.lang('team-standings') + ' & ' + Amilia.lang('game-schedule')},
          {value: 'standings', label: Amilia.lang('team-standings')},
          {value: 'schedule', label: Amilia.lang('game-schedule')}
        ],
        onChange: function(value) {
          setAttributes({show: value});
        }
      }),
      // program
      el(SelectControl, {
        label: Amilia.lang('select-program'),
        value: attributes.program,
        help: orgProgramsMsg,
        options: (orgPrograms || []).map(function(o) {
          return {value: o.Id, label: o.Name};
        }),
        onChange: function(value) {
          setAttributes({program: value});
        }
      }),
      // showstaff
      el(ToggleControl, {
        label: Amilia.lang('show-officials'),
        checked: !!attributes['showstaff'],
        onChange: function(value) {
          setAttributes({'showstaff': value ? 1 : 0});
        }
      }),
      // showhidden
      el(ToggleControl, {
        label: Amilia.lang('show-hidden-activities'),
        checked: !!attributes['showhidden'],
        onChange: function(value) {
          setAttributes({'showhidden': value ? 1 : 0});
        }
      }),
      el('hr'),
      // tags
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
      // help
      el(PanelBody, {title: Amilia.lang('help'), initialOpen: false},
        el('p', {}, Amilia.lang('standings-instructions-p1')),
        el('p', {}, Amilia.lang('instructions-p1')),
        el('p', {}, Amilia.lang('standings-instructions-p2')),
        el('p', {}, Amilia.lang('standings-instructions-p3')),
        el('p', {}, Amilia.lang('standings-instructions-p4'))
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
      el('p', {className: 'strong'}, el(Dashicon, {icon: 'editor-ol'}), ' ', __('Team Standings & Game Schedules')),
      el('p', {className: 'italic'}, Amilia.lang('block-info')),
      inspectorControl
    );
  }

  registerBlockType('amilia-store/amilia-store-standings', {
    title: __('Team Standings & Game Schedules'),
    category: 'embed',
    icon: {
      foreground: '#46aaf8',
      src: 'editor-ol'
    },
    attributes: {
      url: {type: 'string', default: null},
      api: {type: 'string', default: null},
      sport: {type: 'string', default: 'soccer'},
      show: {type: 'string', default: 'standings,schedule'},
      program: {type: 'string', default: null},
      'showhidden': {type: 'string', default: false},
      'showstaff': {type: 'string', default: false},
      tags: {type: 'string', default: null}
    },
    edit: withState({
      urlStatus: null,
      orgTags: null,
      orgPrograms: null
    })(AmiliaControl),
    save: function(props) {
      return null;
    }
  });

})(window.wp);

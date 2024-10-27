(function(wp) {
  var registerBlockType = wp.blocks.registerBlockType;
  var InspectorControls = wp.editor.InspectorControls;
  var PanelBody = wp.components.PanelBody;
  var TextControl = wp.components.TextControl;
  var ColorPicker = wp.components.ColorPicker;
  var ColorPalette = wp.components.ColorPalette;
  var SelectControl = wp.components.SelectControl;
  var Dashicon = wp.components.Dashicon;
  var el = wp.element.createElement;
  var withState = wp.compose.withState;
  var __ = wp.i18n.__;

  function AmiliaControl(props) {
    var attributes = props.attributes;
    var setAttributes = props.setAttributes;
    var setState = props.setState;
    var status = props.status;
    var url = attributes.url === null ? window.Amilia.storeUrl : attributes.url;
    if (url != attributes.url) setAttributes({url: url});

    function onValidateUrl(result) {
      setState({status: result});
    }

    if (status === null) setState({status: Amilia.validateStoreUrlString(url, onValidateUrl)});

    var inspectorControl = el(InspectorControls, {}, 
      el('h4', {}, el('span', {}, Amilia.lang('iframe-title'))),
      el(TextControl, {
        label: Amilia.lang('url-label'),
        value: url,
        onChange: function(value) {
          setAttributes({url: value});
          setState({status: Amilia.validateStoreUrlString(value, onValidateUrl)});
        }
      }),
      el('p', {className: 'input-helper'},
        status ? status.message + ' ' : '',
        status && status.status == 'error' ? el('a', {
          href: '#',
          onClick: function(e) {
            e.preventDefault();
            setState({status: Amilia.validateStoreUrlString(url, onValidateUrl)});
          }
        }, Amilia.lang('try-again')) : undefined
      ),
      el('label', {}, Amilia.lang('color')),
      el(ColorPalette, {
        color: attributes.color,
        colors: Object.keys(Amilia.COLORS).map(function(k) {
          return {name: Amilia.lang(k), color: Amilia.COLORS[k]};
        }),
        onChange: function(value) {
          setAttributes({color: value});
        }
      }),
      el(PanelBody, {title: Amilia.lang('help'), initialOpen: false},
        el('p', {}, Amilia.lang('instructions-p1')),
        el('p', {}, Amilia.lang('instructions-p2')),
        el('p', {}, Amilia.lang('instructions-p3')),
        el('p', {}, Amilia.lang('instructions-p4'))
      )
    );

    return el('div', {
        className: 'amilia-store-block',
        style: {
          backgroundColor: attributes.color,
          color: Amilia.invertColor(attributes.color)
        }
      },
      el('img', {src: Amilia.pluginUrl + 'images/amilia-a.svg', className: 'logo'}),
      el('p', {className: 'strong'}, el(Dashicon, {icon: 'store'}), ' ', Amilia.lang('amilia-store')),
      el('p', {className: 'italic'}, Amilia.lang('block-info')),
      inspectorControl
    );
  }

  registerBlockType('amilia-store/amilia-store-iframe', {
    title: __('Amilia Store'),
    category: 'embed',
    icon: {
      foreground: '#46aaf8',
      src: 'store'
    },
    attributes: {
      url: {
        type: 'string',
        default: null
      },
      color: {
        type: 'string',
        default: '#46aaf8'
      }
    },
    edit: withState({status: null})(AmiliaControl),
    save: function(props) {
      return null;
    }
  });

})(window.wp);

<?php

function amilia_store_iframe_shortcode_handler($atts, $content = null) {
  $a = shortcode_atts(array(
    'color' => '#46AAF8',
    'url' => 'https://www.amilia.com/store/en/usa-amilia-group/shop/products',
    'css' => ''
  ), $atts);

    $override_url = isset($_GET['amilia_url']) ? urldecode($_GET['amilia_url']) : NULL;
    if ($override_url != NULL && preg_match('/www\.amilia\.(com|localhost|qa)\/(Store|MassRegistrations|Directory|Jobs)/i', $override_url)) {
        $a['url'] = $override_url;
    }

    if (preg_match('/www\.amilia\.(com|localhost|qa)\/(MassRegistrations|Directory|Jobs)/i', $a['url']) === 1) {
        return '<!-- Embed this code in your page.-->' .
            '<iframe id="amilia-iframe" ' .
            'allowtransparency="true" ' .
            'frameborder="0" ' .
            'width="100%" ' .
            'data-background-color="transparent" ' .
            'data-css="' . $a['css'] . '" ' .
            'style="width: 100% !important; ' .
            'border: none !important; ' .
            'overflow: hidden !important; ' .
            'visibility: hidden;" ' .
            'scrolling="no" ' .
            'horizontalscrolling="no" ' .
            'verticalscrolling="no" ' .
            'src="' . $a['url'] . '">' .
            '</iframe>' .
            '<script src="https://www.amilia.com/assets/src/directory/shared/iframe-embed.js" type="text/javascript"></script>' .
            '<!-- End of Amilia embed -->';
    }

  return '<!-- Embed this code in your page.-->' .
    '<div id="amilia">' .
    '<iframe id="amilia-iframe" ' .
    'allowtransparency="true" ' .
    'frameborder="0" ' .
    'width="100%" ' .
    'style="width:100%!important; border:none!important; overflow:hidden!important; visibility:hidden;" ' .
    'scrolling="no" ' .
    'horizontalscrolling="no" ' .
    'verticalscrolling="no" ' .
    'data-color-code="' . $a['color'] . '" ' .
    'data-css="' . $a['css'] . '" ' .
    'src="' . $a['url'] . '">' .
    '</iframe>' .
    '<script src="https://www.amilia.com/scripts/amilia-iframe.js" type="text/javascript"></script>' .
    '</div>' .
    '<!-- End of Amilia embed -->';
}
add_shortcode('amilia_store', 'amilia_store_iframe_shortcode_handler');

?>
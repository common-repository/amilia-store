<?php

function amilia_store_table_shortcode_handler($atts, $content = null) {
    $labels = array(
        'ProgramName' => __("Program", 'amilia-store'),
        'CategoryName' => __("Category", 'amilia-store'),
        'SubCategoryName' => __("Sub-category", 'amilia-store'),
        'Name' => __("Activity", 'amilia-store'),
        'AgeSummary' => __("Age", 'amilia-store'),
        'Description' => __("Description", 'amilia-store'),
        'ShortScheduleString' => __("When", 'amilia-store'),
        'LegacyLocation' => __("Location", 'amilia-store'),
        'SpotsRemaining' => __("Spots", 'amilia-store'),
        'Price' => __("Price", 'amilia-store')
    );

    $a = shortcode_atts(array(
        'tags' => '1051050',
        'url' => 'https://www.amilia.com/store/en/usa-amilia-group/shop/products',
        'api' => 'https://www.amilia.com/PublicApi/usa-amilia-group/en/',
        'columns' => 'Name,ShortScheduleString,LegacyLocation,Price'
    ), $atts);
    $tags = explode(',', $a['tags']);
    $url = $a['api'].'Tags/'.$tags[0].'/Activities?v2';
    $columns = explode(',', $a['columns']);
    $headers = array();
    foreach ($labels as $head => $label) if (in_array($head, $columns)) $headers[$head] = $label;

    $html = '<table class="amilia-store-table"><thead><tr>';
    foreach ($headers as $head => $label) $html .= '<th>'.$label.'</th>';
    $html .= '<th>&nbsp;</th>';
    $html .= '</tr></thead><tbody>';

    if (count($tags) > 0) {
        $json = file_get_contents($url);
        if ($json === FALSE) {
            $html .= '<tr><td colspan="'.count($headers).'">'.__("Unexpected error", 'amilia-store').'</td></tr>';
        } else {
            $activities = json_decode($json, true);
            if (count($activities) == 0) {
                $html .= '<tr><td  colspan="'.count($headers).'">'.__("No activities found", 'amilia-store').'</td></tr>';
            } else {
                foreach ($activities as $activity) {
                    if ($activity['Status'] != "Normal") continue;
                    $html .= '<tr>';
                    foreach ($headers as $head => $label) $html .= '<td>'.$activity[$head].'</td>';
                    $html .= '<td><a href="'.$activity['Url'].'">'.__("Register", 'amilia-store').'</a></td>';
                    $html .= '</tr>';
                }
            }
        }
    } else {
        $html .= '<tr><td colspan="'.count($headers).'">'.__("No tag specified", 'amilia-store').'</td></tr>';
    }

    $html .= '</tbody></table>';
    return $html;
}
add_shortcode('amilia_store_table', 'amilia_store_table_shortcode_handler');

?>
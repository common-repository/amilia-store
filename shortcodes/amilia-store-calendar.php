<?php

function amilia_store_calendar_shortcode_handler($atts, $content = null) {
    $a = shortcode_atts(array(
        'tags' => '',
        'facilities' => '',
        'tagsfilter' => 0,
        'facilitiesfilter' => 0,
        'view' => 'month',
        'date' => '',
        'time' => '',
        'showstaff' => 0,
        'showhidden' => 0,
        'url' => 'https://www.amilia.com/store/en/usa-amilia-group/shop/products',
        'api' => 'https://www.amilia.com/PublicApi/usa-amilia-group/en/',
        'version' => '0'
    ), $atts);

    $uid = rand();
    $view = $a['view'];
    $date = $a['date'];
    if (empty($date)) $date = date('Y-m-d');
    $time = $a['time'];
    $api = $a['api'];
    $tags = $a['tags'];
    $tagsfilter = $a['tagsfilter'];
    $facilities = $a['facilities'];
    $facilitiesfilter = $a['facilitiesfilter'];
    $showStaff = $a['showstaff'] == 1 ? 1 : 0;
    $showHidden = $a['showhidden'] == 1 ? 1 : 0;

    $lang = __("en", 'amilia-store');
    $errorWhenNojQuery = __("Amilia calendar requires jQuery. It cannot be shown.", 'amilia-store');
    $anyTag = __("Any tag", 'amilia-store');
    $anyFacility = __("Any facility", 'amilia-store');
    $label_ViewInStore = __("View in Store", 'amilia-store');
    $label_AddToCalendar = __("Add to calendar", 'amilia-store');
    $label_Officials = __("Officials", 'amilia-store');
    $label_ShowOfficials = __("Show officials", 'amilia-store');
    $label_HideOfficials = __("Hide officials", 'amilia-store');
    $clientJSFile = plugins_url('amilia-store-calendar-client.js', __FILE__).'?v='.$a['version'];

    $html = <<<EOD
<div class="amilia-store-calendar-container">
    <div id="amilia-store-calendar-filters-$uid" class="amilia-store-calendar-filters">
EOD;
    if ($facilitiesfilter == 1) $html .= <<<EOD
        <select id="amilia-store-calendar-facilities-$uid" class="amilia-store-calendar-facilities" placeholder="$anyFacility" multiple></select>
EOD;
    if ($tagsfilter == 1) $html .= <<<EOD
        <select id="amilia-store-calendar-tags-$uid" class="amilia-store-calendar-tags" placeholder="$anyTag" multiple></select>
EOD;
    $html .= <<<EOD
    </div>
    <div id="amilia-store-calendar-$uid" class="amilia-store-calendar"></div>
</div>
<style>
    .amilia-store-calendar-container {
        padding: 10px 0;
    }
    .amilia-store-calendar .fc-toolbar .fc-center h2 {
        padding: 0;
    }
    .amilia-store-calendar tr:hover {
        background: inherit;
    }
    .amilia-store-calendar-filters {
        display: flex;
        margin: 0 -15px;
    }
    .amilia-store-calendar-filters select,
    .amilia-store-calendar-filters .selectize-control {
        flex: 1;
        width: 0;
        padding: 0 15px 10px 15px;
    }
</style>
<link href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.css" rel="stylesheet" type="text/css" charset="utf-8">
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.js" type="text/javascript"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.css" rel="stylesheet" type="text/css" charset="utf-8">
EOD;
    if ($a['tagsfilter'] == 1 || $facilitiesfilter == 1) $html .= <<<EOD
<link href="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.4/css/selectize.bootstrap3.min.css" rel="stylesheet" type="text/css" charset="utf-8">
<script src="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.4/js/standalone/selectize.min.js" type="text/javascript"></script>
EOD;
    if (strlen($facilities) > 0) $html .= <<<EOD
<link href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar-scheduler/1.9.4/scheduler.min.css" rel="stylesheet" type="text/css" charset="utf-8">
<script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar-scheduler/1.9.4/scheduler.min.js" type="text/javascript"></script>
EOD;
    if ($lang == 'fr') $html .=  <<<EOD
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/locale/fr.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/locale/fr.js" type="text/javascript"></script>
EOD;
    $html .= <<<EOD
<script src="$clientJSFile" type="text/javascript"></script>
<script>
    (function() {
        amiliaStoreCalendar({
            uid: '$uid',
            api: '$api',
            errorWhenNojQuery: '$errorWhenNojQuery',
            tags: [$tags],
            tagsfilter: '$tagsfilter',
            facilities: [$facilities],
            facilitiesfilter: '$facilitiesfilter',
            showStaff: $showStaff,
            showHidden: $showHidden,
            view: '$view',
            date: '$date',
            time: '$time',
            label_AddToCalendar: '$label_AddToCalendar',
            label_Officials: '$label_Officials',
            label_ShowOfficials: '$label_ShowOfficials',
            label_HideOfficials: '$label_HideOfficials',
            label_ViewInStore: '$label_ViewInStore'
        });
    })();
</script>
EOD;

    return $html;
}
add_shortcode('amilia_store_calendar', 'amilia_store_calendar_shortcode_handler');

?>
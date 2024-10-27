<?php

function amilia_store_standings_shortcode_handler($atts, $content = null) {
    $a = shortcode_atts(array(
        'sport' => 'soccer',
        'program' => '',
        'subcategory' => '',
        'tags' => '',
        'showhidden' => false,
        'showstaff' => false,
        'show' => 'standings,schedule',
        'url' => 'https://www.amilia.com/store/en/usa-amilia-group/shop/products',
        'api' => 'https://www.amilia.com/PublicApi/usa-amilia-group/en/',
        'version' => '0'
    ), $atts);

    $uid = rand();
    $api = $a['api'];
    $sport = $a['sport'];
    $program = $a['program'];
    if (!is_numeric($program)) $program = 'null';
    $subCategory = $a['subcategory'];
    if (!is_numeric($subCategory)) $subCategory = 'null';
    $tags = $a['tags'];
    $showHidden = $a['showhidden'] == 1 ? 1 : 0;
    $showStaff = $a['showstaff'] == 1 ? 1 : 0;
    $show = $a['show'];
    $clientJSFile = plugins_url('amilia-store-standings-client.js', __FILE__).'?v='.$a['version'];

    $lang = __("en", 'amilia-store');
    $errorWhenNojQuery = __("Amilia calendar requires jQuery. It cannot be shown.", 'amilia-store');
    $errorNoProgram = __("No programs found.", 'amilia-store');
    $legend = $sport == 'football' ? 
        __("GP = Games played, W = Win, T = Tie, L = Lost, % = Percentage, PDiff = Point difference, Pts = Points", 'amilia-store') :
        __("GP = Games played, W = Win, T = Tie, L = Lost, F = Goals for, A = Goals against, GD = Goal differential, Pts = Points", 'amilia-store');
    $label_Team = __("Team", 'amilia-store');
    $label_Home = __("Home", 'amilia-store');
    $label_Away = __("Away", 'amilia-store');
    $label_Officials = __("Officials", 'amilia-store');
    $label_GP = __("GP", 'amilia-store');
    $label_W = __("W", 'amilia-store');
    $label_T = __("T", 'amilia-store');
    $label_L = __("L", 'amilia-store');
    $label_F = __("F", 'amilia-store');
    $label_A = __("A", 'amilia-store');
    $label_GD = __("GD", 'amilia-store');
    $label_Perc = __("%", 'amilia-store');
    $label_PDiff = __("PDiff", 'amilia-store');
    $label_Pts = __("Pts", 'amilia-store');
    $label_Location = __("Location", 'amilia-store');
    $label_Date = __("Date/time", 'amilia-store');
    $label_ViewInStore = __("View in Store", 'amilia-store');
    $label_AddToCalendar = __("Add to calendar", 'amilia-store');
    $pleaseWait = __("Please wait...", 'amilia-store');
    $standings = __("Standings", 'amilia-store');
    $games = __("Games", 'amilia-store');
    $warning = __("Warning!", 'amilia-store');
    $warningMsg = __("Some games cannot be created because we identified more or less than 2 teams meeting at same time and place. Please ensure there are exactly 2 teams per location at a given time. Alternatively, you can use Tags to group a pair of teams playing at the same location.", 'amilia-store');

    $calendarSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792"><path d="M192 1664h288v-288h-288v288zm352 0h320v-288h-320v288zm-352-352h288v-320h-288v320zm352 0h320v-320h-320v320zm-352-384h288v-288h-288v288zm736 736h320v-288h-320v288zm-384-736h320v-288h-320v288zm768 736h288v-288h-288v288zm-384-352h320v-320h-320v320zm-352-864v-288q0-13-9.5-22.5t-22.5-9.5h-64q-13 0-22.5 9.5t-9.5 22.5v288q0 13 9.5 22.5t22.5 9.5h64q13 0 22.5-9.5t9.5-22.5zm736 864h288v-320h-288v320zm-384-384h320v-288h-320v288zm384 0h288v-288h-288v288zm32-480v-288q0-13-9.5-22.5t-22.5-9.5h-64q-13 0-22.5 9.5t-9.5 22.5v288q0 13 9.5 22.5t22.5 9.5h64q13 0 22.5-9.5t9.5-22.5zm384-64v1280q0 52-38 90t-90 38h-1408q-52 0-90-38t-38-90v-1280q0-52 38-90t90-38h128v-96q0-66 47-113t113-47h64q66 0 113 47t47 113v96h384v-96q0-66 47-113t113-47h64q66 0 113 47t47 113v96h128q52 0 90 38t38 90z" fill="currentColor"/></svg>';

    $html = <<<EOD
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js" type="text/javascript"></script>
EOD;
    if ($lang == 'fr') $html .=  <<<EOD
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/locale/fr.js" type="text/javascript"></script>
EOD;
    $html .= <<<EOD
<script src="https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.js" type="text/javascript"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.css" rel="stylesheet" type="text/css" charset="utf-8">
<script src="$clientJSFile" type="text/javascript"></script>
<script type="text/javascript">
    (function() {
        amiliaStoreStandings({
            uid: '$uid',
            errorWhenNojQuery: '$errorWhenNojQuery',
            api: '$api',
            sport: '$sport',
            tags: [$tags],
            program: $program,
            subCategory: $subCategory,
            showHidden: $showHidden,
            showStaff: $showStaff,
            show: '$show',
            errorNoProgram: '$errorNoProgram',
            label_ViewInStore: '$label_ViewInStore',
            label_AddToCalendar: '$label_AddToCalendar',
            warning: '$warning',
            warningMsg: '$warningMsg'
        });
    })();
</script>
<style>
    .amilia-store-standings-container {
        padding: 10px 0;
    }
    table.amilia-store-table {
        width: 100%;
    }
    .amilia-store-table td,
    .amilia-store-table th {
        border: 1px solid #999;
        padding: 5px 10px;
    }
    .amilia-store-table svg.jersey {
        height: 18px;
    }
    .amilia-store-table .team {
        min-width: 200px;
    }
    .amilia-store-table .staff {
        max-width: 150px;
    }
    .amilia-store-table a.team {
        color: #000;
    }
    .amilia-store-table-legend {
        font-style: italic;
    }
    .amilia-store-standings-container h3 {
        clear: both;
    }
    .amilia-store-standings-container h3 .add-to-calendar {
        float: right;
        font-size: 90%;
        font-weight: normal;
    }
    .amilia-store-standings-container h3 .add-to-calendar svg {
        height: 18px;
    }
    .qtip.amilia-store-standings a.team {
        color: #000;
        line-height: 24px;
    }
    .qtip.amilia-store-standings svg.jersey {
        height: 18px;
    }
</style>
<div class="amilia-store-standings-container" id="amilia-store-standings-container-$uid">
EOD;
    if (strpos($show, 'standings') !== false) $html .=  <<<EOD
    <h3>$standings <a href="#" class="add-to-calendar">$calendarSvg $label_AddToCalendar</a></h3>
    <table class="amilia-store-table standings">
        <thead>
            <tr>
                <th class="team">$label_Team</th>
                <th>$label_GP</th>
                <th>$label_W</th>
                <th>$label_L</th>
                <th>$label_T</th>
EOD;
    if ($sport == 'football') {
        $html .= <<<EOD
                <th>$label_Perc</th>
                <th>$label_PDiff</th>
EOD;
    } else {
        $html .= <<<EOD
                <th>$label_F</th>
                <th>$label_A</th>
                <th>$label_GD</th>
EOD;
    }
    $html .= <<<EOD
                <th>$label_Pts</th>
            </tr>
        </thead>
        <tbody>
            <tr><td colspan="9" style="text-align:center;font-style:italic;">$pleaseWait</td></tr>
        </tbody>
    </table>
    <p class="amilia-store-table-legend">$legend</p>
EOD;
    if (strpos($show, 'schedule') !== false) $html .=  <<<EOD
    <h3>$games <a href="#" class="add-to-calendar">$calendarSvg $label_AddToCalendar</a></h3>
    <table class="amilia-store-table games">
        <thead>
            <tr>
                <th class="location">$label_Location</th>
                <th class="date">$label_Date</th>
EOD;
    if ($showStaff) $html .=  <<<EOD
                <th class="staff">$label_Officials</th>
EOD;
    $html .=  <<<EOD
                <th>$label_Home</th>
                <th>$label_Away</th>
            </tr>
        </thead>
        <tbody>
            <tr><td colspan="4" style="text-align:center;font-style:italic;">$pleaseWait</td></tr>
        </tbody>
    </table>
EOD;
    $html .=  <<<EOD
    <p class="warnings"></p>
</div>
EOD;

    return $html;
}
add_shortcode('amilia_store_standings', 'amilia_store_standings_shortcode_handler');

?>
window.amiliaStoreCalendar = function(options) {
  function renderError(error) {
    document.getElementById('amilia-store-calendar-'+options.uid).innerHTML = error;
  }
  if (!window.jQuery) {
    renderError(options.errorWhenNojQuery);
    return;
  }
  var api = options.api;
  var eventsUrl = api + 'Events';
  var tagIds = options.tags;
  var showTagsFilter = options.tagsfilter == 1;
  var facilityIds = options.facilities;
  var showFacilitiesFilter = options.facilitiesfilter == 1;
  var tags, facilities, resources;
  var calendarDiv = jQuery('#amilia-store-calendar-'+options.uid);
  var facilitiesSelect = jQuery('#amilia-store-calendar-facilities-'+options.uid);
  var tagsSelect = jQuery('#amilia-store-calendar-tags-'+options.uid);
  var showStaff = options.showStaff;
  var showHidden = options.showHidden;
  var defaultView = options.view;
  var defaultDate = options.date;
  var scrollTime = options.time;
  var label_AddToCalendar = options.label_AddToCalendar;
  var label_Officials = options.label_Officials;
  var label_ShowOfficials = options.label_ShowOfficials;
  var label_HideOfficials = options.label_HideOfficials;
  var label_ViewInStore = options.label_ViewInStore;
  var inlineOfficials = false;

  function getArrayOfIntsFromSelect(el) {
    var ints = el.val() || [];
    for (var i = 0; i < ints.length; i++) ints[i] = parseInt(ints[i], 10);
      return ints;
  }

  function addChildrenIdsToFacilityIds(fids) {
    if (!fids || !fids.length || !facilities || !facilities.length) return fids;
    var idsToAdd = [];
    for (var i = 0; i < facilities.length; i++) {
      var facility = facilities[i];
      for (var j = 0; j < fids.length; j++) {
        var fid = fids[j];
        if (facility.AncestorIds.indexOf(fid) >= 0 && idsToAdd.indexOf(facility.Id) === -1)
          idsToAdd.push(facility.Id);
      }
    }
    return fids.concat(idsToAdd);
  }

  function getColorFromActivityName(name) {
    if(!name){
			return null;
		}
    var match = name.match(/\:([a-z]+|#[0-9a-f]{6}|#[0-9a-f]{3})\s*$/i);
    return match && match.length == 2 ? match[1] : null;
  }
  function removeColorFromActivityName(name) {
    if(!name){
			return name;
		}
    return name.replace(/\:[a-z]+|\:#[0-9a-f]{6}|\:#[0-9a-f]{3}/i, '');
  }
  function getDisplayNameFromEvent(event) {
    return removeColorFromActivityName(event.ExtraInformation) || event.ActivityName;
  }
  function invertColor(hex) {
    if (!hex) return '#FFFFFF';
    if (hex.indexOf('#') === 0) hex = hex.slice(1);
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};
    if (colors[hex.toLowerCase()]) hex = colors[hex.toLowerCase()].slice(1);
    if (hex.length != 6) return '#FFFFFF';
    var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
  }
  function getStaffNamesFromEvent(event) {
    if (!event.Staff || event.Staff.length == 0) return null;
    return event.Staff.map(function(o) {return o.Name;}).join(', ');
  }
  function getNowHour() {
    var nowHour = (new Date()).getHours();
    return (nowHour < 10 ? ('0'+nowHour) : nowHour) + ':00:00';
  }

  function render() {
    if (facilityIds.length && facilities.length) {
      resources = [];
      var facilitiesForSelect = [];
      for (var i = 0; i < facilities.length; i++) {
        if (facilityIds.indexOf(facilities[i].Id) >= 0) {
          resources.push({id: facilities[i].Id, title: facilities[i].Name});
          facilitiesForSelect.push(facilities[i]);
        }
      }
      resources.sort(function(a,b) {
        var _a = a.title.toLowerCase();
        var _b = b.title.toLowerCase();
        if (_a == _b) return 0;
        if (_a > _b) return 1;
        return -1;
      });
      if (showFacilitiesFilter) {
        facilitiesSelect.selectize({
          allowEmptyOption: true,
          options: facilitiesForSelect,
          valueField: 'Id',
          labelField: 'FullName',
          searchField: 'FullName',
          onChange: function() {
            calendarDiv.fullCalendar('refetchResources');
            calendarDiv.fullCalendar('refetchEvents');
          }
        });
      }
    }

    if (tagIds.length && tags.length && showTagsFilter) {
      var tagsForSelect = [];
      for (var i = 0; i < tags.length; i++) {
        if (tagIds.indexOf(tags[i].Id) >= 0) {
          tagsForSelect.push(tags[i]);
        }
      }
      tagsSelect.selectize({
        allowEmptyOption: true,
        options: tagsForSelect,
        valueField: 'Id',
        labelField: 'Name',
        searchField: 'Name',
        onChange: function() {
          calendarDiv.fullCalendar('refetchEvents');
        }
      });
    }

    calendarDiv.fullCalendar({
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      defaultView: defaultView,
      defaultDate: defaultDate,
      minTime: scrollTime ? undefined : getNowHour(),
      scrollTime: scrollTime ? scrollTime : undefined,
      events: function(start, end, timezone, callback) {
        var url = eventsUrl + '?start=' + start.format('YYYY-MM-DD') + '&end=' + end.format('YYYY-MM-DD') + '&offline=true' + (showHidden ? '&showHidden=true' : '');
        jQuery.get(url).done(function(data) {
          for (var i = 0; i < data.length; i++) {
            var event = data[i];
            event.color = getColorFromActivityName(event.ExtraInformation) || '#46aaf8';
            event.textColor = invertColor(event.color);
            event.title = getDisplayNameFromEvent(event);
            if (inlineOfficials) {
              var staff = getStaffNamesFromEvent(event);
              if (staff) event.title += ' (' + staff + ')';
            }
          }

          if (facilityIds.length == 0 && tagIds.length == 0) {
            callback(data);
            return;
          }

          var tids = tagIds;
          if (tagsSelect.length) tids = getArrayOfIntsFromSelect(tagsSelect);
          var fids = facilityIds;
          if (facilitiesSelect.length) fids = getArrayOfIntsFromSelect(facilitiesSelect);
          fids = addChildrenIdsToFacilityIds(fids);
          var events = [];
          for (var i = 0; i < data.length; i++) {
            var event = data[i];
            var okForTags = tids.length ? false : true;
            if (tids.length && event.Tags) {
              for (var j = 0; j < event.Tags.length; j++) {
                if (tids.indexOf(event.Tags[j].Id) >= 0) {
                  okForTags = true;
                  break;
                }
              }
            }
            var okForFacilities = fids.length ? false : true;
            if (fids.length && event.Facilities) {
              for (var j = 0; j < event.Facilities.length; j++) {
                if (fids.indexOf(event.Facilities[j].Id) >= 0) {
                  okForFacilities = true;
                  break;
                }
              }
            }
            if (okForTags && okForFacilities) events.push(event);
          }

          callback(events);
        });
      },
      eventClick: function(event, e) {
        e.preventDefault();
        jQuery(e.currentTarget).qtip('show');
      },
      resources: function(callback) {
        var selectedResources = resources;
        var fids = [];
        if (facilitiesSelect.length) fids = getArrayOfIntsFromSelect(facilitiesSelect);
        if (fids && fids.length) {
          selectedResources = [];
          for (var i = 0; i < resources.length; i++)
            if (fids.indexOf(resources[i].id) >= 0) selectedResources.push(resources[i]);
        }
        callback(selectedResources);
      },
      customButtons: showStaff ? {
        toggleStaff: {
          text: label_ShowOfficials,
          click: function(e) {
            inlineOfficials = !inlineOfficials;
            jQuery(e.currentTarget).text(inlineOfficials ? label_HideOfficials : label_ShowOfficials);
            calendarDiv.fullCalendar('refetchEvents');
          }
        }
      } : undefined,
      header: {
        left: 'month,agendaWeek,agendaDay,listDay',
        center: 'title',
        right: showStaff ? 'toggleStaff,prev,next' : 'prev,next'
      },
      eventRender(event, element) {
        var parentNames = [];
        var icalUrl = api + '/Activities/' + event.ActivityId + '/ICalendar';
        if (event.ProgramName != event.CategoryName) parentNames.push(event.ProgramName);
        if (event.CategoryName != event.SubCategoryName) parentNames.push(event.CategoryName);
        if (event.SubCategoryName != event.ActivityName) parentNames.push(event.SubCategoryName);
        var html = '<p><b>' + getDisplayNameFromEvent(event) + '</b>';
        if (parentNames.length) html += '<br/>' + parentNames.join(', ');
        html += '<br/>' + element.find('.fc-time').text() + '</p>';
        if (showStaff) {
          var staff = getStaffNamesFromEvent(event);
          if (staff) html += '<p>' + label_Officials + ': ' + staff + '</p>';
        }
        html += '<p>' + event.Location + '</p>';
        html += '<p style="clear:both; min-width:200px;">';
        if (event.url) html +='<a href="' + event.url + '" target="_blank" style="float:left;">' + label_ViewInStore + '</a>';
        html += '<a href="' + icalUrl + '" style="float:right;">' + label_AddToCalendar + '</a>';
        html += '</p>';
        element.qtip({
          content: {
            text: html
          },
          style: {
            classes: 'qtip-bootstrap'
          },
          position: {
            viewport: jQuery(window)
          },
          hide: 'unfocus',
          show: false
        });
      }
    });
  }

  jQuery.get(api+'Tags')
  .done(function(result) {
    tags = result;
    jQuery.get(api+'Facilities')
    .done(function(result) {
      facilities = result;
      render();
    })
    .fail(function(xhr, textStatus) {
      renderError(xhr.statusText || textStatus);
    });
  })
  .fail(function(xhr, textStatus) {
    renderError(xhr.statusText || textStatus);
  });
};
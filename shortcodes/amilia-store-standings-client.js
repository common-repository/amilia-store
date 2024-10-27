window.amiliaStoreStandings = function(options) {
	var uid = options.uid;
	function renderError(error) {
		console.log(error);
		document.getElementById('amilia-store-standings-container-'+uid).innerHTML = error;
	}

	if (!window.jQuery && !options.noRender) {
		renderError(options.errorWhenNojQuery);
		return;
	}

	if(options && options.api && options.api.indexOf('amilia.com') > -1 && window.location.href.indexOf('localhost') > -1){
		options.api = options.api.replace("https://www.amilia.com", "http://www.amilia.localhost");
	}

	var api = options.api;
	var sport = options.sport;
	var tagIds = options.tags;
	var eventsUrl = api + 'Events';
	var events = [];
	var programId = options.program;
	var subCategoryId = options.subCategory;
	var showHidden = options.showHidden;
	var showStaff = options.showStaff;
	var show = options.show || 'standings,schedule';
	if (typeof programId != 'number' && typeof programId != 'string') {
		renderError(options.errorNoProgram);
		return;
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
	function formatGameDateTime(start, end) {

		if (typeof moment !== "undefined"){
			var startDate = moment(start).format('ddd MMM D');
			var startTime = moment(start).format('h:mmA');
			var endDate = moment(end).subtract('minutes', 1).format('ddd MMM D');
			var endTime = moment(end).format('h:mmA');
			return startDate + ' @ ' + startTime + (startDate != endDate ? (' - ' + endDate + ' @ ' + endTime) : '');
		}else {
			return new Date(start)  + ' ' + Date(end);
		}

	}
	function buildParentName(event) {
		var parentNames = [];
		if (event.ProgramName != event.CategoryName) parentNames.push(event.ProgramName);
		if (event.CategoryName != event.SubCategoryName) parentNames.push(event.CategoryName);
		if (event.SubCategoryName != event.ActivityName) parentNames.push(event.SubCategoryName);
		return parentNames.join(', ');
	}
	function buildTooltipeTitle(team) {
		var html = '<p>' + team.Name + '<br/>' + team.ParentName + '</p>';
		html += '<p style="clear:both; min-width:200px;">';
		if (team.Url) html +='<a href="' + team.Url + '" target="_blank" style="float:left;">' + options.label_ViewInStore + '</a>';
		html += '<a href="' + team.ICalendarUrl + '" style="float:right;">' + options.label_AddToCalendar + '</a>';
		html += '</p>';
		return escape(html);
	}
	function buildJerseySvg(color) {
		return '<svg xmlns="http://www.w3.org/2000/svg" class="jersey" viewBox="0 0 640 512"><path fill="currentColor" stroke="black" stroke-width="10" d="M631.2 96.5L436.5 0C416.4 27.8 371.9 47.2 320 47.2S223.6 27.8 203.5 0L8.8 96.5c-7.9 4-11.1 13.6-7.2 21.5l57.2 114.5c4 7.9 13.6 11.1 21.5 7.2l56.6-27.7c10.6-5.2 23 2.5 23 14.4V480c0 17.7 14.3 32 32 32h256c17.7 0 32-14.3 32-32V226.3c0-11.8 12.4-19.6 23-14.4l56.6 27.7c7.9 4 17.5.8 21.5-7.2L638.3 118c4-7.9.8-17.6-7.1-21.5z"></path></svg>'.replace('currentColor', color);
	}
	function getStaffNamesFromEvents(event1, event2) {
		var staff = [];
		if (event1.Staff && event1.Staff)
			event1.Staff.forEach(function(o) {
				staff.push(o.Name);
			});
		if (event2.Staff && event1.Staff)
			event2.Staff.forEach(function(o) {
				if (staff.indexOf(o.Name) === -1) staff.push(o.Name);
			});
		return staff;
	}

	function getDataFromEvents(events){

		var ids = [];
		var id2team = {};
		var games = [];
		var game2events = {};
		var warnings = [];
		var gamesHtml = '';
		var gamesData = [];
		for (var i = 0; i < events.length; i++) {
			var event = events[i];

			//if(!event.Location){
				// if event has no location, we continue
			//	continue;
			//}

			if (subCategoryId && event.SubCategoryId != subCategoryId) continue;
			if (tagIds && tagIds.length) {
				var found = false;
				for (var t = 0; t < event.Tags.length; t++) {
					if (tagIds.indexOf(event.Tags[t].Id) >= 0) {
						found = true;
						break;
					}
				}
				if (!found) continue;
			}

			// adding teams - if id already in team so team will remain in the id..
			var id = event.ActivityId;
			if (ids.indexOf(id) === -1) ids.push(id);
			var team;
			if (id2team[id]) {
				team = id2team[id];
			} else {
				team = {
					Name: getDisplayNameFromEvent(event),
					ActivityName: event.ActivityName,
					ParentName: buildParentName(event),
					Url: event.url,
					ICalendarUrl: api + '/Activities/' + event.ActivityId + '/ICalendar',
					Color: getColorFromActivityName(event.ExtraInformation) || '#ccc',
					GP: 0,
					W: 0,
					L: 0,
					T: 0,
					GD: 0,
					Pts: 0,
					// Soccer
					F: 0,
					A: 0,
					ExtraInformation: event.ExtraInformation,
					// Football
					Perc: 0,
					SubCategoryName: event.SubCategoryName,
					SubCategoryId: event.SubCategoryId,
					CategoryName: event.CategoryName,
					CategoryId: event.CategoryId,
					games: [],
					id: event.ActivityId,
					occurance: event.id,
					Event: event
				};
				id2team[id] = team;
			}

			game = event.Location + ': ' + formatGameDateTime(event.start, event.end) + ' ' + (options.gamesByCategory ? event.SubCategoryName : null);

			if (!game2events[game]) {
				game2events[game] = [];
				games.push(game);
			}
			game2events[game].push(event);
		}

		for (var i = 0; i < games.length; i++) {
			var game = games[i];

			if (game2events[game].length == 2 && game2events[game][0].Location) {
				var event1 = game2events[game][0];
				var event2 = game2events[game][1];

				if(event2.IsHome && event2.IsHome){ // switching Home
					var temp = game2events[game][0];
					event1 = game2events[game][1];
					event2 = temp;
				}

				var team1 = id2team[event1.ActivityId];
				var team2 = id2team[event2.ActivityId];

				var goals1 = event1.AttendanceSummary && event1.AttendanceSummary.ValueCounts && event1.AttendanceSummary.ValueCounts.GOAL ? event1.AttendanceSummary.ValueCounts.GOAL : 0;
				var goals2 = event2.AttendanceSummary && event2.AttendanceSummary.ValueCounts && event2.AttendanceSummary.ValueCounts.GOAL ? event2.AttendanceSummary.ValueCounts.GOAL : 0;
				var gamePlayed = goals1 || goals2 ||
				(event1.AttendanceSummary && event1.AttendanceSummary.StatusCounts && event1.AttendanceSummary.StatusCounts.Present &&
					event2.AttendanceSummary && event2.AttendanceSummary.StatusCounts && event2.AttendanceSummary.StatusCounts.Present);
				team1.GP += gamePlayed ? 1 : 0;
				team2.GP += gamePlayed ? 1 : 0;
				if (goals1 == goals2 && gamePlayed) {
					team1.T += 1;
					team2.T += 1;
					team1.Pts += 1;
					team2.Pts += 1;
				} else if (goals1 < goals2) {
					team1.L += 1;
					team2.W += 1;
					team2.Pts += sport == 'football' ? 2 : 3;
				} else if (goals1 > goals2) {
					team2.L += 1;
					team1.W += 1;
					team1.Pts += sport == 'football' ? 2 : 3;
				}
				team1.F += goals1;
				team2.F += goals2;
				team1.A += goals2;
				team2.A += goals1;

				var location = (event1.Location || "").split('|')[0].trim();

				// adding game to team
				team1.games.push({
					goals: goals1,
					opponent: event2.ActivityId,
					event: game2events[game]
				});

				team2.games.push({
					goals: goals2,
					opponent: event1.ActivityId,
					event: game2events[game]
				});

				team1.goals = goals1;
				team2.goals = goals2;

				gamesData.push({
					location: location,
					locationId: event1.resourceId,
					start: event1.start,
					end: event1.end,
					goals1: goals1,
					goals2: goals2,
					SubCategoryName: event1.SubCategoryName,
					SubCategoryId: event1.SubCategoryId,
					CategoryName: event1.CategoryName,
					CategoryId: event1.CategoryId,
					teamOccurance1: event1.id,
					teamOccurance2: event2.id,
					teamId1: team1.id,
					teamId2: team2.id,
					events: [event1, event2],
					teams: [team1 ,team2], // maybe we will have many teams playing
					gamePlayed: gamePlayed,
					state: event1.state,
					Day: event1.Day
				});

				gamesHtml += '<tr>' +
				'<td>' + location + '</td>' +
				'<td>' + formatGameDateTime(event1.start, event1.end) + '</td>' +
				(showStaff ? ('<td class="staff">' + getStaffNamesFromEvents(event1, event2).join(', ') + '</td>') : '') +
				'<td><a href="#" class="team" title="' + buildTooltipeTitle(team1) + '">' + buildJerseySvg(team1.Color) + ' ' + team1.Name + '</a> ' + (gamePlayed ? ('<strong>'+goals1+'</strong>') : '') + '</td>' +
				'<td><a href="#" class="team" title="' + buildTooltipeTitle(team2) + '">' + buildJerseySvg(team2.Color) + ' ' + team2.Name + '</a> ' + (gamePlayed ? ('<strong>'+goals2+'</strong>') : '') + '</td>' +
				'</tr>';

			} else if(game2events[game][0].Location) {
				var names = [];
				for (var t = 0; t < game2events[game].length; t++)
					names.push(id2team[game2events[game][t].ActivityId].Name);
				warnings.push(game + ' => ' + names.join(', '));
			}
		}

		var teams = [];

		for (var i = 0; i < ids.length; i++) {
			var team = id2team[ids[i]];
			team.GD = team.F - team.A;
			team.Perc = (team.W + team.T/2) / (team.W + team.T + team.L);
			if (isNaN(team.Perc)) team.Perc = 0;
			teams.push(team);
		}
		if (sport == 'football')
			teams.sort(function(a, b) {
				if (a.Pts == b.Pts) {
					if (a.GD == b.GD) return 0;
					return a.GD < b.GD ? 1 : -1;
				}
				return a.Pts < b.Pts ? 1 : -1;
			});
		else
			teams.sort(function(a, b) {
				if (a.Pts == b.Pts) {
					if (a.F == b.F) {
						if (a.GD == b.GD) return 0;
						return a.GD < b.GD ? 1 : -1;
					}
					return a.F < b.F ? 1 : -1;
				}
				return a.Pts < b.Pts ? 1 : -1;
			});

		return {
			ids: ids,
			id2team: id2team,
			games: games,
			game2events: game2events,
			warnings: warnings,
			gamesHtml: gamesHtml,
			gamesData: gamesData,
			teams: teams
		}
	}

	function renderStandings() {
		var containerEl = jQuery('#amilia-store-standings-container-'+uid);
		var standingsTbodyEl = containerEl.find('table.standings tbody');
		var gamesTbodyEl = containerEl.find('table.games tbody');
		var warningsEl = containerEl.find('p.warnings');

		var data = getDataFromEvents(events);

		var ids = data.ids;
		var id2team = data.id2team;
		var warnings = data.warnings;
		var gamesHtml = data.gamesHtml;
		var teams = data.teams;

		if (show.indexOf('schedule') >= 0) gamesTbodyEl.html(gamesHtml);

		var html = '';
		var addToCalendarTooltipHtml = '';
		for (var i = 0; i < teams.length; i++) {
			var team = teams[i];
			html += '<tr>' +
			'<td class="team"><a href="#" class="team" title="' + buildTooltipeTitle(team) + '">' + buildJerseySvg(team.Color) + ' ' + team.Name + '</a></td>' +
			'<td>' + team.GP + '</td>' +
			'<td>' + team.W + '</td>' +
			'<td>' + team.L + '</td>' +
			'<td>' + team.T + '</td>';
			if (sport == 'football') {
				html += '<td>' + (team.Perc ? Math.round(1000*team.Perc)/1000 : '-') + '</td>';
			} else {
				html += '<td>' + team.F + '</td>' +
				'<td>' + team.A + '</td>';
			}
			html += '<td>' + team.GD + '</td>' +
			'<td>' + team.Pts + '</td>' +
			'</tr>';
			addToCalendarTooltipHtml +=
			'<a href="' + team.ICalendarUrl + '" class="team">' + buildJerseySvg(team.Color) + ' ' + team.Name + '</a>' +
			'</br>';
		}
		if (show.indexOf('standings') >= 0) standingsTbodyEl.html(html);

		if (warnings.length) {
			html = '<strong>' + options.warning + '</strong> ' + options.warningMsg + '<br/>' + warnings.join('<br/>');
			warningsEl.html(html);
		}

		jQuery('#amilia-store-standings-container-' + uid + ' a.add-to-calendar').each(function() {
			jQuery(this).qtip({
				content: {
					text: addToCalendarTooltipHtml
				},
				style: {
					classes: 'qtip-bootstrap amilia-store-standings'
				},
				position: {
					viewport: jQuery(window)
				},
				hide: 'unfocus',
				show: false
			})
			.click(function(e) {
				e.preventDefault();
				jQuery(e.currentTarget).qtip('show');
			});
		});

	}

	function bindTooltips() {
		jQuery('#amilia-store-standings-container-' + uid + ' a.team').each(function() {
			var el = jQuery(this);
			el.qtip({
				content: {
					text: unescape(el.attr('title'))
				},
				style: {
					classes: 'qtip-bootstrap'
				},
				position: {
					viewport: jQuery(window)
				},
				hide: 'unfocus',
				show: false
			})
			.click(function(e) {
				e.preventDefault();
				jQuery(e.currentTarget).qtip('show');
			});
		});
	}

	if (!options.noRender) {
		var fetchCount = 0;
		var fetchMaxCount = 10;
		function fetchNextEvents(start, end) {
			if (start.isSame(end) || start.isAfter(end)) {
				bindTooltips();
				return;
			}

			var cursor = moment(start);
			cursor.add(1, 'M');
			if (cursor.isAfter(end)) cursor = end;
			var url = eventsUrl + '?start=' + start.format('YYYY-MM-DD') + '&end=' + cursor.format('YYYY-MM-DD') + '&onlyTeam=true&programId=' + programId + (showHidden ? '&showHidden=true' : '');
			jQuery.get(url)
			.done(function(data) {
				if (!data) return;
				for (var i = 0; i < data.length; i++) {
					var event = data[i];
					events.push(event);
				}
				renderStandings();
				fetchCount += 1;
				if (fetchCount == fetchMaxCount || cursor.isSame(end)) {
					bindTooltips();
					return;
				}
				fetchNextEvents(cursor, end);
			});
		}

		jQuery.get(api + 'Programs/' + programId)
		.done(function(result) {
			fetchNextEvents(moment(result.Start), moment(result.End));
		})
		.fail(function(xhr, textStatus) {
			renderError(xhr.statusText || textStatus);
		});
	}

	return {
		getDataFromEvents: getDataFromEvents
	}
};

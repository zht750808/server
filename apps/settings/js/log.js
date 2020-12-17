/**
 *
 *
 * @author Bernhard Posselt <dev@bernhard-posselt.com>
 * @author Christopher Schäpers <kondou@ts.unde.re>
 * @author Georg Ehrke <oc.list@georgehrke.com>
 * @author Jan-Christoph Borchardt <hey@jancborchardt.net>
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
 * @author Lukas Reschke <lukas@statuscode.ch>
 * @author Michael Gapczynski <GapczynskiM@gmail.com>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Robin Appelman <robin@icewind.nl>
 * @author Stephane V <stephane@vergeylen.eu>
 * @author Thomas Müller <thomas.mueller@tmit.eu>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/* global formatDate */

OC.Log = {
	reload: function (count) {
		if (!count) {
			count = OC.Log.loaded;
		}
		OC.Log.loaded = 0;
		$('#log tbody').empty();
		OC.Log.getMore(count);
	},
	levels: ['Debug', 'Info', 'Warning', 'Error', 'Fatal'],
	loaded: 3,//are initially loaded
	getMore: function (count) {
		count = count || 10;
		$.get(OC.generateUrl('/settings/admin/log/entries'), {offset: OC.Log.loaded, count: count}, function (result) {
			OC.Log.addEntries(result.data);
			if (!result.remain) {
				$('#moreLog').hide();
			}
			$('#lessLog').show();
		});
	},
	showLess: function (count) {
		count = count || 10;
		//calculate remaining items - at least 3
		OC.Log.loaded = Math.max(3, OC.Log.loaded - count);
		$('#moreLog').show();
		// remove all non-remaining items
		$('#log tr').slice(OC.Log.loaded).remove();
		if (OC.Log.loaded <= 3) {
			$('#lessLog').hide();
		}
	},
	addEntries: function (entries) {
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			var row = $('<tr/>');
			var levelTd = $('<td/>');
			levelTd.text(OC.Log.levels[entry.level]);
			row.append(levelTd);

			var appTd = $('<td/>');
			appTd.text(entry.app);
			row.append(appTd);

			var messageTd = $('<td/>');
			messageTd.addClass('log-message');
			messageTd.text(entry.message);
			row.append(messageTd);

			var timeTd = $('<td/>');
			timeTd.addClass('date');
			if (isNaN(entry.time)) {
				timeTd.text(entry.time);
			} else {
				timeTd.text(formatDate(entry.time * 1000));
			}
			row.append(timeTd);

			var userTd = $('<td/>');
			userTd.text(entry.user);
			row.append(userTd);

			$('#log').append(row);
		}
		OC.Log.loaded += entries.length;
	}
};

window.addEventListener('DOMContentLoaded', function () {
	$('#moreLog').click(function () {
		OC.Log.getMore();
	});
	$('#lessLog').click(function () {
		OC.Log.showLess();
	});
});

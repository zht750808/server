/**
 *
 *
 * @author Arthur Schiwon <blizzz@arthur-schiwon.de>
 * @author Daniel Kesselberg <mail@danielkesselberg.de>
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
 * @author Vincent Petry <vincent@nextcloud.com>
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
OC.Settings = OC.Settings || {};
OC.Settings = _.extend(OC.Settings, {

	_cachedGroups: null,

	escapeHTML: function (text) {
		return text.toString()
			.split('&').join('&amp;')
			.split('<').join('&lt;')
			.split('>').join('&gt;')
			.split('"').join('&quot;')
			.split('\'').join('&#039;');
	},

	/**
     * Setup selection box for group selection.
     *
     * Values need to be separated by a pipe "|" character.
     * (mostly because a comma is more likely to be used
     * for groups)
     *
     * @param $elements jQuery element (hidden input) to setup select2 on
     * @param {Array} [extraOptions] extra options hash to pass to select2
     * @param {Array} [options] extra options
     * @param {Array} [options.excludeAdmins=false] flag whether to exclude admin groups
     */
	setupGroupsSelect: function($elements, extraOptions, options) {
		var self = this;
		options = options || {};
		if ($elements.length > 0) {
			// Let's load the data and THEN init our select
			$.ajax({
				url: OC.linkToOCS('cloud/groups', 2) + 'details',
				dataType: 'json',
				success: function(data) {
					var results = [];

					if (data.ocs.data.groups && data.ocs.data.groups.length > 0) {

						data.ocs.data.groups.forEach(function(group) {
							if (!options.excludeAdmins || group.id !== 'admin') {
								results.push({ id: group.id, displayname: group.displayname });
							}
						})

						// note: settings are saved through a "change" event registered
						// on all input fields
						$elements.select2(_.extend({
							placeholder: t('core', 'Groups'),
							allowClear: true,
							multiple: true,
							toggleSelect: true,
							separator: '|',
							data: { results: results, text: 'displayname' },
							initSelection: function(element, callback) {
								var groups = $(element).val();
								var selection;
								if (groups && results.length > 0) {
									selection = _.map(_.filter((groups || []).split('|').sort(), function(groupId) {
										return results.find(function(group) {
											return group.id === groupId
										}) !== undefined
									}), function(groupId) {
										return {
											id: groupId,
											displayname: results.find(function(group) {
												return group.id === groupId
											}).displayname
										}
									})
								} else if (groups) {
									selection = _.map((groups || []).split('|').sort(), function(groupId) {
										return {
											id: groupId,
											displayname: groupId
										};
									});
								}
								callback(selection);
							},
							formatResult: function(element) {
								return self.escapeHTML(element.displayname);
							},
							formatSelection: function(element) {
								return self.escapeHTML(element.displayname);
							},
							escapeMarkup: function(m) {
								// prevent double markup escape
								return m;
							}
						}, extraOptions || {}));
					} else {
						OC.Notification.show(t('settings', 'Group list is empty'), { type: 'error' });
						console.log(data);
					}
				},
				error: function(data) {
					OC.Notification.show(t('settings', 'Unable to retrieve the group list'), { type: 'error' });
					console.log(data);
				}
			});
		}
	}
});

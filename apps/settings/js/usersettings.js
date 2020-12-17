/**
 *
 *
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
 * @author Joas Schilling <coding@schilljs.com>
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

/**
 * Copyright (c) 2016, Christoph Wurst <christoph@owncloud.com>
 *
 * This file is licensed under the Affero General Public License version 3 or later.
 * See the COPYING-README file.
 */

(function() {
	'use strict';

	/**
	 * Model for storing and saving user settings
	 *
	 * @class UserSettings
	 */
	var UserSettings = OC.Backbone.Model.extend({
		url: OC.generateUrl('/settings/users/{id}/settings', {id: OC.currentUser}),
		isNew: function() {
			return false; // Force PUT on .save()
		},
		parse: function(data) {
			if (_.isUndefined(data)) {
				return null;
			}

			if (data.status && data.status === 'error') {
				OC.Notification.show(data.data.message, { type: 'error' });
			}

			if (_.isUndefined(data.data)) {
				return null;
			}
			data = data.data;

			var ignored = [
				'userId',
				'message'
			];

			_.each(ignored, function(ign) {
				if (!_.isUndefined(data[ign])) {
					delete data[ign];
				}
			});

			return data;
		}
	});

	OC.Settings = OC.Settings || {};

	OC.Settings.UserSettings = UserSettings;
})();

/**
 *
 *
 * @author Björn Schießle <bjoern@schiessle.org>
 * @author Clark Tomlinson <fallen013@gmail.com>
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
 * @author Thomas Müller <thomas.mueller@tmit.eu>
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

/**
 * @namespace
 * @memberOf OC
 */
OC.Encryption = _.extend(OC.Encryption || {}, {
	displayEncryptionWarning: function () {
		if (!OC.currentUser || !OC.Notification.isHidden()) {
			return;
		}

		$.get(
			OC.generateUrl('/apps/encryption/ajax/getStatus'),
			function (result) {
				if (result.status === "interactionNeeded") {
					OC.Notification.show(result.data.message);
				}
			}
		);
	}
});
window.addEventListener('DOMContentLoaded', function() {
	// wait for other apps/extensions to register their event handlers and file actions
	// in the "ready" clause
	_.defer(function() {
		OC.Encryption.displayEncryptionWarning();
	});
});

/**
 *
 *
 * @author Joas Schilling <coding@schilljs.com>
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author mrtnmtth <mrtn.mtth@gmx.de>
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
 * This only gets loaded if an update is available and the notifications app is not enabled for the user.
 */
window.addEventListener('DOMContentLoaded', function(){
	var text = t('core', '{version} is available. Get more information on how to update.', {version: oc_updateState.updateVersion}),
		element = $('<a>').attr('href', oc_updateState.updateLink).attr('target','_blank').text(text);

	OC.Notification.showHtml(element.prop('outerHTML'), { type: 'error' });
});

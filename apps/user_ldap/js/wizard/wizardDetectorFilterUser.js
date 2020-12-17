/**
 *
 *
 * @author Arthur Schiwon <blizzz@arthur-schiwon.de>
 * @author Morris Jobke <hey@morrisjobke.de>
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

OCA = OCA || {};

(function() {

	/**
	 * @classdesc a Port Detector. It executes the auto-detection of the port
	 * by the Nextcloud server, if requirements are met.
	 *
	 * @constructor
	 */
	var WizardDetectorFilterUser = OCA.LDAP.Wizard.WizardDetectorFilterSimpleRequestAbstract.subClass({
		init: function() {
			this.setTrigger([
				'ldap_userfilter_groups',
				'ldap_userfilter_objectclass'
			]);
			this.setTargetKey('ldap_userlist_filter');
			this.runsOnRequest = true;

			this.wizardMethod = 'getUserListFilter';
		}
	});

	OCA.LDAP.Wizard.WizardDetectorFilterUser = WizardDetectorFilterUser;
})();

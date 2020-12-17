/**
 *
 *
 * @author Arthur Schiwon <blizzz@arthur-schiwon.de>
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
	 * @classdesc let's the wizard backend count the available users
	 *
	 * @constructor
	 */
	var WizardDetectorEmailAttribute = OCA.LDAP.Wizard.WizardDetectorFilterSimpleRequestAbstract.subClass({
		init: function() {
			this.setTargetKey('ldap_user_count');
			this.wizardMethod = 'detectEmailAttribute';
			this.runsOnRequest = true;
		},

		/**
		 * @inheritdoc
		 */
		run: function(model, configID) {
			if(model.configuration.ldap_email_attr) {
				// a value is already set. Don't overwrite and don't ask LDAP
				// without reason.
				return false;
			}
			this._super(model, configID);
		}
	});

	OCA.LDAP.Wizard.WizardDetectorEmailAttribute = WizardDetectorEmailAttribute;
})();

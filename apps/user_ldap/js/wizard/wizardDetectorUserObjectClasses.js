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
	 * @classdesc discovers object classes for the users tab
	 *
	 * @constructor
	 */
	var WizardDetectorUserObjectClasses = OCA.LDAP.Wizard.WizardDetectorFeatureAbstract.subClass({
		/** @inheritdoc */
		init: function() {
			// given, it is not a configuration key
			this.setTargetKey('ldap_userfilter_objectclass');
			this.wizardMethod = 'determineUserObjectClasses';
			this.featureName = 'UserObjectClasses';
			this.runsOnRequest = true;
		}
	});

	OCA.LDAP.Wizard.WizardDetectorUserObjectClasses = WizardDetectorUserObjectClasses;
})();

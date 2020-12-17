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
	 * @classdesc an Attributes Detector. It executes the auto-detection of
	 * available attributes by the Nextcloud server, if requirements are met.
	 *
	 * @constructor
	 */
	var WizardDetectorAvailableAttributes = OCA.LDAP.Wizard.WizardDetectorGeneric.subClass({
		/** @inheritdoc */
		init: function() {
			// given, it is not a configuration key
			this.setTargetKey('ldap_loginfilter_attributes');
			this.runsOnRequest = true;
		},

		/**
		 * runs the detector, if port is not set.
		 *
		 * @param {OCA.LDAP.Wizard.ConfigModel} model
		 * @param {string} configID - the configuration prefix
		 * @returns {boolean|jqXHR}
		 * @abstract
		 */
		run: function(model, configID) {
			model.notifyAboutDetectionStart(this.getTargetKey());
			var params = OC.buildQueryString({
				action: 'determineAttributes',
				ldap_serverconfig_chooser: configID
			});
			return model.callWizard(params, this.processResult, this);
		},

		/**
		 * @inheritdoc
		 */
		processResult: function(model, detector, result) {
			if(result.status === 'success') {
				var payload = {
					feature: 'AvailableAttributes',
					data: result.options[detector.getTargetKey()]
				};
				model.inform(payload);
			}
			this._super(model, detector, result);
		}
	});

	OCA.LDAP.Wizard.WizardDetectorAvailableAttributes = WizardDetectorAvailableAttributes;
})();

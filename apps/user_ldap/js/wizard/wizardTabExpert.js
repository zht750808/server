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
	 * @classdesc This class represents the view belonging to the expert tab
	 * in the LDAP wizard.
	 */
	var WizardTabExpert = OCA.LDAP.Wizard.WizardTabGeneric.subClass({
		/**
		 * initializes the instance. Always call it after initialization.
		 *
		 * @param tabIndex
		 * @param tabID
		 */
		init: function (tabIndex, tabID) {
			this._super(tabIndex, tabID);

			var items = {
				ldap_expert_username_attr: {
					$element: $('#ldap_expert_username_attr'),
					setMethod: 'setUsernameAttribute'
				},
				ldap_expert_uuid_user_attr: {
					$element: $('#ldap_expert_uuid_user_attr'),
					setMethod: 'setUserUUIDAttribute'
				},
				ldap_expert_uuid_group_attr: {
					$element: $('#ldap_expert_uuid_group_attr'),
					setMethod: 'setGroupUUIDAttribute'
				},

				//Buttons
				ldap_action_clear_user_mappings: {
					$element: $('#ldap_action_clear_user_mappings')
				},
				ldap_action_clear_group_mappings: {
					$element: $('#ldap_action_clear_group_mappings')
				}

			};
			this.setManagedItems(items);
			_.bindAll(this, 'onClearUserMappingsClick', 'onClearGroupMappingsClick');
			this.managedItems.ldap_action_clear_user_mappings.$element.click(this.onClearUserMappingsClick);
			this.managedItems.ldap_action_clear_group_mappings.$element.click(this.onClearGroupMappingsClick);
		},

		/**
		 * Sets the config model for this view and subscribes to some events.
		 * Also binds the config chooser to the model
		 *
		 * @param {OCA.LDAP.Wizard.ConfigModel} configModel
		 */
		setModel: function(configModel) {
			this._super(configModel);
			this.configModel.on('configLoaded', this.onConfigLoaded, this);
			this.configModel.on('receivedLdapFeature', this.onResultReceived, this);
		},

		/**
		 * sets the attribute to be used to create an Nextcloud ID (username)
		 *
		 * @param {string} attribute
		 */
		setUsernameAttribute: function(attribute) {
			this.setElementValue(this.managedItems.ldap_expert_username_attr.$element, attribute);
		},

		/**
		 * sets the attribute that provides an unique identifier per LDAP user
		 * entry
		 *
		 * @param {string} attribute
		 */
		setUserUUIDAttribute: function(attribute) {
			this.setElementValue(this.managedItems.ldap_expert_uuid_user_attr.$element, attribute);
		},

		/**
		 * sets the attribute that provides an unique identifier per LDAP group
		 * entry
		 *
		 * @param {string} attribute
		 */
		setGroupUUIDAttribute: function(attribute) {
			this.setElementValue(this.managedItems.ldap_expert_uuid_group_attr.$element, attribute);
		},

		/**
		 * requests clearing of all user mappings
		 */
		onClearUserMappingsClick: function() {
			this.configModel.requestWizard('ldap_action_clear_user_mappings', {ldap_clear_mapping: 'user'});
		},

		/**
		 * requests clearing of all group mappings
		 */
		onClearGroupMappingsClick: function() {
			this.configModel.requestWizard('ldap_action_clear_group_mappings', {ldap_clear_mapping: 'group'});
		},

		/**
		 * deals with the result of the Test Connection test
		 *
		 * @param {WizardTabAdvanced} view
		 * @param {FeaturePayload} payload
		 */
		onResultReceived: function(view, payload) {
			if(payload.feature === 'ClearMappings') {
				var message;
				if(payload.data.status === 'success') {
					message = t('user_ldap', 'Mappings cleared successfully!');
				} else {
					message = t('user_ldap', 'Error while clearing the mappings.');
				}
				OC.Notification.showTemporary(message);
			}
		}
	});

	OCA.LDAP.Wizard.WizardTabExpert = WizardTabExpert;
})();

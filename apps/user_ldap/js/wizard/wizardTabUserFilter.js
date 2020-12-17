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
	 * @classdesc This class represents the view belonging to the server tab
	 * in the LDAP wizard.
	 */
	var WizardTabUserFilter = OCA.LDAP.Wizard.WizardTabAbstractFilter.subClass({
		/**
		 * @inheritdoc
		 */
		init: function (fotf, tabIndex, tabID) {
			tabID = '#ldapWizard2';
			var items = {
				ldap_userfilter_objectclass: {
					$element: $('#ldap_userfilter_objectclass'),
					setMethod: 'setObjectClass',
					keyName: 'ldap_userfilter_objectclass',
					featureName: 'UserObjectClasses'
				},
				ldap_user_filter_mode: {
					setMethod: 'setFilterModeOnce'
				},
				ldap_userfilter_groups: {
					$element: $('#ldap_userfilter_groups'),
					setMethod: 'setGroups',
					keyName: 'ldap_userfilter_groups',
					featureName: 'GroupsForUsers',
					$relatedElements: $(
						tabID + ' .ldapGroupListAvailable,' +
						tabID + ' .ldapGroupListSelected,' +
						tabID + ' .ldapManyGroupsSearch'
					)
				},
				ldap_userlist_filter: {
					$element: $('#ldap_userlist_filter'),
					setMethod: 'setFilter',
					keyName: 'ldap_userlist_filter'
				},
				userFilterRawToggle: {
					$element: $('#toggleRawUserFilter')
				},
				userFilterRawContainer: {
					$element: $('#rawUserFilterContainer')
				},
				ldap_user_count: {
					$element: $('#ldap_user_count'),
					$relatedElements: $('.ldapGetUserCount'),
					setMethod: 'setCount',
					keyName: 'ldap_user_count'
				}
			};
			this.setManagedItems(items);
			this.manyGroupsSupport = true;
			this._super(fotf, tabIndex, tabID);
		},

		/**
		 * @inheritdoc
		 * @returns {Object}
		 */
		getObjectClassItem: function () {
			return this.managedItems.ldap_userfilter_objectclass;
		},

		/**
		 * @inheritdoc
		 * @returns {Object}
		 */
		getGroupsItem: function () {
			return this.managedItems.ldap_userfilter_groups;
		},

		/**
		 * @inheritdoc
		 * @returns {Object}
		 */
		getFilterItem: function () {
			return this.managedItems.ldap_userlist_filter;
		},

		/**
		 * @inheritdoc
		 * @returns {Object}
		 */
		getToggleItem: function () {
			return this.managedItems.userFilterRawToggle;
		},

		/**
		 * @inheritdoc
		 * @returns {Object}
		 */
		getRawFilterContainerItem: function () {
			return this.managedItems.userFilterRawContainer;
		},

		/**
		 * @inheritdoc
		 * @returns {Object}
		 */
		getCountItem: function () {
			return this.managedItems.ldap_user_count;
		},

		/**
		 * @inheritdoc
		 * @returns {string}
		 */
		getFilterModeKey: function () {
			return 'ldap_user_filter_mode';
		},

		/**
		 * @inheritdoc
		 */
		overrideErrorMessage: function(message, key) {
			var original = message;
			message = this._super(message, key);
			if(original !== message) {
				// we pass the parents change
				return message;
			}
			if(   key === 'ldap_userfilter_groups'
			   && message === 'memberOf is not supported by the server'
			) {
				message = t('user_ldap', 'The group box was disabled, because the LDAP / AD server does not support memberOf.');
			}
			return message;
		}

	});

	OCA.LDAP.Wizard.WizardTabUserFilter = WizardTabUserFilter;
})();

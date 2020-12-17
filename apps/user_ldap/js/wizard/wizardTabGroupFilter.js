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
	var WizardTabGroupFilter = OCA.LDAP.Wizard.WizardTabAbstractFilter.subClass({
		/**
		 * @inheritdoc
		 */
		init: function (fotf, tabIndex, tabID) {
			tabID = '#ldapWizard4';
			var items = {
				ldap_groupfilter_objectclass: {
					$element: $('#ldap_groupfilter_objectclass'),
					setMethod: 'setObjectClass',
					keyName: 'ldap_groupfilter_objectclass',
					featureName: 'GroupObjectClasses'
				},
				ldap_group_filter_mode: {
					setMethod: 'setFilterModeOnce'
				},
				ldap_groupfilter_groups: {
					$element: $('#ldap_groupfilter_groups'),
					setMethod: 'setGroups',
					keyName: 'ldap_groupfilter_groups',
					featureName: 'GroupsForGroups',
					$relatedElements: $(
						tabID + ' .ldapGroupListAvailable,' +
						tabID + ' .ldapGroupListSelected,' +
						tabID + ' .ldapManyGroupsSearch'
					)
				},
				ldap_group_filter: {
					$element: $('#ldap_group_filter'),
					setMethod: 'setFilter',
					keyName: 'ldap_group_filter'
				},
				groupFilterRawToggle: {
					$element: $('#toggleRawGroupFilter')
				},
				groupFilterRawContainer: {
					$element: $('#rawGroupFilterContainer')
				},
				ldap_group_count: {
					$element: $('#ldap_group_count'),
					$relatedElements: $('.ldapGetGroupCount'),
					setMethod: 'setCount',
					keyName: 'ldap_group_count'
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
			return this.managedItems.ldap_groupfilter_objectclass;
		},

		/**
		 * @inheritdoc
		 * @returns {Object}
		 */
		getGroupsItem: function () {
			return this.managedItems.ldap_groupfilter_groups;
		},

		/**
		 * @inheritdoc
		 * @returns {Object}
		 */
		getFilterItem: function () {
			return this.managedItems.ldap_group_filter;
		},

		/**
		 * @inheritdoc
		 * @returns {Object}
		 */
		getToggleItem: function () {
			return this.managedItems.groupFilterRawToggle;
		},

		/**
		 * @inheritdoc
		 * @returns {Object}
		 */
		getRawFilterContainerItem: function () {
			return this.managedItems.groupFilterRawContainer;
		},

		/**
		 * @inheritdoc
		 * @returns {Object}
		 */
		getCountItem: function () {
			return this.managedItems.ldap_group_count;
		},

		/**
		 * @inheritdoc
		 * @returns {string}
		 */
		getFilterModeKey: function () {
			return 'ldap_group_filter_mode';
		}

	});

	OCA.LDAP.Wizard.WizardTabGroupFilter = WizardTabGroupFilter;
})();

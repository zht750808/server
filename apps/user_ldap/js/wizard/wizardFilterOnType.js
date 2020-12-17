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
	 * @classdesc filters a select box when a text element is typed in
	 */
	var FilterOnType = OCA.LDAP.Wizard.WizardObject.subClass({
		/**
		 * initializes a type filter on a text input for a select element
		 *
		 * @param {jQuery} $select
		 * @param {jQuery} $textInput
		 */
		init: function($select, $textInput) {
			this.$select = $select;
			this.$textInput = $textInput;
			this.lastSearch = '';

			var fity = this;
			$textInput.bind('change keyup', function () {
				if(fity.runID) {
					window.clearTimeout(fity.runID);
				}
				fity.runID = window.setTimeout(function() {
					fity.filter(fity);
				}, 250);
			});
		},

		/**
		 * the actual search or filter method
		 *
		 * @param {FilterOnType} fity
		 */
		filter: function(fity) {
			var filterVal = fity.$textInput.val().toLowerCase();
			if(filterVal === fity.lastSearch) {
				return;
			}
			fity.lastSearch = filterVal;

			fity.$select.find('option').each(function() {
				if(!filterVal || $(this).val().toLowerCase().indexOf(filterVal) > -1) {
					$(this).removeAttr('hidden')
				} else {
					$(this).attr('hidden', 'hidden');
				}
			});
			delete(fity.runID);
		}
	});

	OCA.LDAP.Wizard.FilterOnType = FilterOnType;
})();

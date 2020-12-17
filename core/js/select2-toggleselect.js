/**
 *
 *
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

/* global Select2 */

/**
 * Select2 extension for toggling values in a multi-select dropdown
 */
(function(Select2) {

	var Select2FindHighlightableChoices = Select2.class.multi.prototype.findHighlightableChoices;
	Select2.class.multi.prototype.findHighlightableChoices = function () {
		if (this.opts.toggleSelect) {
			return this.results.find('.select2-result-selectable:not(.select2-disabled)');
		}
		return Select2FindHighlightableChoices.apply(this, arguments);
	};

	var Select2TriggerSelect = Select2.class.multi.prototype.triggerSelect;
	Select2.class.multi.prototype.triggerSelect = function (data) {
		if (this.opts.toggleSelect && this.val().indexOf(this.id(data)) !== -1) {
			var self = this;
			var val = this.id(data);

			var selectionEls = this.container.find('.select2-search-choice').filter(function() {
				return (self.id($(this).data('select2-data')) === val);
			});

			if (this.unselect(selectionEls)) {
				// also unselect in dropdown
				this.results.find('.select2-result.select2-selected').each(function () {
					var $this = $(this);
					if (self.id($this.data('select2-data')) === val) {
						$this.removeClass('select2-selected');
					}
				});
				this.clearSearch();
			}

			return false;
		} else {
			return Select2TriggerSelect.apply(this, arguments);
		}
	};

})(Select2);


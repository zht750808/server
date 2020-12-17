/**
 *
 *
 * @author Abijeet <abijeetpatro@gmail.com>
 * @author Roeland Jago Douma <roeland@famdouma.nl>
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

(function() {
	var FileMultiSelectMenu = OC.Backbone.View.extend({
		tagName: 'div',
		className: 'filesSelectMenu popovermenu bubble menu-center',
		_scopes: null,
		initialize: function(menuItems) {
			this._scopes = menuItems;
		},
		events: {
			'click a.action': '_onClickAction'
		},

		/**
		 * Renders the menu with the currently set items
		 */
		render: function() {
			this.$el.html(OCA.Files.Templates['filemultiselectmenu']({
				items: this._scopes
			}));
		},
		/**
		 * Displays the menu under the given element
		 *
		 * @param {OCA.Files.FileActionContext} context context
		 * @param {Object} $trigger trigger element
		 */
		show: function(context) {
			this._context = context;
			this.$el.removeClass('hidden');
			if (window.innerWidth < 480) {
				this.$el.removeClass('menu-center').addClass('menu-right');
			} else {
				this.$el.removeClass('menu-right').addClass('menu-center');
			}
			OC.showMenu(null, this.$el);
			return false;
		},
		toggleItemVisibility: function (itemName, show) {
			if (show) {
				this.$el.find('.item-' + itemName).removeClass('hidden');
			} else {
				this.$el.find('.item-' + itemName).addClass('hidden');
			}
		},
		updateItemText: function (itemName, translation) {
			this.$el.find('.item-' + itemName).find('.label').text(translation);
		},
		toggleLoading: function (itemName, showLoading) {
			var $actionElement = this.$el.find('.item-' + itemName);
			if ($actionElement.length === 0) {
				return;
			}
			var $icon = $actionElement.find('.icon');
			if (showLoading) {
				var $loadingIcon = $('<span class="icon icon-loading-small"></span>');
				$icon.after($loadingIcon);
				$icon.addClass('hidden');
				$actionElement.addClass('disabled');
			} else {
				$actionElement.find('.icon-loading-small').remove();
				$actionElement.find('.icon').removeClass('hidden');
				$actionElement.removeClass('disabled');
			}
		},
		isDisabled: function (itemName) {
			var $actionElement = this.$el.find('.item-' + itemName);
			return $actionElement.hasClass('disabled');
		},
		/**
		 * Event handler whenever an action has been clicked within the menu
		 *
		 * @param {Object} event event object
		 */
		_onClickAction: function (event) {
			var $target = $(event.currentTarget);
			if (!$target.hasClass('menuitem')) {
				$target = $target.closest('.menuitem');
			}

			OC.hideMenus();
			this._context.multiSelectMenuClick(event, $target.data('action'));
			return false;
		}
	});

	OCA.Files.FileMultiSelectMenu = FileMultiSelectMenu;
})(OC, OCA);

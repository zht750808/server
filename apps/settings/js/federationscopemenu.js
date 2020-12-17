/**
 *
 *
 * @author Bjoern Schiessle <bjoern@schiessle.org>
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
 * @author Joas Schilling <coding@schilljs.com>
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
 * @author Julius Härtl <jus@bitgrid.net>
 * @author Lukas Reschke <lukas@statuscode.ch>
 * @author Morris Jobke <hey@morrisjobke.de>
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

/* global OC, Handlebars */
(function() {

	/**
	 * Construct a new FederationScopeMenu instance
	 * @constructs FederationScopeMenu
	 * @memberof OC.Settings
	 */
	var FederationScopeMenu = OC.Backbone.View.extend({
		tagName: 'div',
		className: 'federationScopeMenu popovermenu bubble menu menu-center',
		field: undefined,
		_scopes: undefined,

		initialize: function(options) {
			this.field = options.field;
			this._scopes = [
				{
					name: 'private',
					displayName: t('settings', 'Private'),
					tooltip: t('settings', "Don't synchronize to servers"),
					iconClass: 'icon-password',
					active: false
				},
				{
					name: 'contacts',
					displayName: t('settings', 'Trusted'),
					tooltip: t('settings', 'Only synchronize to trusted servers'),
					iconClass: 'icon-contacts-dark',
					active: false
				},
				{
					name: 'public',
					displayName: t('settings', 'Public'),
					tooltip: t('settings', 'Synchronize to trusted servers and the global and public address book'),
					iconClass: 'icon-link',
					active: false
				}
			];
		},

		/**
		 * Current context
		 *
		 * @type OCA.Files.FileActionContext
		 */
		_context: null,

		events: {
			'click a.action': '_onSelectScope',
			'keydown a.action': '_onSelectScopeKeyboard'
		},

		/**
		 * Event handler whenever an action has been clicked within the menu
		 *
		 * @param {Object} event event object
		 */
		_onSelectScope: function(event) {
			var $target = $(event.currentTarget);
			if (!$target.hasClass('menuitem')) {
				$target = $target.closest('.menuitem');
			}

			this.trigger('select:scope', $target.data('action'));

			OC.hideMenus();
		},

		_onSelectScopeKeyboard: function(event) {
			if (event.keyCode === 13 || event.keyCode === 32) {
				// Enter and space can be used to select a scope
				event.preventDefault();
				this._onSelectScope(event);
			}
		},

		/**
		 * Renders the menu with the currently set items
		 */
		render: function() {
			this.$el.html(OC.Settings.Templates['federationscopemenu']({
				items: this._scopes
			}));
		},

		/**
		 * Displays the menu
		 */
		show: function(context) {
			this._context = context;
			var currentlyActiveValue = $('#'+context.target.closest('form').id).find('input[type="hidden"]')[0].value;

			for(var i in this._scopes) {
				this._scopes[i].active = false;
			}

			switch (currentlyActiveValue) {
				case 'private':
					this._scopes[0].active = true;
					break;
				case 'contacts':
					this._scopes[1].active = true;
					break;
				case 'public':
					this._scopes[2].active = true;
					break;
			}

			this.render();
			this.$el.removeClass('hidden');

			OC.showMenu(null, this.$el);
		}
	});

	OC.Settings = OC.Settings || {};
	OC.Settings.FederationScopeMenu = FederationScopeMenu;

})();

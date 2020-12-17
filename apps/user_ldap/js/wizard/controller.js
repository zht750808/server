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
OCA.LDAP = {};
OCA.LDAP.Wizard = {};

(function(){

	/**
	 * @classdesc minimalistic controller that basically makes the view render
	 *
	 * @constructor
	 */
	var WizardController = function() {};

	WizardController.prototype = {
		/**
		 * initializes the instance. Always call it after creating the instance.
		 */
		init: function() {
			this.view = false;
			this.configModel = false;
		},

		/**
		 * sets the model instance
		 *
		 * @param {OCA.LDAP.Wizard.ConfigModel} [model]
		 */
		setModel: function(model) {
			this.configModel = model;
		},

		/**
		 * sets the view instance
		 *
		 * @param {OCA.LDAP.Wizard.WizardView} [view]
		 */
		setView: function(view) {
			this.view = view;
		},

		/**
		 * makes the view render i.e. ready to be used
		 */
		run: function() {
			this.view.render();
		}
	};

	OCA.LDAP.Wizard.Controller = WizardController;
})();

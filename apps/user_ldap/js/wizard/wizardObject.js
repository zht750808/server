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
	var initializing = false;
	var superPattern = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;

	/**
	 * @classdesc a base class that allows inheritance
	 *
	 * @abstrcact
	 * @constructor
	 */
	var WizardObject = function(){};
	WizardObject.subClass = function(properties) {
		var _super = this.prototype;

		initializing = true;
		var proto = new this();
		initializing = false;

		for (var name in properties) {
			proto[name] =
				typeof properties[name] === "function" &&
				typeof _super[name] === 'function' &&
				superPattern.test(properties[name]) ?
					(function (name, fn) {
						return function () {
							var tmp = this._super;
							this._super = _super[name];
							var ret = fn.apply(this, arguments);
							this._super = tmp;
							return ret;
						};
					})(name, properties[name]) :
					properties[name];
		};

		function Class() {
			if(!initializing && this.init) {
				this.init.apply(this, arguments);
			}
		}

		Class.prototype = proto;
		Class.constructor = Class;
		Class.subClass = arguments.callee;
		return Class;
	};

	WizardObject.constructor = WizardObject;

	OCA.LDAP.Wizard.WizardObject = WizardObject;
})();

/**
 *
 *
 * @author Arthur Schiwon <blizzz@arthur-schiwon.de>
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

(function() {
	/**
	 * @class OCA.Files.DetailFileInfoView
	 * @classdesc
	 *
	 * Displays a block of details about the file info.
	 *
	 */
	var DetailFileInfoView = OC.Backbone.View.extend({
		tagName: 'div',
		className: 'detailFileInfoView',

		_template: null,

		/**
		 * returns the jQuery object for HTML output
		 *
		 * @returns {jQuery}
		 */
		get$: function() {
			return this.$el;
		},

		/**
		 * Sets the file info to be displayed in the view
		 *
		 * @param {OCA.Files.FileInfo} fileInfo file info to set
		 */
		setFileInfo: function(fileInfo) {
			this.model = fileInfo;
			this.render();
		},

		/**
		 * Returns the file info.
		 *
		 * @return {OCA.Files.FileInfo} file info
		 */
		getFileInfo: function() {
			return this.model;
		}
	});

	OCA.Files.DetailFileInfoView = DetailFileInfoView;
})();


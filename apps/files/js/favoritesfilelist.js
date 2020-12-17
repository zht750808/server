/**
 *
 *
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
 * @author Robin Appelman <robin@icewind.nl>
 * @author Vincent Petry <vincent@nextcloud.com>
 * @author Volkan Gezer <volkangezer@gmail.com>
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

// HACK: this piece needs to be loaded AFTER the files app (for unit tests)
window.addEventListener('DOMContentLoaded', function() {
	(function(OCA) {
		/**
		 * @class OCA.Files.FavoritesFileList
		 * @augments OCA.Files.FavoritesFileList
		 *
		 * @classdesc Favorites file list.
		 * Displays the list of files marked as favorites
		 *
		 * @param $el container element with existing markup for the #controls
		 * and a table
		 * @param [options] map of options, see other parameters
		 */
		var FavoritesFileList = function($el, options) {
			this.initialize($el, options);
		};
		FavoritesFileList.prototype = _.extend({}, OCA.Files.FileList.prototype,
			/** @lends OCA.Files.FavoritesFileList.prototype */ {
			id: 'favorites',
			appName: t('files','Favorites'),

			_clientSideSort: true,
			_allowSelection: false,

			/**
			 * @private
			 */
			initialize: function($el, options) {
				OCA.Files.FileList.prototype.initialize.apply(this, arguments);
				if (this.initialized) {
					return;
				}
				OC.Plugins.attach('OCA.Files.FavoritesFileList', this);
			},

			updateEmptyContent: function() {
				var dir = this.getCurrentDirectory();
				if (dir === '/') {
					// root has special permissions
					this.$el.find('#emptycontent').toggleClass('hidden', !this.isEmpty);
					this.$el.find('#filestable thead th').toggleClass('hidden', this.isEmpty);
				}
				else {
					OCA.Files.FileList.prototype.updateEmptyContent.apply(this, arguments);
				}
			},

			getDirectoryPermissions: function() {
				return OC.PERMISSION_READ | OC.PERMISSION_DELETE;
			},

			updateStorageStatistics: function() {
				// no op because it doesn't have
				// storage info like free space / used space
			},

			reload: function() {
				this.showMask();
				if (this._reloadCall) {
					this._reloadCall.abort();
				}

				// there is only root
				this._setCurrentDir('/', false);

				this._reloadCall = this.filesClient.getFilteredFiles(
					{
						favorite: true
					},
					{
						properties: this._getWebdavProperties()
					}
				);
				var callBack = this.reloadCallback.bind(this);
				return this._reloadCall.then(callBack, callBack);
			},

			reloadCallback: function(status, result) {
				if (result) {
					// prepend empty dir info because original handler
					result.unshift({});
				}

				return OCA.Files.FileList.prototype.reloadCallback.call(this, status, result);
			},
		});

		OCA.Files.FavoritesFileList = FavoritesFileList;
	})(OCA);
});


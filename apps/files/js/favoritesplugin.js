/**
 *
 *
 * @author Daniel Calviño Sánchez <danxuliu@gmail.com>
 * @author Julius Härtl <jus@bitgrid.net>
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

(function(OCA) {
	/**
	 * Registers the favorites file list from the files app sidebar.
	 *
	 * @namespace OCA.Files.FavoritesPlugin
	 */
	OCA.Files.FavoritesPlugin = {
		name: 'Favorites',

		/**
		 * @type OCA.Files.FavoritesFileList
		 */
		favoritesFileList: null,

		attach: function() {
			var self = this;
			$('#app-content-favorites').on('show.plugin-favorites', function(e) {
				self.showFileList($(e.target));
			});
			$('#app-content-favorites').on('hide.plugin-favorites', function() {
				self.hideFileList();
			});
		},

		detach: function() {
			if (this.favoritesFileList) {
				this.favoritesFileList.destroy();
				OCA.Files.fileActions.off('setDefault.plugin-favorites', this._onActionsUpdated);
				OCA.Files.fileActions.off('registerAction.plugin-favorites', this._onActionsUpdated);
				$('#app-content-favorites').off('.plugin-favorites');
				this.favoritesFileList = null;
			}
		},

		showFileList: function($el) {
			if (!this.favoritesFileList) {
				this.favoritesFileList = this._createFavoritesFileList($el);
			}
			return this.favoritesFileList;
		},

		hideFileList: function() {
			if (this.favoritesFileList) {
				this.favoritesFileList.$fileList.empty();
			}
		},

		/**
		 * Creates the favorites file list.
		 *
		 * @param $el container for the file list
		 * @return {OCA.Files.FavoritesFileList} file list
		 */
		_createFavoritesFileList: function($el) {
			var fileActions = this._createFileActions();
			// register favorite list for sidebar section
			return new OCA.Files.FavoritesFileList(
				$el, {
					fileActions: fileActions,
					// The file list is created when a "show" event is handled,
					// so it should be marked as "shown" like it would have been
					// done if handling the event with the file list already
					// created.
					shown: true
				}
			);
		},

		_createFileActions: function() {
			// inherit file actions from the files app
			var fileActions = new OCA.Files.FileActions();
			// note: not merging the legacy actions because legacy apps are not
			// compatible with the sharing overview and need to be adapted first
			fileActions.registerDefaultActions();
			fileActions.merge(OCA.Files.fileActions);

			if (!this._globalActionsInitialized) {
				// in case actions are registered later
				this._onActionsUpdated = _.bind(this._onActionsUpdated, this);
				OCA.Files.fileActions.on('setDefault.plugin-favorites', this._onActionsUpdated);
				OCA.Files.fileActions.on('registerAction.plugin-favorites', this._onActionsUpdated);
				this._globalActionsInitialized = true;
			}

			// when the user clicks on a folder, redirect to the corresponding
			// folder in the files app instead of opening it directly
			fileActions.register('dir', 'Open', OC.PERMISSION_READ, '', function (filename, context) {
				OCA.Files.App.setActiveView('files', {silent: true});
				OCA.Files.App.fileList.changeDirectory(OC.joinPaths(context.$file.attr('data-path'), filename), true, true);
			});
			fileActions.setDefault('dir', 'Open');
			return fileActions;
		},

		_onActionsUpdated: function(ev) {
			if (ev.action) {
				this.favoritesFileList.fileActions.registerAction(ev.action);
			} else if (ev.defaultAction) {
				this.favoritesFileList.fileActions.setDefault(
					ev.defaultAction.mime,
					ev.defaultAction.name
				);
			}
		}
	};

})(OCA);

OC.Plugins.register('OCA.Files.App', OCA.Files.FavoritesPlugin);


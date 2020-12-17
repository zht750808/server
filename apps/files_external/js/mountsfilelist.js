/**
 *
 *
 * @author Daniel Calviño Sánchez <danxuliu@gmail.com>
 * @author Jan-Christoph Borchardt <hey@jancborchardt.net>
 * @author Joas Schilling <coding@schilljs.com>
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
	 * @class OCA.Files_External.FileList
	 * @augments OCA.Files.FileList
	 *
	 * @classdesc External storage file list.
	 *
	 * Displays a list of mount points visible
	 * for the current user.
	 *
	 * @param $el container element with existing markup for the #controls
	 * and a table
	 * @param [options] map of options, see other parameters
	 **/
	var FileList = function($el, options) {
		this.initialize($el, options);
	};

	FileList.prototype = _.extend({}, OCA.Files.FileList.prototype,
		/** @lends OCA.Files_External.FileList.prototype */ {
		appName: 'External storages',

		_allowSelection: false,

		/**
		 * @private
		 */
		initialize: function($el, options) {
			OCA.Files.FileList.prototype.initialize.apply(this, arguments);
			if (this.initialized) {
				return;
			}
		},

		/**
		 * @param {OCA.Files_External.MountPointInfo} fileData
		 */
		_createRow: function(fileData) {
			// TODO: hook earlier and render the whole row here
			var $tr = OCA.Files.FileList.prototype._createRow.apply(this, arguments);
			var $scopeColumn = $('<td class="column-scope column-last"><span></span></td>');
			var $backendColumn = $('<td class="column-backend"></td>');
			var scopeText = t('files_external', 'Personal');
			if (fileData.scope === 'system') {
				scopeText = t('files_external', 'System');
			}
			$tr.find('.filesize,.date').remove();
			$scopeColumn.find('span').text(scopeText);
			$backendColumn.text(fileData.backend);
			$tr.find('td.filename').after($scopeColumn).after($backendColumn);
			return $tr;
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

			this._reloadCall = $.ajax({
				url: OC.linkToOCS('apps/files_external/api/v1') + 'mounts',
				data: {
					format: 'json'
				},
				type: 'GET',
				beforeSend: function(xhr) {
					xhr.setRequestHeader('OCS-APIREQUEST', 'true');
				}
			});
			var callBack = this.reloadCallback.bind(this);
			return this._reloadCall.then(callBack, callBack);
		},

		reloadCallback: function(result) {
			delete this._reloadCall;
			this.hideMask();

			if (result.ocs && result.ocs.data) {
				this.setFiles(this._makeFiles(result.ocs.data));
				return true;
			}
			return false;
		},

		/**
		 * Converts the OCS API  response data to a file info
		 * list
		 * @param OCS API mounts array
		 * @return array of file info maps
		 */
		_makeFiles: function(data) {
			var files = _.map(data, function(fileData) {
				fileData.icon = OC.imagePath('core', 'filetypes/folder-external');
				fileData.mountType = 'external';
				return fileData;
			});

			files.sort(this._sortComparator);

			return files;
		}
	});

	/**
	 * Mount point info attributes.
	 *
	 * @typedef {Object} OCA.Files_External.MountPointInfo
	 *
	 * @property {String} name mount point name
	 * @property {String} scope mount point scope "personal" or "system"
	 * @property {String} backend external storage backend name
	 */

	OCA.Files_External.FileList = FileList;
})();

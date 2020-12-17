/**
 *
 *
 * @author Jan-Christoph Borchardt <hey@jancborchardt.net>
 * @author Jesús Macias <jmacias@solidgear.es>
 * @author Joas Schilling <coding@schilljs.com>
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
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

if (!OCA.Files_External) {
	/**
	 * @namespace
	 */
	OCA.Files_External = {};
}
/**
 * @namespace
 */
OCA.Files_External.App = {

	fileList: null,

	initList: function($el) {
		if (this.fileList) {
			return this.fileList;
		}

		this.fileList = new OCA.Files_External.FileList(
			$el,
			{
				fileActions: this._createFileActions()
			}
		);

		this._extendFileList(this.fileList);
		this.fileList.appName = t('files_external', 'External storages');
		return this.fileList;
	},

	removeList: function() {
		if (this.fileList) {
			this.fileList.$fileList.empty();
		}
	},

	_createFileActions: function() {
		// inherit file actions from the files app
		var fileActions = new OCA.Files.FileActions();
		fileActions.registerDefaultActions();

		// when the user clicks on a folder, redirect to the corresponding
		// folder in the files app instead of opening it directly
		fileActions.register('dir', 'Open', OC.PERMISSION_READ, '', function (filename, context) {
			OCA.Files.App.setActiveView('files', {silent: true});
			OCA.Files.App.fileList.changeDirectory(OC.joinPaths(context.$file.attr('data-path'), filename), true, true);
		});
		fileActions.setDefault('dir', 'Open');
		return fileActions;
	},

	_extendFileList: function(fileList) {
		// remove size column from summary
		fileList.fileSummary.$el.find('.filesize').remove();
	}
};

window.addEventListener('DOMContentLoaded', function() {
	$('#app-content-extstoragemounts').on('show', function(e) {
		OCA.Files_External.App.initList($(e.target));
	});
	$('#app-content-extstoragemounts').on('hide', function() {
		OCA.Files_External.App.removeList();
	});

	/* Status Manager */
	if ($('#filesApp').val()) {

		$('#app-content-files')
			.add('#app-content-extstoragemounts')
			.on('changeDirectory', function(e){
				if (e.dir === '/') {
					var mount_point = e.previousDir.split('/', 2)[1];
					// Every time that we return to / root folder from a mountpoint, mount_point status is rechecked
					OCA.Files_External.StatusManager.getMountPointList(function() {
						OCA.Files_External.StatusManager.recheckConnectivityForMount([mount_point], true);
					});
				}
			})
			.on('fileActionsReady', function(e){
			if ($.isArray(e.$files)) {
				if (OCA.Files_External.StatusManager.mountStatus === null ||
						OCA.Files_External.StatusManager.mountPointList === null ||
						_.size(OCA.Files_External.StatusManager.mountStatus) !== _.size(OCA.Files_External.StatusManager.mountPointList)) {
					// Will be the very first check when the files view will be loaded
					OCA.Files_External.StatusManager.launchFullConnectivityCheckOneByOne();
				} else {
					// When we change between general files view and external files view
					OCA.Files_External.StatusManager.getMountPointList(function(){
						var fileNames = [];
						$.each(e.$files, function(key, value){
							fileNames.push(value.attr('data-file'));
						});
						// Recheck if launched but work from cache
						OCA.Files_External.StatusManager.recheckConnectivityForMount(fileNames, false);
					});
				}
			}
		});
	}
	/* End Status Manager */
});

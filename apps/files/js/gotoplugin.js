/**
 *
 *
 * @author Daniel Calviño Sánchez <danxuliu@gmail.com>
 * @author Robin Appelman <robin@icewind.nl>
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


(function (OCA) {

	OCA.Files = OCA.Files || {};

	/**
	 * @namespace OCA.Files.GotoPlugin
	 *
	 */
	OCA.Files.GotoPlugin = {
		name: 'Goto',

		disallowedLists: [
			'files',
			'trashbin'
		],

		attach: function (fileList) {
			if (this.disallowedLists.indexOf(fileList.id) !== -1) {
				return;
			}
			var fileActions = fileList.fileActions;

			fileActions.registerAction({
				name: 'Goto',
				displayName: t('files', 'View in folder'),
				mime: 'all',
				permissions: OC.PERMISSION_ALL,
				iconClass: 'icon-goto nav-icon-extstoragemounts',
				type: OCA.Files.FileActions.TYPE_DROPDOWN,
				actionHandler: function (fileName, context) {
					var fileModel = context.fileInfoModel;
					OC.Apps.hideAppSidebar($('.detailsView'));
					OCA.Files.App.setActiveView('files', {silent: true});
					OCA.Files.App.fileList.changeDirectory(fileModel.get('path'), true, true).then(function() {
						OCA.Files.App.fileList.scrollTo(fileModel.get('name'));
					});
				},
				render: function (actionSpec, isDefault, context) {
					return fileActions._defaultRenderAction.call(fileActions, actionSpec, isDefault, context)
						.removeClass('permanent');
				}
			});
		}
	};
})(OCA);

OC.Plugins.register('OCA.Files.FileList', OCA.Files.GotoPlugin);


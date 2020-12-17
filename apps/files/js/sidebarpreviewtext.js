/**
 *
 *
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Robin Appelman <robin@icewind.nl>
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

(function () {
	var SidebarPreview = function () {
	};

	SidebarPreview.prototype = {
		attach: function (manager) {
			manager.addPreviewHandler('text', this.handlePreview.bind(this));
		},

		handlePreview: function (model, $thumbnailDiv, $thumbnailContainer, fallback) {
			var previewWidth = $thumbnailContainer.parent().width() + 50;  // 50px for negative margins
			var previewHeight = previewWidth / (16 / 9);

			this.getFileContent(model.getFullPath()).then(function (content) {
				$thumbnailDiv.removeClass('icon-loading icon-32');
				$thumbnailContainer.addClass('large');
				$thumbnailContainer.addClass('text');
				var $textPreview = $('<pre/>').text(content);
				$thumbnailDiv.children('.stretcher').remove();
				$thumbnailDiv.append($textPreview);
				$thumbnailContainer.css("max-height", previewHeight);
			}, function () {
				fallback();
			});
		},

		getFileContent: function (path) {
			return $.ajax({
				url: OC.linkToRemoteBase('files' + path),
				headers: {
					'Range': 'bytes=0-10240'
				}
			});
		}
	};

	OC.Plugins.register('OCA.Files.SidebarPreviewManager', new SidebarPreview());
})();

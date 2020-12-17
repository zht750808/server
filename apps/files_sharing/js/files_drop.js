/**
 *
 *
 * @author Arthur Schiwon <blizzz@arthur-schiwon.de>
 * @author Artur Neumann <info@individual-it.net>
 * @author Christopher Mueller <chrinimue@posteo.me>
 * @author Daniel Calviño Sánchez <danxuliu@gmail.com>
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
 * @author Julius Härtl <jus@bitgrid.net>
 * @author Lukas Reschke <lukas@statuscode.ch>
 * @author Michael Weimann <mail@michael-weimann.eu>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author rakekniven <mark.ziegler@rakekniven.de>
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

(function ($) {

	var Drop = {
		/** @type {Function} **/
		_template: undefined,

		/** @type {bool} */
		_uploading: false,

		addFileToUpload: function(e, data) {
			var errors = [];
			var output = this.template();

			var filesClient = new OC.Files.Client({
				host: OC.getHost(),
				port: OC.getPort(),
				userName: $('#sharingToken').val(),
				// note: password not be required, the endpoint
				// will recognize previous validation from the session
				root: OC.getRootPath() + '/public.php/webdav',
				useHTTPS: OC.getProtocol() === 'https'
			});

			// We only process one file at a time 🤷‍♀️
			var name = data.files[0].name;
			// removing unwanted characters
			name = name.replace(/["'#%`]/gm, '');

			try {
				// FIXME: not so elegant... need to refactor that method to return a value
				Files.isFileNameValid(name);
			}
			catch (errorMessage) {
				OC.Notification.show(errorMessage, {type: 'error'});
				return false;
			}
			var base = OC.getProtocol() + '://' + OC.getHost();
			data.url = base + OC.getRootPath() + '/public.php/webdav/' + encodeURI(name);

			data.multipart = false;

			if (!data.headers) {
				data.headers = {};
			}

			var userName = filesClient.getUserName();
			var password = filesClient.getPassword();
			if (userName) {
				// copy username/password from DAV client
				data.headers['Authorization'] =
					'Basic ' + btoa(userName + ':' + (password || ''));
			}

			$('#drop-upload-done-indicator').addClass('hidden');
			$('#drop-upload-progress-indicator').removeClass('hidden');

			$('#drop-uploaded-files').append(output({isUploading: true, name: data.files[0].name}));
			$('[data-toggle="tooltip"]').tooltip();
			data.submit();

			return true;
		},

		updateFileItem: function (fileName, fileItem) {
			$('#drop-uploaded-files li[data-name="' + fileName + '"]').replaceWith(fileItem);
			$('[data-toggle="tooltip"]').tooltip();
		},

		initialize: function () {
			$(document).bind('drop dragover', function (e) {
				// Prevent the default browser drop action:
				e.preventDefault();
			});
			var output = this.template();
			var self = this;
			$('#public-upload').fileupload({
				type: 'PUT',
				dropZone: $('#public-upload'),
				sequentialUploads: true,
				start: function(e) {
					self._uploading = true;
				},
				stop: function(e) {
					self._uploading = false;
				},
				add: function(e, data) {
					Drop.addFileToUpload(e, data);
					$('#drop-upload-status').text(t('files_sharing', 'Waiting…'));
					//we return true to keep trying to upload next file even
					//if addFileToUpload did not like the privious one
					return true;
				},
				done: function(e, data) {
					// Created
					var mimeTypeUrl = OC.MimeType.getIconUrl(data.files[0].type);
					var fileItem = output({isUploading: false, iconSrc: mimeTypeUrl, name: data.files[0].name});
					Drop.updateFileItem(data.files[0].name, fileItem);
				},
				fail: function(e, data) {
					OC.Notification.showTemporary(OC.L10N.translate(
							'files_sharing',
							'Could not upload "{filename}"',
							{filename: data.files[0].name}
							));
					$('#drop-upload-status').text(t('files_sharing', 'error'));
					var errorIconSrc = OC.imagePath('core', 'actions/error.svg');
					var fileItem = output({isUploading: false, iconSrc: errorIconSrc, name: data.files[0].name});
					Drop.updateFileItem(data.files[0].name, fileItem);
				},
				progressall: function (e, data) {
					var progress = parseInt(data.loaded / data.total * 100, 10);
					if(progress === 100) {
						$('#drop-upload-done-indicator').removeClass('hidden');
						$('#drop-upload-progress-indicator').addClass('hidden');
					} else {
						$('#drop-upload-done-indicator').addClass('hidden');
						$('#drop-upload-progress-indicator').removeClass('hidden');
					}
				},
				progress: function (e, data) {
					var progress = parseInt(data.loaded / data.total * 100, 10);
					if(progress === 100) {
						$('#drop-upload-progress-bar').val(100);
						$('#drop-upload-status').text(t('files_sharing', 'finished'));
					} else {
						$('#drop-upload-progress-bar').val(progress);
						$('#drop-upload-status').text(progress + '%');
					}
				},
			});
			$('#public-upload .button.icon-upload').click(function(e) {
				e.preventDefault();
				$('#public-upload #emptycontent input').focus().trigger('click');
			});
			window.onbeforeunload = function() {
				return self.confirmBeforeUnload();
			}
		},

		/**
		 * @returns {Function} from Handlebars
		 * @private
		 */
		template: function () {
			return OCA.Sharing.Templates['files_drop'];
		},

		confirmBeforeUnload: function() {
			if (this._uploading) {
				return t('files', 'This will stop your current uploads.')
			}
		},
	};

	OCA.FilesSharingDrop = Drop;

	window.addEventListener('DOMContentLoaded', function() {
		if($('#upload-only-interface').val() === "1") {
			$('.avatardiv').avatar($('#sharingUserId').val(), 128, true);
		}

		OCA.FilesSharingDrop.initialize();
	});
})(jQuery);

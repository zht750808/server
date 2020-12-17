/**
 *
 *
 * @author Clark Tomlinson <fallen013@gmail.com>
 * @author Joas Schilling <coding@schilljs.com>
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
 * @author Thomas Müller <thomas.mueller@tmit.eu>
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

OC.Encryption = _.extend(OC.Encryption || {}, {
	updatePrivateKeyPassword: function () {
		var oldPrivateKeyPassword = $('input:password[id="oldPrivateKeyPassword"]').val();
		var newPrivateKeyPassword = $('input:password[id="newPrivateKeyPassword"]').val();
		OC.msg.startSaving('#ocDefaultEncryptionModule .msg');
		$.post(
			OC.generateUrl('/apps/encryption/ajax/updatePrivateKeyPassword'),
			{
				oldPassword: oldPrivateKeyPassword,
				newPassword: newPrivateKeyPassword
			}
		).done(function (data) {
				OC.msg.finishedSuccess('#ocDefaultEncryptionModule .msg', data.message);
			})
			.fail(function (jqXHR) {
				OC.msg.finishedError('#ocDefaultEncryptionModule .msg', JSON.parse(jqXHR.responseText).message);
			});
	}
});

window.addEventListener('DOMContentLoaded', function () {

	// Trigger ajax on recoveryAdmin status change
	$('input:radio[name="userEnableRecovery"]').change(
		function () {
			var recoveryStatus = $(this).val();
			OC.msg.startAction('#userEnableRecovery .msg', 'Updating recovery keys. This can take some time...');
			$.post(
				OC.generateUrl('/apps/encryption/ajax/userSetRecovery'),
				{
					userEnableRecovery: recoveryStatus
				}
			).done(function (data) {
					OC.msg.finishedSuccess('#userEnableRecovery .msg', data.data.message);
				})
				.fail(function (jqXHR) {
					OC.msg.finishedError('#userEnableRecovery .msg', JSON.parse(jqXHR.responseText).data.message);
				});
			// Ensure page is not reloaded on form submit
			return false;
		}
	);

	// update private key password

	$('input:password[name="changePrivateKeyPassword"]').keyup(function (event) {
		var oldPrivateKeyPassword = $('input:password[id="oldPrivateKeyPassword"]').val();
		var newPrivateKeyPassword = $('input:password[id="newPrivateKeyPassword"]').val();
		if (newPrivateKeyPassword !== '' && oldPrivateKeyPassword !== '') {
			$('button:button[name="submitChangePrivateKeyPassword"]').removeAttr("disabled");
			if (event.which === 13) {
				OC.Encryption.updatePrivateKeyPassword();
			}
		} else {
			$('button:button[name="submitChangePrivateKeyPassword"]').attr("disabled", "true");
		}
	});

	$('button:button[name="submitChangePrivateKeyPassword"]').click(function () {
		OC.Encryption.updatePrivateKeyPassword();
	});

});

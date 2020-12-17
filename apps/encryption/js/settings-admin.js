/**
 *
 *
 * @author Björn Schießle <bjoern@schiessle.org>
 * @author Clark Tomlinson <fallen013@gmail.com>
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
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

window.addEventListener('DOMContentLoaded', function () {
	
	$('input:button[name="enableRecoveryKey"]').click(function () {

		var recoveryStatus = $(this).attr('status');
		var newRecoveryStatus = (1 + parseInt(recoveryStatus)) % 2;
		var buttonValue = $(this).attr('value');

		var recoveryPassword = $('#encryptionRecoveryPassword').val();
		var confirmPassword = $('#repeatEncryptionRecoveryPassword').val();
		OC.msg.startSaving('#encryptionSetRecoveryKey .msg');
		$.post(
			OC.generateUrl('/apps/encryption/ajax/adminRecovery'),
			{
				adminEnableRecovery: newRecoveryStatus,
				recoveryPassword: recoveryPassword,
				confirmPassword: confirmPassword
			}
		).done(function (data) {
				OC.msg.finishedSuccess('#encryptionSetRecoveryKey .msg', data.data.message);

				if (newRecoveryStatus === 0) {
					$('p[name="changeRecoveryPasswordBlock"]').addClass("hidden");
					$('input:button[name="enableRecoveryKey"]').attr('value', 'Enable recovery key');
					$('input:button[name="enableRecoveryKey"]').attr('status', '0');
				} else {
					$('input:password[name="changeRecoveryPassword"]').val("");
					$('p[name="changeRecoveryPasswordBlock"]').removeClass("hidden");
					$('input:button[name="enableRecoveryKey"]').attr('value', 'Disable recovery key');
					$('input:button[name="enableRecoveryKey"]').attr('status', '1');
				}
			})
			.fail(function (jqXHR) {
				$('input:button[name="enableRecoveryKey"]').attr('value', buttonValue);
				$('input:button[name="enableRecoveryKey"]').attr('status', recoveryStatus);
				OC.msg.finishedError('#encryptionSetRecoveryKey .msg', JSON.parse(jqXHR.responseText).data.message);
			});


	});

	$("#repeatEncryptionRecoveryPassword").keyup(function (event) {
		if (event.keyCode == 13) {
			$("#enableRecoveryKey").click();
		}
	});

	// change recovery password

	$('button:button[name="submitChangeRecoveryKey"]').click(function () {
		var oldRecoveryPassword = $('#oldEncryptionRecoveryPassword').val();
		var newRecoveryPassword = $('#newEncryptionRecoveryPassword').val();
		var confirmNewPassword = $('#repeatedNewEncryptionRecoveryPassword').val();
		OC.msg.startSaving('#encryptionChangeRecoveryKey .msg');
		$.post(
			OC.generateUrl('/apps/encryption/ajax/changeRecoveryPassword'),
			{
				oldPassword: oldRecoveryPassword,
				newPassword: newRecoveryPassword,
				confirmPassword: confirmNewPassword
			}
		).done(function (data) {
				OC.msg.finishedSuccess('#encryptionChangeRecoveryKey .msg', data.data.message);
			})
			.fail(function (jqXHR) {
				OC.msg.finishedError('#encryptionChangeRecoveryKey .msg', JSON.parse(jqXHR.responseText).data.message);
			});
	});

	$('#encryptHomeStorage').change(function() {
		$.post(
			OC.generateUrl('/apps/encryption/ajax/setEncryptHomeStorage'),
			{
				encryptHomeStorage: this.checked
			}
		);
	});

});

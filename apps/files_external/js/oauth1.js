/**
 *
 *
 * @author Joas Schilling <coding@schilljs.com>
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
 * @author Robin McCorkell <robin@mccorkell.me.uk>
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
window.addEventListener('DOMContentLoaded', function() {

	function displayGranted($tr) {
		$tr.find('.configuration input.auth-param').attr('disabled', 'disabled').addClass('disabled-success');
	}

	OCA.Files_External.Settings.mountConfig.whenSelectAuthMechanism(function($tr, authMechanism, scheme, onCompletion) {
		if (authMechanism === 'oauth1::oauth1') {
			var config = $tr.find('.configuration');
			config.append($(document.createElement('input'))
				.addClass('button auth-param')
				.attr('type', 'button')
				.attr('value', t('files_external', 'Grant access'))
				.attr('name', 'oauth1_grant')
			);

			onCompletion.then(function() {
				var configured = $tr.find('[data-parameter="configured"]');
				if ($(configured).val() == 'true') {
					displayGranted($tr);
				} else {
					var app_key = $tr.find('.configuration [data-parameter="app_key"]').val();
					var app_secret = $tr.find('.configuration [data-parameter="app_secret"]').val();
					if (app_key != '' && app_secret != '') {
						var pos = window.location.search.indexOf('oauth_token') + 12;
						var token = $tr.find('.configuration [data-parameter="token"]');
						if (pos != -1 && window.location.search.substr(pos, $(token).val().length) == $(token).val()) {
							var token_secret = $tr.find('.configuration [data-parameter="token_secret"]');
							var statusSpan = $tr.find('.status span');
							statusSpan.removeClass();
							statusSpan.addClass('waiting');
							$.post(OC.filePath('files_external', 'ajax', 'oauth1.php'), { step: 2, app_key: app_key, app_secret: app_secret, request_token: $(token).val(), request_token_secret: $(token_secret).val() }, function(result) {
								if (result && result.status == 'success') {
									$(token).val(result.access_token);
									$(token_secret).val(result.access_token_secret);
									$(configured).val('true');
									OCA.Files_External.Settings.mountConfig.saveStorageConfig($tr, function(status) {
										if (status) {
											displayGranted($tr);
										}
									});
								} else {
									OC.dialogs.alert(result.data.message, t('files_external', 'Error configuring OAuth1'));
								}
							});
						}
					}
				}
			});
		}
	});

	$('#externalStorage').on('click', '[name="oauth1_grant"]', function(event) {
		event.preventDefault();
		var tr = $(this).parent().parent();
		var app_key = $(this).parent().find('[data-parameter="app_key"]').val();
		var app_secret = $(this).parent().find('[data-parameter="app_secret"]').val();
		if (app_key != '' && app_secret != '') {
			var configured = $(this).parent().find('[data-parameter="configured"]');
			var token = $(this).parent().find('[data-parameter="token"]');
			var token_secret = $(this).parent().find('[data-parameter="token_secret"]');
			$.post(OC.filePath('files_external', 'ajax', 'oauth1.php'), { step: 1, app_key: app_key, app_secret: app_secret, callback: location.protocol + '//' + location.host + location.pathname }, function(result) {
				if (result && result.status == 'success') {
					$(configured).val('false');
					$(token).val(result.data.request_token);
					$(token_secret).val(result.data.request_token_secret);
					OCA.Files_External.Settings.mountConfig.saveStorageConfig(tr, function() {
						window.location = result.data.url;
					});
				} else {
					OC.dialogs.alert(result.data.message, t('files_external', 'Error configuring OAuth1'));
				}
			});
		} else {
			OC.dialogs.alert(
				t('files_external', 'Please provide a valid app key and secret.'),
				t('files_external', 'Error configuring OAuth1')
			);
		}
	});

});

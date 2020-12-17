/**
 *
 *
 * @author Björn Schießle <bjoern@schiessle.org>
 * @author Jan-Christoph Borchardt <hey@jancborchardt.net>
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
 * @author Lukas Reschke <lukas@statuscode.ch>
 * @author Morris Jobke <hey@morrisjobke.de>
 * @author Roeland Jago Douma <roeland@famdouma.nl>
 * @author Stefan Weil <sw@weilnetz.de>
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

	$('#fileSharingSettings button.pop-up').click(function() {
		var url = $(this).data('url');
		if (url) {
			var width = 600;
			var height = 400;
			var left = (screen.width/2)-(width/2);
			var top = (screen.height/2)-(height/2);

			window.open(url, 'name', 'width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
		}
	});

	$('#oca-files-sharing-add-to-your-website').click(function() {
		if ($('#oca-files-sharing-add-to-your-website-expanded').is(':visible')) {
			$('#oca-files-sharing-add-to-your-website-expanded').slideUp();
		} else {
			$('#oca-files-sharing-add-to-your-website-expanded').slideDown();
		}
	});

	/* Verification icon tooltip */
	$('#personal-settings-container .verify img').tooltip({placement: 'bottom', trigger: 'hover'});

	$('#fileSharingSettings .clipboardButton').tooltip({placement: 'bottom', title: t('core', 'Copy'), trigger: 'hover'});

	// Clipboard!
	var clipboard = new Clipboard('.clipboardButton');
	clipboard.on('success', function(e) {
		var $input = $(e.trigger);
		$input.tooltip('hide')
			.attr('data-original-title', t('core', 'Copied!'))
			.tooltip('fixTitle')
			.tooltip({placement: 'bottom', trigger: 'manual'})
			.tooltip('show');
		_.delay(function() {
			$input.tooltip('hide')
				.attr('data-original-title', t('core', 'Copy'))
				.tooltip('fixTitle');
		}, 3000);
	});
	clipboard.on('error', function (e) {
		var $input = $(e.trigger);
		var actionMsg = '';
		if (/iPhone|iPad/i.test(navigator.userAgent)) {
			actionMsg = t('core', 'Not supported!');
		} else if (/Mac/i.test(navigator.userAgent)) {
			actionMsg = t('core', 'Press ⌘-C to copy.');
		} else {
			actionMsg = t('core', 'Press Ctrl-C to copy.');
		}

		$input.tooltip('hide')
			.attr('data-original-title', actionMsg)
			.tooltip('fixTitle')
			.tooltip({placement: 'bottom', trigger: 'manual'})
			.tooltip('show');
		_.delay(function () {
			$input.tooltip('hide')
				.attr('data-original-title', t('core', 'Copy'))
				.tooltip('fixTitle');
		}, 3000);
	});


	$('#fileSharingSettings .hasTooltip').tooltip({placement: 'right'});
});

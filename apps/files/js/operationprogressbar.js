/**
 *
 *
 * @author Hannes Burger <hburger30@gmail.com>
 * @author James Lao <jameslao@users.noreply.github.com>
 * @author Tomasz Grobelny <tomasz@grobelny.net>
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
	var OperationProgressBar = OC.Backbone.View.extend({
		tagName: 'div',
		id: 'uploadprogresswrapper',
		events: {
			'click button.stop': '_onClickCancel'
		},

		render: function() {
			this.$el.html(OCA.Files.Templates['operationprogressbar']({
				textCancelButton: t('Cancel operation')
			}));
			this.setProgressBarText(t('Uploading …'), t('…'));
		},

		hideProgressBar: function() {
			var self = this;
			$('#uploadprogresswrapper .stop').fadeOut();
			$('#uploadprogressbar').fadeOut(function() {
				self.$el.trigger(new $.Event('resized'));
			});
		},

		hideCancelButton: function() {
			var self = this;
			$('#uploadprogresswrapper .stop').fadeOut(function() {
				self.$el.trigger(new $.Event('resized'));
			});
		},

		showProgressBar: function(showCancelButton) {
			if (showCancelButton) {
				showCancelButton = true;
			}
			$('#uploadprogressbar').progressbar({value: 0});
			if(showCancelButton) {
				$('#uploadprogresswrapper .stop').show();
			} else {
				$('#uploadprogresswrapper .stop').hide();
			}
			$('#uploadprogresswrapper .label').show();
			$('#uploadprogressbar').fadeIn();
			this.$el.trigger(new $.Event('resized'));
		},

		setProgressBarValue: function(value) {
			$('#uploadprogressbar').progressbar({value: value});
		},

		setProgressBarText: function(textDesktop, textMobile, title) {
			var labelHtml = OCA.Files.Templates['operationprogressbarlabel']({textDesktop: textDesktop, textMobile: textMobile});
			$('#uploadprogressbar .ui-progressbar-value').html(labelHtml);
			$('#uploadprogressbar .ui-progressbar-value>em').addClass('inner');
			$('#uploadprogressbar>em').replaceWith(labelHtml);
			$('#uploadprogressbar>em').addClass('outer');
			$('#uploadprogressbar').tooltip({placement: 'bottom', container: '#uploadprogresswrapper'});
			if (title) {
				$('#uploadprogressbar').attr('data-original-title', title);
				$('#uploadprogresswrapper .tooltip-inner').text(title);
			}
			if(textDesktop || textMobile) {
				$('#uploadprogresswrapper .stop').show();
			}
		},

		_onClickCancel: function (event) {
			this.trigger('cancel');
			return false;
		}
	});

	OCA.Files.OperationProgressBar = OperationProgressBar;
})(OC, OCA);

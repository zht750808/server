/**
* @copyright 2015 Vincent Petry <pvince81@owncloud.com>
 *
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
 * @author Julius Haertl <jus@bitgrid.net>
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

describe('Apps base tests', function() {
	describe('Sidebar utility functions', function() {
		beforeEach(function() {
			$('#testArea').append('<div id="content"><div id="app-content">Content</div><div id="app-sidebar">The sidebar</div></div>');
			jQuery.fx.off = true;
		});
		afterEach(function() {
			jQuery.fx.off = false;
		});
		it('shows sidebar', function() {
			var $el = $('#app-sidebar');
			OC.Apps.showAppSidebar();
			expect($el.hasClass('disappear')).toEqual(false);
		});
		it('hides sidebar', function() {
			var $el = $('#app-sidebar');
			OC.Apps.showAppSidebar();
			OC.Apps.hideAppSidebar();
			expect($el.hasClass('disappear')).toEqual(true);
		});
		it('triggers appresize event when visibility changed', function() {
			var eventStub = sinon.stub();
			$('#content').on('appresized', eventStub);
			OC.Apps.showAppSidebar();
			expect(eventStub.calledOnce).toEqual(true);
			OC.Apps.hideAppSidebar();
			expect(eventStub.calledTwice).toEqual(true);
		});
	});
});


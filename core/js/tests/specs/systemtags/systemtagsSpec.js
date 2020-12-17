/**
* @copyright 2016 Joas Schilling <nickvergessen@owncloud.com>
 *
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

describe('OC.SystemTags tests', function() {
	it('describes non existing tag', function() {
		var $return = OC.SystemTags.getDescriptiveTag('23');
		expect($return.text()).toEqual('Non-existing tag #23');
		expect($return.hasClass('non-existing-tag')).toEqual(true);
	});

	it('describes SystemTagModel', function() {
		var tag = new OC.SystemTags.SystemTagModel({
			id: 23,
			name: 'Twenty Three',
			userAssignable: true,
			userVisible: true
		});
		var $return = OC.SystemTags.getDescriptiveTag(tag);
		expect($return.text()).toEqual('Twenty Three');
		expect($return.hasClass('non-existing-tag')).toEqual(false);
	});

	it('describes JSON tag object', function() {
		var $return = OC.SystemTags.getDescriptiveTag({
			id: 42,
			name: 'Fourty Two',
			userAssignable: true,
			userVisible: true
		});
		expect($return.text()).toEqual('Fourty Two');
		expect($return.hasClass('non-existing-tag')).toEqual(false);
	});

	it('scope', function() {
		function testScope(userVisible, userAssignable, expectedText) {
			var $return = OC.SystemTags.getDescriptiveTag({
				id: 42,
				name: 'Fourty Two',
				userAssignable: userAssignable,
				userVisible: userVisible
			});
			expect($return.text()).toEqual(expectedText);
			expect($return.hasClass('non-existing-tag')).toEqual(false);
		}

		testScope(true, true, 'Fourty Two');
		testScope(false, true, 'Fourty Two (invisible)');
		testScope(false, false, 'Fourty Two (invisible)');
		testScope(true, false, 'Fourty Two (restricted)');
	});
});

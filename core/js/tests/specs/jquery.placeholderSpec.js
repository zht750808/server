/**
 *
 *
 * @author Sergey Shliakhov <husband.sergey@gmail.com>
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

describe('jquery.placeholder tests', function() {

	var $div;

	beforeEach(function() {
		$('#testArea').append($('<div id="placeholderdiv">'));
		$div = $('#placeholderdiv');
	});

	afterEach(function() {
		$div.remove();
	});

	describe('placeholder text', function() {
		it('shows one first letter if one word in a input text', function() {
			spyOn($div, 'html');
			$div.imageplaceholder('Seed', 'Name')
			expect($div.html).toHaveBeenCalledWith('N');
		});

		it('shows two first letters if two words in a input text', function() {
			spyOn($div, 'html');
			$div.imageplaceholder('Seed', 'First Second')
			expect($div.html).toHaveBeenCalledWith('FS');
		});

		it('shows two first letters if more then two words in a input text', function() {
			spyOn($div, 'html');
			$div.imageplaceholder('Seed', 'First Second Middle')
			expect($div.html).toHaveBeenCalledWith('FS');
		});
	});
});

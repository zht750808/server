/**
 *
 *
 * @author Morris Jobke <hey@morrisjobke.de>
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

(function(){
	var Semaphore = function(max) {
		var counter = 0;
		var waiting = [];

		this.acquire = function() {
			if(counter < max) {
				counter++;
				return new Promise(function(resolve) { resolve(); });
			} else {
				return new Promise(function(resolve) { waiting.push(resolve); });
			}
		};

		this.release = function() {
			counter--;
			if (waiting.length > 0 && counter < max) {
				counter++;
				var promise = waiting.shift();
				promise();
			}
		};
	};

	// needed on public share page to properly register this
	if (!OCA.Files) {
		OCA.Files = {};
	}
	OCA.Files.Semaphore = Semaphore;

})();

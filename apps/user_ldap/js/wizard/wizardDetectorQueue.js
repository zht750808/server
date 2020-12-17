/**
 *
 *
 * @author Arthur Schiwon <blizzz@arthur-schiwon.de>
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

OCA = OCA || {};

(function() {
	/**
	 * @classdesc only run detector is allowed to run at a time. Basically
	 * because we cannot have parallel LDAP connections per session. This
	 * queue is takes care of running all the detectors one after the other.
	 *
	 * @constructor
	 */
	var WizardDetectorQueue = OCA.LDAP.Wizard.WizardObject.subClass({
		/**
		 * initializes the instance. Always call it after creating the instance.
		 */
		init: function() {
			this.queue = [];
			this.isRunning = false;
		},

		/**
		 * empties the queue and cancels a possibly running request
		 */
		reset: function() {
			this.queue = [];
			if(!_.isUndefined(this.runningRequest)) {
				this.runningRequest.abort();
				delete this.runningRequest;
			}
			this.isRunning = false;
		},

		/**
		 * a parameter-free callback that eventually executes the run method of
		 * the detector.
		 *
		 * @callback detectorCallBack
		 * @see OCA.LDAP.Wizard.ConfigModel._processSetResult
		 */

		/**
		 * adds a detector to the queue and attempts to trigger to run the
		 * next job, because it might be the first.
		 *
		 * @param {detectorCallBack} callback
		 */
		add: function(callback) {
			this.queue.push(callback);
			this.next();
		},

		/**
		 * Executes the next detector if none is running. This method is also
		 * automatically invoked after a detector finished.
		 */
		next: function() {
			if(this.isRunning === true || this.queue.length === 0) {
				return;
			}

			this.isRunning = true;
			var callback = this.queue.shift();
			var request = callback();

			// we receive either false or a jqXHR object
			// false in case the detector decided against executing
			if(request === false) {
				this.isRunning = false;
				this.next();
				return;
			}
			this.runningRequest = request;

			var detectorQueue = this;
			$.when(request).then(function() {
				detectorQueue.isRunning = false;
				detectorQueue.next();
			});
		}
	});

	OCA.LDAP.Wizard.WizardDetectorQueue = WizardDetectorQueue;
})();

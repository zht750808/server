/**
 *
 *
 * @author Arthur Schiwon <blizzz@arthur-schiwon.de>
 * @author John Molakvoæ (skjnldsv) <skjnldsv@protonmail.com>
 * @author Jörn Friedrich Dreyer <jfd@butonic.de>
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

OCA = OCA || {};



/**
 * initializes the wizard and related components and kicks it off.
 */

(function() {
	var Wizard = function() {
		var detectorQueue = new OCA.LDAP.Wizard.WizardDetectorQueue();
		detectorQueue.init();

		var detectors = [];
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorPort());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorBaseDN());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorEmailAttribute());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorUserDisplayNameAttribute());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorUserGroupAssociation());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorUserObjectClasses());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorGroupObjectClasses());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorGroupsForUsers());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorGroupsForGroups());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorFilterUser());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorFilterLogin());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorFilterGroup());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorUserCount());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorGroupCount());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorAvailableAttributes());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorTestLoginName());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorTestBaseDN());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorTestConfiguration());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorClearUserMappings());
		detectors.push(new OCA.LDAP.Wizard.WizardDetectorClearGroupMappings());

		var model = new OCA.LDAP.Wizard.ConfigModel();
		model.init(detectorQueue);
		// NOTE: order of detectors may play a role
		// for example, BaseDN detector needs the port. The port is typically found
		// by the Port Detector. If BaseDN detector was run first, it will not have
		// all necessary information. Only after Port Detector was executed…
		for (var i = 0; i < detectors.length; i++) {
			model.registerDetector(detectors[i]);
		}

		var filterOnTypeFactory = new OCA.LDAP.Wizard.FilterOnTypeFactory();

		var tabs = [];
		tabs.push(new OCA.LDAP.Wizard.WizardTabUserFilter(filterOnTypeFactory, 1));
		tabs.push(new OCA.LDAP.Wizard.WizardTabLoginFilter(2));
		tabs.push(new OCA.LDAP.Wizard.WizardTabGroupFilter(filterOnTypeFactory, 3));
		tabs.push(new OCA.LDAP.Wizard.WizardTabAdvanced());
		tabs.push(new OCA.LDAP.Wizard.WizardTabExpert());

		var view = new OCA.LDAP.Wizard.WizardView(model);
		view.init();
		view.setModel(model);
		for (var j = 0; j < tabs.length; j++) {
			view.registerTab(tabs[j], '#ldapWizard' + (j + 2));
		}

		var controller = new OCA.LDAP.Wizard.Controller();
		controller.init();
		controller.setView(view);
		controller.setModel(model);
		controller.run();
	};

	OCA.LDAP.Wizard.Wizard = Wizard;
})();

window.addEventListener('DOMContentLoaded', function() {
	new OCA.LDAP.Wizard.Wizard();
});

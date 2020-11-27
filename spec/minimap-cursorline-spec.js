/** @babel */

// import MinimapCursorLine from '../lib/minimap-cursorline'

describe('MinimapCursorLine', () => {
	let workspaceElement, editor, minimap

	beforeEach(async () => {
		workspaceElement = atom.views.getView(atom.workspace)
		jasmine.attachToDOM(workspaceElement)

		editor = await atom.workspace.open('sample.js')

		// Package activation will be deferred to the configured, activation hook, which is then triggered
		// Activate activation hook
		atom.packages.triggerDeferredActivationHooks()
		atom.packages.triggerActivationHook('core:loaded-shell-environment')

		const minimapPkg = await atom.packages.activatePackage('minimap')
		minimap = minimapPkg.mainModule.minimapForEditor(editor)

		await atom.packages.activatePackage('minimap-cursorline')
	})

	describe('with an open editor that have a minimap', () => {
		describe('when cursor markers are added to the editor', () => {
			it('creates decoration for the cursor markers', () => {
				editor.addCursorAtScreenPosition({ row: 2, column: 3 })

				expect(Object.keys(minimap.decorationsByMarkerId).length).toBe(1)
			})
		})
	})
})

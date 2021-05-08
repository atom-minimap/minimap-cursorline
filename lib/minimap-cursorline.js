/** @babel */

import { CompositeDisposable } from 'atom'

let MinimapCursorLineBinding = null

export default {

	active: false,

	isActive () { return this.active },

	bindings: new Map(),

	activate () {
		require('atom-package-deps').install('minimap-cursorline')
	},

	consumeMinimapServiceV1 (minimap) {
		this.minimap = minimap
		this.minimap.registerPlugin('cursorline', this)
	},

	deactivate () {
		if (!this.minimap) { return }
		this.minimap.unregisterPlugin('cursorline')
		this.minimap = null
	},

	activatePlugin () {
		if (this.active) { return }

		this.subscriptions = new CompositeDisposable()
		this.active = true

		this.minimapsSubscription = this.minimap.observeMinimaps((minimap) => {
			if (MinimapCursorLineBinding === null) {
				MinimapCursorLineBinding = require('./minimap-cursorline-binding')
			}

			const id = minimap.id
			const binding = new MinimapCursorLineBinding(minimap)
			this.bindings.set(id, binding)

			const subscription = minimap.onDidDestroy(() => {
				binding.destroy()
				this.subscriptions.remove(subscription)
				subscription.dispose()
				this.bindings.delete(id)
			})

			this.subscriptions.add(subscription)
		})
	},

	deactivatePlugin () {
		if (!this.active) { return }

		for (const binding of this.bindings.values()) { binding.destroy() }
		this.bindings.clear()
		this.active = false
		this.minimapsSubscription.dispose()
		this.subscriptions.dispose()
	},

}

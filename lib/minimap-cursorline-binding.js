/** @babel */

import { CompositeDisposable } from 'atom'

export default class MinimapCursorLineBinding {
	constructor (minimap) {
		this.minimap = minimap
		this.subscriptions = new CompositeDisposable()
		this.decorationsByMarkerId = new Map()
		this.decorationSubscriptionsByMarkerId = new Map()

		this.subscriptions.add(this.minimap.getTextEditor().observeCursors((cursor) => {
			this.handleMarker(cursor.getMarker())
		}))
	}

	handleMarker (marker) {
		const { id } = marker
		const decoration = this.minimap.decorateMarker(
			marker, { type: 'line', class: 'cursor-line' },
		)
		this.decorationsByMarkerId.set(id, decoration)

		this.decorationSubscriptionsByMarkerId.set(id,
			decoration.onDidDestroy(() => {
				const cachedDecoration = this.decorationSubscriptionsByMarkerId.get(id)
				if (cachedDecoration) {
					cachedDecoration.dispose()
				}

				this.decorationsByMarkerId.delete(id)
				this.decorationSubscriptionsByMarkerId.delete(id)
			}),
		)
	}

	destroy () {
		for (const [id, decoration] of this.decorationsByMarkerId) {
			const decorationSub = this.decorationSubscriptionsByMarkerId.get(id)
			if (decorationSub) {
				decorationSub.dispose()
			}
			decoration.destroy()

			this.decorationsByMarkerId.delete(id)
			this.decorationSubscriptionsByMarkerId.delete(id)
		}

		this.subscriptions.dispose()
	}
}

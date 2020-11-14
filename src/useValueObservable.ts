import { ValueObservable } from 'r-value-observable'
import { useEffect, useState } from 'react'

export function useValueObservable<T>(observable: ValueObservable<T> | (() => ValueObservable<T>)): T {
	const [ stream ] = useState(observable)
	const [ value, setValue ] = useState(stream.value)

	useEffect(() => {
		const subscription = stream.subscribe(next => {
			setValue(next)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	return value
}

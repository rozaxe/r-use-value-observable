import { renderHook, act } from '@testing-library/react-hooks'
import { ValueObservable } from 'r-value-observable'
import { BehaviorSubject, Subject, Observable } from 'rxjs'

import { useValueObservable } from './useValueObservable'

describe('useValueObservable', () => {
	test('sync subject', () => {
		const hello$ = new BehaviorSubject('hello')
		const { result } = renderHook(() => useValueObservable(hello$))
		expect(result.current).toBe('hello')
	})

	test('complete subject', () => {
		const hello$ = new BehaviorSubject(0)
		const { result } = renderHook(() => useValueObservable(hello$))
		expect(result.current).toBe(0)
		act(() => hello$.complete())
		expect(result.current).toBe(0)
	})

	test('unsubscribe on unmount', () => {
		const hello$ = new BehaviorSubject(0)
		expect(hello$.observers).toHaveLength(0)
		const { unmount } = renderHook(() => useValueObservable(hello$))
		expect(hello$.observers).toHaveLength(1)
		unmount()
		expect(hello$.observers).toHaveLength(0)
	})

	test('many unsubscribe on unmount', () => {
		const hello$ = new BehaviorSubject(0)
		expect(hello$.observers).toHaveLength(0)
		const a = renderHook(() => useValueObservable(hello$))
		const b = renderHook(() => useValueObservable(hello$))
		expect(hello$.observers).toHaveLength(2)
		a.unmount()
		expect(hello$.observers).toHaveLength(1)
		b.unmount()
		expect(hello$.observers).toHaveLength(0)
	})

	test('on rerender', () => {
		const hello$ = new BehaviorSubject('hello')
		const spyOnSubscribe = jest.spyOn(hello$, 'subscribe')
		const { rerender } = renderHook(() => useValueObservable(hello$))
		expect(spyOnSubscribe).toHaveBeenCalledTimes(1)
		rerender()
		expect(spyOnSubscribe).toHaveBeenCalledTimes(1)
	})

	test('with callback', () => {
		const mockObservableOf = jest.fn((n: number): ValueObservable<number> => new BehaviorSubject(n))
		const { rerender, result } = renderHook(() => useValueObservable(() => mockObservableOf(42)))
		expect(mockObservableOf).toHaveBeenCalledTimes(1)
		expect(result.current).toBe(42)
		rerender()
		expect(mockObservableOf).toHaveBeenCalledTimes(1)
	})
})

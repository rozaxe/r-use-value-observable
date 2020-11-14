import { Observable } from 'rxjs';
export declare function useObservable<T>(observable: Observable<T> | (() => Observable<T>), initialValue?: T | null): T | null;

import { useCallback, useRef, useEffect } from "react";

/**
 * Returns a debounced function that delays invoking `fn` until after `delay` ms
 * have passed since the last time it was invoked. Automatically re-creates
 * the callback if `deps` change.
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @param deps - Dependency array (like useEffect)
 * @returns A debounced version of `fn`
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
  deps: any[] = []
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay, ...deps]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debouncedFn;
}


/**
 * Runs a debounced function when specified dependencies change.
 *
 * @param fn - Function to call after debounce
 * @param deps - Dependency array to watch
 * @param delay - Debounce delay in ms (default: 500)
 */
export function useDebouncedCallbackOnValueChange(
  fn: () => void,
  deps: any[],
  delay: number = 500
): void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      fn();
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

package customslice

type Selector[U any, T comparable] func(U) T

func UniqueSliceElements[U any, T comparable](inputSlice []U, selector Selector[U, T]) []T {
	uniqueSlice := make([]T, 0, len(inputSlice))
	seen := make(map[T]bool, len(inputSlice))
	for _, raw := range inputSlice {
		element := selector(raw)
		if !seen[element] {
			uniqueSlice = append(uniqueSlice, element)
			seen[element] = true
		}
	}
	return uniqueSlice
}

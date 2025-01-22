package testutil

import (
	"reflect"
	"testing"
)

func Equal(t *testing.T, got, want interface{}) {
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Not Equal \n got: %v \n want: %v ", got, want)
	}
}

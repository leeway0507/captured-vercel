package assert

import (
	"reflect"
	"testing"
)

func Equal(t *testing.T, got, want interface{}) {
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Not Equal got: %v \n want: %v ", got, want)
	}
}

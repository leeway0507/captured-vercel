package testutil

import (
	"testing"
)

func Test_Mock_DB(t *testing.T) {
	session := MockDB(t)
	defer FinishAll(t, session)

}

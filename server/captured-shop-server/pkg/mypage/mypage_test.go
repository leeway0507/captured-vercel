package mypage

import (
	"context"
	"product-server/dbtest"
	"product-server/ent"
	"product-server/ent/enttest"
	"testing"

	_ "github.com/mattn/go-sqlite3"
)

func Test_Mypage(t *testing.T) {
	ctx := context.Background()
	session := enttest.Open(t, "sqlite3", "file:ent?mode=memory&_fk=1")
	defer session.Close()
	dbtest.InsertTestUserData(t, session)
	dbtest.InsertTestAddressData(t, session)

	t.Run("Test_GetAddressByUserID", func(t *testing.T) {
		testID := "6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc"
		res, err := GetAddressByUserID(ctx, session, testID)
		if err != nil {
			t.Error(err)
		}
		if len(res) == 0 {
			t.Error("\n len(res) must be 1 \n ")
		}
		t.Log(res)
	})

	t.Run("Test_GetAddressByAddressID", func(t *testing.T) {
		testID := "UA-6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc-0"
		res, err := GetAddressByAddressID(ctx, session, testID)
		if err != nil {
			t.Error(err)
		}
		if len(res) == 0 {
			t.Error("len(res) must be 1")
		}
		t.Log(res)
	})

	t.Run("Test_CreateAddressID", func(t *testing.T) {
		testID := "6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc"
		res, err := CreateAddressID(ctx, session, testID)
		if res == "" || err != nil {
			t.Error(err)
		}
		t.Log("\n" + res + "\n")
	})

	t.Run("Test_UpdateAddress", func(t *testing.T) {
		userAddress := ent.UserAddress{
			ID:              "UA-6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc-0",
			UserID:          "6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc",
			KrName:          "업데이트",
			EnName:          "test",
			CustomID:        "p123456789012",
			Phone:           "010-0000-0000",
			KrAddress:       "서울 양천구 목동중앙로 143(목동1차우성아파트)",
			KrAddressDetail: "101,801 143 Mokdongjungang-ro, Yangcheon-gu, Seoul",
			EnAddress:       "143, Mokdongjungang-ro, Yangcheon-gu, Seoul, Korea",
			EnAddressDetail: "update",
		}
		err := UpdatAddress(ctx, session, &userAddress)

		if err != nil {
			t.Error(err)
		}

	},
	)

	t.Run("Test_DeleteAddress_Case_Perament_False", func(t *testing.T) {
		id := "UA-6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc-0"
		err := DeleteAddress(ctx, session, id)
		if err != PrimaryErr {
			t.Error(err)
		}
		t.Log(err) // a Default Address is not deletable.

	})

	t.Run("Test_CreateAddress_second", func(t *testing.T) {
		userAddress := ent.UserAddress{
			UserID:          "6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc",
			KrName:          "테스트",
			EnName:          "test",
			CustomID:        "p123456789012",
			Phone:           "010-0000-0000",
			KrAddress:       "서울 양천구 목동중앙로 143(목동1차우성아파트)",
			KrAddressDetail: "101,801 143 Mokdongjungang-ro, Yangcheon-gu, Seoul",
			EnAddress:       "143, Mokdongjungang-ro, Yangcheon-gu, Seoul, Korea",
			EnAddressDetail: "",
		}
		err := CreateAddress(ctx, session, &userAddress)
		if err != nil {
			t.Error(err)
		}

	})
	t.Run("Test_DeleteAddress", func(t *testing.T) {
		id := "UA-6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc-1"
		err := DeleteAddress(ctx, session, id)
		if err != nil {
			t.Error(err)
		}

	})
}

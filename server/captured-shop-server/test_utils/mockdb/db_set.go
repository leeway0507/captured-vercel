package mockdb

import (
	"context"
	"product-server/ent"
	"testing"
	"time"
)

func InsertTestProductInfoData(t testing.TB, session *ent.Client) {
	ctx := context.Background()

	Bulk := ProdInfoCreateBulk(t, session)
	_, err := session.ProductInfo.CreateBulk(Bulk...).Save(ctx)
	if err != nil {
		t.Error(err)
	}
}

func InsertTestSizeData(t testing.TB, session *ent.Client) {
	ctx := context.Background()

	Bulk := SizeCreateBulk(t, session)
	_, err := session.Size.CreateBulk(Bulk...).Save(ctx)
	if err != nil {
		t.Error(err)
	}
}

func InsertTestUserData(t testing.TB, session *ent.Client) {
	ctx := context.Background()
	res, err := session.User.Create().
		SetID("6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc").
		SetEmail("test@test.com").
		SetKrName("테스트").
		SetNillablePassword(nil).
		SetSignUpType("네이버").
		SetRegisterAt(time.Now()).
		SetLastLogin(time.Now()).Save(ctx)
	if err != nil {
		t.Error(err)
	}

	t.Logf("userID %v", res.ID)
}

func InsertTestAddressData(t testing.TB, session *ent.Client) {
	ctx := context.Background()
	userAddress := ent.UserAddress{
		ID:              "UA-6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc-0",
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
	_, err := session.UserAddress.
		Create().
		SetID(userAddress.ID).
		SetUserID(userAddress.UserID).
		SetKrName(userAddress.KrName).
		SetKrAddress(userAddress.KrAddress).
		SetKrAddressDetail(userAddress.KrAddressDetail).
		SetEnName(userAddress.EnName).
		SetEnAddress(userAddress.EnAddress).
		SetEnAddressDetail(userAddress.EnAddressDetail).
		SetPhone(userAddress.Phone).
		SetCustomID(userAddress.CustomID).
		SetPermanent(false).
		Save(ctx)

	if err != nil {
		t.Error(err)
	}
	t.Log("Successfully Created a user address")
}

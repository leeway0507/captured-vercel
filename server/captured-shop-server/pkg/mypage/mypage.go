package mypage

import (
	"context"
	"errors"
	"fmt"
	"product-server/ent"
	"product-server/ent/useraddress"
	"strconv"
	"strings"
)

var (
	PrimaryErr = errors.New("a Default Address is not deletable.")
)

func GetAddressByUserID(ctx context.Context, session *ent.Client, userID string,
) ([]*ent.UserAddress, error) {
	return session.UserAddress.Query().
		Where(useraddress.UserIDEQ(userID),
			useraddress.PermanentEQ(false),
		).All(ctx)
}

func GetAddressByAddressID(ctx context.Context, session *ent.Client, addressID string,
) ([]*ent.UserAddress, error) {
	return session.UserAddress.Query().
		Where(useraddress.IDEQ(addressID),
			useraddress.PermanentEQ(false),
		).All(ctx)
}

func CreateAddress(ctx context.Context, session *ent.Client, AddressForm *ent.UserAddress) error {
	addressID, err := CreateAddressID(ctx, session, AddressForm.UserID)
	if err != nil {
		return err
	}

	_, err = session.UserAddress.
		Create().
		SetID(addressID).
		SetUserID(AddressForm.UserID).
		SetKrName(AddressForm.KrName).
		SetKrAddress(AddressForm.KrAddress).
		SetKrAddressDetail(AddressForm.KrAddressDetail).
		SetEnName(AddressForm.EnName).
		SetEnAddress(AddressForm.EnAddress).
		SetEnAddressDetail(AddressForm.EnAddressDetail).
		SetPhone(AddressForm.Phone).
		SetCustomID(AddressForm.CustomID).
		SetPermanent(false).
		Save(ctx)

	if err != nil {
		return err
	}
	return nil
}

func CreateAddressID(ctx context.Context, session *ent.Client, userID string) (string, error) {
	res, err := session.UserAddress.Query().
		Where(useraddress.UserIDEQ(userID),
			useraddress.Permanent(false)).
		Order(useraddress.ByID(), ent.Desc()).
		All(ctx)

	if err != nil {
		return "", err
	}
	if len(res) == 0 {
		return fmt.Sprintf("UA-%v-0", userID), nil
	} else {
		lastNumber := strings.Split(res[0].ID, "-")
		num, _ := strconv.Atoi(lastNumber[len(lastNumber)-1])
		fmt.Println(num)
		return fmt.Sprintf("UA-%v-%v", userID, num+1), nil
	}

}

func UpdatAddress(ctx context.Context, session *ent.Client, AddressForm *ent.UserAddress) error {
	_, err := session.UserAddress.UpdateOneID(AddressForm.ID).
		SetKrName(AddressForm.KrName).
		SetKrAddress(AddressForm.KrAddress).
		SetKrAddressDetail(AddressForm.KrAddressDetail).
		SetEnName(AddressForm.EnName).
		SetEnAddress(AddressForm.EnAddress).
		SetEnAddressDetail(AddressForm.EnAddressDetail).
		SetPhone(AddressForm.Phone).
		SetCustomID(AddressForm.CustomID).
		Save(ctx)
	return err

}

func DeleteAddress(ctx context.Context, session *ent.Client, AddressID string) error {
	x := strings.Split(AddressID, "-")

	if x[len(x)-1] == "0" {
		return PrimaryErr
	}

	// 주소 삭제하지 않고 보여주지 않는 식으로 처리
	// permanent = isDeleted
	return session.UserAddress.Update().
		Where(useraddress.IDEQ(AddressID)).
		SetPermanent(true).
		Exec(ctx)
}

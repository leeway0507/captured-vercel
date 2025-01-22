package book

import (
	"context"
	"database/sql"
	"errors"

	lru "github.com/hashicorp/golang-lru/v2"
)

type Response[D any] struct {
	Data        Page[D] `json:"data"`
	CurrentPage int     `json:"currentPage"`
	LastPage    int     `json:"lastPage"`
	FromCahce   bool    `json:"fromCache"`
	Err         error   `json:"error"`
}
type SearchDataFunc[F, D any] func(ctx context.Context, index F) (*[]D, error)

type Page[D any] []D
type Chapter[D any] map[int]Page[D]
type Book[F comparable, D any] struct {
	Session      *sql.DB
	LimitPerPage int
	TOC          *lru.Cache[F, Chapter[D]] // TOC : Table of Contents
}

func (b *Book[F, D]) FindPage(ctx context.Context, index F, page int, SearchData SearchDataFunc[F, D]) *Response[D] {
	cachedChapter, ok := b.TOC.Get(index)

	if ok {
		data := cachedChapter[page]
		return &Response[D]{
			Data:        data,
			CurrentPage: page,
			LastPage:    len(cachedChapter),
			FromCahce:   true,
			Err:         nil,
		}
	}

	chapter, err := b.CreateChapter(ctx, index, SearchData)
	if err != nil {
		return b.ErrorResponse(page, err)
	}

	return &Response[D]{
		Data:        chapter[page],
		CurrentPage: page,
		LastPage:    len(chapter),
		FromCahce:   false,
		Err:         nil,
	}
}
func (b *Book[F, D]) CreateChapter(ctx context.Context, index F, SearchData SearchDataFunc[F, D]) (Chapter[D], error) {
	data, err := SearchData(ctx, index)
	if err != nil {
		return nil, err
	}

	chapter, err := b.BindPage(*data)
	if err != nil {
		return nil, err
	}

	b.TOC.Add(index, chapter)
	return chapter, nil
}

func (b *Book[F, D]) SearchData(ctx context.Context, index F) (Page[D], error) {
	err := errors.New("Book's SearchData Method is not defined")
	return Page[D]{}, err
}

func (b *Book[F, D]) BindPage(data []D) (Chapter[D], error) {

	if b.LimitPerPage == 0 {
		return Chapter[D]{}, errors.New("Book Error : LimitPerPage is 0")
	}

	lenData := len(data)
	q, r := lenData/b.LimitPerPage, lenData%b.LimitPerPage

	if r != 0 {
		q++
	}

	Chapter := make(map[int]Page[D])

	for i := 0; i < q; i++ {
		start, end := i*b.LimitPerPage, (i+1)*b.LimitPerPage
		if i+1 == q {
			end = len(data)
		}
		Chapter[i+1] = data[start:end]
	}

	return Chapter, nil
}

func (b *Book[F, D]) ErrorResponse(page int, err error) *Response[D] {
	return &Response[D]{
		Data:        nil,
		CurrentPage: page,
		LastPage:    0,
		FromCahce:   false,
		Err:         err,
	}
}

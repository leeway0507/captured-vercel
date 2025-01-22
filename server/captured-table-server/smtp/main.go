package main

import (
	"backend/lib/envset"
	"fmt"
	"log"
	"net/smtp"
	"os"
	"strconv"
	"strings"
)

func main() {
	envset.LoadEnv()

	// ######
	storeName := "메아리"
	to := []string{"sungeun6508@gmail.com"}
	subject := "손쉬운 가격 비교로 최저가 제품을 찾아 마진율을 올려보세요."
	// subject := "검색 한 번으로 전세계 편집샵 제품을 한눈에 비교해보세요."
	// subject := "복잡한 배송비 계산, 어지러운 관부가세 계산 없이 제품을 찾아보세요."
	log.Printf("\n 스튜디오 이름 %s \n 메일주소 %s", storeName, to)
	// ######

	// Set up authentication information
	smtpServer := "smtp.gmail.com"
	smtpPort := 587 // Change this if your SMTP server uses a different port
	email := os.Getenv("GMAIL_ID")
	password := os.Getenv("GMAIL_APP_PASSWORD")

	// Set up the message
	var from string
	var filePath string

	if strings.Contains(to[0], "@gmail.com") {
		from = fmt.Sprintf("CAPTURED %s", os.Getenv("SENDING_EMAIL"))
		filePath = "/Users/yangwoolee/repo/captured-filter/backend/smtp/gmail.html"

	} else {
		from = "CAPTURED wecapturedkr@gmail.com"
		filePath = "/Users/yangwoolee/repo/captured-filter/backend/smtp/naver.html"
	}

	htmlContent, err := os.ReadFile(filePath)
	if err != nil {
		log.Fatal("Error reading HTML file:", err)
	}
	body := strings.Replace(string(htmlContent), "STORE_NAME", storeName, 1)

	message := "From: " + from + "\n" +
		"To: " + to[0] + "\n" +
		"Subject: " + subject + "\n" +
		"MIME-Version: 1.0\n" +
		"Content-Type: text/html\n\n" +
		body

	// Authenticate with the SMTP server
	auth := smtp.PlainAuth("", email, password, smtpServer)

	// Connect to the server, authenticate, and send the email
	err = smtp.SendMail(smtpServer+":"+strconv.Itoa(smtpPort), auth, from, to, []byte(message))
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Email sent successfully!")

}

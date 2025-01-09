import ThirdPartyPolicy from '../agreement-third-party'

function PrivacyPolicy() {
    const title = 'text-base font-medium py-4'
    return (
        <>
            <div className="text-2xl py-2 font-medium">개인정보 처리방침</div>
            <div>
                스톡헌터스(이하 ‘회사’라 한다)는 「개인정보 보호법」 제30조에 따라 정보주체에게
                개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게
                처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </div>
            <>
                <div className={`${title}`}>1. 수집하는 개인정보 항목</div>
                <div className="flex flex-col gap-2">
                    <div>[회원정보] 성명, 이메일, 비밀번호</div>
                    <div>
                        [배송지정보] 성명, 영문 성명, 휴대폰번호, 통관번호, 한글 주소, 영문 주소
                    </div>
                    <div>
                        [결제정보] 구매자명, 휴대폰번호, 결제 수단, 결제 수단별 정보, 결제 금액{' '}
                    </div>
                    <div>
                        인터넷 서비스 이용과정에서 아래 개인정보 항목이 자동으로 생성되어 수집될 수
                        있습니다.
                    </div>
                    <div className="px-2">
                        <span>-</span>IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록, 불량
                        이용기록 등
                    </div>
                </div>
            </>
            <>
                <div className={`${title}`}>2. 개인정보의 수집 및 이용 목적</div>
                <div className="flex flex-col gap-2">
                    <div>[회원정보] </div>
                    <ul className="list-inside flex flex-col gap-1">
                        <li>
                            <span className="px-2">•</span>사용자 식별 및 관리
                        </li>
                    </ul>
                    <div>[배송지정보]</div>
                    <ul className="list-inside flex flex-col gap-1">
                        <li>
                            <span className="px-2">•</span>상품 배송을 위한 배송지 정보 제공 및 관리
                        </li>
                        <li>
                            <span className="px-2">•</span>구매대행 상품에 대한 통관 대행{' '}
                        </li>
                    </ul>
                    <div>[결제정보]</div>
                    <ul className="list-inside flex flex-col gap-1">
                        <li>
                            <span className="px-2">•</span>결제수단(신용카드 등)을 이용한 전자결제
                            서비스 제공
                        </li>
                        <li>
                            <span className="px-2">•</span>결제한 거래의 취소 또는 환불 등
                            전자상거래 관련 서비스 제공
                        </li>
                        <li>
                            <span className="px-2">•</span>전자결제 결과 조회 및 통보
                        </li>
                        <li>
                            <span className="px-2">•</span>세금계산서 및 현금영수증 발행
                        </li>
                    </ul>
                </div>
            </>
            <>
                <div className={`${title}`}>3. 개인정보의 파기절차 및 방법</div>
                <div className="flex flex-col gap-2">
                    <div>
                        회사는 원칙적으로 개인정보의 보유기간의 경과, 처리목적 달성 등 개인정보가
                        불필요하게 되었을 때에는 지체없이 해당 정보를 파기합니다.
                    </div>
                    <div>
                        파기절차 : 회사는 파기 사유가 발생한 개인정보를 선정한 뒤 개인정보를
                        파기합니다.
                    </div>
                    <div>
                        파기방법 : 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적
                        방법을 사용하여 삭제합니다.
                    </div>
                </div>
            </>
            <ThirdPartyPolicy />
            <>
                <div className={`${title}`}>7. 이용자와 법정대리인의 권리 및 행사 방법</div>
                <div className="flex flex-col gap-2">
                    <div>
                        이용자는 언제든지 등록되어 있는 귀하의 개인정보를 열람하거나 정정할 수
                        있습니다. 개인정보 열람 및 정정을 하고자 할 경우에는 마이페이지 내 제공
                        항목을 통해 정정하거나, 개인정보관리책임자에게 E-mail로 연락하시면
                        조치하겠습니다
                    </div>
                    <div>
                        이용자가 정보의 정정을 요구하는 경우에 회사는 그 정보의 오류가 정정될 때까지
                        당해 개인정보를 사용하지 않으며, 폐기 요구시에는 즉각 폐기하여 어떠한
                        용도로도 사용할 수 없도록 합니다.
                    </div>
                    <div>
                        이용자는 개인정보를 최신의 상태로 정확하게 입력하고 변동 사항이 있는 경우,
                        이를 회사에 통보하여야 하며, 스스로 부정확한 정보를 입력하거나, 회사에
                        통보하지 않아서 회사가 알 수 없는 고객정보의 변동으로 인한 책임은 이용자
                        자신에게 귀속됩니다.
                    </div>
                    <div>
                        만 14세 미만의 어린이에 관한 정보는 법정대리인의 동의 없이는 수집, 이용하지
                        않습니다.
                    </div>
                    <div>
                        이용자의 모든 비밀번호에 대한 보안책임은 이용자에게 있으며, 회사는 어떠한
                        경우에도 이용자의 금융정보를 금융 서비스 제공시 외에 이메일 등을 이용하여
                        질문하지 않으니 비밀번호 유출에 주의하여 주십시오.
                    </div>
                </div>
            </>
            <>
                <div className={`${title}`}>8.개인정보의 보유 및 이용기간</div>
                <div className="flex flex-col gap-2">
                    <div>
                        회사는 회원이 탈퇴를 요청하거나 개인정보 수집ㆍ이용에 대한 동의를 철회하는
                        경우, 수집ㆍ이용 목적이 달성되거나 보유기간이 종료한 경우 해당 개인정보를
                        지체 없이 파기합니다.
                    </div>
                    <div>
                        단, 상법, 전자상거래 등에서의 소비자보호에 관한 법률, 특정 금융거래정보의
                        보고 및 이용 등에 관한 법률 등 관련 법령의 규정에 의하여 보존할 필요가 있는
                        경우 회사는 관련 법령에서 정한 기간 동안 정보를 보관합니다. 이 경우 회사는
                        그 보존의 목적으로만 이용하며 보존기간은 아래와 같습니다.
                    </div>
                    <ul className="list-inside flex flex-col gap-1">
                        <li>
                            <span className="px-2">•</span>계약 또는 청약철회 등에 관한 기록 : 5년
                        </li>
                        <li>
                            <span className="px-2">•</span>대금결제 및 재화 등의 공급에 관한 기록 :
                            5년
                        </li>
                        <li>
                            <span className="px-2">•</span>소비자의 불만 또는 분쟁처리에 관한 기록 :
                            3년
                        </li>
                    </ul>
                </div>
            </>
            <>
                <div className={`${title}`}>
                    9.개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                        서비스 이용 과정에서 이용자의 편리성 확보를 위하여 쿠키(Cookie)가 자동으로
                        생성되어 수집될 수 있습니다. 쿠키는 이용자가 웹사이트에 접속할 때 해당
                        웹사이트에서 이용자의 웹 브라우저를 통해 이용자의 PC에 저장하는 매우 작은
                        크기의 텍스트 파일입니다. 이후 이용자가 다시 웹사이트에 접근할 경우,
                        서버에서 이용자의 PC에 저장된 쿠키 값을 통해 이용자가 설정한 서비스 이용
                        환경을 유지하여 편리한 인터넷 서비스를 이용할 수 있도록 합니다. 이용자는
                        쿠키에 대한 선택권을 가지고 있으며 웹브라우저에서 옵션을 설정하여 모든
                        쿠키를 허용하거나 쿠키가 저장될 때마다 확인을 거치거나 혹은 모든 쿠키의
                        저장을 거부할 수 있습니다.
                    </div>
                    <div className="font-medium">쿠키(cookie) 저장 차단에 대한 안내</div>
                    <div>
                        [Chrome] 웹 브라우저 우측의 설정 메뉴 &gt; 화면 하단의 고급 설정 표시 &gt;
                        개인정보의 콘텐츠 설정 버튼 &gt; 쿠키
                    </div>
                </div>
            </>
            <>
                <div className={`${title}`}>10.행태정보의 수집·이용 및 거부 등에 관한 사항</div>
                <div className="flex flex-col gap-2">
                    <div>
                        회사는 서비스 이용과정에서 정보주체에게 최적화된 맞춤형 서비스 및 혜택,
                        온라인 맞춤형 광고 등을 제공하기 위하여 온라인 행태정보를 수집·이용 하고
                        있습니다. 행태정보란, 웹 사이트 방문 이력, 앱 사용 이력, 구매 및 검색 이력
                        등 이용자의 관심, 흥미, 기호 및 성향 등을 파악하고 분석할 수 있는 온라인상의
                        이용자 활동정보를 말합니다.
                    </div>
                    <div>
                        회사는 온라인 맞춤형 광고 등에 필요한 비식별화 처리된 최소한의 행태정보만을
                        수집하며, 사상, 신념, 가족 및 친인척관계, 학력·병력, 기타 사회활동 경력 등
                        개인의 권리·이익이나 사생활을 뚜렷하게 침해할 우려가 있는 민감한 행태정보를
                        수집하지 않습니다.
                    </div>
                    <div>
                        회사는 만 14세 미만임을 알고 있는 아동이나 만14세 미만의 아동을 주 이용자로
                        하는 온라인 서비스로부터 맞춤형 광고 목적의 행태정보를 수집하지 않고, 만
                        14세 미만임을 알고 있는 아동에게는 맞춤형 광고를 제공하지 않습니다.
                    </div>
                    <div>
                        정보주체는 웹브라우저의 쿠키 설정 변경 및 부가기능 설치 등을 통해 온라인
                        맞춤형 광고를 일괄적으로 차단·허용할 수 있습니다. 다만, 쿠키 설정 변경은
                        웹사이트 자동로그인 등 일부 서비스의 이용에 영향을 미칠 수 있습니다.
                    </div>
                    <div className="font-medium">가. 행태정보 수집 항목</div>
                    <ul className="list-inside flex flex-col gap-1">
                        <li>
                            <span className="px-2">•</span>웹/앱 서비스 방문 기록, 검색·클릭 등
                            사용기록
                        </li>
                    </ul>
                    <div className="font-medium">나. 행태정보 수집 방법</div>
                    <ul className="list-inside flex flex-col gap-1">
                        <li>
                            <span className="px-2">•</span> 구글 애널리틱스(Google analytics),
                            픽셀(Pixel)을 이용하여 이용자의 방문 빈도, 방문 페이지 등의 정보를 수집
                        </li>
                    </ul>
                    <div className="font-medium">다. 행태정보 수집 목적</div>
                    <ul className="list-inside flex flex-col gap-1">
                        <li>
                            <span className="px-2">•</span>사이트 이용 패턴 분석
                        </li>
                    </ul>
                    <div className="font-medium">라. 보유·이용기간 및 이후 정보처리 방법</div>
                    <ul className="list-inside flex flex-col gap-1">
                        <li>
                            <span className="px-2">•</span>수집일로부터 최대 1년간 보유·이용되며,
                            이후 지체없이 삭제
                        </li>
                    </ul>
                    <div className="font-medium">행태 정보 수집 차단에 대한 안내</div>
                    <ul className="list-inside flex flex-col gap-1">
                        <li>
                            [Chrome] 웹 브라우저 우측의 설정 메뉴 &gt; 화면 하단의 고급 설정 표시
                            &gt; 개인정보의 콘텐츠 설정 버튼 &gt; 쿠키
                        </li>
                        <li>[안드로이드폰] ① 구글설정 → ② 광고 → ③ 광고 맞춤설정 선택 또는 해제</li>
                        <li>
                            [아이폰] ① 아이폰설정 → ② 개인정보보호 → ③ 광고 → ④ 광고 추적 제한 ※
                            OS버전에 따라 방법이 다소 상이할 수 있습니다.
                        </li>
                        <li>
                            구글 애널리틱스 차단 브라우저 부가기능의
                            설치(https://tools.google.com/dlpage/gaoptout)
                        </li>
                        <li>
                            페이스북 플랫폼 내 광고 설정 변경 또는 옵트아웃 프로그램
                            활용(https://optout.aboutads.info/?c=2&lang=EN)
                        </li>
                    </ul>
                </div>
            </>
            <>
                <div className={`${title}`}>11.개인정보 보호를 위한 기술적 대책</div>
                <div className="flex flex-col gap-2">
                    <div>
                        회사는 귀하의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 누출, 변조
                        또는 훼손되지 않도록 안전성 확보를 위하여 다음과 같은 기술적 대책을 강구하고
                        있습니다.
                    </div>
                    <ul className="list-inside flex flex-col gap-1">
                        <li>
                            <span className="px-2">•</span>개인정보처리시스템 사용자 계정 및
                            접근권한 관리
                        </li>
                        <li>
                            <span className="px-2">•</span>고유식별정보 등의 중요정보 및 개인정보
                            암호화
                        </li>
                    </ul>
                </div>
            </>

            <>
                <div className={`${title}`}>12.개인정보 보호책임자 및 이용자 고충처리 안내</div>
                <div className="flex flex-col gap-2">
                    <div>
                        회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
                        정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보
                        보호책임자를 지정하고 있습니다.
                    </div>
                    <div>
                        이용자께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련
                        문의, 불만처리, 피해구제 등에 관한 사항을 전화 및 이메일 등의 방법으로
                        개인정보 보호책임자 및 개인정보 보호담당자에게 문의하실 수 있으며, 회사는
                        이용자의 문의에 지체 없이 답변 및 처리하겠습니다
                    </div>
                    <div>
                        개인정보 보호책임자 : 이양우 전화번호 0502-1935-3403 이메일 :
                        admin@we-captured.kr
                    </div>
                </div>
            </>
            <>
                <div className={`${title}`}>13.정보주체의 권익침해에 대한 구제방법</div>
                <div className="flex flex-col gap-2">
                    <div>
                        정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회,
                        한국인터넷진흥원, 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수
                        있습니다. 이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에
                        문의하시기 바랍니다
                    </div>
                    <div className="font-medium">행태 정보 수집 차단에 대한 안내</div>
                    <ul className="list-inside flex flex-col gap-1">
                        <li>
                            <span className="px-2">•</span>개인정보분쟁조정위원회 : (국번없이)
                            1833-6972 (www.kopico.go.kr)
                        </li>
                        <li>
                            <span className="px-2">•</span>개인정보침해신고센터 : (국번없이) 118
                            (privacy.kisa.or.kr)
                        </li>
                        <li>
                            <span className="px-2">•</span>경찰청 사이버수사국 : (국번없이) 182
                            (ecrm.cyber.go.kr/minwon/main)
                        </li>
                    </ul>
                </div>
            </>
            <>
                <div className={`${title}`}>14.개인정보 처리방침 변경</div>
                <div className="flex flex-col gap-2">
                    <div>본 방침은 2023. 12. 1. 부터 적용됩니다.</div>
                </div>
            </>
        </>
    )
}

export default PrivacyPolicy

function PersonalPolicy() {
    const title = 'text-base font-medium py-4'
    return (
        <>
            <div className="text-2xl font-medium">개인정보 수집 및 이용 동의</div>
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
                <div className={`${title}`}>3. 개인정보의 보유 및 이용기간</div>
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
        </>
    )
}

export default PersonalPolicy

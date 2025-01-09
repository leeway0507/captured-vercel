export const Process = (
    <div className="flex flex-col gap-2">
        <div>
            국내배송 상품 : 1 - 3일<span>(영업일 기준)</span>
        </div>

        <div>
            해외배송 상품 : 5 - 15일<span>(영업일 기준)</span>
        </div>
        <div>해외배송 절차</div>
        <div className="border rounded-md py-2 border-gray-500">
            <div className="flex-center flex-col gap-1">
                <div>물품 구매 및 현지 배송 (1-5일)</div>
                <div>⇣</div>
                <div>국제 배송 및 통관 (3-8일)</div>
                <div>⇣</div>
                <div>국내 배송 (1-2일)</div>
            </div>
        </div>
    </div>
)
export const ShippingFee = (
    <div className="flex flex-col gap-2 ">
        <div>국내배송 상품 : 3,000원</div>

        <div>
            해외배송 상품
            <div className=" pt-1 ps-1 flex flex-col gap-1">
                <div>• 가방, 악세서리, 모자 : 15,000원</div>
                <div>• 반팔, 긴팔, 셔츠, 바지, 반바지 : 15,000원</div>
                <div>• 가디건, 코트, 패딩, 후리스 : 19,000원</div>
                <div>• 신발 : 19,000원</div>
            </div>
        </div>
    </div>
)
export const RefundAndExchange = (
    <div className="flex flex-col gap-2 ">
        <div className="py-1">
            <div className="font-medium pb-1">교환 및 수리</div>
            <div>구매대행 특성 상 수리 및 교환은 불가합니다.</div>
        </div>
        <div className="py-1">
            <div className="font-medium pb-1">반품 및 취소 정책</div>
            <div>
                <div>
                    <div>
                        단순 변심 사유 및 기타 회사가 정한 사유로 인해 인해 반품 또는 취소 시 국외
                        배송비 및 국내 배송비가 발생 됩니다.
                    </div>
                    <div>
                        <div className="pt-2 pb-2  font-medium">단순 변심에 해당하는 사유</div>
                        <div className=" ps-2 flex flex-col gap-1">
                            <div>• 주문 실수 및 단순 변심</div>
                            <div>• 모니터 해상도 차이에 의해 발생하는 색상 불일치</div>
                            <div className="flex">
                                <div>•&nbsp;</div>
                                <div>
                                    상품 추가 구성품(종이포장, 지지대, 택 등) 누락 및 상품 박스의
                                    훼손이 발생하였지만 물건에 이상 없는 경우
                                </div>
                            </div>
                            <div className="flex">
                                <div>•&nbsp;</div>
                                <div>
                                    신발 바닥의 오염, 겉면의 미세한 얼룩, 박음질, 본드자국, 신
                                    발굽의 높낮이 차이, 미세한 틀어짐, 양쪽 미세한 색상차이, 약간의
                                    눌린 자국, 가죽 표면의 미세한 스크래치, 주름, 가죽결 등 소재
                                    특성에 따른 차이 등 모든 상품 퀄리티(완성도) 마감도와 관련한
                                    사항
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 pb-2  font-medium">기타</div>
                    <div className="ps-2 ">
                        • 현지 판매처에 의한 배송지연(기상악화, 배송 급증, 현지 공휴일 등)
                    </div>
                </div>
            </div>
        </div>
        <div className="py-1 ">
            <div className="font-medium pb-1 py-2">반품 및 취소 건에 대한 배송비 </div>
            <ul className="list-inside flex flex-col gap-1  ps-2">
                <li>• 물품 구매 및 현지 배송 : 판매처 발송 여부에 따라 무료 또는 2만원</li>
                <li>• 국제 배송 및 세관 통과 이후 : 5만원</li>
            </ul>
        </div>
        <div className="py-1 ">
            <div className="font-medium pb-1">반품 및 취소 신청</div>
            <div className=" pb-1">
                물품 수령 후 7일 이전의 경우 반품 및 취소 신청 가능합니다. 아래의 양식으로 고객센터
                메일(
                <span className="underline text-blue-500 ">{process.env.CUSTOMER_EMAIL}</span>
                )로 보내주시면 관련 내용 안내드리겠습니다.{' '}
            </div>
            <div className="border rounded-md py-3 my-2  px-2 border-gray-500">
                <div className="grid grid-cols-7 py-1">
                    <div className="font-medium col-span-2">주문자 성명</div>
                    <div className="col-span-5">주문 시 기입한 성명</div>
                </div>
                <div className="grid grid-cols-7 py-1">
                    <div className="font-medium col-span-2">결제코드</div>
                    <div className="col-span-5">
                        마이페이지 → 주문배송 → 상세주문정보 항목에서 결제코드 확인 가능
                    </div>
                </div>
                <div className="grid grid-cols-7 py-1">
                    <div className="font-medium col-span-2">환불 방식</div>
                    <div className="col-span-5">희망 환불 절차(반품 또는 취소) 기입</div>
                </div>
                <div className="grid grid-cols-7 py-1">
                    <div className="font-medium col-span-2">상세 내용</div>
                    <div className="col-span-5">반품 및 취소 사유 및 이미지 등 상세 내용 작성</div>
                </div>
            </div>
        </div>
    </div>
)

export const CustomFee = (
    <div className="flex flex-col gap-2 ">
        <div className="pb-1"> 상품 가격에 관∙부가세를 포함하고 있습니다.</div>
    </div>
)

export const NotYetShipped = (
    <div className="flex flex-col gap-2 ">
        <div className="pb-1">
            배송 정보는 <span className="font-medium">마이페이지 ❯ 주문배송 ❯ 상세 주문 내역</span>
            에서 확인하실 수 있습니다.{' '}
        </div>
        <div className="pb-1">
            주문일이 15일 이상 경과한 경우 고객센터 메일(
            <span className="underline text-blue-500 ">{process.env.CUSTOMER_EMAIL}</span>) 또는
            채널 알림톡으로 문의주시면 확인 후 안내드리겠습니다.
        </div>
    </div>
)

export const Package = (
    <div className="pb-1">묶음 배송은 불가능합니다. 각 상품의 배송일정에 따라 개별 배송됩니다.</div>
)

export const RefundProcess = (
    <div>
        반품 및 취소정책에 부합하는 주문건에 대해 반품 물품이 고객센터에 도착이후 7일 이내 환불이
        진행됩니다. 환불 금액은 반품 및 취소 건에 대한 배송비를 제외한 나머지 금액이 환불됩니다.
    </div>
)

export const QuestionInfo = (
    <div className="flex flex-col gap-1">
        <div>• 이메일 : {process.env.CUSTOMER_EMAIL}</div>
        <div>
            • 카카오 채널 : <span className="underline">@captured</span> 검색
        </div>
    </div>
)

export const SizeInfo = (
    <div>해외 배송 특성상 재고를 보유하고 있지 않아, 사이즈 안내가 불가합니다. </div>
)

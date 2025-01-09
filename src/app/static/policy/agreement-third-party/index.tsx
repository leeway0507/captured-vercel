function ThirdPartyPolicy() {
    const title = 'text-base font-medium py-4'
    return (
        <div>
            <div className={`${title}`}>4. 개인정보의 제3자 제공에 관한 사항</div>
            <div className="flex flex-col gap-2">
                <div>
                    회사의 서비스 이행을 위하여 다음의 경우 개인정보를 제3자에게 제공하고 있습니다.
                </div>
                <ul className="list-inside flex flex-col gap-1">
                    <li>
                        <span className="px-2">•</span>수입 및 통관 업무의 경우
                    </li>
                    <li>
                        <span className="px-2">•</span>전자결제 서비스 이용의 경우
                    </li>
                    <li>
                        <span className="px-2">•</span>세법상 세무 업무 처리에 필요할 경우
                    </li>
                    <li>
                        <span className="px-2">•</span>법령의 규정에 의거하거나, 수사 목적으로
                        법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
                    </li>
                </ul>
            </div>
            <div className={`${title}`}>5. 개인정보의 국외이전 제공에 관한 사항</div>
            <div className="flex flex-col gap-2">
                <div>
                    회사의 서비스 이행을 위하여 개인정보를 국외 제3자에게 제공하고 있는 경우는
                    다음과 같습니다.
                </div>
                <ul className="list-inside flex flex-col gap-1">
                    <li>
                        <span className="px-2">•</span>수입 및 통관 업무의 경우
                    </li>
                </ul>
            </div>
            <div className={`${title}`}>6.개인정보의 위탁처리</div>
            <div className="flex flex-col gap-2">
                <div>
                    회사는 서비스의 원활한 제공을 위하여 다음과 같이 개인정보 처리업무를 위탁하고
                    있습니다.
                </div>
                <table className="table-fixed max-w-xl w-full">
                    <thead className="bg-slate-200 ">
                        <tr>
                            <th>위탁업체</th>
                            <th>위탁업무 내용</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>회사가 정한 운송 및 통관 업무 위탁사</td>
                            <td>운송 및 통관 업무</td>
                        </tr>
                        <tr>
                            <td>㈜토스페이먼츠</td>
                            <td>전자결제 서비스</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ThirdPartyPolicy

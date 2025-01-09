function CustomServiceBlock() {
  return (
    <div>
      <div className="hidden md:flex-center flex-row w-full h-[35px] bg-black text-white/90 text-sm z-50">
        <div className="me-5">
          여러분들의 불편사항과 개선사항을 기다리고 있습니다.
        </div>
        <div>
          📥 support@we-captured.kr
        </div>
      </div>
      <div className="md:hidden flex-center flex-row w-full h-[35px] bg-rose-600 text-white/90 text-sm z-50">
        원활한 제품 검색을 위해 PC/태블릿 환경을 이용해주세요.
      </div>
    </div>
  );
}

export default CustomServiceBlock;

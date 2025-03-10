# 편집샵 재설계 및 리팩토링

## 스택

-   프레임워크: Next.js 14 (App Router)
-   라이브러리: Tailwind, Jest, Radix UI
-   백엔드: Go, Python
-   이미지 처리: Python, Pillow, BRIA-rmbg 1.4, S3, CloudFront
-   배포: EC2

## 서비스 재설계 배경

-   Next.js 프레임워크의 핵심 기능과 리액트 18 서버 기능을 충분히 활용하지 못한 구조적 한계

-   번들 사이즈 및 서버 내 이미지 최적화 처리로 인한 초기 로딩 지연

-   레이아웃 흔들림(CLS), 페이지 플리커링 발생으로 사용자 경험 저하

-   개발 시간의 30% 이상을 에러 원인 추적과 디버깅에 할애하여 구조 개선 및 생산성 향상 필요

-   Core Web Vitals 지표 개선을 통한 SEO 최적화 필요

## 성과

-   리액트 18 신규 서버 기능의 설계 의도를 반영한 서비스 재설계 및 리팩토링

    -   클라이언트 컴포넌트의 20%를 서버 컴포넌트로 리팩토링하여 브라우저 번들 크기 46% 감소 및 캐싱 최적화 달성

    -   스트림 기반 SSR 설계 의도를 반영하여 페이지 구조를 개선하고 suspense를 사용하여 First Contentful Paint(FCP) 0.4초로 단축

    -   useEffect에 의존하는 로직을 개선하고 서버 컴포넌트로 리팩토링하여, 레이아웃 흔들림(CLS)과 페이지 플리커링 해결

-   자체 이미지 최적화 파이프라인을 통해 Largest Contentful Paint(LCP) 0.9초로 개선

-   TDD를 도입해 유지보수 시간을 하루 평균 3시간에서 1시간 이하로 단축

## 상세

#### React 18의 서버 기능을 정리하고 학습한 내용을 기반으로 리팩토링

-   [1부: React 18이 해결하고자 하는 문제들](https://leeway0507.github.io/blog/frontend/react18)

    React 18의 신규 기능인 스트림 기반 SSR과 서버 컴포넌트가 개별적으로 어떠한 문제를 해결하기 위해 고안되었는지, 어떠한 방식으로 이를 해결하였는지를 다루었습니다.

    또한 React 팀이 제공한 서버 컴포넌트 데모 코드를 분석하여 서버 컴포넌트가 실제 처리되는 절차를 정리했습니다.

-   [2부: Next.js App Router 코드로 이해하기](https://leeway0507.github.io/blog/frontend/app-router)

    Next.js App Router가 사용자 요청을 처리하는 전체 흐름을 코드 기반으로 정리했습니다.
    구체적으로는 Next.js 서버가 실행되는 흐름, 사용자가 홈페이지에 접속했을 때 서버의 처리절차,
    서버로부터 받은 HTML을 Next.js가 Hydration하는 절차를 분석했습니다.

-   [[React] 다양한 의미로 쓰이는 렌더링 이해하기](https://leeway0507.github.io/blog/frontend/rendering)

    서버 사이드 렌더링과 브라우저 렌더링을 리액트 렌더링과 연관지어 정리했습니다.

<br/>

#### 자체 이미지 최적화 파이프라인을 구축하여 LCP 0.9초로 개선

-   문제점

    -   EC2(T2 micro)로 서비스 배포 시 LCP 평균 14초에 달하는 페이지 로딩 지연 발생

    -   이미지 최적화(Sharp.js)에 상당한 서버 리소스가 할당되는 것이 원인

-   1차 시도 : LCP 5.2초로 개선

    -   원본 이미지를 1차 가공하여 서버의 이미지 최적화에 드는 리소스 절감 시도

    -   제품 등록 시 자동으로 원본 이미지를 리사이징하고 WEBP로 이미지 압축하는 프로세스를 구축하여 LCP 5.2초로 개선 [[코드]](https://github.com/leeway0507/captured-vercel/tree/main/server/image-resize)

-   2차 시도 : LCP 0.9초로 개선

    -   이미지 최적화로 인한 체감 로딩 속도는 향상됐으나 LCP 향상 필요

    -   서버 부담을 줄이기 위해 이미지 최적화 옵션을 비활성화하고 외부에서 이미지를 제공 받는 구조로 서비스 개선

    -   기존 이미지 처리 프로세스에 S3 업로드 기능을 추가하고 cloudfront를 활용해 이미지 캐싱 및 관련 비용 절감
    -   서버 리소스 절감으로 인한 FCP 일부 개선 및 LCP 0.9초 달성

<br/>

#### 유지보수가 쉬운 개발 습관 형성

-   문제점

    -   기능이 추가되고 구조가 복잡할수록 유지보수 시간이 급증하여, 개발 습관 개선 필요성을 인식

    -   에러 추적의 어려움, 사이드 이펙트, 관리되지 않은 코드 등이 원인

-   방법

    -   Clean Code를 읽고 소프트웨어 엔지니어의 역할이 '유지보수와 변경이 쉬운 시스템을
        만들어 나가는 것'에 있음을 공감하여,이러한 원칙을 실천하고자 시도

    -   모든 개발은 테스트 환경을 구축하는 것에서 시작, 구축된 환경 속에서 비즈니스 로직 개발

    -   프론트엔드 영역을 데이터, UI ,인터랙션으로 구분하고 단일 책임 원칙과 함수의 순수성을 준수하여 기존 코드 리팩토링

    -   유지보수 시간을 하루 평균 3시간에서 1시간 이내로 단축할 수 있었고 확보한 시간을 비즈니스 로직 구현에 활용

<br/>

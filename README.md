# 리액트 기초 mongo 사용 api server 생성

## | 해당서버 기초 정보
- ip
- port
- 개발모드 실행
---
## 1. 몽고 기초

- 데이터 베이스 생성 및 연결
- 문서 생성
- 스키마 특성
- CRUD
- 데이터 베이스 구조

---
## 2. node.js 와 Express를 활용한 REST API 만들기
- node.js 설치
- npm
- packge.json
- Express 설정하기
- nodemon
- REST API
- GET POST PUT PATCH DELETE request 타입 차이
- 데이터 보내는 방식 header, query, body, params 차이
- express 미들웨어

---
## 3. 비동기 프로그래밍(asymcchronous)
- Non -blocking
- Callback
- Promise
- Promise Chain
- Async await

---
## 4. node.js로 MongoDB 다루기(mongoose)
- mongoose Connection
- schema & Model
- user document 생성
- express에서 오류 처리
- get /user
- get /user/:userId
- delete /user/:userId
- put /user/userId
- 몽구스 디버그 모드 설정
- 라우터 리팩토링
---
## 5. 관계된 데이터 관리하기
- user 와 관계된 Blog Model
- blog router 준비
- create Blog document
- Blog 관련 API 만들기
- POSTman API 관리하기
- Comment model 만들기
- 자식 관계 만들어주기
- post /comment
- Promise.all response time 개선하기
- comment 불러오기
- 리팩토링
---
## 관계된 데이터 효율적으로 읽기
- 블로그의 관계 데이터 읽기 소개
- faker로 데이터 생성하기
- axios 이용해서 client 코드 만들기
- Client 코드 리팩토링 & 마무리
- N + 1 Problem
- 성능 측정하기
- populate로 자식문서 효율적으로 불러오기
- virtual Populate
- Populate 성능 테스트
---
## 문서 내장으로 읽기 퍼포먼스 극대화
- MongoDB의 핵심 적절한 내장
- 수정된 faker 적용하기
- Comment Post Api 수정
- dubugging & testing Comment POST API
- BLOG에 Comment 내장하기
- Nesting 성능 테스트
- $ 내장된 특정 문서 수정하기
- updateMany
- arrayFilter
- $pull, $elemMatch
- User 삭제하기
- 스키마 설계하기

## 인덱스 많은 데이터 관리하기(빠른 읽기)
- 데이터가 맣아지면서 느려지는 탐색시간
- index 원리 이해하기
- 탐색 성능 테스트를 위한 데이터 생성
- index 원리 이해하기
- 탐색 성능 테스트를 위한 데이터 생성
- Pagination 원리
- GET /blog API에 Pagination 적용


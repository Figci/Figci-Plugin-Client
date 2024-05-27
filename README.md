# Figci

<h2 id="서비스-소개">🧑🏻‍🏫 서비스 소개</h2>

### **Figci (Figma, Compare, Interface designs)**
<img src="src/assets/readme/thumbnail_figci.png" width="720" />

<br />

**Figci**는 Git의 코드 변경 사항을 시각적으로 표시해 주는 아이디어에 착안하여 개발한 Figma 프로젝트 파일의 버전 관리 웹 서비스 및 피그마 플러그인 서비스입니다. 

<br />

**Figci**는 사용자가 선택한 특정 버전 간의 모든 요소의 차이점을 분석하여서 변경 사항이 감지된 사항을 시각적으로 강조하여서 표시해 주고 동시에 변경 사항을 텍스트로 표시해줍니다.

<br />

<h2 id="배포-링크">🔗 배포 링크</h2>

<div style="text-align:center; font-size: 16px;">
  <a href="https://www.figma.com/community/plugin/1339982367203490154"><b>🔌 피그마 앱 플러그인</b></a> | <a href="https://client.figci.net"><b>🌐 웹 앱 서비스</b></a>
</div>

<br />

## 💼 Contents
- [**프로젝트 소개**](#figci)
  - [🧑🏻‍🏫 서비스 소개](#서비스-소개)
  - [💡 기획 동기](#기획-동기)
  - [🚀 기술 스택](#기술-스택)
  - [🔗 배포 링크](#배포-링크)

- [**기능 설명**](#기능-설명)

- [**기술 챌린지**](#기술-챌린지)
  - [🤔 Diffing: 효율적인 차이 분석 로직을 향한 여정](#diffing-효율적인-차이-분석-로직을-향한-여정)
    - [1) 초기 접근 방식: 동시 트리 순회](#1-초기-접근-방식-동시-트리-순회)
    - [2) 해결책 : 중첩된 트리 구조 평탄화](#2-해결책--중첩된-트리구조-평탄화)
    - [3) 수정된 접근 방식 : 노드 ID를 기준으로 한 트리 순회](#3-수정된-접근-방식--노드-id를-기준으로-한-트리-순회)

  - [🗄️ 복잡한 피그마 Data를 MongoDB에 어떻게 저장할까?](#복잡한-피그마-data를-mongodb에-어떻게-저장할까)
    - [1) 초기 접근 방식: 피그마 JSON 데이터 저장 방식 고려](#1-초기-접근-방식-피그마-json-데이터-저장-방식-고려)
    - [2) 해결 방안 모색 : 피그마 파일 스키마 구조화](#2-해결-방안-모색--피그마-파일-스키마-구조화)

  - [📚 16MB 이상의 대용량 파일은 MongoDB에 어떻게 저장할까?](#16mb-이상의-대용량-파일은-mongodb에-어떻게-저장할까)
    - [1) 문제 인식 : 피그마 데이터 16MB 이상일 경우 MongoDB 저장 시 에러 발생](#1-문제-인식--피그마-데이터-16mb-이상일-경우-mongodb-저장-시-에러-발생)
    - [2) 문제 원인 : MongoDB에서 대용량의 파일을 저장 할 수 없는 이유는?](#2-문제-원인--mongodb에서-대용량의-파일을-저장-할-수-없는-이유는)
    - [3) 해결 방안 모색 : GridFS는 어떤 기능이고 어떻게 동작할까?](#3-해결-방안-모색--gridfs는-어떤-기능이고-어떻게-동작할까)
    - [4) 문제 해결 : 우리 서비스에서 gridFS 를 어떻게 적용할 수 있을까?](#4-문제-해결--우리-서비스에서-gridfs-를-어떻게-적용할-수-있을까)
    - [5) 추가 문제 인식 : GridFS 파일과 Document 객체의 데이터 구조가 달라요..](#5-추가-문제-인식--gridfs-파일과-document-객체의-데이터-구조가-달라요)
    - [6) 문제 해결 : GridFS 파일을 Document 객체와 동일한 Map 구조로 변환](#6-문제-해결--gridfs-파일을-document-객체와-동일한-map-구조로-변환)
  
  - [🎨 피그마 JSON 파일을 어떻게 렌더할 수 있을까?](#피그마-json-파일을-어떻게-렌더할-수-있을까)
    - [1) 데이터 분석: 피그마 JSON 파일은 어떻게 구성되어 있을까?](#1-데이터-분석-피그마-json-파일은-어떻게-구성되어-있을까)
    - [2) 피그마 요소 렌더링 : 피그마의 다양한 요소를 어떻게 효과적으로 렌더 할 수 있을까?](#2-다양한-피그마-요소-렌더링--피그마의-여러가지-도형이나-이미지를-어떻게-효과적으로-렌더할-수-있을까)
    - [3) 객체의 이벤트 상호 작용 : 요소 간 발생하는 이벤트에 따라 상호작용하게 할 수 없을까?](#3-객체의-이벤트-상호-작용--요소-간-발생하는-이벤트에-따라-상호작용하게-할-수-없을까)
    - [4) 피그마 디자인 속성 구현 : 피그마에 디자인 시스템 속성은 어떻게 구현할 수 있을까?](#4-피그마-디자인-속성-구현--피그마에-디자인-시스템-속성은-어떻게-구현할-수-있을까)

  - [👤 플러그인에서는 OAuth 로그인을 어떻게 구현해야 할까?](#플러그인에서는-oauth-로그인을-어떻게-구현해야-할까)
    - [1) 문제 인식 : 플러그인 환경에서는 redirect가 되지 않는다?](#1-문제-인식--플러그인-환경에서는-redirect가-되지-않는다)
    - [2) 해결 방안 모색 : 서버로 우회하여 OAuth인증을 받자!](#2-해결-방안-모색--서버로-우회하여-oauth인증을-받자)
    - [3) 추가 문제 인식 : 근데.. 클라이언트 측에서 인증 완료 여부를 어떻게 알지..? 😳](#3-추가-문제-인식-근데-클라이언트-측에서-인증-완료-여부를-어떻게-알지)
    - [4) 문제 해결 : Polling 방식을 사용한 인증 확인 요청](#4-문제-해결--polling-방식을-사용한-인증-확인-요청)

- [**개발 이슈**](#개발-이슈)
  - [🙅‍♂️ 캔버스에 이벤트가 발생하지 않는다?!](#캔버스에-이벤트가-발생하지-않는다)
    - [1) 문제 원인 : Fabric.js 캔버스의 반복 렌더링](#1-문제-원인--fabricjs-캔버스의-반복-렌더링)
    - [2) 문제 해결 : Fabric.js 캔버스의 sideEffect 처리](#2-문제-해결--fabricjs-캔버스의-sideeffect-처리)

  - [🫨 렌더링 순서가 뒤죽박죽!](#렌더링-순서가-뒤죽박죽)
    - [1) 문제 원인 : Fabric 객체 생성 시 생성 순서 미보장](#1-문제-원인--fabric-객체-생성-시-생성-순서-미보장)
    - [2) 문제 해결 : BFS 알고리즘 적용과 Map 자료구조 사용으로 객체 생성 순서 보장](#2-문제-해결--bfs-알고리즘-적용과-map-자료구조-사용으로-객체-생성-순서-보장)

  - [🦥 diffing 응답속도가 너무 느려요! (feat. Testing)](#diffing-응답속도가-너무-느려요-feat-testing)
    - [1) 문제 원인: MongoDB에서 diffing 결과 조회 시 서브 트리로 치환 로직에서 응답 속도 지연](#1-문제-원인-mongodb에서-diffing-결과-조회-시-서브-트리로-치환-로직에서-응답-속도-지연)
    - [2) 원인 분석 : 서브 트리 치환 로직의 정확한 소요 시간 측정](#2-원인-분석--mongodb의-diffing-결과-프레임-서브-트리-치환-로직의-정확한-소요-시간-측정)
    - [3) 문제 해결: diffing 결과를 바로 응답하므로 서브 트리 치환 로직 생략](#3-문제-해결-diffing-결과를-바로-응답하므로-서브-트리-치환-로직-생략)
    - [4) 테스트 결과 : 개선된 로직으로 기존 대비 약 2.5배의 응답 속도 향상 달성](#4-테스트-결과--개선된-로직으로-기존-대비-약-25배의-응답-속도-향상-달성)

  - [❔gridFS Map 데이터가 JSON 직렬화 시 데이터가 사라진다?](#gridfs-map-데이터가-json-직렬화-시-데이터가-사라진다)
    - [1) 문제 인식 : gridFS Map 데이터 전송 시 데이터 소실로 인한 렌더링 에러 발생](#1-문제-인식--서버에서-gridfs-map-데이터-전송-시-내부-데이터-소실로-인한-렌더링-에러-발생)
    - [2) 원인 분석 : Map 구조 데이터가 왜 Object 타입으로 변환 되어있을까?](#2-원인-분석-Map-구조-데이터가-왜-Object-타입으로-변환-되어있을까?)
    - [3) 해결 방안 모색 : Map을 JSON으로 직렬화할 때 데이터를 유지하는 방법](#3-해결-방안-모색--map을-json으로-직렬화할-때-데이터를-유지하는-방법)
    - [4) 문제 해결 : gridFS Map 데이터를 손실 없이 Object로 변환하기](#4-문제-해결--gridfs-map-데이터를-손실-없이-object로-변환하기)

- [**팀 문화 & 코드 컨벤션**](#팀-문화--코드-컨벤션)
  - [📋 팀 문화](#팀-문화)
  - [🤝 코드 컨벤션](#코드-컨벤션)
  - [👨‍👩‍👦 팀원 소개](#팀원-소개)
  - [✍️ 프로젝트 회고](#회고)

<br />

<h2 id="기획-동기">💡 기획 동기</h2>

디자이너였던 팀원이 현업에서 개발자와의 협업 중 겪었던 불편을 해소하기 위해 아이디어를 구상했습니다.<br />
이 아이디어로 해결하고자 한 주요 문제점은 다음과 같습니다.

### 1) 의사소통 비용 최소화

디자이너가 변경된 디자인 시안을 개발자에게 전달할 때, 변경된 부분을 일일이 코멘트로 달거나 정리해서 전달해야 했는데<br />
이때 발생하는 의사소통 과정을 줄이기 위해 개발자도 변경 사항을 시각적으로 쉽게 파악할 방법이 없을지 고민했습니다.

### 2) Git 의 스테이징 기술 구현

Git에서는 코드의 변경 사항을 초록색 또는 빨간색으로 표시해 주어, 누구나 추가된 부분과 삭제된 부분을 알 수 있는데<br />
이에 착안하여 디자인의 변경 사항도 초록색 또는 주황색으로 강조 표시해 변경된 요소를 쉽게 파악할 수 있도록 아이디어를 구상했습니다.

<br />

<h2 id="기술-스택">🚀 기술 스택</h2>

### FrontEnd

<div style="display:flex;">
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/react router-CA4245?style=for-the-badge&logo=react-router&logoColor=white">
  <img src="https://img.shields.io/badge/styled components-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white">
  <img src="https://img.shields.io/badge/zustand-f66d2d?style=for-the-badge&logo=&logoColor=white">
  <img src="https://img.shields.io/badge/fabric.js-0097da?style=for-the-badge&logo=&logoColor=white">
</div>

### BackEnd

<div style="display:flex;">
  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
  <img src="https://img.shields.io/badge/mongo DB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">
  <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=Express&logoColor=white">
  <img src="https://img.shields.io/badge/mongoose-880000?style=for-the-badge&logo=Mongoose&logoColor=white">
  <img src="https://img.shields.io/badge/pug-A86454?style=for-the-badge&logo=pug&logoColor=white">
</div>

### Tools

<div style="display:flex;">
  <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
  <img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white">
</div>

### Collaboration

<div style="display:flex;">
  <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=Notion&logoColor=white">
  <img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white">
  <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=Figma&logoColor=white">
</div>

<br />
<br />

<h1 id="기능-설명">기능 설명</h1>

### 1) 피그마 계정 로그인
<details><summary><b>🎥 Preview</b></summary>
<p>
<img src="src/assets/readme/gif_login.gif" width="720" alt="피그마 계정 로그인 gif"/>
</p>
</details>
→ `OAuth 2.0` 를 통해 Figma 계정으로 로그인하여 `Aceess Token`을 요청합니다.

> 로그인 성공 시 서비스 페이지로 redirect 하며 Welcome 모달이 렌더링 됩니다.<br />
> 발급된 Access Token은 로컬 스토리지에 저장되어 Figma API 요청 시 사용됩니다.


### 2) 프로젝트 버전 선택 (Web)

<details><summary><b>🎥 Preview</b></summary>
<p>
<img src="src/assets/readme/gif_version.gif" width="720" alt="버전 선택 gif"/>
</p>
</details>

→ 사용자가 변경 사항을 확인하고 싶은 프로젝트의 링크를 입력하면 해당 프로젝트의 모든 버전 리스트가 나타나며, 사용자가 비교하고자 하는 두 버전을 선택할 수 있습니다.

> 이전 버전이 이후 버전보다 나중 일 수는 없습니다.<br />
> 만약, 이전 버전이 이후 버전보다 나중일 경우에는 에러 메시지 토스트가 렌더링 됩니다.<br />

### 3) 변경 사항 시각화 (Web)

<details><summary><b>🎥 Preview</b></summary>
<p>
<img src="src/assets/readme/gif_difference.gif" width="720" alt="변경 사항 시각화 gif"/>
</p>
</details>

→ 사용자가 선택한 두 버전에 공통으로 존재하는 페이지 중 하나를 선택하면 해당 페이지에 있는
모든 변경 사항이 있는 프레임들을 렌더링한 뒤, 변경 사항을 시각화합니다.

> <span style="color: red">빨간색 테두리</span>는 이전 버전과 대비하여 이후 버전에서 변경 사항이 생긴 요소입니다. <br />
> <span style="color: green">초록색 테두리</span>는 이전 버전에는 존재하지 않았으나, 이후 버전에서 새롭게 추가된 요소입니다.<br />
> 각각의 테두리에 마우스를 hover 할 시 변경된 요소들을 자세하게 표시해 줍니다.<br />

### 4) 새로운 버전 선택 하기 & 피그마로 이동하기 (Web)

<details><summary><b>🎥 Preview</b></summary>
<p>

|새 버전 선택 하기|피그마로 이동하기|
|----|----|
|<img src="src/assets/readme/gif_reversion.gif" width="max-content" alt="새 버전 선택 gif"/>|<img src="src/assets/readme/gif_open_figma.gif" width="max-content" alt="피그마에서 열기 gif"/>|
|현재 프로젝트의 **다른 버전 간의 차이점**을 확인할 수 있습니다.|확인 중인 디자인 요소를 **피그마 앱**에서 확인 할 수 있습니다.|

</p>
</details>

> 현재 프로젝트의 다른 버전을 선택할 수 있도록 버전 선택 창으로 리디렉션 됩니다.<br />
> 피그마 애플리케이션 사용자가 확인 중인 디자인의 요소 위치에 자동 포커스 되어서 보입니다.<br />

### 5) 변경 사항 페이지네이션 (Plugin)

<details><summary><b>🎥 Preview</b></summary>
<p>
<img src="src/assets/readme/gif_pagination.gif" width="720" alt="페이지네이션 gif"/>
</p>
</details>

→ 변경 사항이 있는 모든 요소를 직접 클릭해서 확인 할 수도 있지만,<br />
화살표 버튼을 통해서 변경 사항이 있는 요소들을 하나씩 확인 할 수도 있습니다.<br />
<br />

<h1 id="기술-챌린지">기술 챌린지</h1>

<h2 id="diffing-효율적인-차이-분석-로직을-향한-여정">🤔 Diffing: 효율적인 차이 분석 로직을 향한 여정</h2>

### 1) 초기 접근 방식: 동시 트리 순회

저희 서비스를 구현하기 위해서는 사용자가 두 개의 버전을 선택하면 해당 버전의 변경 사항을 도출해 내야 했습니다.<br />
처음에는 Figma API를 통해 받은 두 서브 트리를 동시에 순회하면서, 같은 위치에 있는 노드들의 프로퍼티를 비교하여 차이점을 찾았습니다.<br />
이 방법은 한 번의 순회로 모든 변경 사항을 찾을 수 있었으며, `O(n)`의 시간 복잡도를 가져갈 수 있었습니다.

<img src="src/assets/readme/image_diffing_1.png" width="720" alt="diffing 이미지" />

<br />

다만 이런 방식에는 한가지 문제점이 있었습니다.<br />

한쪽 버전에서 노드가 추가되거나 삭제될 경우, 트리의 구조가 바뀌어버려 동시 순회 시 두 트리가 서로 다른 노드를 바라보는 문제가 발생했습니다.<br />
이로 인해 변경 사항이 없는 노드들마저 변경된 것으로 잘못 식별되는 이슈가 발생했습니다.

<img src="src/assets/readme/image_diffing_2.png" width="720" alt="diffing 이미지" />

<br />

### 2) 해결책 : 중첩된 트리구조 평탄화

이 문제의 원인이 트리의 깊이에 있음을 파악한 저희는, Figma 데이터를 평탄화하기로 하고,<br />
두 트리를 동시에 순회하는 방법을 포기했습니다.

<br />

### 3) 수정된 접근 방식 : 노드 ID를 기준으로 한 트리 순회

수정된 차이 분석 로직에서는 노드들을 평탄화한 후, 한쪽 트리를 기준으로 순회하며 해당 노드의 `NodeId`가 다른 트리에 존재하는지를 확인합니다.<br />
동일한 `NodeId`를 가진 노드가 존재한다면, 그들의 프로퍼티를 비교하여 변경 사항을 확인합니다.<br />
이처럼 수정된 로직으로는 저희가 예상했던 정확한 변경 사항을 도출할 수 있었습니다.

<img src="src/assets/readme/image_diffing_3.png" width="720" alt="수정된 접근 방식 이미지" />

<br />

초기 로직이 `O(n)`의 시간 복잡도를 가졌던 반면, 수정된 로직은 `O(n^2)`의 시간 복잡도를 가집니다.<br />
왜냐하면 각 `NodeId`가 다른 평탄화된 트리에 존재하는지 검색해야 하기 때문입니다.<br />
그런데도, 정확한 변경 사항 도출이 더 우선순위라고 판단한 저희는 이 새로운 로직을 채택했습니다.

<br />

<h2 id="16mb-이상의-대용량-파일은-mongodb에-어떻게-저장할까">📚 16MB 이상의 대용량 파일은 MongoDB에 어떻게 저장할까?</h2>

### 1) 문제 인식 : 피그마 데이터 16MB 이상일 경우 MongoDB 저장 시 에러 발생

피그마 API로부터 피그마 데이터가 16MB 이상일 경우 MongoDB에 저장 시 에러가 발생했습니다.

<br />

### 2) 문제 원인 : MongoDB에서 대용량의 파일을 저장 할 수 없는 이유는?

MongoDB에서는 단일 Document의 최대 저장 가능 용량을 16MB로 제한하고 있습니다.

문서 저장 크기를 제한하는 이유는 공식 문서에서 아래와 같이 설명하고 있었습니다.

> 1. 인덱싱과 쿼리 **성능을 최적화**하기 위해
>
> 2. 메모리 사용량을 관리하고 **시스템 안정성**을 유지하기 위해
>
> 3. 네트워크 대역폭을 효율적으로 사용해서 **속도를 최적화** 하기 위해
>
> 4. 문서 업데이트 작업의 **원자성과 일관성을 유지**하기 위해

<br />

### 3) 해결 방안 모색 : GridFS는 어떤 기능이고 어떻게 동작할까?

GridFS는 MongoDB에서 제공하는 대용량 파일을 저장하기 위한 기능으로 파일을 청크(chunk)라는 작은 단위로 분할해서 chunk 컬렉션에 저장하고, 파일의 메타데이터는 files 컬렉션에 저장해서 관리합니다.

![image](https://github.com/Figci/Figci-Plugin-Client/assets/95596243/c7bd2de3-794b-4814-a83f-05c37494a320)

=> GridFS에 대해서 요약하자면 아래와 같습니다.
> - 파일구성 : GridFS는 메타데이터 `files`와 작은 단위로 쪼갠 `chunk`로 구성됩니다.
>
> - 청크의 기본 크기는 255KB이며 파일의 고유 objectId를 참조해서 파일을 재구성합니다.
>
> - 청크 단위로 파일을 읽고 쓸 때 스트리밍 방식으로 이루어지므로 실시간 데이터 처리가 가능합니다.
>
> - 대용량 파일을 안정적으로 처리할 수 있고 스트리밍 방식으로 메모리 사용량을 최소화합니다.

<br />

<details><summary><b>💡 여기서 잠깐! 스트림(Stream) 알고가기</b></summary>
<p>

> **💡 스트림 (Stream) 이란?**
>
> MongoDB의 GridFS에서 대용량 파일을 처리할 때 스트림 `Stream`방식을 사용하는데 `Stream`이란 단어에서 유추할 수 있듯이 데이터를 끊기지 않고 연속적으로 전송하고 처리하는 방식입니다.

`Stream` 방식의 장점을 요약하자면 다음과 같습니다.

1. 메모리 효율성
    - 대용량 파일을 청크 단위로 처리하므로 메모리 사용량을 최소화합니다.
2. 네트워크 효율성
    - 각 청크는 독립적으로 전송되므로 네트워크 대역폭을 효율적으로 활용하고 전송 시간을 단축합니다.
3. 실시간 데이터 처리
    - 청크 단위로 데이터를 처리하는 동시에 변환, 압축 등 추가적인 작업을 실시간으로 수행할 수 있습니다.

  ⇒ `GridFS`에서 스트림 방식을 사용함으로써 대용량 파일을 효율적으로 처리할 수 있고, 이벤트 기반 처리를 통해 에러 핸들링과 로직 작성이 간편해지고 메모리와 효율성을 높이고 실시간 데이터 처리가 가능해집니다.
</p>
</details>

<hr />
<br />

### 4) 문제 해결 : 우리 서비스에서 gridFS 를 어떻게 적용할 수 있을까?

- 아이디어 : **파일 용량 크기에 따라서 16MB를 기준으로 다른 방식으로 저장하기**

  평탄화된 피그마 데이터를 MongoDB에 저장하기 전 데이터 크기에 따라 저장 하는 방식을 다르게 적용하기 위해 먼저 피그마 데이터의 크기를 구해야 했습니다.

1. **데이터의 크기 구하기**

    MongoDB에 저장하고자 하는 피그마 데이터는 Javascript Object 타입으로 파일의 크기를 구하기 위해 연속적인 데이터 형태인 JSON으로 직렬화 하기 위해 `JSON.stringify`를 사용하고 `length`를 사용해서 문자열의 길이로 대략적인 파일의 크기를 구했습니다.

2. **데이터 크기에 따라 다른 방식으로 저장**

    데이터의 크기가 상수화 해놓은 16MB 이상인지 이하인지 여부에 따라서 <span style="color: #CBF6C1">gridFS 파일 형태로 저장할지 </span>스키마 구조대로 컬렉션에 <span style="color: #FFA5A5">Document로 저장할지 </span> 분기 처리하였습니다.

    ```js
    // document 객체의 크기에 따른 저장 방법 분기처리

    // javascript를 JSON으로 직렬화 하여 문자열의 길이로 파일의 크기 추출
    const documentSize = JSON.stringify(document).length;

      // CONSTANT.MAX_DOCUMENT_SIZE => 16MB
      if (documentSize <= CONSTANT.MAX_DOCUMENT_SIZE) {

      // 16MB 이하 데이터의 경우 스미카 설계대로 Document 저장
        const flattenedDocument = await Document.create(document);

        return flattenedDocument;
      }

      // 16MB 이상 데이터의 경우 gridFS 파일로 저장
      const gridFSDocument = await saveDocumentToGridFS(document);

      return gridFSDocument;
    ```

3. GridFS를 활용하여 대용량 파일 처리 : 

    GridFS를 활용하여 대용량 파일 처리 처리하는 방식은 아래의 순서로 동작합니다.

    1️⃣ gridFS 기능을 사용하기 위해 저장하고자 하는 DB와 연결된 bucket을 생성
    
    ```jsx
    const initBucket = async () => {
      const db = mongoose.connection.client.db(CONFIG.DB_NAME);
    
      bucket = new GridFSBucket(db, { bucketName: CONSTANT.BUCKET_NAME });
    };
    ```

    2️⃣ 해당 bucket에 데이터 처리를 위한 stream 메서드를 실행
    - gridFS 파일 저장 시 : `GridFSBucket.openUploadStream()`
    - gridFS 파일 조회 시 : `GridFSBucket.openDownloadStream()`
    
    3️⃣ chunk 단위로 데이터를 처리
    
    - 대용량 파일을 `chunks` 라는 단위로 분할하여서 각 `chunks`는 고유한 ObjectId를 공유하고 메타 데이터(파일명, 크기, 청크 정보 등)는 `files` 컬렉션에 저장하고, 파일 청크를 `chunks` 컬렉션에 저장한다.
    
    4️⃣ 결과 반환
    - 파일을 조회할 때 `files` 에서 메타 데이터를 찾고, 해당 파일의 ObjectId를 공유하는 `chunks` 를 합쳐서 파일을 재구성하여서 결괏값을 `resolve`에 담아 반환한다.
    - gridFS 메서드를 호출한 곳에서 gridFS Stream의 반환값이 Truthy 일 때 다음 로직을 수행한다.

    5️⃣ 에러 핸들링
    - chunk 단위의 데이터 처리에 실패했을 때 null을 `resolve` 메서드에 담아 반환한다.
    - gridFS 메서드를 호출한 곳에서 gridFS Stream의 반환값이 Falsy 일 때 에러 핸들링을 수행한다.

<br />

### 5) 추가 문제 인식 : GridFS 파일과 Document 객체의 데이터 구조가 달라요..

<hr />

피그마 파일 데이터가 `16MB 이하인 경우`, 설계된 <span style="color: #CBF6C1">스키마에 따라 Map 형식으로 문서가 저장</span>됩니다. <br />

반면, <span style="color: #FFA5A5">GridFS 파일은 피그마 파일 데이터 Object 타입 그대로 저장</span>되므로, Map 구조를 기반으로 동작하는 `비교 로직 수행 시 에러가 발생`했습니다.

<br />

### 6) 문제 해결 : GridFS 파일을 Document 객체와 동일한 Map 구조로 변환

<hr />

기존 스키마 설계대로 저장된 <span style="color: #CBF6C1">document 객체의 Map 타입</span>과 <span style="color: #FFA5A5">gridFS 파일 데이터의 Object 타입</span>을 같게 하기 위해 <i><u>gridFS 데이터를 반환하기 전 Map 자료구조로 변환하는 로직을 수행</u></i>하도록 하여서 문제를 해결할 수 있었습니다.

```jsx
// GridFS 파일 조회 시 ===================================================

// Object 타입 데이터
const gridFSFileBuffer = await downloadStreamToBuffer(downloadStream);
const gridFSDocument = JSON.parse(gridFSFileBuffer.toString());

// Object => Map 변환 로직 수행
const convertedDocument = convertObjectToMap(gridFSDocument);

return convertedDocument;


// GridFS 파일 저장 시 ===================================================
// Object 타입 데이터
const savedGridFSObject = await uploadStreamToGridFS(
	uploadStream, 
	flattenFigmaJson,
);

// Object => Map 변환 로직 수행
const convertedDocument = convertObjectToMap(savedGridFSObject);

return convertedDocument;
```

<br />

<h2 id="복잡한-피그마-data를-mongodb에-어떻게-저장할까">🗄️ 복잡한 피그마 Data를 MongoDB에 어떻게 저장할까?</h2>

### 1) 초기 접근 방식: 피그마 JSON 데이터 저장 방식 고려

<img src="src/assets/readme/image_json_data.png" width="720" alt="json 데이터 이미지" />

피그마 파일의 트리 구조는 피그마 파일 구조의 데이터들이 모두 들어가 있기 때문에 `Document` - `Pages` - `Frames` - `Nodes` 순으로 중첩되고 많은 데이터를 포함하고 있습니다.

저희는 동일한 파일의 버전 간 데이터 비교와 디자인된 화면을 캔버스에 구현하기 위해 피그마 파일 트리구조를 그대로 보존하면서 MongoDB의 관계형 데이터베이스 구조에 맞게 저장해야 했습니다.

<br />

### 2) 해결 방안 모색 : 피그마 파일 스키마 구조화

<img src="src/assets/readme/image_database.png" width="720" alt="스키마 디자인 이미지"/>

초반에는, `NodeSchema`를 트리 구조 그대로 저장했었습니다. `Frame` 내부에 있는 `Nodes` 데이터 안에 많은 정보들이 집중되어 있었기 때문에<br />
한 번에 트리 구조를 Database에 넣는 것은 MongoDB의 문서 용량 제한의 문제나 데이터의 무결성을 유지하기도 어려웠습니다.

해당 구조를 그대로 저장하다 보니 (동시에 순회를 하지 않는다고 가정 해도) 트리구조의 깊은 중첩 탓에 비교하고 싶은 값에 한 번에 접근하기가 쉽지 않았고,<br />
이를 해결하기 위해 저희는 `NodeSchema`에 트리 구조 그대로 저장하는 대신 `DFS` 알고리즘을 활용하여<br />
Node 데이터를 평탄화시킨 뒤 DB에 저장함으로 써 트리 구조의 효율적인 관리가 가능해졌습니다.

<br />

<h2 id="피그마-json-파일을-어떻게-렌더할-수-있을까">🎨 피그마 JSON 파일을 어떻게 렌더할 수 있을까?</h2>

### 1) 데이터 분석: 피그마 JSON 파일은 어떻게 구성되어 있을까?

**피그마 속성 분류**<br />

<img src="src/assets/readme/image_figma_data.png" width="720" alt="피그마 데이터"/>

서버로부터 전달받은 Figma JSON 트리를 Fabric.js를 사용하여 캔버스에 렌더링해야 했습니다.<br />
피그마에는 여러 가지 속성이 존재하였고 그중에 canvas로 렌더할 수 있는 속성을 분류하기 위해 피그마 내부 디자인 시스템에서 사용하는 **"시스템 속성"**과 실제 렌더에 관여하는 **"디자인 속성"**으로 나누어서 속성을 분류했습니다.

```javascript
// 디자인 속성 (실제 시각적인 렌더 관여하는 요소)
absoluteBoundingBox: { x, y, width, height },
absoluteRenderBounds: { x, y, width, height },
constraints: { vertical, horizontal },
clipsContent: true,
background: [{ blendMode, type, color }],
fills: [{ blendMode, type, color }],
strokes: [],
strokeWeight: 1,
strokeAlign: "INSIDE",
backgroundColor: { r, g, b, a },

// 시스템 속성 (피그마 디자인 시스템 관련 요소)
layoutAlign: "INHERIT",
layoutGrow: 0,
layoutSizingHorizontal: "FIXED",
layoutSizingVertical: "FIXED",
rectangleCornerRadii: [0, 0, 0, 0],
cornerSmoothing: 0,
effects: [],
componentId: "37:17",
componentProperties: { Primary, Secondary, Line, "full CTA" },
overrides: [ { id, overriddenFields },
```

<br />

### 2) 다양한 피그마 요소 렌더링 : 피그마의 여러가지 도형이나 이미지를 어떻게 효과적으로 렌더할 수 있을까?

저희는 복잡한 피그마 JSON 데이터를 피그마 애플리케이션에서의 디자인과
가장 유사하게 웹 Canvas 상에 렌더링 하기 위해 ***Fabric.js*** 라이브러리를 사용했습니다.

<details>
  <summary>
    <b>💡 여기서 잠깐!`Fabric.js`를 사용한 이유는?</b>
  </summary>
  <p>

  ### 🎨 `Fabric.js`를 사용한 이유는?

  #### *1. 간편한 이벤트 핸들링* 
  저희 서비스에서는 변경 결과 페이지에서 디자인 변경 사항이 존재하는 경우 변경된 영역 크기만큼 <span style="color: #CBF6C1">**변경된 영역을 표시하기 위한 도형 객체**</span>와, <span style="color: #FFA5A5">**변경된 내용의 텍스트 객체**</span>를 canvas에 렌더링하게 되는데,

  이때 <span style="color: #CBF6C1">**변경된 영역을 표시하기 위한 도형 객체**</span>에 사용자의 마우스 이벤트가 발생했을 때 <span style="color: #FFA5A5">**변경된 내용의 텍스트 객체**</span>를 보이게 했습니다.

  즉, 사용자의 mouseHover 이벤트가 발생에 따라 동적으로 <span style="color: #FFA5A5">**변경된 내용의 텍스트 객체**</span>가 보이도록 display 속성값이 바뀌도록 했습니다. <br />

  > ```fabric.js```는 fabric Object라는 객체 형태로 변환 한 후 canvas에 렌더링 하기 때문에 객체의 이벤트 처리가 용이하다.

  두 객체에 발생하는 이벤트에 따라 UI가 적절히 변경되도록 이벤트에 따른 객체 간의 상호작용을 편리하게 구현할 수 있는 장점 때문에 ```fabric.js``` 를 사용했습니다.

  [🔗 관련 내용 링크](#3-객체의-이벤트-상호-작용--요소-간-발생하는-이벤트에-따라-상호작용하게-할-수-없을까)

  <br /> 

  #### *2. 다양한 그래픽 요소 지원*

  |실제 배포된 Figci 서비스 Web 상의 비교 결과 페이지|
  |----|
  |<img src="src/assets/readme/image_web_preview.png" width="720" alt="web-preview"/>|

  저희 서비스에서는 디자인 변경 요소를 표시하기 위해 이후 버전의 디자인 요소위에 변경된 영역과 변경 사항 텍스트가 겹쳐서 렌더링 되게 됩니다.

  그러기 위해 피그마 애플리케이션에서 작성된 디자인을 그대로 웹 canvas 상에 렌더링했는데 다양한 그래픽 요소(도형, 선, 텍스트 등)를 지원하는 ```fabric.js``` 사용을 고려하게 되었고 Figma의 다양한 디자인 요소(Rectangle, Text, Line 등..)를 구현하기에 가장 적합했습니다.

  [🔗 관련 내용 링크](#피그마-json-파일을-어떻게-렌더할-수-있을까)

  </p>
</details>

<hr />
<br />

**피그마 타입별 렌더 함수 작성**<br />
피그마 디자인 파일의 JSON 데이터를 Fabric.js 객체로 변환하는 맵핑 함수를 구현하였습니다. <br />

서버에서 전달받은 피그마 데이터를 한 번의 순회로 fabric 객체로 모두 변환한 뒤 Canvas에 렌더링 하여서 다양하고 많은 양의 디자인 요소들을 효과적으로 렌더링할 수 있게 되었습니다.

```javascript
// 피그마 타입별 렌더함수 맵핑
const renderFunctionByFigmaType = {
  BOOLEAN_OPERATION: renderRect,
  COMPONENT: renderRect,
  ELLIPSE: renderEllipse,
  FRAME: renderFrame,
  GROUP: renderRect,
  INSTANCE: renderRect,
  MODIFIED: renderDifference,
  NEW: renderNewFrame,
  NEW_FRAME: renderNewFrameInfo,
  REGULAR_POLYGON: renderTriangle,
  RECTANGLE: renderRect,
  TEXT: renderText,
  VECTOR: renderRect,
  LINE: renderRect,
};
```

<br />

### 3) 객체의 이벤트 상호 작용 : 요소 간 발생하는 이벤트에 따라 상호작용하게 할 수 없을까?

사용자 경험을 고려해서 이전 버전과 비교해 **변경 사항이 감지된 영역을 먼저 시각적으로 강조해 표시** 하고 사용자가 확인하기 원하는 영역에 마우스 이벤트가 발생했을 때만 변경된 내용이 보이게 하고 싶었습니다.<br />

`fabric.js`의 `set`메서드를 사용해서 렌더링 전에 마우스 이벤트 핸들러를 추가했습니다. <br />

마우스 이벤트 발생에 따라 변경 내용이 동적으로 보이도록 **변경 영역 도형과 변경 사항 텍스트의 속성을 맵핑 후 렌더**하여서 사용자의 상호작용에 따라 실시간으로 변경 내용이 보이도록 구현하였습니다.

```javascript
// 변경 사항 영역을 표시해 주는 Rectangle 도형 객체
rectObject.on("mouseover", () => {
  const [r, g, b, o] = getRGBNumber(rectObject.fill);
  const mouseoverColor = `rgba(${r}, ${g}, ${b}, 0.5)`;

  rectObject.set({
    fill: mouseoverColor,
  });
  // mouseOver 이벤트 발생 시 변경 사항 텍스트 보이기
  textObject.set({
    visible: true,
  });
  this.renderAll();
});

rectObject.on("mouseout", () => {
  const [r, g, b, o] = getRGBNumber(rectObject.fill);
  const mouseoutColor = `rgba(${r}, ${g}, ${b}, 0)`;

  rectObject.set({
    fill: mouseoutColor,
  });

  // mouseOut 이벤트 발생 시 변경 사항 텍스트 가리기
  textObject.set({
    visible: false,
  });
  this.renderAll();
});
```

<br />

### 4) 피그마 디자인 속성 구현 : 피그마에 디자인 시스템 속성은 어떻게 구현할 수 있을까?

피그마 JSON 데이터를 canvas에 구현하면서 어려웠던 부분 중 하나는 피그마 디자인 시스템에서 사용하는 속성을 구현하지 못해서 실제 디자인과 다르게 보이는 문제가 발생했습니다. <br />

여러 가지 피그마 디자인 속성 중 clipPath 속성을 구현한 부분에 대해서 작성했습니다.

<br />

> 💡 **`clipPath` 속성이란?**
>
> clipPath 속성은 특정 영역을 잘라내어 그 영역 밖의 부분은 보이지 않게 하는 속성입니다.

<img src="src/assets/readme/image_clippath.png" width="720" alt="clippath"/>

Figma 데이터에서 `clipsContent` 속성값을 확인하였습니다.<br />
`clipsContent`가 true인 경우, 연결된 자식 노드를 찾아 `Fabric.js`객체로 변환하고<br /> `clipPath` 속성에 부모 노드를 추가하여 자식 노드와 부모 노드를 연결하였습니다.


<br />

<h2 id="플러그인에서는-oauth-로그인을-어떻게-구현해야-할까">👤 플러그인에서는 OAuth 로그인을 어떻게 구현해야 할까?</h2>

### 1) 문제 인식 : 플러그인 환경에서는 redirect가 되지 않는다?

OAuth 2.0의 동작 과정은 사용자가 인증 서버에서 로그인하고 인증을 완료한 후,<br />
저희가 등록한 `redirectURL`로 리디렉션하는 단계를 포함합니다.

이 과정에서 **Authorization Server**는 권한 부여 승인을 위해 자체 생성한 Authorization Code 를`redirectURL`로 전달하고,<br />
클라이언트에서 해당 Authorization Code로 보호된 자원에 요청할 수 있는 AccessToken을 발급해 주는 방식으로 동작합니다.

<img src="src/assets/readme/image_OAuth_1.png" width="720" alt="OAuth 2.0 인증 동작방식 이미지" />

<br />

그러나 이러한 메커니즘은 Figma 플러그인에서는 작동하지 않았습니다.<br />
Figma 플러그인은 웹 브라우저가 아닌 Figma 애플리케이션(일렉트론 앱)에서 실행되어<br />
브라우저의 redirect 메커니즘이 그대로 적용되지 않기 때문이었습니다.<br />

**Authorization Server**로부터 리디렉션이 일어나는 과정을 플러그인 환경에서 클라이언트 측에서 처리하는 것이 불가능했습니다.

_**이 문제를 해결하기 위해 저희는 OAuth인증을 저희가 구축해놓은 서버로 우회하여 처리하는 방법을 생각해냈습니다.**_

<br />

### 2) 해결 방안 모색 : 서버로 우회하여 OAuth인증을 받자!

**저희가 생각해낸 방법은,**

사용자가 로그인하게 되면 **Authorization Server**에서는 기존에 등록된 서버의 엔드포인트로 redirect 요청을 보내고,<br />
서버에서 OAuth 2.0인증을 통해 AccessToken을 발급받으면,<br />
플러그인 클라이언트에게 발급받은 AccessToken을 전달해 주는 방식이었습니다.

<img src="src/assets/readme/image_call_URL.png" width="720" alt="서버 엔드포인트를 Call URL에 추가한 이미지" />

→ Callback URL에 서버 측 엔드포인트를 추가해 주어서 redirect 요청을 서버로 우회하여 받을 수 있게 하였습니다.

<br />

<img src="src/assets/readme/image_OAuth_2.png" width="720" alt="서버로 우회한 OAuth인증절차 시각화 이미지" />

_→ 서버로 redirectURL을 우회하여 AccessToken을 클라이언트 측으로 전달하는 로직을 시각화한 것._

<br />

이때 서버 측에서 모든 인증이 완료되어 AccessToken이 성공적으로 발급되었다면,<br />
`Server Side Rendering` 으로 만들어진 로그인 완료 페이지를 응답으로 보내 UX를 개선했습니다.

<img src="src/assets/readme/image_server_side.png" width="720" alt="서버사이드 렌더링 로그인 완료 페이지 이미지" />

<br />

<h3 id="3-추가-문제-인식-근데-클라이언트-측에서-인증-완료-여부를-어떻게-알지">3) 추가 문제 인식 : 근데.. 클라이언트 측에서 인증 완료 여부를 어떻게 알지..? 😳</h3>

다만 서버로 우회하는 OAuth로그인 방식을 구현하면서 마주했던 또 다른 문제점은

**_Authorization Server_** 에서 저희 서버로 요청을 보낸 request-response life cycle 내부에서 AccessToken이 생성되는 것이므로<br />
**_플러그인 클라이언트 측에서는 서버 측에서 인증을 성공하여 AccessToken을 정상적으로 발급을 받았는지 알 수 있는 방법이 없었습니다._**<br />
**_이를 해결하기 위해 저희는 `Polling` 기법을 사용했습니다._**

<br />

&ensp; **• `Polling` 이란?**

&emsp; → 클라이언트가 일정한 주기(특정한 시간)을 가지고 서버와 응답을 주고받는 방식으로 <br />
&emsp; 웹 소켓과 같은 특정한 프로토콜을 사용하지 않아도 아주 간단히 서버와 지속적인 커넥션을 유지하는 방법 입니다.
&emsp; 즉, 클라이언트는 일정 주기마다 서버에 요청을 계속 보내, 지속해서 최신 데이터 상태를 유지할 수 있습니다.

&emsp; <img src="src/assets/readme/image_polling.png" width="720" alt="Polling동작방식 이미지" />

<br />

### 4) 문제 해결 : Polling 방식을 사용한 인증 확인 요청

클라이언트 측에서는 로그인을 완료하게 되면, <br />
해당 시점 이후부터는 일정한 시간마다 서버에 지속해서 AccessToken 전달을 요청하는 request를 보내게 됩니다.<br />
서버 측에서는 인증이 성공적으로 완료가 되어서 AccessToken을 발급받았다면 <br />
해당 AccessToken을 클라이언트의 `Polling`요청에 대해서 응답으로 보내게 됩니다.

클라이언트 측에서는 AccessToken을 응답으로 받게 되면, 서버로 Polling 요청을 중단합니다. <br />
이렇게 OAuth 로그인을 구현함으로써 플러그인 환경에서도 AccessToken을 발급받아 Figma REST API를 사용할 수 있었습니다.<br />

<br />

# 개발 이슈

<h2 id="캔버스에-이벤트가-발생하지-않는다">🙅‍♂️ 캔버스에 이벤트가 발생하지 않는다?!</h2>

사용자가 강조 표시된 Rectangle 마우스 호버 이벤트 발생 시 변경 사항 Textbox 을 보이게 하고 싶었으나<br /> 캔버스에 이벤트 자체가 발생하지 않는 문제가 발생했습니다.

<br />

### 1) 문제 원인 : Fabric.js 캔버스의 반복 렌더링

Fabric.js에서는 객체가 그려지는 `lower.canvas`와 사용자 이벤트를 처리하는 `upper.canvas`가 분리되어 있는데<br /> 이벤트 처리를 담당하는 `upper.canvas`에 문제가 있다고 판단했습니다.

<img src="src/assets/readme/image_canvas.png" width="720" alt="캔버스 문제 원인 이미지"/>

개발자 모드 layer 탭에서 확인한 결과 `upper.canvas`가 두 번 생성되어 사용자 이벤트가 제대로 전달되지 않았다는 것을 가정하고<br />
`canvas`가 반복적으로 렌더되는 부분을 확인했습니다.

<br />

### 2) 문제 해결 : Fabric.js 캔버스의 sideEffect 처리

#### 🧐 왜 `upper.canvas`가 두 번 생성되고 있을까?

React.StrictMode로 인해 useEffect가 2번 실행되어서 `upper.canvas`가 두 번 생성되어서 이에 따라 사용자 이벤트가 `lower.canvas` 객체로 제대로 전달되지 않는 문제 발생 함수 시절
fabric.js 캔버스의 sideEffect 처리를 하지 않아 발생한 문제로 판단하여서 언마운트시 캔버스가 초기화 되도록 fabric.js 의 `dispose` 메서드를 활용하여서 클리어 함수 로직을 추가하였습니다.


| 메서드 | 설명 |
|--------|------|
| dispose() | 캔버스 인스턴스 자체를 완전히 제거합니다. 클리어 함수에 더 적합하다고 판단|
| clear() | 캔버스 위의 객체들만 제거하고, 인스턴스는 유지합니다. 새 객체를 렌더할 때 사용|

<br />

```javascript
useEffect(() => {
  // Fabric.js 초기화 함수
  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.dispose(); // 모든 캔버스 설정 삭제
    }
  };

  return () => {
    clearCanvas(); // Fabric.js 초기화 함수 실행
  };
}, []);
```

| sideEffect 처리 전                                                                              | sideEffect 처리 후                                                                              |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| <img src="src/assets/readme/image_canvas_side_effect_1.png" alt="side effect 처리 전 이미지" /> | <img src="src/assets/readme/image_canvas_side_effect_2.png" alt="side effect 처리 전 이미지" /> |

**→ 사이드 이펙트 처리함으로서 `upper.canvas` 가 중복으로 생성되는 문제를 해결하고, 캔버스 이벤트가 정상적으로 `lower.canvas` 객체에게 전달되도록 했습니다.**

<br />


<h2 id="렌더링-순서가-뒤죽박죽">🫨 렌더링 순서가 뒤죽박죽!</h2>

### 1) 문제 원인 : Fabric 객체 생성 시 생성 순서 미보장

피그마에서는 디자인 요소의 중첩 구조에 따라 z-index를 구분하지만, 서버로부터 전달받은 JSON 데이터는 실제 중첩 구조와 다르게 평탄화되어 있었습니다. 또한 평탄화된 디자인 요소를 fabric 객체로 변환해서 Object 타입의 변수에 할당한 뒤 순회할 때, 객체 내의 생성 순서가 보장되지 않아 실제 디자인과 다르게 렌더링 되는 문제가 발생했습니다. 앞에 있어야 할 디자인 요소가 뒤로 가려져 보이지 않는 등 **디자인 요소의 중첩 순서가 바뀌는 문제가 발생** 했습니다.

<br />

### 2) 문제 해결 : BFS 알고리즘 적용과 Map 자료구조 사용으로 객체 생성 순서 보장

1️⃣ 평탄화 시 실제 피그마 디자인의 중첩 구조를 보장하기 위해  `DFS(깊이 우선 탐색)` 대신 `BFS(너비 우선 탐색)로` 알고리즘을 변경하여 피그마 상에 중첩되어 있는 구조를 보장하면서 평탄화할 수 있었습니다.<br />
🔗 [**DFS** 로 피그마 데이터 평탄화 하기](#🗄️-복잡한-피그마-data를-mongodb에-어떻게-저장할까)

2️⃣ 평탄화된 디자인 요소의 중첩된 순서를 보장하기 위해 Fabric 객체로 변환된 피그마 데이터를 순회할 때 Object 형태 대신 Map 형태로 변경하였습니다. 이를 통해 피그마 데이터의 원래 중첩 구조 순서대로 Fabric 객체가 만들어진 순서를 보장하여서 Canvas에 렌더링함으로 실제 피그마 상에 디자인과 동일한 순서대로 디자인 요소를 렌더 할 수 있었습니다.

<br/>

<h2 id="diffing-응답속도가-너무-느려요-feat-testing">🦥 diffing 응답속도가 너무 느려요! (feat. Testing)</h2>

### 1) 문제 원인: MongoDB에서 diffing 결과 조회 시 서브 트리로 치환 로직에서 응답 속도 지연

사용자가 선택한 페이지의 diffing 결과를 가져오는 것은 문제가 되지 않았지만, 예상보다 변경 사항을 도출하고, 사용자에게 응답하기까지의 시간이 너무 길었습니다.

기존의 변경 사항 제공 로직은 다음과 같습니다.

1. 클라이언트에서 요청이 들어오면, endpoint에서 diffing result를 찾기 위해 필요한 정보를 추출합니다.
2. 해당 정보를 가지고 DB에서 저장된 결과가 있는지 탐색합니다.
3. DB에 결과가 있다면 해당 결과를 가져와서 응답합니다.
4. 없다면 diffing을 실행해서 해당 결과를 DB에 저장하고 결과를 응답합니다.

<br/>

예시)<br/>
사용자가 `v1`과 `v2`를 선택하고 비교하고 싶은 페이지로 `page1`을 선택했다고 가정하겠습니다.

v1의 `page1`과 v2의 `page1`을 diffing 합니다.<br/>
page1은 `frame1`, `frame2`, `frame3` 총 3개의 프레임을 갖고 있습니다.<br/>
diffing 결과,<br/>
**_frame1에는 변경 사항이 있지만 frame2와 frame3는 변경 사항이 없습니다._**

이때 서버는 page1에 대한 diffingResult로 frame1, frame2, frame3을 전부 보내는 것이 아니라,<br/>**frame1의 서브 트리와, frame1의 내부 변경 정보**만 전달합니다.

DB에 저장되는 형태는 이미지와 같이 frames의 값에 해당 페이지의 프레임 중에서 변경 사항이 있는 frame의 id만 값으로 할당된 형태입니다.<br/>
(differences 필드에는 프레임의 하위 요소들의 변경 사항 정보들이 저장됩니다.)

<img src="./src/assets/readme/image_diffing_result_data.png" width="720" />

<br />
그러나 클라이언트 측에서 변경 사항을 사용자에게 렌더링하려면 변경 사항 정보만으로는 부족합니다.<br />
<br />
변경 사항이 있는 프레임 원본을 그대로 렌더링한 뒤에 그곳에서 변경 사항이 있는 요소들을 표시하는 프로세스이기 때문에, 변경 사항이 있는 프레임들의 원본 서브 트리도 함께 보내주어야 했습니다.

<br />

따라서 DB에는 변경 사항이 있는 frame의 id들을 배열의 형태로 저장하지만,<br />
클라이언트에게 응답을 보낼 때는 해당 frame id들을 순회하면서 id에 해당하는 프레임 서브 트리로 치환 후, 클라이언트에게 응답하는 과정을 거치게 됩니다.<br />
<br />
정리하자면 diffingResult를 응답하는 과정은 크게 `두 가지`로 진행됩니다.

1. diffing을 해서 변경 사항 정보를 수집하는 과정
2. 변경 사항이 있는 frame의 id를 가지고 서브 트리를 탐색 후 치환하는 과정

<br/>

### 2) 원인 분석 : MongoDB의 diffing 결과 프레임 서브 트리 치환 로직의 정확한 소요 시간 측정

위 로직에 소요되는 정확한 시간을 확인하고자 `Postman`을 사용해서 `테스트`를 진행해 보았습니다.

- **before-version의 크기와 after-version의 크기 : `5.8mb`, `8.1mb`**
- **10개의 다른 버전의 다른 페이지, `delay`는 `100ms`로 설정**

  <img src="./src/assets/readme/image_postman_test.png" width="720" />

<br />

#### 테스트 결과: diffing 결과를 바로 전송하는 방식으로 변경 후 속도 개선 확인

  <img src="./src/assets/readme/image_test_result.png" width="720" />

- 평균 응답시간 : **`1951ms`**
- 첫 응답부터 마지막 응답까지 걸린 시간: **`20s 811ms`**

<br />

그러나, 해당 결과에서 한 가지 **_이상한 점_** 을 발견할 수 있었습니다.

<img src="./src/assets/readme/image_strange_result.png" width="720" />
응답에 따른 시간 차가 매우 클 때가 있었다는 것입니다.

왜 이런 것인지 분석 해보니 시간이 압도적으로 적게 드는 요청은

**_“사용자가 선택한 페이지에 변경 사항이 없는 경우”_** 였습니다.

변경 사항이 없는 경우에는 diffingResult의 frames에 frameID가 존재하지 않을 것이고, 이는 diffingResult를 보내는 두 가지 큰 과정 중

**_“변경 사항이 있는 frame의 id를 가지고 서브 트리로 치환하는 과정”_** 을 생략한다는 것을 의미하고,<br/>
이는 곧 **_“변경 사항이 있는 frame의 id를 가지고 서브 트리로 치환하는 과정”_** 을 처리하는 데 시간이 오래 걸린다는 것을 의미했습니다.

직접 확인해보니

<img src="./src/assets/readme/image_test_time.png" />

1. 해당 결과를 찾아서 가져오는 데 걸리는 시간: **`평균 70ms`**
2. 변경 사항이 있는 frame의 id를 서브 트리로 치환하는 시간: **`평균 7000ms`**

<br />
저희의 생각이 맞았습니다.<br />
실제로 diffing을 하는 시간보다 frame들을 서브 트리로 치환하는 데 걸리는 시간이 훨씬 더 오래 걸렸습니다.

<br />

그렇다면 ***“해당 서브 트리 치환 과정이 왜 필요한가?”*** 를 생각해 본 결과, diffingResult를 DB에 저장할 때 frame의 ID값으로만 저장하므로, 실제 프레임 내용을 가져와야 했기 때문이었습니다.

그렇다고 frame 서브 트리를 스키마 없이 중첩된 데이터를 그대로 값으로 넣기에는 데이터 모델의 복잡성이 증가하기 때문에 ID로 넣어주었습니다.

이에 따라 저희는 **_“그렇다면 서브 트리 치환 과정을 하지 않을 수 있는 방법은 없을까?”_** 를 고민하기 시작했습니다.

<br />

### 3) 문제 해결: diffing 결과를 바로 응답하므로 서브 트리 치환 로직 생략

저희는 아래와 같은 아이디어를 도출했습니다.

**_“만약, diffing을 진행하면서 요소에 변경 사항이 있으면 해당 요소의 frame을 바로 diffingResult에 넣어 주고, <br />사용자에게 응답을 보내준다면 치환 과정을 생략할 수 있지 않을까?”_**<br />

물론 그 말은 DB에 diffingResult를 저장하지 않기 때문에 사용자의 요청마다 중복된 요청이라도 diffing을 해야 하지만,<br />프레임을 서브 트리로 치환하는 시간이 사라진다는 것이 사용자 경험으로도 좋게 다가올 것 같았습니다.

<br />

### 4) 테스트 결과 : 개선된 로직으로 기존 대비 약 2.5배의 응답 속도 향상 달성

**_기존 diffing 결과를 DB에 저장하는 로직을 삭제하고 클라이언트에 바로 응답을 전달하는 방법으로 로직을 수정 한 뒤 테스팅을 진행했습니다._**

**`Result 스키마`를 삭제** 하고 `diffingResult`를 바로 클라이언트에게 응답으로 보냄으로써

<img src="./src/assets/readme/image_improved_result.png" width="720" />

1. 매 응답마다 새로 diffing을 할 경우 걸리는 시간: **`평균 800ms`**
2. 첫 응답부터 마지막 응답까지 걸린 시간: **`8s 811ms`**

<br />

기존 DB에 저장하는 방식과, 개선한 로직의 테스팅 결과를 분석해본 결과

<img src="./src/assets/readme/image_diffing_speed.png" width="720" />

#### 약 `2.5배` 정도의 성능 개선을 이루어 낼 수 있었습니다.

<br />

<h2 id="gridfs-map-데이터가-json-직렬화-시-데이터가-사라진다">❔ gridFS Map 데이터가 JSON 직렬화 시 데이터가 사라진다?</h2>

### 1) 문제 인식 : 서버에서 gridFS Map 데이터 전송 시 내부 데이터 소실로 인한 렌더링 에러 발생

서버에서 <span style="color: #CBF6C1">**gridFS의 Map 데이터**</span>를 비교한 결과를 클라이언트에 전송하기 위해 Map 구조가 Object로 직렬화될 때 Map 내부 데이터가 소실되어 빈 객체를 전달하고 있었습니다.

그 결과 클라이언트에서는 프레임 내부가 빈 화면으로 렌더링 되는 에러가 발생했습니다.

반면에 <span style="color: #FFA5A5">**MongoDB에서 조회한 Map 데이터**</span>를 비교한 결과는 클라이언트에 전송하기 위해 Map 구조가 Object로 직렬화될 때 Map 내부 데이터를 유지하면서 Object로 변환되어 결과를 전달하고 있었습니다.

이에 따라 <span style="color: #CBF6C1">**gridFS의 Map 데이터**</span>가 `Object 타입으로 직렬화 시 데이터가 소실되는 이유`와 `데이터 소실을 방지하면서 Object 데이터로 직렬화 하기 위한 방법`을 찾아야 했습니다.

<br />

<h3 id="2-원인-분석-Map-구조-데이터가-왜-Object-타입으로-변환-되어있을까?">2) 원인 분석 :<br/><br/>1️⃣ Map 구조 데이터가 왜 Object 타입으로 변환 되어있을까?</h3>

서버에서 데이터를 클라이언트에 전송할 때 연속된 데이터 형식인 JSON로 ***직렬화*** 되어서 전송하고 클라이언트에서는 `response.json()` 를 실행해서 ***역 직렬화*** 해서 Javascript 객체 형태로 데이터에 접근할 수 있습니다.

이때 클라이언트에서 전송된 데이터를 확인해 보면 Map 데이터가 Object로 변환되는 이유는 <u>***`JSON`은 Map을 지원하지 않기 때문에***</u>Map 구조가 Object로 변환됩니다.

JSON에 Map 지원이 없는 이유를 직접적으로 명시하지는 않지만 공식 문서의 설계 목표와 원칙에서 
알 수 있듯이 단순성과 범용성을 중요하게 여기는 JSON의 특성 때문으로 유추해 볼 수 있습니다.

> JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write

<br />

### 2️⃣ Map 구조가 Object로 변환될 때 왜 Map 데이터가 소실 될까?

Map 데이터가 Object로 변환되면서  Map 내부 데이터가 소실되고 빈 객체  `{}` 를 반환하고 있었습니다. 그래서 프레임 내부 노드 데이터인 “nodes” 키값의 데이터가 소실되었기 때문에 캔버스에 렌더링 될 때 빈 프레임만 렌더링 되는 에러가 발생했습니다.

<br />

|서버 -> 클라이언트 데이터 전송 시 `nodes`의 Map 데이터가 소실(오른쪽) 되고 {} 빈 객체를 전달(왼쪽)|
| ---- |
|![image](https://github.com/Figci/Figci-Plugin-Client/assets/95596243/b2dc3710-232f-445a-81fd-784eb6cdeb69)|
 
<br />

서버에서 데이터를 전송할 때 연속된 형태의 JSON 형식으로 변환하는 직렬화 과정을 거치는데 이때 Map 내부 데이터가 소실되는 이유는 `JSON`에는 Map을 처리할 수 없어서 Map을 일반 Object 객체로 취급하게 되기 때문에 Map 에서 Object 형태 (키-값) 로 접근할 수 있는 데이터가 없는 경우 빈 객체 `{}` 를 반환합니다.

> **JSON은 Object 형태로 (키-값) 구성되어 있지 않은 데이터는 다룰 수 없다.**

<br />

### 3️⃣ MongoDB의 Map 데이터를 Object 변환할 시 소실되지 않는 이유

그렇다면 왜 <span style="color: #FFA5A5">MongoDB에서 조회한 Map 데이터</span>는 Object 직렬화 시 왜 Map 내부 데이터가 소실되지 않을까?

|MongoDB Map 데이터 nodes의 데이터가 유실되지 않고 Object로 직렬화 되어서 클라이언트 데이터 전송됨|
|----|
|![image](https://github.com/Figci/Figci-Plugin-Client/assets/95596243/681b2c8a-f684-4162-8fe1-56d1a2264e65)|

MongoDB에서 조회한 Map 데이터가 클라이언트에 전송 될때 nodes의 Map 데이터가 유실되지 않고 Object로 변환됩니다.

MongoDB Map 데이터와 gridFS Map 데이터가 어떤 차이점을 가지고 있는지 확인하기 위해 `fs` 모듈을 사용해서 클라이언트에 전송하기 전의 데이터를 텍스트 파일로 추출해서 비교해 보았습니다.

|1. Map으로 변환된 gridFS 파일 데이터|2. MongoDB에 조회한 Map 구조 데이터|
|----|----|
|![image](https://github.com/Figci/Figci-Plugin-Client/assets/95596243/1c2fdfce-02ad-49dd-bd9e-4b463c267e5d)|![image](https://github.com/Figci/Figci-Plugin-Client/assets/95596243/51b8d2dd-b795-46c7-97a1-ea0d24319ff3)|

<span style="color: #FFA5A5">MongoDB 데이터</span>는 `_id` 속성이 추가된 것을 제외하면 <span style="color: #CBF6C1">gridFS 파일 데이터</span>와 구조가 동일해 보이지만 <span style="color: #FFA5A5">MongoDB 데이터</span>는 MongoDB 드라이버 내부에서 저장된 `BSON Map` 데이터를 `Javascript Map`으로 역 직렬화해서 반환된 값이기 때문에 내부적으로는 ***Javascript Object 형태로도 값을 가지고 있는*** Map 데이터입니다.

> **즉, MongoDB 에서 조회한 데이터는 BSON Map 형식으로 Object 형태로도 값을 가지고 있기 때문에 직렬화 시 Map 내부 데이터를 유지할 수 있습니다.**

<br />

### 3) 해결 방안 모색 : Map을 JSON으로 직렬화할 때 데이터를 유지하는 방법

Map을 JSON으로 직렬화할 때 내부 데이터를 유지하는 방법에 대해서 코드로 확인해 보자면

```jsx
const map = new Map();

// 직렬화 시 데이터가 누락됩니다.
map.set("name", "figci");

// 직렬화 시 데이터가 포함됩니다.
map["team"] = "coreInsight";

console.log(JSON.stringify(m));
// {"team":"coreInsight"}
```

`set` 메서드로 추가한 “name” 은 직렬화 시 key 값으로 데이터에 접근할 수 없으므로 소실되고 object 형태의 key 값으로 추가한 “team” 데이터는 key 값으로 데이터에 접근할 수 있으므로 유지됩니다.

> **즉, Object 형태의 키-값으로 접근할 수 있는 데이터의 경우 JSON으로 직렬화 시 데이터가 유지됩니다.**

<br />

#### 🧐 MongoDB에서 사용하는 BSON 형식은 무엇일까?

<hr />

> [BSON](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-BSON) is a binary serialization format used to store documents and make remote procedure calls in MongoDB.


- MongoDB에서는 document를 저장하거나 프로시저를 호출할 때 `BSON(Binary JSON)`이라는 이진 형식으로 직렬화된 포맷을 사용해서 데이터를 효율적으로 저장하고 전송할 수 있도록 합니다.

<br />



<details><summary><b>💡 여기서 잠깐! BSON(Binary JSON) 이란?</b></summary>
<p>

#### 🧐 BSON 이란?

> `BSON`은 MongoDB에서 개발한 바이너리 직렬화 형식으로 JSON 기반으로 설계되었지만, 효율성과 유연성 때문에 데이터 직렬화와 전송에 적합한 형식으로 인정받아 현재는 다른 프로젝트와 시스템에서도 널리 사용되고 있습니다.  

- BSON 의 구조

아래의 간단한 JSON 데이터를 BSON 형식으로 변환한 코드를 보면서 차이점을 확인할 수 있습니다.

```jsx
// JSON - human readable
{"hello": "world"}

// BSON - machine readable
\x16\x00\x00\x00           // total document size
\x02                       // 0x02 = type String
hello\x00                  // field name
\x06\x00\x00\x00world\x00  // field value
\x00                       // 0x00 = type EOO ('end of object')
```
JSON 데이터가 binary 형태의 데이터로 변환되고 데이터의 길이, 타입 등 여러 메타데이터를 가지게 됩니다.

<br />

MongoDB에서 사용하는 BSON 형식에 대해서 요약하자면

> 1. MongoDB는 데이터를 저장할 때 내부적으로 `BSON` 형식을 사용하여서 저장한다.
> 2. `BSON`은 `JSON`에서 지원하지 않는 다양한 자료구조를 지원하므로 유연성과 확장성이 높다.
> 3. MongoDB에서 조회한 Map 데이터는 이미 Javascript Object 형태의 데이터를 가지고 있다.
> 4. `BSON`은 다양한 인덱싱, 쿼리 기능을 지원할 수 있게 하는 MongoDB의 핵심 기능 요소이다.
</p>
</details>

<hr />

<br />

MongoDB Map 데이터를 조회해서 클라이언트 전송 시 ***아래의 순서로 데이터 변환***이 일어납니다.

1. **MongoDB 데이터 저장 :**
    - MongoDB Driver에서 Javacript Object ⇒ BSON Map 형식으로 직렬화

2. **MongoDB 데이터 조회 :**
    - MongoDB Driver에서 BSON Map ⇒ JavaScript Map으로 역 직렬화 후 결과 반환

      ⇒ 이때 Javascript Object (키-값) 형태로도 값을 가질 수 있게 됩니다.
    
3. **서버 ⇒ 클라이언트 데이터 전송 :**
    - 네트워크 데이터 전송을 위해 JavaScript Map ⇒ JSON으로 직렬화하여 전송
    
      ⇒ Javascript Object 형태의 값을 가지고 있기 때문에 데이터가 소실되지 않습니다.
    
4. **클라이언트 데이터 출력 :**
    - `response.json()` 으로 JSON ⇒ Javascript Object로 역 직렬화 후 결과 반환

<br />

### 4) 문제 해결 : gridFS Map 데이터를 손실 없이 Object로 변환하기

<hr />

Map으로 변환된 gridFS 파일의 데이터 유실을 막기 위해 아래와 같은 2가지 방법을 생각했습니다.

<br />

> **❌ 방법 1.**  gridFS 파일을 Map으로 변환할 때 Javascript Map이 아닌 BSON Map으로 변환하기 ( 불가능 )

- BSON으로 변환하는 작업은 MongoDB 드라이버 내부에서 이루어지는 작업이기 때문에 직접 구현이 불가

> **✅  방법2.**  gridFS 파일을 Map으로 변환할 때 Object 형태의 데이터 (키- 값) 추가 해주기

- JSON으로 직렬화할 시 Map을 Object 취급하므로 키-값으로 조회할 수 있는 데이터의 경우 데이터 변환 가능

<br />

**`방법 1`** 은 불가능하다고 판단되어 **`방법 2`** 를 선택했습니다. Map 데이터를 생성할 시 Object 형태의 키-값 데이터를 함께 저장하면 Map → Object 직렬화할 시 내부 데이터를 유지할 수 있도록 했습니다.

```jsx
// [ 기존 로직 ] object Entries의 이중 배열 데이터를 Map으로 변환
if (key === "pages" || key === "frames" || key === "nodes") {
  convertedObj[key] = new Map(
    Object.entries(obj[key]).map(([pageId, pageValue]) => [
      pageId,
      convertObjectToMap(pageValue),
    ]),
  );
}

// [ 개선 후 로직 ] set 메서드로 Map 데이터 추가 후 Object 타입의 데이터 추가
if (key === "pages" || key === "frames" || key === "nodes") {
  const convertedMap = new Map();

  for (const [pageId, pageNodes] of Object.entries(gridFSObject[key])) {
    convertedMap.set(pageId, convertObjectToMap(pageNodes)); // map 데이터 추가
    convertedMap[pageId] = convertObjectToMap(pageNodes); // object 데이터 추가
  }

  convertedObject[key] = convertedMap;
} 
```
<br />

# 팀 문화 & 코드 컨벤션


<h2 id="팀-문화">📋 팀 문화</h2>

<details>
<summary><span style="font-size: 16px;">Team Culture가 궁금하시다면</span></summary>
<div markdown="1">
<br />

1. 회의록은 순서대로 돌아가면서 작성
2. 코어타임은 **오전 11시 - 오후 11시**
3. 1분이라도 지각한 사람은 커피 사기
4. 점심시간 오후 12시 30분, 저녁 시간 오후 6시
5. 공지 확인 시 12시간 이내에 답장 해주기 + 공지 확인 후에 ✅ 체크 필수
6. 공부하다 모르는 내용 생기면 공유하고 서로 같이 고민하기

</div>
</details>

<br />

<h2 id="코드-컨벤션">🤝 코드 컨벤션</h2>

<details>
<summary><span style="font-size: 16px;">Convention이 궁금하시다면</span></summary>
<div markdown="1">

### Convention

**(1) `Commit Convention`**

| 커밋 유형          | 의미                                                         |
| ------------------ | ------------------------------------------------------------ |
| ✨ [Feat]          | 새로운 기능 추가                                             |
| 🐛 / 🚑 [Fix]      | 버그 수정                                                    |
| 📝 [Docs]          | 문서 수정                                                    |
| ✏️ [Style]         | 코드 formatting, 세미콜론 누락, 코드 자체의 변경이 없는 경우 |
| ♻️ [Refactor]      | 코드 리팩토링                                                |
| ✅ [Test]          | 테스트 코드, 리팩토링 테스트 코드 추가                       |
| 📦[Chore]          | 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore           |
| 💄[Design]         | CSS 등 사용자 UI 디자인 변경                                 |
| 💬[Comment]        | 필요한 주석 추가 및 변경                                     |
| 🚚[Rename]         | 파일 또는 폴더명을 수정하거나 옮기는 작업만인 경우          |
| 🔥[Remove]         | 파일을 삭제하는 작업만 수행한 경우                           |
| 🔨!BREAKING CHANGE | 커다란 API 변경의 경우                                       |
| 🐛!HOTFIX          | 급하게 치명적인 버그를 고쳐야 하는 경우                      |

<br />

1. **_커밋 유형은 영어 대문자로 작성하기_**

- 예: [Feat] 로그인 구현

2. **_제목과 본문을 빈 행으로 분리_**

- 커밋 유형 이후 제목과 본문은 한글로 작성하여 내용이 잘 전달될 수 있도록 할 것
- 본문에는 변경한 내용과 이유 설명 (어떻기보다는 무엇 & 왜를 설명)

3. **_제목과 본문은 한글로 작성_**
4. **_자신의 코드가 직관적으로 바로 파악할 수 있다고 생각하지 말자_**
5. **_반드시 너무 많은 작업 단위를 담지 말자_**

- 추적할 수 있게 유지해 주기
- 너무 많은 문제를 한 커밋에 담으면 추적하기 어렵다.

<br />

**(2) `PR Convention`**

1. **_PR 제목 양식을 지키자._**
   commit 제목: ✔️어떤 task를 수정했는지 기능 단위로 작성하기
   - **`Chore: lodash 패키지 추가`** 
   - **`Refactor: 클라이언트 서비스 추가 및 안 쓰는 변수 삭제`**
   - **`Feat: users/user_id/project 엔드포인트 및 라우터 추가`**
2. **_반드시 최신 버전을 rebase 한 뒤 PR을 올리자_**
3. **_PR의 머지가 급한 상황에는 Slack을 통해서 한 번 더 동료들에게 알리자_**
4. **_description, remarks, concern을 꼼꼼하게 정리 정돈하여 작성하자._**
5. **_절대로 한꺼번에 Merge하지 말자._**
   PR이 여러 개 있으면 코드가 유실되거나 꼬이지 않도록 주의.
6. **_PR에 Label을 지정하자_**

   쌓여있는 PR 리뷰 요청이 많아질 시 부채감으로 느끼지 않도록 PR 리뷰의 일정 공유를 통해 우선순위에 따라 라벨을 지정해 줌.

   - `ASAP`: 현재 작업하던 일이 있더라도, 해당 PR을 먼저 확인해 주세요
   - `TBR`: 현재 작업하던 일이 마무리되면 해당 PR을 확인해 주세요

<br />

**(3) `CodeReview Convention`**

1. **_Pn규칙을 적용하여 의사소통과 작업시간의 능률을 올리도록 하자_**
   - `P1`: **꼭 반영해 주세요 (Request changes)**
   - `P2`: **웬만하면 반영해 주세요 (Request changes)**
   - `P3`: **반영해도 좋고 넘어가도 좋습니다. (Comment)**

2. **_리뷰는 최대한 꼼꼼하고 자세하게 하자._**
   1. 일관된 구조, 로직, 스타일을 유지하고 있는지
   2. 다른 해결 방법 의견 제시할 게 있는지
   3. 버그 발생 가능성이 있는지
   4. 기술적인 지식, 노하우, 히스토리 전달

3. **_추가적인 질문이나 피드백이 있으면, 적극적으로 작성하고 토론하자_**

<br />

</div>
</details>

<br />

<h2 id="팀원-소개">👨‍👩‍👦 팀원 소개</h2>

<table>
  <tr>
    <td align="center" width="200">
      <a href="https://github.com/doitchuu" target="_blank">
        <img src="https://github.com/Figci/Figci-Client/assets/95596243/ccb7f875-7ae9-438e-9de4-3d279a437b4a" alt="추슬기 프로필" />
      </a>
    </td>
    <td align="center" width="200">
      <a href="https://github.com/tjd985" target="_blank">
        <img src="https://github.com/Figci/Figci-Client/assets/95596243/68a3474a-6b70-44ab-81e3-c24f3225ef12" alt="오성호 프로필" />
      </a>
    </td>
    <td align="center" width="200">
      <a href="https://github.com/kyeongjun-ko" target="_blank">
        <img src="https://github.com/Figci/Figci-Client/assets/95596243/7496f4e6-b5bf-4df8-8a9c-2afc3161d4ff" alt="고경준 프로필" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/doitchuu" target="_blank">
        추슬기
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/tjd985" target="_blank">
        오성호
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/kyeongjun-ko" target="_blank">
        고경준
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="mailto:seulgichu14@gmail.com">seulgichu14@gmail.com</a>
    </td>
    <td align="center">
      <a href="mailto:tjd985@gmail.com">tjd985@gmail.com</a>
    </td>
    <td align="center">
      <a href="mailto:rhrudwnszoq@naver.com">rhrudwnszoq@naver.com</a>
    </td>
  </tr>
</table>

<br />
<br />

<h2 id="회고">✍️ 프로젝트 회고</h2>

<details>
<summary>팀 회고</summary>
저희 팀원이 디자이너로서 실제 겪었던 불편을 해소하고자 시작된 프로젝트인 만큼 집중할 수 있었고<br />
개발자나 디자이너와 협업하는 사용자가 서비스를 사용한다면 어떨까 깊이 생각할 수 있던 프로젝트였습니다.<br />

<br />

사용자 경험을 가장 중요한 키워드로 생각하며 서로 적극적으로 토론하며 몰입도 있게 고민해 보고<br />
실제 기술로 구현해 하나의 서비스를 완성해 보는 경험을 할 수 있어 뜻깊은 프로젝트였습니다.

<br />
</details>

<details>
<summary>추슬기</summary>
디자이너로서의 경력을 통해, 협업 중 커뮤니케이션의 중요성을 항상 느꼈습니다. 이번 팀 프로젝트는 그런 저에게 협업을 통한 문제 해결을 경험하게 해준 시간이었습니다. 특히, 피그마 파일 구조를 파악하고 변경 사항을 비교하며, 플러그인과 웹 환경과 같이 다른 생태계에서 개발하는 과정은 혼자서는 상당히 어려웠을 텐데, 팀 프로젝트를 통해 개발을 진행할 수 있어 3주라는 짧은 시간에도 좋은 결과물을 낼 수 있었습니다.

<br />

프로젝트 초반에는 피그마 파일의 복잡성과 예외 케이스들 때문에 실제 일정에 맞춰 구현할 수 있을지에 대한 불안감이 컸습니다. 그러나 팀원들과 끊임없는 논의와 스터디를 통해 불안감을 극복할 수 있었고, 팀으로서 함께 성장하는 과정을 경험했습니다.
팀원들과 함께 밤을 새우며 개발하는 동안, 각자의 개발 스타일과 작업 방식을 조율하는 과정이 특히 기억에 남습니다. 서로 다른 배경을 가진 팀원들과의 협업은 때로 도전적이었고, 서로 의견의 방향이 다를 때도 있었지만, 경준 님과 성호 님의 배려와 협력 덕분에 프로젝트를 성공적으로 마칠 수 있었습니다. 협업하는 동안 서비스 사용자와 팀원들을 고려하면서 작업의 가독성을 높이고, 내용을 정리하며, PR에서 상대방이 코드를 쉽게 이해할 수 있도록 하는 배려가 중요하다는 것을 배웠습니다.

<br />

마지막으로, 디자이너로서 제 경험이 프로젝트의 디자인 측면에서 큰 도움이 될 수 있어 기뻤고, 팀원들과의 긴밀한 협업을 통해 기술적인 측면에서도 많은 성장을 이룰 수 있었습니다. 이번 프로젝트는 저에게 단순한 기술적 성장뿐만 아니라, 팀과 함께하는 과정에서 배움과 성장의 가치를 일깨워준 뜻깊은 시간이었습니다. 이러한 경험은 앞으로 협업할 때 큰 자산이 될 것 같습니다.

<br />

</details>
<details>
<summary>오성호</summary>
이번 팀 프로젝트를 진행하며 코드 한 줄을 작성할 때마다,
제가 작성하는 코드가 더 이상 개인의 코드가 아닌 팀의 코드가 된다는 생각에
평소라면 금방 작성했을 코드 한 줄에도 훨씬 더 많은 시간과 신중함을 기울여야 했습니다.
프로젝트 기간 내에 서비스를 완성할 수 있을지에 대한 걱정도 많았지만, 목표 달성을 위해 열심히 노력하는 팀원들과 함께 밤을 지새우며 시간이 흐를수록 저의 걱정은 점차 확신으로 변해갔습니다.
이번 프로젝트를 통해 사소한 행동 하나까지도 팀원의 입장에서 고려하는 것이 얼마나 중요한지,
또한 개인의 작업 속도보다 팀 전체가 같은 방향성과 싱크를 유지하며 나아가는 것이 왜 중요한지 깨달았습니다.
이 경험은 앞으로 겪어야 할 개발자가 되기 위한 날들뿐만 아니라, 추후 개발자로 살아가는 데 있어서 소중한 자산이 될 것이라고 확신합니다.

<br />

</details>
<details><summary>고경준</summary>
아이디어 구상부터 개발 일정 기획까지 처음에는 문제없이 순조롭게 진행될 것으로 생각했던 기능들도 POC 단계에 들어가고 실제 구현을 하면서 예상보다 일정이 지연되는 일들이 생겼습니다. 남은 일정을 기한 내에 마무리하지 못할 것 같다는 위기감에 새벽에 긴급회의를 하면서 개발 일정을 전면적으로 수정하기도 했지만, 결국 기한 내에 성공적으로 프로젝트를 완성할 수 있었던 정말 다사다난했던 프로젝트였습니다.

<br />

제가 맡은 태스크가 예상보다 늦어져 일정이 지연될 때, 팀원들에게 피해를 끼치는 것 같다는 생각에 힘들어할 때마다 기간이 조금 지체되더라도 꼼꼼히 하는 게 중요하다며 독려해 준 팀원들 덕분에 다시 마음을 다잡고 작업에 임할 수 있었고 기한 내에 성공적으로 개발을 마무리할 수 있었습니다.

<br />

이번 프로젝트를 통해 현업에서의 다양한 업무수행 방식을 적용하고, 우리 팀에 맞게 규칙을 수정해 가면서 의사소통 비용을 최소화하는 체계적인 시스템이 개발 효율성에 얼마나 큰 영향을 미치는지 알 수 있었습니다. 또한, 팀 프로젝트에서 개개인의 역량도 중요하지만, 개인의 책임감과 동료들과의 협력이 무엇보다 중요하다는 것을 몸소 느낄 수 있었습니다.

<br />

특히 동료들이 서로 어떻게 의사소통하는지, 새로운 기능을 적용하고자 할 때 어떻게 공부해야 하는지 등 개발자로서의 태도에 대해 많이 배울 수 있었습니다. 제가 동료들과 함께 문제를 해결해 나가며 성장할 수 있었던 것처럼, 현업에서도 어려운 문제들을 함께 고민하고 서로에게 원동력이 되어주는 동기가 되어야겠다고 다짐했습니다.

<br />

매일 밤을 새우며 고생하는 팀원들을 보며 처음의 열정을 유지할 수 있었고, 힘들어할 때마다 항상 옆에서 믿어주고 응원해 준 성호 님과 슬기 님께 정말 감사드립니다. 
</details>

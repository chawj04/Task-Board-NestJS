# Task-Board-NestJS

## Skills & Development Environment

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white">
<img src="https://img.shields.io/badge/TypeOrm-f05435?style=for-the-badge&logo=TypeOrm&logoColor=white"> <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">

<img src="https://img.shields.io/badge/Swagger-172B4D?style=for-the-badge&logo=Swagger&logoColor=85EA2D"> <img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white"> <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=E2E2E2"> <img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white"><br><br>

---

## Directory & Project Structure

![Structure](https://user-images.githubusercontent.com/97301076/199872070-3f51616d-1dc0-482b-827c-d0516e7295ce.png)<br><br>

---

## The Request Lifecycle

![Request_Lifecycle](https://user-images.githubusercontent.com/97301076/199872524-9a428131-6217-439c-8d39-7703bdb44d61.png)<br><br>

---

## Swagger API

![image](https://user-images.githubusercontent.com/97301076/199899344-65ebdde0-5454-4312-86a9-968f05c31c1c.png)

---

## ENV variables

NODE_ENV =<br>
NEST_SERVER_PORT=<br>

SWAGGER_SECURITY_ID =<br>
SWAGGER_SECURITY_PASSWORD =<br>

DB_HOST=<br>
DB_PORT=<br>
DB_USERNAME=<br>
DB_PASSWORD=<br>
DB_DATABASE=<br>

JWT_SECRET=<br>
JWT_EXPIRATION_TIME=<br>

---

<br>

## 개인 프로젝트 목적 및 기획 이유

개발자로서 성장하기 위해 갖춰야 하는 역량에 대한 고민이 많았습니다.

팀 프로젝트를 통해 Node.js 와 React를 다루면서 웹 프로세스 흐름을 어느 정도 이해할 수 있게 되었지만, 생각한 것들을 수월하게 구현할 수 있는 건 별개의 일이었습니다.

학습하는 입장에서 Frontend와 Backend를 나누고 싶지는 않았지만, 짧은 시간 내에 하나라도 집중하는 것이 적합하다고 판단했습니다.

기본을 갖춘 웹 개발자가 되고 싶다는 생각에 이 프로젝트를 기획하게 되었고, 지금까지 공부해온 것들을 활용할 수 있는 NestJS를 선택하게 되었습니다.<br>

### <i>NestJS 프레임워크를 선택한 개인적인 이유</i>

1. JavaScript & TypeSript를 사용해서 Frontend와 같은 언어로 Backend를 구성할 수 있습니다. 이미 알고 있는 언어를 활용할 수 있다는 점이 좋았습니다.

2. Node.js(Express.js) 기반으로 서버를 구축할 수 있으면서 configuration, ORM, Validation 등 많은 기능을 제공하고 있습니다. npm 활용도 가능하고, Backend Server를 구축하는데 필요한 것들을 손쉽게 사용할 수 있어서 좋았습니다.<br>

- ex) Rate Limiting - ThrottlerGuard

3. Modul 기반으로 프로그래밍을 구성할 수 있어서 코드 재사용 및 확장성에 대해서 고민하고 접근하기에 좋은 구조라고 생각합니다. 또한, 객체지향 디자인 패턴, 제어역전(IoC)과 의존성 주입(DI)등 이 녹아있는 형태의 프레임워크라 해당 패턴에 대해서 완벽히 알지 못해도 코드를 간결하게 작성할 수 있는 장점을 누릴 수 있어서 좋았습니다. 추가적으로 관련 패턴에 대한 공부도 할 수 있어서 좋았습니다. <br>

- ex) UsersController가 UsersService에 의존하고 있을 때 UsersService에 관여하지 않고 생성자에 객체를 가져다 쓸 수 있는 것 등

<br><br>

---

## 주요 기능

### 1) Login & Auth Guards - Logic

![Login&Auth_Guards](https://user-images.githubusercontent.com/97301076/199739272-a0d9431e-43f4-4d78-86b6-0c00035a21e8.png)<br>

### 2) Task-Boards

- 해당 유저가 생성한 정보만 처리할 수 있습니다.
- 현재 유저 정보를 받아올 수 있게 커스텀 데코레이터인 user.decorator를 만들었습니다.
- Task(일감)을 생성할 때 현재 유저의 정보를 같이 넘겨주어서 Task(일감)에 있는 유저 정보에 해당 값이 들어갈 수 있도록 구현했습니다.
- Task(일감)을 조회하고 수정하고 삭제하는 경우에는 작성된 Task(일감)의 유저 정보와 현재 유저의 정보가 일치하는 경우에만 접근이 가능하게 구현했습니다.<br>

### 3) Entity

- 해당 유저 삭제 시 해당 일감도 같이 삭제될 수 있도록 작성했습니다.<br>
  ![Entities](https://user-images.githubusercontent.com/97301076/199893897-f7bfa786-ede9-43d5-bce8-e474d1b6cb77.png)
- Entity + DTO ( Data Transfer Object ) <br>
  DTO를 통해 데이터의 유효성을 체크하고 Controller -> Service 로 넘어갈 값들 OmitType, PickType을 통해 선별해 주었습니다.

### 4) Swagger API - 보안 처리

- Swagger 내부 정보가 공개적으로 노출되지 않도록 보안 처리를 해주었습니다.<br>

  ![SwaggerLogin](https://user-images.githubusercontent.com/97301076/199899009-75d1d230-e1a0-4674-8dcb-a5c7ad5d12e6.gif)<br>

### 5) middleWares - Logger

- 요청에 대한 정보를 Logging할 수 있는 Logger를 동일한 형태로 처리될 수 있도록 App Module 전체에 적용해주었습니다.<br>

### 6) Interceptors & Filters

- Interceptor와 Filter를 통해 요청에 대한 성공과 예외 처리의 응답 형태가 동일하도록 구현했습니다.<br>

### 7) Pagination

- PaginationQuery와 TypeOrm의 take와 skip을 통해 Pagination을 구현했습니다.<br>

### 8) Rate Limiting - ThrottlerGuard

- 클라이언트의 요청을 시간당 횟수 제한을 두어 무제한 요청을 막을 수 있도록 구현했습니다.<br> ex )

  ![throttler](https://user-images.githubusercontent.com/97301076/199909123-888da6c6-5286-4e5e-a63b-0f6abd721cd5.png)<br>

### E2E - TEST

![E2E_TEST](https://user-images.githubusercontent.com/97301076/199724504-2678de41-2db9-456d-a3c9-c75ba9cb1280.png)

- 요청과 응답이 정상적으로 수행되는지 테스트 하기 위해 E2E 테스트를 사용했습니다.
- 테스트는 별도의 데이터베이스에서 진행될 수 있도록 envFilePath 경로를 설정해 주었습니다.
- 해당 테스트가 종료되면 Synchronize를 통해 DB를 초기화해 주었습니다.

<br><br>

---

## 구현 도중 발생한 이슈 및 해결

### 1. AccessToken 이슈

![image](https://user-images.githubusercontent.com/97301076/199759966-16e1fefa-c5fc-44bf-b5d2-12420eb201a7.png)

- 액세스 토큰을 받아오려는데 secretKey를 읽어오지 못하는 문제가 생겼습니다.
  config 설정으로 문제를 해결한 경우가 많았는데, 직접적으로 값을 넣어도 인식을 못했습니다.
- 결국, 액세스 토큰을 발급받는 로직을 천천히 따라가면서 JwtService.sign에 payload 외에 secretKey를 넣어 주어야 한다는 사실을 알게 되어서 해결할 수 있었습니다.<br><br>

### 2. currentUser Issue

- Task(일감)을 생성할 때 유저 정보도 같이 넣어주어야 하는데, 기존에 권한으로만 게시글을 수정 삭제할 수 있는 로직으로만 구현을 하다보니 쉽지 않았습니다.
- roles.guard 를 구현할 때 UserRole 과 User.role을 비교하기 위해서 해당 유저를 가져왔는데, 이 부분에서 힌트를 얻어 해결할 수 있었습니다.

### 3. 사소한 이슈

- DTO에 class-validation의 사용을 위해서는 main.ts에 app.useGlobalPipes(new ValidationPipe()); 을 넣어주야 합니다.

- 테스트를 별도의 데이터베이스에서 진행하기 위해서 .env 경로를 나눠주었는데 적용이 안되는 문제가 있었습니다. package.json 파일에 있는 script에 직접적으로 경로를 넣어주어서 해결했습니다.

<br><br>

---

## 개인 프로젝트를 통해 느낀 점

기본을 지키면서 구현하기 위해서 최대한 간단한 구조로 프로젝트를 만들었는데도, 상당히 어려웠습니다.

구현한 기능들이 적절하게 만들어진 것이 맞는지 더 좋은 방향으로 만들 수 없을지 고민이 많았습니다.

머릿속에서 생각했던 것들을 전부 구현하고자 욕심을 부렸다면, 기한 내에 프로젝트를 만들지 못했을 것 같습니다.

NestJS의 기본적인 CRUD는 익숙해졌지만, 세부적인 NestJS 프레임워크에 대한 이해도를 올리기에는 아직 많이 부족합니다.

그래도 어떠한 방향성을 가지고 공부를 해야 할지는 알게 되어서 좋았습니다.

이번 프로젝트가 끝나갈 때쯤 테스트 코드의 중요성을 알게 되어서 뒤늦게 E2E TEST라도 진행했는데 앞으로는 하나하나의 기능을 구현하면서 같이 Unit Test도 작성해 보고 싶습니다.

지식을 습득한 후에 구현하는 과정에 익숙해져 있었는데 이번에는 필요한 것들을 공부해가면서 적용하다 보니 더욱더 많이 배울 수 있었던 것 같습니다.

최근에는 공부를 하면 할수록 배워야 할 게 끝도 없이 늘어나는 느낌이라 방향을 잡기가 힘들었는데, 구직 전에 간단한 프로젝트를 진행하면서 기본기를 다질 수 있는 기회를 가지게 되어 다행이라고 생각하고 있습니다.

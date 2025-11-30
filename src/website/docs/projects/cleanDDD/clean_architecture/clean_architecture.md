## 1. Clean Architecture란?

### 1.1 개념

* **핵심:** 비즈니스 규칙(도메인)이 프레임워크/DB/외부 인터페이스에 **의존하지 않도록** 하는 설계 원칙.
* **레이어:**

  1. **Domain (Entities, Value Objects, Domain Services)**
  2. **Application (Use Cases, Ports, DTO, CQRS, Validation)**
  3. **Interface/Adapters (Controllers, gRPC Services, Gateways)**
  4. **Infrastructure (EF Core, Message Bus, File/Cache, External APIs)**
* **규칙:** 소스코드 의존성은 **바깥→안쪽 금지**, **안쪽→바깥 허용**(의존성 역전, DIP).

### 1.2 효과

* **효과:** 변경 용이성, 테스트 용이성, 프레임워크 교체 내성, 유지보수 비용 절감.
* **비용:** 초기 설계/계층 비용, 경계(Port/Adapter) 코드 증가.

### 1.3 레이어 쉬운 설명

* **L1. Domain (핵심 규칙)**

  * *하는 일:* 우리 비즈니스의 **진짜 규칙**을 코드로 표현합니다. 계산/검증/상태 전이 같은 **핵심 로직**이 여기 있습니다.
  * *예:* `Employee`, `Email(VO)`, `ChangeEmail()` 같은 메서드, `EmployeeEmailChanged` 도메인 이벤트.
  * *놓는 것:* 엔티티/VO/도메인 서비스/도메인 이벤트, 불변식 검증.
  * *놓지 말 것:* EF Core 의존, HTTP/gRPC, 로그 프레임워크, 설정값 읽기 등 **외부 기술 의존**.

* **L2. Application (유즈케이스)**

  * *하는 일:* 사용자의 의도를 **절차**로 묶습니다(명령/조회). 트랜잭션 경계, 입력 검증, 권한 체크, **포트(인터페이스)** 정의.
  * *예:* `ChangeEmployeeEmailCommandHandler`, `IEmployeeRepository`, `IEmailUniquenessChecker`.
  * *놓는 것:* Command/Query/Handler, DTO, Validator, 트랜잭션/UoW 조율, 외부는 **포트(인터페이스)** 로만 바라보기.
  * *놓지 말 것:* 컨트롤러, gRPC 서비스 구현, EF Core 구현 클래스, 구체 메시지 버스 클라이언트.

* **L3. Interface Adapters (입출력 변환)**

  * *하는 일:* 세상의 요청/응답을 우리 앱이 이해하는 형태로 **변환**합니다. 컨트롤러, gRPC 서비스, 프레젠터, 매퍼.
  * *예:* `EmployeesController`, `EmployeesGrpcService`, `Map(Employee -> EmployeeDto)`.
  * *놓는 것:* 웹/GRPC 엔드포인트, ViewModel, Presenter, 입력/출력 모델.
  * *놓지 말 것:* 도메인 규칙(계산/검증) 직접 구현, DbContext 직접 접근.

* **L4. Infrastructure (기술 세부)**

  * *하는 일:* 저장소/메시징/파일/외부 API 같은 **구체 기술**을 구현해 **L2의 포트 인터페이스**를 채웁니다.
  * *예:* `EfCoreEmployeeRepository : IEmployeeRepository`, `WolverineMessageBus`, `SmtpEmailSender`.
  * *놓는 것:* EF Core, Migrations, Message Bus, Cache, FileSystem, Observability(로깅/메트릭).
  * *놓지 말 것:* 도메인 규칙/유즈케이스 로직.


![alt text](img/cleanarchitecture.png)

![alt text](img/cleanarchitecture_example.png)
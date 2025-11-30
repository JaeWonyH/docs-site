## 2. DDD란?

### 2.1 개념

* **전략적 설계:** Bounded Context, Context Map(협력·통합 관계).
* **전술적 설계:** Aggregate, Entity, Value Object, Domain Event, Repository, Factory, Specification.

### 2.2 왜 DDD인가

* 복잡한 도메인을 모델로 **명시화**하여 **변경에 강한** 소프트웨어를 만든다.
* 팀 커뮤니케이션의 기준(언어/경계)을 명확히 하여 **오해를 줄이고 생산성**을 높인다.

---

## 4. Entity 설계도

### 4.1 원칙

* **식별자 불변**(Guid/StronglyTypedId 권장), **불변식(invariant) 자가검증**, **행위 지향**(setter 최소화).
* **Value Object 선호:** 동등성 기반, 불변(Immutable), 의미 있는 메서드 제공.
* **Aggregate 경계:** 트랜잭션 일관성의 단위. 외부 접근은 **Aggregate Root**를 통해서만.
* **도메인 이벤트:** 상태 전이의 의미를 외부로 알림. Outbox로 신뢰성 전달.

### 4.2 Simple

**Aggregate 구조:**

```
Circle (AggregateRoot)
├── Activity (AggregateRoot)
│   ├── Expense (Entity)
│   └── Attendant (Entity)
└── CircleMember (Entity)

Employee (AggregateRoot)
└── CircleMember와의 관계
```


### 4.3 Detail

**상세 도메인 모델:**

| 클래스 | 타입 | 책임 |
|--------|------|------|
| Activity | AggregateRoot | 활동 주최, 비용 관리 |
| Expense | Entity | 개별 비용 항목 |
| Attendant | Entity | 참석자 정보 |
| Circle | AggregateRoot | 모임 관리 |
| CircleMember | Entity | 멤버 정보 |
| Employee | AggregateRoot | 직원 정보 |
| Money | ValueObject | 금액 및 통화 |
| Email | ValueObject | 이메일 정보 |
| EmployeeName | ValueObject | 이름 |

Aggregate 관점에서 보는 **TotalExpense ↔ Expenses**

> **Aggregate Root = Activity**. `TotalExpense`(요약값)과 `Expenses`(상세 항목)는 **한 트랜잭션에서 일관성**을 유지해야 하므로 **같은 Aggregate 내부**에 둡니다.

#### 왜 Aggregate가 필요한가?

1. **불변식(Invariant) 강제**

   * 규칙: *모든 Expense의 통화는 동일해야 하며*, `TotalExpense = Σ Expense.Money`.
   * Aggregate는 **경계 안**에서만 상태 변경을 허용하고, Root(Activity) 메서드로만 수정하게 하여 불변식을 깬 변경을 차단합니다.

2. **트랜잭션 경계(Consistency Boundary)**

   * `AddExpense`/`RemoveExpense`는 **한 번의 커밋**으로 `Expenses`와 `TotalExpense`를 함께 갱신해야 합니다.
   * Aggregate 단위 커밋(UoW + Repository per Aggregate Root)을 지키면, 저장 직후에 항상 **자기 일관성(self-consistency)** 을 보장합니다.

3. **동시성 제어 단위**

   * 두 사용자가 동시에 비용을 추가해도, **버전(낙관적 동시성)** 으로 충돌을 감지/조정합니다. Aggregate가 크리티컬 섹션 역할을 합니다.

4. **캡슐화/응집도**

   * `TotalExpense`는 파생값(denormalized)으로 **내부 구현**입니다. 외부에서 직접 수정 금지, 노출은 조회 전용.
   * 모든 금액/통화 검사는 Activity 내부에서 한 곳(Activity Root)에서 이뤄집니다.

5. **읽기/쓰기 분리 최적화**

   * 합계 컬럼을 **미리 유지**(denormalize)하면 읽기가 빨라집니다. 대신 쓰기 시 Aggregate 내부에서 **불변식**을 지키며 갱신합니다.

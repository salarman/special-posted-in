---
layout: post
title: 어댑터 패턴
categories: [software-design]
tags: [Adapter Pattern, Design Pattern]
date: 2020-06-12 20:17:00 +0900
thumbnail: /post/software-design/uml/adapter-pattern-intro.png
profile-image: /post/profile/profile0.jpg
current-company: Cubic INC
current-position: SI Researcher
summary: Adapter Pattern
excerpt-separator: <!--more-->
hide: false
---
어댑터 패턴은 직접적으로 바로 사용이 불가능한 클래스를 사용할 수 있도록 하는 패턴이다.
이 패턴은 기존의 클래스를 수정하지 않고, 새로운 클래스를 생성하여 기존의 클래스를 사용할 수 있도록 한다.
<!--more-->
### 구성요소

- Target: 어댑터 패턴을 사용하기 위한 인터페이스를 정의한다.
- Adapter: Target 인터페이스를 구현하여 기존의 클래스를 사용할 수 있도록 한다.
- Adaptee: 어댑터 패턴을 사용하기 위한 기존의 클래스이다.
- Client: Adapter 패턴을 사용하는 클래스이다.

### 예제

먼저 Adapter 패턴을 사용하기 위해 선언한 핵심 구성요소는 아래와 같은 클래스들로 구성된다.

::code-group

```Payment.java
public interface Payment {

    void processPayment(double amount);

    PaymentStatus checkStatus(String paymentId);
}

```
```PayPalAPI.java
public class PayPalAPI {

    public void makePayment(PayPalPaymentRequest request) {
        System.out.println("Making PayPal payment of " + request.getAmount());
    }

    public PayPalPaymentStatus getPaymentStatus(PaypalTransactionId txId) {
        return PayPalPaymentStatus.SUCCESS;
    }
}
```
```PayPalAdapter.java
public class PaypalAdapter implements Payment {

    private final PayPalAPI payPalAPI;

    public PaypalAdapter(PayPalAPI payPalAPI) {
        this.payPalAPI = payPalAPI;
    }

    @Override
    public void processPayment(double amount) {
        PayPalPaymentRequest request = new PayPalPaymentRequest(amount);
        payPalAPI.makePayment(request);
    }

    @Override
    public PaymentStatus checkStatus(String paymentId) {
        PaypalTransactionId txId = new PaypalTransactionId(paymentId);
        PayPalPaymentStatus paymentStatus = payPalAPI.getPaymentStatus(txId);

        return convertPayPalStatus(paymentStatus);
    }

    private PaymentStatus convertPayPalStatus(PayPalPaymentStatus payPalPaymentStatus) {
        switch (payPalPaymentStatus) {
            case SUCCESS:
                return PaymentStatus.COMPLETED;
            case PENDING:
                return PaymentStatus.PENDING;
            case REFUND_SUCCESS:
                return PaymentStatus.REFUNDED;
            case CANCELLED:
                return PaymentStatus.CANCELLED;
            default:
                return PaymentStatus.FAILED;
        }
    }
}
```
```PaymentProcessor.java
public class PaymentProcessor {

    private final Payment paymentSystem;

    public PaymentProcessor(Payment paymentSystem) {
        this.paymentSystem = paymentSystem;
    }

    public void process(Order order) {
        paymentSystem.processPayment(order.getTotal());
        //결제상태 확인
        PaymentStatus paymentStatus = paymentSystem.checkStatus("AE2D123-12");
        System.out.println("Payment status: " + paymentStatus);

    }
}
```

::

Target: Payment.java
Adapter: PaypalAdapter.java
Adaptee: PayPalAPI.java
Client: PaymentProcessor.java
---
layout: post
title: Operating System (OS)
categories: [os]
tags: [Operating System, OS]
date: 2021-01-20 20:19:30 +0900
thumbnail: /post/computer/operating-system.webp
current-company: Cubic INC
current-position: SI Researcher
profile-image: /post/profile/profile1.jpg
summary: 컴퓨터와 운영체제
excerpt-separator: <!--more-->
hide: false
---
운영체제가 어떤일을 하는지를 알려면, 컴퓨터가 어떤 요소들로 구성되어 있는지를 이해 해야한다.
각 요소의 구성과 이해관계 그리고 역할을 알아보자.
<!--more-->

## 컴퓨터의 구성::computer-structure

컴퓨터는 크게 응용프로그램, 운영체제, 하드웨어 계층으로 분류된다.
이 문서에서는 응용프로그램을 제외하고 운영체제와 하드웨어에 대해 논한다.

[CPU](/wiki/central-processing-unit)와 [입출력 장치]() 그리고 [메모리]()는 [시스템 버스]()를 통해 서로 연결되어 있으며, 버스의 종류에 따라 단방향 또는 양방향으로 신호를 보낸다.
입출력 장치의 경우 메인보드 위에 사전에 만들어진 장치 컨트롤러를 운영체제의 장치 드라이버가 제어하며, 장치드라이버는 운영체제에 일관된 인터페이스를 제공한다.
CPU와 장치컨트롤러는 병렬로 실행되기 떄문에 메모리에 접근하기위해 메모리 사이클을 두고 경쟁한다. 이 메모리에 순차적으로 접근하기 위해 메모리 컨트롤러는 메모리에 대한 액세스를 동기화한다.


위에서 간단히 설명한 내용은 OS 내부의 커널과 시스템 프로그램에 의해 제어되며, 하드웨어의 경우 사전에 설계된 회로의 동작을 수행한다.

## 운영체제의 동작 순서::sequence-of-os

컴퓨터의 전원을 켤 때 실행되는 부트스트랩 프로그램은 펌웨어이다.  
부트스트랩 프로그램은 하드웨어 위에서 동작하며 `CPU`, `메모리` `저장장치` 등을 초기화 한다. 또한 운영체제를 로드하기 위해 부트로더를 실행하며, 이는 저장장치에서 메모리로 [Kernel]()(`커널`)을 적재한다.

부트로더는 커널 실행에 필요한 초기설정(예: 커맨드라인 인자 전달 등)을 한뒤, 커널에 제어를 넘긴다. 이후에 커널은 시스템을 초기화하고 사용자 공간(user space)을 준비한다.
각 시스템에서 사용 되는 부트로더는 여러종류가 있다.

* GRUB (GNU GRUB):
  * 리눅스/유닉스 시스템에서 사용되는 부트로더
* LILO(Linux Loader)
  * 과거 리눅스 시스템에서 사용되는 부트로더
* Windows Boot Manager
  * 윈도우 시스템에서 사용하는 부트로더
* Android Bootloader
  * 안드로이드 기기에서 사용되는 부트로더로, 리커버리모드와 운영체제를 실행한다.

## 운영체제의 역할::role-of-os

운영체제는 자원을 관리하지만, 아마 그중에서도 가장 중요한건 [프로세스]()에 대한 관리이다. 대표적으로 아래와 같다.

* 사용자 프로세스와 시스템프로세스의 생성과 제거
* `CPU`에 프로세스와 스레드 스케줄링
* 프로세스의 일시중지(suspend) 와 재수행(resume)
* 프로세스 동기화 기법 제공
* 프로세스 간 통신(IPC) 제공

위와 같은 처리를 위해 운영체제는 프로세스의 상태를 관리하며, 프로세스의 상태(process stats)는 `생성`, `준비`, `실행`, `대기`, `종료`로 나뉜다.
이러한 상태는 아래처럼 나타낼 수 있다.
```
 New
  ↓
Ready ←→ Running → Terminated
  ↑        ┆
Waiting ←--╯
```
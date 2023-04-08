# IT-Hermes-Crawling

:paperclip: [서비스 링크](https://it-hermes.store)  

:paperclip: [IT-Hermes 애플리케이션 서버 레포](https://github.com/f-lab-edu/IT-Hermes-Server)  
:paperclip: [IT-Hermes 배치 서버 레포](https://github.com/f-lab-edu/IT-Hermes-Batch)  
:paperclip: [IT-Hermes 프론트 레포](https://github.com/f-lab-edu/IT-Hermes-Front)    
<br>

## :thought_balloon: IT 관련 컨텐츠 알림 서비스 - Crawling 서버 

```프로젝트 기간: 2023.01.04 ~```

> IT에 관심이 많은 유저에게 채용, 유투브, 뉴스 정보 등의 각종 IT 관련 컨텐츠를   
> 유저 맞춤형으로 자동 알림해주는 서비스
- IT에 관련된 채용, 유투브, 뉴스 사이트를 크롤링 
- 10분 간격으로 배치서버의 요청을 받아 최신 IT 관련 크롤링 컨텐츠를 수집
- 깃허브 액션으로 CI, 젠킨스로 CD 구축  
- RabbitMQ를 이용해서 크롤링 데이터가 많아졌을시 장애 대응   

<br>

## :page_facing_up: 기술 스택  

`Nodejs, NCP`,`Javascript`   
`Mysql 8.0`,`h2`,`Spring Data JPA`  
`Jenkins`, `Github action`  
`Docker`, `Docker hub`  
`Feign Client`   
`RabbitMQ`

## :thought_balloon: 전체 구조    
![68A30EE6-7C85-4FD7-B51C-AFB90683363D_1_105_c](https://user-images.githubusercontent.com/70764912/230696042-70781f1d-6f8f-46d4-9e45-86ad4fa57cb5.jpeg)

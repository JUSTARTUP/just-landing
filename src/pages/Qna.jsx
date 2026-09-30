const QNA = [
  {
    q: 'Q1. Just가 정확히 어떤 동아리인지 궁금해요',
    icon: 'assets/flash.png',
    a: (
      <>
        <span className="medium">2022년</span> <b>“일반 동아리에서 창업을 하면 어떨까?🤔”</b> 하는 생각으로 Just를 개설하였고,<br />
        <b>창업</b>을 키워드로 Just를 운영하였습니다.<br /><br />
        하지만, 재작년부터 <b>서비스 개발</b>과 <b>창업</b>을 동시에 진행하게 되었으며,<br />
        두 개의 어플리케이션과 기타 임베디드 시스템을 비롯한 여러 서비스가 개발되었습니다.<br /><br />
        <b>Just 4기 여러분</b>은 1학기 전후로 각 분야의 교육을 마치고, 서비스 개발과 창업을 진행하며 여러 대회에 나갈 예정입니다.<br /><br />
        그래서 Just는, 이른 나이에 <b>서비스 개발</b>과 <b>창업</b>의 경험을 하며<br />
        <b>세특</b>, <b>커리어</b>, <b>포트폴리오</b>, <b>인맥</b>까지 얻을 수 있는 동아리입니다!🚀
      </>
    ),
  },
  {
    q: 'Q2. 디자인 직무를 희망하는 경우 포토샵이나 일러스트레이터 같은 프로그램들을 잘 다뤄야지만 들어갈 수 있나요?',
    icon: 'assets/wifi.png',
    a: (
      <>
        Just는 실력 있는 인재보다 <b>다듬어지지 않았더라도 열정 있는 분</b>을 더 환영합니다.<br />
        기획, 디자인, 개발에 있어 실력과 경험이 부족하더라도, 희망 분야에 열정이 있다면 충분히 지원하실 수 있습니다.🔥<br /><br />
        현재 디자인팀 커리큘럼으로는 실무에 큰 도움이 되는 <b>Figma</b> 교육을 준비해 두었습니다.
      </>
    ),
  },
  {
    q: 'Q3. 수상 실적이나 포트폴리오가 화려해야만 들어갈 수 있나요?',
    icon: 'assets/folder.png',
    a: (
      <>
        2학년의 경우 메인 프로젝트를 이끌어 가며 1학년을 교육해야 하는 입장이기 때문에 <b>경험이 많은 분</b><span className="medium">을 우선으로 선발합니다.</span><br /><br />
        그러나 1학년의 경우, 시작하는 단계인 경우가 대부분이기 때문에 <b>경험이 부족하거나 없더라도 열정만으로</b> 충분히 선발되실 수 있습니다!
      </>
    ),
  },
  {
    q: 'Q4. 사용될 개발 스택이 궁금해요',
    icon: 'assets/gym.png',
    a: <>앱 개발은 <b>Flutter(Getx)</b>, 프론트엔드는 <b>React</b>를 쓸 예정입니다. 백엔드는 협의중에 있습니다.</>,
  },
  {
    q: 'Q5. 동아리 이름 뜻이 궁금해요',
    icon: 'assets/hash.png',
    a: (
      <>
        <b>“우린 10대니까 그냥 도전해 보자”</b> 하는 생각에서 <b>‘Just’</b>라는 이름을 지었고,<br />
        “<b>J</b>o<b>U</b>rney <b>ST</b>arts from me” 라는 슬로건을 통해 일련의 여정과 같은 <b>스타트업을 Just로부터, 나로부터 시작해 보자</b>는 의미를 부여했습니다.
      </>
    ),
  },
]

export default function Qna() {
  return (
    <main className="page">
      <h1 className="page-title qna-title reveal">
        Q&amp;A
        <img src="assets/chat.png" width="83" height="83" alt="" />
      </h1>
      <dl className="qna">
        {QNA.map(({ q, icon, a }) => (
          <div key={q} className="qna-item reveal">
            <dt>
              {q}
              <img src={icon} width="36" height="36" alt="" />
            </dt>
            <dd>{a}</dd>
          </div>
        ))}
      </dl>
    </main>
  )
}

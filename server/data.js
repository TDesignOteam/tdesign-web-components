const chunks = [
  { type: 'search', title: '开始获取资料…' },
  {
    type: 'search',
    title: '找到 2 篇相关资料...',
    content: [
      { title: 'AI推理模式研究', url: 'https://example.com/ref1' },
      { title: 'SSE协议规范', url: 'https://example.com/ref2' },
    ],
  },
  { type: 'think', title: '思考中...', content: '嗯，' },
  { type: 'think', title: '思考中...', content: '我现在需' },
  { type: 'think', title: '思考中...', content: '要帮用' },
  { type: 'think', title: '思考中...', content: '户说明一下，' },
  { type: 'think', title: '思考中...', content: '让我先仔细想想，' },
  // { type: 'error', content: '系统错误' },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，\n',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，\n',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock这是个mock，这是个mock，这是个mock这是个mock，这是个mock，\n',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock，这是个mock，这是个mock这是个mock，这是个mock，\n',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock这是个mock，这是个mock，这是个mock，这是个mock，\n',
  },
  {
    type: 'think',
    title: '数据已查询到，重新解析中...',
    content: '联网查询完成，',
  },
  {
    type: 'think',
    title: '数据已查询到，重新解析中...',
    content: '\n联网查询完成\n',
    search_type: 1,
    step: 'web_search',
    docs: [
      {
        title: '8位男神转战悬疑剧! 檀健次回归《猎罪图鉴》,王鹤棣、丁禹兮、许凯都悬疑剧报到_图片_来源_微博',
        content:
          ' 檀健次《猎罪图鉴》依然帅,王鹤棣､丁禹兮､许凯､龚俊通通悬疑剧报到! 转战悬疑剧的男神1:檀健次《猎罪图鉴》 虽然不少观众是因为《长相思》相柳才认识檀健次,但其实在《长相思》前,檀健次主演的《猎罪图鉴》也很红,还成了黑马悬疑剧,在豆瓣上有7.6的高分,以悬疑剧来说,表现非常亮眼,这也让檀健次获得不少知名度! 图片来源:微博《猎罪图鉴》 转战悬疑剧的男神2:丁禹兮《黑白森林》 丁禹兮《永夜星河》刚播完,另一部刑侦剧《黑白森林》马上接着开播,丁禹兮化身硬汉青年刑警文彬彬,搭档许多老戏骨同台飙戏,目前播出后的评价还不错,剧情节奏紧凑,丁禹兮在剧中是用原声演出,声音很有少年感,不会让人出戏｡ 图片来源:微博《黑白森林》 图片来源:微博《黑白森林》 转战悬疑剧的男神3:王鹤棣《黑夜告白》 王鹤棣在新剧《黑夜告白》首次挑战刑警角色,网上已经有不少造型路透,王鹤棣除了为新角色换成帅气利落的短发外,一身警装的造型也是男人味爆棚,值得期待! 而《黑夜告白》今年刚杀青,除了王鹤棣外,还搭挡了老戏骨潘粤明､任敏,以悬疑剧的阵容来说,算是蛮豪华的!',
        url: 'https://www.sohu.com/a/837503835_99913067',
        type: 'thirdparty',
        index: 3,
        score: 0.3695275,
        date: '2024-12-15 10:21:00',
        site: '搜狐',
      },
      {
        title: '95生梯队重排,王一博独占鳌头,陈哲远、张晚意、许凯久捧不红',
        content:
          '如今的95生似乎有点后继乏力,已经很久没有出现下一个爆火的流量小生,反倒是各种待爆小生层出不穷｡ 更可怕的是,好几年过去了,这批待爆帝没有一个大火的,至于他们为什么不能火,则是各有各的原因｡ 先来说第一梯队的王一博和刘昊然,这两位一个是因为耽改剧成为顶流,另一位是手握高票房电影｡ 一､王一博 UNIQ这个组合有点生不逢时,刚出道就遇到了禁韩令,组员们只能转型走其他赛道｡ ',
        url: 'http://mp.weixin.qq.com/s?src=11\u0026timestamp=1744589294\u0026ver=5929\u0026signature=CkISLYieluR3WAwHkVZyR5lsES3xDWck7fHnaZUHX1Pf-nJXAqkCOiKZrcwgicJliteYLu9bR743SoeT-c9a7trD7FiZZKdlabjY-7e9IWSG8xP6m*SwF1aCcfmqWfPi\u0026new=1',
        type: 'mp',
        index: 4,
        score: 0.280569,
        date: '2025-02-23 23:59:07',
        site: '微信公众平台',
      },
      {
        title: '五部王炸阵容的悬疑新剧,潘粤明张颂文段奕宏陈建斌王景春 - 今日头条',
        content:
          '1､《白夜破晓》潘粤明/王龙正 《白夜追凶2》,除了导演,编剧演员都是原班人马,8月来袭,小板凳准备好! 2､《暗潮缉凶》 陈建斌/陈若轩/李溪芮/成泰燊/梅婷 《尘封十三载》编剧执笔, 曾经朝气蓬勃的国营大厂内,废弃的排污水池中惊现断足女尸,意外的案件,意外的组合,开启一段宿命缉凶之行…… 3､《近在咫尺》张颂文/林家川 《白夜追凶》编剧指纹执笔,车轮下的命案,隐藏的真相,无论做什么对方都快一步?',
        url: 'https://www.toutiao.com/article/7390586247297434148',
        type: 'thirdparty',
        index: 5,
        score: 0.24094234,
        date: '2024-07-12 13:40:00',
        site: '今日头条',
      },
    ],
  },
  {
    type: 'think',
    title: '思考中...',
    content: '继续思考，这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock，这是个mock，这是个mock这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '数据已查询到，重新解析中...',
    content: '\n联网查询完成\n',
    search_type: 1,
    step: 'web_search',
    docs: [
      {
        title: '盘点人气男演员的悬疑题材待播剧一览罗... 来自芒果娱乐 - 微博',
        content:
          '盘点人气男演员的悬疑题材待播剧一览?罗云熙《剥茧》丁禹兮《南部档案》许凯《火场追凶+方圆八百米》王鹤棣《黑夜告白》魏大勋《无罪之身》龚俊《风过留痕》陈星旭《枭起青壤》张若昀《人之初》白敬亭《正当防卫》宋威龙《七根心简》曾舜晞《刍狗之血》井柏然《谷雨》你最期待哪部作品?#芒果娱乐# ',
        url: 'https://weibo.com/1886903325/PcVnSuhqI',
        type: 'thirdparty',
        index: 1,
        score: 0.42336947,
        date: '2025-02-05 21:39:19',
        site: '微博',
      },
      {
        title: '悬疑男主上新',
        content:
          '文 | 11‍ 最近的悬疑剧轮番开播,让推理爱好者们过了把瘾｡ 从年初的《漂白》到近期的《余烬之上》《燃罪》《黄雀》《棋士》《沙尘暴》等作品,各类警察和反派角色悉数登场,观众也从中看到了不少老熟人｡比如《漫长的季节》中的退休老年刑警马德胜摇身一变,成为《棋士》中和弟弟斗智斗勇的刑警队长崔伟;曾经在窝囊废赛道稳扎稳打的郭京飞,也已经连续在三部剧中出演警察;王宝强更是时隔多年再度出演电视剧｡ ',
        url: 'http://mp.weixin.qq.com/s?src=11\u0026timestamp=1744589294\u0026ver=5929\u0026signature=p*KqHBAstd3dlpy1Fb9i5TlgeRfIecw8uTTjAv*hPUMG*I-t3cGS9TBssPcXlIJ0xvQUjkNtJBXkV5rFqHBdHy5FW78n6Tj-WqLLLXUyOCLUZ1G8Hb5yINkBk077sLZx\u0026new=1',
        type: 'mp',
        index: 2,
        score: 0.37942445,
        date: '2025-04-10 21:39:43',
        site: '微信公众平台',
      },
      {
        title: '新生代95后男演员大盘点,每一位极具潜力,张新成最被看好-今日头条',
        content:
          '第二位是陈哲远,其实很多人听到这个名字会觉得有些陌生,但其实从出道到现在他也参演了不少的影视作品,比如在此前的“蜀山战纪”以及“唐探”当中,他的演技都是可圈可点的｡ 后来在“绝代双骄”这部作品当中,他也获得了很多人的关注,虽然他在早期是凭借唱跳歌手身份出道的,但在这几年他也是获得了不少的影视资源,因此也让很多粉丝期待他在表演上的更多可能性｡',
        url: 'https://www.toutiao.com/article/6809991254726672907/',
        type: 'thirdparty',
        index: 10,
        score: 0.39439696,
        date: '2020-03-30 21:24:00',
        site: '今日头条',
      },
      {
        title: '8位男神转战悬疑剧! 檀健次回归《猎罪图鉴》,王鹤棣、丁禹兮、许凯都悬疑剧报到_图片_来源_微博',
        content:
          ' 檀健次《猎罪图鉴》依然帅,王鹤棣､丁禹兮､许凯､龚俊通通悬疑剧报到! 转战悬疑剧的男神1:檀健次《猎罪图鉴》 虽然不少观众是因为《长相思》相柳才认识檀健次,但其实在《长相思》前,檀健次主演的《猎罪图鉴》也很红,还成了黑马悬疑剧,在豆瓣上有7.6的高分,以悬疑剧来说,表现非常亮眼,这也让檀健次获得不少知名度! 图片来源:微博《猎罪图鉴》 转战悬疑剧的男神2:丁禹兮《黑白森林》 丁禹兮《永夜星河》刚播完,另一部刑侦剧《黑白森林》马上接着开播,丁禹兮化身硬汉青年刑警文彬彬,搭档许多老戏骨同台飙戏,目前播出后的评价还不错,剧情节奏紧凑,丁禹兮在剧中是用原声演出,声音很有少年感,不会让人出戏｡ 图片来源:微博《黑白森林》 图片来源:微博《黑白森林》 转战悬疑剧的男神3:王鹤棣《黑夜告白》 王鹤棣在新剧《黑夜告白》首次挑战刑警角色,网上已经有不少造型路透,王鹤棣除了为新角色换成帅气利落的短发外,一身警装的造型也是男人味爆棚,值得期待! 而《黑夜告白》今年刚杀青,除了王鹤棣外,还搭挡了老戏骨潘粤明､任敏,以悬疑剧的阵容来说,算是蛮豪华的!',
        url: 'https://www.sohu.com/a/837503835_99913067',
        type: 'thirdparty',
        index: 3,
        score: 0.3695275,
        date: '2024-12-15 10:21:00',
        site: '搜狐',
      },
      {
        title: '95生梯队重排,王一博独占鳌头,陈哲远、张晚意、许凯久捧不红',
        content:
          '如今的95生似乎有点后继乏力,已经很久没有出现下一个爆火的流量小生,反倒是各种待爆小生层出不穷｡ 更可怕的是,好几年过去了,这批待爆帝没有一个大火的,至于他们为什么不能火,则是各有各的原因｡ 先来说第一梯队的王一博和刘昊然,这两位一个是因为耽改剧成为顶流,另一位是手握高票房电影｡ 一､王一博 UNIQ这个组合有点生不逢时,刚出道就遇到了禁韩令,组员们只能转型走其他赛道｡ ',
        url: 'http://mp.weixin.qq.com/s?src=11\u0026timestamp=1744589294\u0026ver=5929\u0026signature=CkISLYieluR3WAwHkVZyR5lsES3xDWck7fHnaZUHX1Pf-nJXAqkCOiKZrcwgicJliteYLu9bR743SoeT-c9a7trD7FiZZKdlabjY-7e9IWSG8xP6m*SwF1aCcfmqWfPi\u0026new=1',
        type: 'mp',
        index: 4,
        score: 0.280569,
        date: '2025-02-23 23:59:07',
        site: '微信公众平台',
      },
      {
        title: '五部王炸阵容的悬疑新剧,潘粤明张颂文段奕宏陈建斌王景春 - 今日头条',
        content:
          '1､《白夜破晓》潘粤明/王龙正 《白夜追凶2》,除了导演,编剧演员都是原班人马,8月来袭,小板凳准备好! 2､《暗潮缉凶》 陈建斌/陈若轩/李溪芮/成泰燊/梅婷 《尘封十三载》编剧执笔, 曾经朝气蓬勃的国营大厂内,废弃的排污水池中惊现断足女尸,意外的案件,意外的组合,开启一段宿命缉凶之行…… 3､《近在咫尺》张颂文/林家川 《白夜追凶》编剧指纹执笔,车轮下的命案,隐藏的真相,无论做什么对方都快一步?',
        url: 'https://www.toutiao.com/article/7390586247297434148',
        type: 'thirdparty',
        index: 5,
        score: 0.24094234,
        date: '2024-07-12 13:40:00',
        site: '今日头条',
      },
      {
        title: '中生代演员用细腻表演赋予角色新鲜感 实力演绎悬疑剧获肯定',
        content:
          '文/广州日报全媒体记者:莫斯其格      王宝强时隔多年回归电视剧市场､孙俪闯进悬疑赛道饰演女警韩青､段奕宏在漫天风沙中被迫回忆起多年前的往事……近日,《棋士》《乌云之上》《沙尘暴》等热播新剧引起观众热议｡相似的是,这几部作品聚焦现实的同时主打“悬疑感”,中生代实力演员用细腻的表演,给角色赋予更多层次,让观众更容易理解角色､进入剧情｡      《棋士》的故事背景设定在21世纪初的南方城市｡',
        url: 'https://new.qq.com/rain/a/20250411A04PTZ00',
        type: 'thirdparty',
        index: 6,
        score: 0.21537739,
        date: '2025-04-11 12:54:13',
        site: '腾讯网',
      },
      {
        title: '盘点95后男演员待播作品:新生力量,恣意生长!吴磊电视剧古装电影_网易订阅',
        content:
          '刘昊然/ 主要待播作品: 电影 《唐探3》､电影《尘埃里开花》､电影《平原上的摩西》等 刘昊然称得上95后男演员中国民度很高的一位｡这一点既源于他正面且阳光的良好形象,更源于他塑造的不少有记忆点的角色｡ 从《最好的我们》里让人念念不忘的余淮,到《唐人街探案》中的高智商侦探秦风,再到《九州缥缈录》里逐渐强大的吕归尘,还有《我和我的祖国》中自由野性的沃德乐,以及《妖猫传》里清秀单纯的白龙少年…… 仅仅从剧照,观众就能感受出不同角色间截然不同的性格和态度,一个气定神闲､睥睨四方,一个充满热情和活力｡ 刘昊然还和陈飞宇､张雪迎､文淇等一起出演陈凯歌导演的电影《尘埃里开花》｡ 此外,刘昊然和周冬雨主演的悬疑犯罪题材电影《平原上的摩西》也备受关注｡该片讲述了由一起出租车司机被杀案揭开的陈年往事,刘昊然在其中出演警察庄树｡ 王一博 /主要待播作品:《有翡》､《冰雨火》等 情令》在19年夏天火遍全网,出演主角蓝忘机的王一博人气急升 此前导演郑伟文曾说看中王一博身上“有一种自然天成的酷”,而他的内敛沉静也在蓝忘机的身上有所展现｡',
        url: 'https://www.163.com/dy/article/FC4V0MA30517JF3D.html',
        type: 'thirdparty',
        index: 7,
        score: 0.84132403,
        date: '2020-05-08 22:22:10',
        site: '网易',
      },
      {
        title: '95后男演员不得不转型,00后小辈飞速赶超,谁是下一届流量王者?_代表作品_观众_白宇帆',
        content:
          '95后男演员:由少年感转向时尚 张新成(95年) 中戏出来的科班演员,有台词功底,哭戏感染力强｡ 张新成总在少年感和时尚感之间来回摆动,既有校园青春剧《你好旧时光》《冰糖炖雪梨》,又有家庭情感剧《以家人之名》,在热播剧《光芒》中再次饰演具有复杂个性的男主“程亦治”｡ 白宇帆(95年) 当过兵抗过洪的白宇帆总给人正气凛然的感觉｡ 代表作品有《山海情》､《我在他乡挺好的》｡ 白宇帆在《山海情》里饰演马得宝,拥有细腻的情感张力;和周雨彤的“亦辰不染”cp受到了很多观众喜爱｡',
        url: 'https://www.sohu.com/a/587968665_121391836',
        type: 'thirdparty',
        index: 8,
        score: 0.41154826,
        date: '2022-09-26 07:54:00',
        site: '搜狐',
      },
      {
        title: '未来可期的十位95后男明星,每一个都非常有潜力,你最看好谁?_偶像_男星_少年',
        content:
          '第一位 易烊千玺 易烊千玺出道以来一直是备受争议,很多人都看不好他,如今成为娱乐圈最有人气的实力派演员｡电影《少年的你》让我们看到了他的演技与实力,他已经实现了完美逆袭,是一位努力低调不张扬的青年偶像,未来可期! 第二位 王一博 我们的酷盖男孩王一博可以说是最大的黑马男星之一,去年凭借着《陈情令》获得了很多人的喜欢｡唱歌､跳舞､摩托车､滑板､主持都不在话下,主演的武侠剧《有翡》呼声热度很高,真是始于颜值,陷于才华,忠于人品｡ 第三位 刘昊然 最初认识昊然弟弟是在《北京爱情故事》中,当时就觉得这个男孩非常的有潜力,如今作为最具票房号召力的95后男星,他主演的唐人街探案系列电影火爆全国,让更多的人喜欢上了这个少年｡ 第四位 张新成 我们的冰神张新成是95年的,长了一张人人都喜欢的男神脸,也是一位颜值与实力并存的实力派,主演的《冰糖炖雪梨》获得了很多人的喜欢,接下来还有《以家人之名》和《让全世界都听见》两部剧将要上映,期待他的表现吧｡',
        url: 'https://www.sohu.com/a/590263333_121392631',
        type: 'thirdparty',
        index: 9,
        score: 0.42007017,
        date: '2022-10-05 07:13:00',
        site: '搜狐',
      },
    ],
  },
  {
    type: 'think',
    title: '思考中...',
    content: '继续思考，这是个mock，这是个mock这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '继续思考，这是个mock，这是个mock这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  {
    type: 'think',
    title: '思考中...',
    content: '这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，这是个mock，',
  },
  { type: 'think', title: '思考完成（耗时4秒）', content: '重要的事情说三遍' },
  // 自定义插件测试1
  {
    type: 'weather',
    id: 'w11',
    content: '{"temp": 1,"city": "北京","conditions": "多云"}',
  },
  // 图片测试
  {
    type: 'image',
    content:
      '{"url":"https://tdesign.gtimg.com/site/avatar.jpg","format":"png","width":1204,"height":1024,"size":1032}',
  },
  // 测试用例1 - 标题开头被截断
  {
    type: 'text',
    msg: ',**我是加粗文本,**我不应该加粗"**我应该加粗;**',
  },
  { type: 'text', msg: '🌼' },

  { type: 'text', msg: '宝' },

  { type: 'text', msg: '子' },
  { type: 'text', msg: '们' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '*' },
  { type: 'text', msg: '*重' },
  { type: 'text', msg: '要' },
  { type: 'text', msg: '通' },
  { type: 'text', msg: '知*' },
  { type: 'text', msg: '*_' },
  { type: 'text', msg: '强调' },
  { type: 'text', msg: '内容_' },
  { type: 'text', msg: '，' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '春天' },

  { type: 'text', msg: '来' },

  { type: 'text', msg: '啦' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '#' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '一级标题' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '##' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '二级标题' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '[' },
  { type: 'text', msg: '腾讯' },
  { type: 'text', msg: '官网' },
  { type: 'text', msg: ']' },
  { type: 'text', msg: '(' },
  { type: 'text', msg: 'https://www.qq.com' },
  { type: 'text', msg: ')' },
  { type: 'text', msg: '这些' },
  { type: 'text', msg: '`' },
  { type: 'text', msg: 'const' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: 'x' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '=' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '10' },
  { type: 'text', msg: ';' },
  { type: 'text', msg: '`' },
  { type: 'text', msg: '户外' },

  { type: 'text', msg: '郊' },

  { type: 'text', msg: '游' },

  { type: 'text', msg: '打卡' },

  { type: 'text', msg: '地' },

  { type: 'text', msg: '你必须' },

  { type: 'text', msg: '知道' },

  { type: 'text', msg: '👏' },

  { type: 'text', msg: '\n\n' },
  { type: 'text', msg: '```' },
  { type: 'text', msg: 'javascript' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: 'function' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: 'test' },
  { type: 'text', msg: '(' },
  { type: 'text', msg: ')' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '{' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '  ' },
  { type: 'text', msg: 'console' },
  { type: 'text', msg: '.' },
  { type: 'text', msg: 'log' },
  { type: 'text', msg: '(' },
  { type: 'text', msg: "'" },
  { type: 'text', msg: 'Hello' },
  { type: 'text', msg: "'" },
  { type: 'text', msg: ')' },
  { type: 'text', msg: ';' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '}' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '```' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '🌟' },

  { type: 'text', msg: '郊' },

  { type: 'text', msg: '野' },

  { type: 'text', msg: '公园' },

  { type: 'text', msg: '\n' },

  { type: 'text', msg: '这里' },

  { type: 'text', msg: '有大' },

  { type: 'text', msg: '片的' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '>' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '这是引用内容' },
  { type: 'text', msg: '\n\n' },
  { type: 'text', msg: '草地' },

  { type: 'text', msg: '和' },

  { type: 'text', msg: '各种' },

  { type: 'text', msg: '花卉' },

  { type: 'text', msg: '，' },

  { type: 'text', msg: '随便' },

  { type: 'text', msg: '一' },

  { type: 'text', msg: '拍' },

  { type: 'text', msg: '都是' },

  { type: 'text', msg: '大片' },

  { type: 'text', msg: '既' },

  { type: 'text', msg: '视' },

  { type: 'text', msg: '感' },

  { type: 'text', msg: '📷' },

  { type: 'text', msg: '。' },

  { type: 'text', msg: '还能' },

  { type: 'text', msg: '放' },

  { type: 'text', msg: '风筝' },

  { type: 'text', msg: '、' },

  { type: 'text', msg: '野' },

  { type: 'text', msg: '餐' },

  { type: 'text', msg: '，' },

  { type: 'text', msg: '享受' },

  { type: 'text', msg: '惬' },

  { type: 'text', msg: '意的' },

  { type: 'text', msg: '春' },

  { type: 'text', msg: '日' },

  { type: 'text', msg: '时光' },

  { type: 'text', msg: '。\n\n' },
  { type: 'text', msg: '-' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '列表项1' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '*' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '列表项2' },
  { type: 'text', msg: '\n' },
  // 有序列表
  { type: 'text', msg: '1' },
  { type: 'text', msg: '.' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '第一项' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '2' },
  { type: 'text', msg: '.' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '第二项' },
  { type: 'text', msg: '\n' },

  { type: 'text', msg: '---' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '🌳' },
  { type: 'text', msg: '植物' },

  { type: 'text', msg: '园' },

  { type: 'text', msg: '\n' },
  { type: 'text', msg: '各种' },

  { type: 'text', msg: '珍' },

  { type: 'text', msg: '稀' },

  { type: 'text', msg: '植物' },

  { type: 'text', msg: '汇聚' },

  { type: 'text', msg: '于此' },

  { type: 'text', msg: '，' },

  { type: 'text', msg: '仿佛' },

  { type: 'text', msg: '置身' },

  { type: 'text', msg: '于' },

  { type: 'text', msg: '绿色的' },

  { type: 'text', msg: '海洋' },

  { type: 'text', msg: '。' },

  { type: 'text', msg: '漫步' },

  { type: 'text', msg: '其中' },

  { type: 'text', msg: '，' },

  { type: 'text', msg: '感受' },

  { type: 'text', msg: '大' },

  { type: 'text', msg: '自然的' },

  { type: 'text', msg: '神奇' },

  { type: 'text', msg: '与' },

  { type: 'text', msg: '美丽' },

  { type: 'text', msg: '。\n\n' },

  { type: 'text', msg: '💧' },

  { type: 'text', msg: '湖' },

  { type: 'text', msg: '边' },

  { type: 'text', msg: '湿地' },

  { type: 'text', msg: '\n' },

  { type: 'text', msg: '湖' },

  { type: 'text', msg: '水' },

  { type: 'text', msg: '清澈' },

  { type: 'text', msg: '，' },

  { type: 'text', msg: '周围' },

  { type: 'text', msg: '生态环境' },

  { type: 'text', msg: '优越' },

  { type: 'text', msg: '。' },

  { type: 'text', msg: '能看到' },

  { type: 'text', msg: '很多' },

  { type: 'text', msg: '候' },

  { type: 'text', msg: '鸟' },

  { type: 'text', msg: '和水' },

  { type: 'text', msg: '生' },

  { type: 'text', msg: '植物' },

  { type: 'text', msg: '，' },

  { type: 'text', msg: '是' },

  { type: 'text', msg: '亲近' },

  { type: 'text', msg: '自然' },

  { type: 'text', msg: '的好' },

  { type: 'text', msg: '去' },

  { type: 'text', msg: '处' },

  { type: 'text', msg: '。\n\n' },
  // 表格
  { type: 'text', msg: '|' },
  { type: 'text', msg: '姓名' },
  { type: 'text', msg: '|' },
  { type: 'text', msg: '年龄' },
  { type: 'text', msg: '|' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '|' },
  { type: 'text', msg: '---' },
  { type: 'text', msg: '|' },
  { type: 'text', msg: '---' },
  { type: 'text', msg: '|' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '|' },
  { type: 'text', msg: '张三' },
  { type: 'text', msg: '|' },
  { type: 'text', msg: '25' },
  { type: 'text', msg: '|' },
  { type: 'text', msg: '\n\n' },
  { type: 'text', msg: '宝' },

  { type: 'text', msg: '子' },

  { type: 'text', msg: '们' },

  { type: 'text', msg: '，' },

  { type: 'text', msg: '赶紧' },

  { type: 'text', msg: '收拾' },

  { type: 'text', msg: '行' },

  { type: 'text', msg: '囊' },

  { type: 'text', msg: '，' },

  { type: 'text', msg: '去' },

  { type: 'text', msg: '这些' },

  { type: 'text', msg: '地方' },

  { type: 'text', msg: '打卡' },

  { type: 'text', msg: '吧' },

  { type: 'text', msg: '😜' },

  { type: 'text', msg: '。\n\n' },

  { type: 'text', msg: '-' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '[' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: ']' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '未完成任务' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '-' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '[' },
  { type: 'text', msg: 'x' },
  { type: 'text', msg: ']' },
  { type: 'text', msg: ' ' },
  { type: 'text', msg: '已完成任务' },

  { type: 'text', msg: '\n\n' },
  { type: 'text', msg: '!' },
  { type: 'text', msg: '[' },
  { type: 'text', msg: 'logo' },
  { type: 'text', msg: ']' },
  { type: 'text', msg: '(' },
  { type: 'text', msg: 'https://tdesign.gtimg.com/demo/demo-image-1.png' },
  { type: 'text', msg: ')' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: '#' },

  { type: 'text', msg: '春天' },

  { type: 'text', msg: '郊' },

  { type: 'text', msg: '游' },
  { type: 'text', msg: '内容' },
  { type: 'text', msg: '[' },
  { type: 'text', msg: '^' },
  { type: 'text', msg: '1' },
  { type: 'text', msg: ']' },
  { type: 'text', msg: '\n' },
  { type: 'text', msg: ' #' },

  { type: 'text', msg: '打卡' },

  { type: 'text', msg: '目的地' },

  { type: 'text', msg: ' #' },

  { type: 'text', msg: '户外' },

  { type: 'text', msg: '之旅' },

  { type: 'text', msg: ' #' },

  { type: 'text', msg: '春' },

  { type: 'text', msg: '日' },

  { type: 'text', msg: '美景' },
  { type: 'text', msg: '\n' },
  {
    type: 'suggestion',
    content:
      '  \n**是不是想提问：**  \n- [技术理想国项目的叙事设计特点是什么](#prompt:技术理想国项目的叙事设计特点是什么)  \n- [资本媾和地项目的技术应用有哪些](#prompt:资本媾和地项目的技术应用有哪些)  \n- [如影中还有哪些项目结合了技术创新](#prompt:如影中还有哪些项目结合了技术创新)  \n- [突破性叙事设计对项目的影响如何](#prompt:突破性叙事设计对项目的影响如何)  \n',
  },
];

export { chunks };

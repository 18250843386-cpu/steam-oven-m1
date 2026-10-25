'use strict';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const refLink = (key, label) => `<a class="source-link" href="#ref-${key}" data-ref="${key}">${label} ↗</a>`;

const journeyData = [
 {name:'购买安装',code:'SPACE / FIT',title:'放得下机器，也要放得下一餐。',desc:'选机时，标称容量最容易被看到；真正影响日常使用的还有散热间距、开门范围、柜体开孔，以及家里常用的餐盘。',evidence:'西门子规格表列出安装与电源条件；松下、东芝手册提示台面和散热空间要求。',response:'把外机包络、烤盘区域和抽取空间放在同一张结构图里比较。',metric:'烤盘可放尺寸 / 层间净高 / 开门抽取空间',key:'BSH',source:'产品规格与说明书'},
 {name:'模式设定',code:'UNDERSTAND / CHOOSE',title:'功能很多，下一步却不一定清楚。',desc:'从模式、温度到份量与器皿，用户需要连续做判断。新手或老年用户可能反复查说明书，界面上的按钮数量并不等于任务完成能力。',evidence:'智能厨电界面研究与面向老年用户的引导研究，关注信息分组、步骤反馈和使用理解。',response:'从“选一个任务”开始，按步骤确认输入，随时能返回或停止。',metric:'设置用时 / 完成率 / 误操作与求助次数',key:'L03',source:'界面设计用户研究'},
 {name:'烹饪观察',code:'HEAT / VISIBILITY',title:'同一道菜，换份量或层位就不同？',desc:'空气温差、食品中心熟度和表面上色是不同的问题。热源、风道、摆盘和厚度都可能影响结果；玻璃起雾还会妨碍观察。',evidence:'温场预测与叶轮优化研究提供气流和温度机制的线索；除雾专利提供门面气流的工程对照。',response:'先区分腔温与食品温度，再比较浅拱顶和循环路径；门面清晰度单独评价。',metric:'多点腔温 / 食品中心温度 / 上色差与可见面积',key:'L04',source:'温场预测算法研究'},
 {name:'安全取餐',code:'OPEN / SERVE',title:'倒计时结束，不代表热汽已经散去。',desc:'取餐时，用户要同时面对热托盘、门体表面和开门热汽。屏幕反馈必须与实际的排汽路径和可靠结构配合。',evidence:'门体隔热专利关注传热路径；玻璃爆裂研究则进一步涉及材料、装配和热应力。',response:'在取餐前组织排汽并提示状态；门体隔热与材料装配另外验证。',metric:'门表面温度 / 排汽方向 / 开门操作错误',key:'L01',source:'玻璃门可靠性研究'},
 {name:'餐后清洁',code:'WATER / MAINTENANCE',title:'蒸汽用完了，水还留在哪里？',desc:'管路余水、门面挂水和腔底冷凝水来自不同路径。把它们都交给用户擦干，可能让一次方便的烹饪变成繁琐的收尾。',evidence:'消费者报道与单条平台投诉提供积水线索；供排水专利处理管路余水，但并不覆盖全部清洁任务。',response:'区分供汽、冷凝与收集路径，设计可拆洗水盒，并把清洁纳入任务流程。',metric:'残水质量 / 擦洗用时 / 拆装错误',key:'NEWS',source:'消费者报道与公开反馈'}
];

const products = [
 {id:'midea',brand:'美的',name:'SX5',type:'built',capacity:'55 L',tags:['温湿协同','热风循环'],help:'以温湿控制和热风支持家庭多种蒸烤任务。',limit:'先核对柜体与散热；蒸后余水仍需确认清理路径。',price:'3,920',priceNote:'采集页面标价 · 非补贴价',key:'JDm',url:'https://item.jd.com/100088782955.html',color:'#3c5050'},
 {id:'supor',brand:'苏泊尔',name:'DY78',type:'built',capacity:'60 L',tags:['远红外','陶瓷膜内胆'],help:'大容量与内胆设计面向家庭多份量烹饪。',limit:'大容量不自动保证多层均匀，仍需确认层位和摆盘。',price:'3,459',priceNote:'采集页面标价 · 非补贴价',key:'JDs',url:'https://item.jd.com/100285546212.html',color:'#626b63'},
 {id:'siemens',brand:'西门子',name:'Z3Pro',type:'built',capacity:'CS0T5MAB2W',tags:['触控交互','安装规格明确'],help:'触控与具体安装、电源参数便于按厨房条件选机。',limit:'嵌入安装需要预留柜体开孔、电源及散热空间。',price:'4,692',priceNote:'采集页面标价 · 非补贴价',key:'BSH',url:'https://media3.bsh-group.com/Documents/specsheet/zh-CN/CS0T5MAB2W.pdf',color:'#697778'},
 {id:'panasonic',brand:'松下',name:'NU-SC211W',type:'counter',capacity:'22 L',tags:['小份量家庭','台面蒸烤'],help:'以台式机提供蒸烤功能，适合小份量家庭的使用路线。',limit:'大餐盘、多道菜及另需微波时，要计算总设备空间。',price:null,priceNote:'小份量家庭场景',key:'PANm',url:'https://home.panasonic.cn/support/attachments/auld/manual/NU-SC211W.pdf',color:'#c4ccc3'},
 {id:'fotile',brand:'方太',name:'A1.i',type:'counter',capacity:'32 L',tags:['语音入口','任务反馈'],help:'语音入口为用户减少寻找菜单的步骤提供另一条路线。',limit:'语音仍需可靠的屏幕反馈，以及可直接操作的停止入口。',price:null,priceNote:'台式产品路线',key:'FOT',url:'https://hsadmin.fotile.com/h5happylife/video/detail.html?id=17811',color:'#78918c'},
 {id:'toshiba',brand:'东芝',name:'YD95',type:'counter',capacity:'含微波',tags:['弧形顶','微蒸烤复合'],help:'弧形顶与微蒸烤模式为复合烹饪和腔体设计提供参照。',limit:'外形仍需散热空间；微波模式要正确选择兼容器皿。',price:null,priceNote:'台式产品路线',key:'TOSH',url:'https://dsdcp.smartmidea.net/mcsp/prod/20240910/583fba8d40864b7cb752e348aa89f042.pdf',color:'#5a6665'}
];

const patents = [
 {brand:'老板',no:'CN209136182U',topic:'供排水与维护',title:'让管路余水有回去的地方',problem:'蒸功能结束后，供汽管路中可能仍有余水。',method:'水箱分为储水区与废水区，由回水泵把管路余水送回废水区。',benefit:'供水与回水有明确路径，便于把余水处理加入程序。',boundary:'它处理的是管路水；腔底冷凝水、废水盒倒空和泵路清洗仍需单独设计。',fig:'图 1 · 供排水结构',page:'公开文本 PDF 第 9 页',key:'P01'},
 {brand:'美的',no:'CN109008592B',topic:'复合烹饪控制',title:'让烹饪时长对应食物条件',problem:'同一组时间参数不一定适合不同食物与份量。',method:'先按模式预热，再结合食物种类、重量确定时长，控制蒸汽与热风。',benefit:'把食物条件放进控制过程，比单一固定倒计时更贴近烹饪任务。',boundary:'用户仍需提供可信的食物信息；同重量但摆位不同，也可能出现不同结果。',fig:'图 3 · 烹饪控制流程',page:'公开文本 PDF 第 18 页',key:'P06'},
 {brand:'华帝',no:'CN112043154B',topic:'湿度感知与控制',title:'把冷凝水的影响纳入控湿',problem:'蒸汽与冷凝水共同作用，可能使目标湿度出现过冲。',method:'利用氧浓度变化判断加湿时机，并考虑冷凝水蒸发的阶段。',benefit:'控制依据包含过程状态，而不仅是固定的供汽时间。',boundary:'传感器需要面对冷凝、油污、标定与拆装；家庭维护便利性仍需评价。',fig:'图 1 · 控湿流程',page:'公开文本 PDF 第 12 页',key:'P17'},
 {brand:'苏泊尔',no:'CN218588848U',topic:'拱顶与顶部气流',title:'从炉腔顶部组织循环',problem:'风机布置占用空间，气流还需要覆盖不同层位。',method:'在顶部凹部设置风机罩，让气流从中心进入、向周边流出；说明书给出拱形或穹形顶壁。',benefit:'把风机与上部空间一起考虑，为装载区留下清楚的边界。',boundary:'拱顶不会直接缩小外机占地；食品均匀性需在相同风机与负载下比较。',fig:'图 5 · 顶部风机与拱顶剖面',page:'公开文本 PDF 第 16 页',key:'P22'},
 {brand:'方太',no:'CN112294099B',topic:'蒸烤排汽通道',title:'给蒸与烤选择不同的出口',problem:'蒸模式需保留蒸汽热量，烤模式又要排走多余水汽。',method:'阀板切换竖向直通与弯折通道，分别适应蒸和烤的排汽需要。',benefit:'模式切换对应具体气流结构，而不仅是屏幕上的名称。',boundary:'活动阀、窄通道和油水混合物带来清洁与故障任务，取餐排汽也需另外考虑。',fig:'图 7 · 双通道阀路剖面',page:'公开文本 PDF 第 19 页 · 已旋转便于阅读',key:'P23'},
 {brand:'格力',no:'CN212186239U',topic:'门体隔热与安全',title:'从传热路径降低门面热量',problem:'高温烹饪时，门外表面可能过热。',method:'外层玻璃与隔热玻璃分层，隔热玻璃内部再设置隔热结构。',benefit:'从门体传热路径着手，减少用户接触高温面的风险。',boundary:'核心是隔热，不能据此认为玻璃爆裂已经解决；材料、装配和热循环仍需验证。',fig:'图 4 · 隔热玻璃层间结构',page:'公开文本 PDF 第 10 页',key:'P07'}
];

const phases = {
 steam:{name:'蒸',en:'STEAM / RETAIN',title:'供汽与保湿，保留必要排放。',desc:'按任务供汽并控制腔温；维持正常排放。水位和门状态提供过程反馈。',states:['供汽：按任务','循环：保持','排汽：正常排放'],screen:'蒸制进行中'},
 transition:{name:'蒸转烤',en:'TRANSITION / EXHAUST',title:'停止补汽，再有控制地排出余汽。',desc:'供汽、热源和循环风机一起调整；通过受控路径排湿，将冷凝液送入收集路径。',states:['供汽：停止','热风：调整','排汽：受控开启'],screen:'正在切换至烤'},
 bake:{name:'烤',en:'BAKE / CIRCULATE',title:'围绕食物需要组织热风与排湿。',desc:'按任务与温差反馈调节热源和循环。排汽并非长期全开，避免无效带走热量。',states:['供汽：停止','循环：烘烤任务','排汽：按需'],screen:'烘烤进行中'},
 serve:{name:'取餐前',en:'SERVE / RELEASE',title:'先组织余汽排放，再提示取餐。',desc:'停止或降低热源，组织余汽排放，并提示门体和器皿仍然高温；随后引导清理残水。',states:['热源：停止 / 降低','余汽：排出','反馈：取餐与维护'],screen:'取餐前排汽提示'}
};

function renderHero(){ $('#hero-oven').innerHTML=`<img class="m1-hero-img" src="assets/m1-front.svg?v=6" alt="M1工程横剖：均压送风、双层装载、浅拱顶、独立水盒及干湿分路"><div class="hero-facts"><span><b>595 × 560 × 455</b> mm 设计外形</span><span><b>430 × 340</b> mm 烤盘目标</span></div>`; }

function ovenThumb(color, countertop){
 return `<svg class="oven-thumb" viewBox="0 0 100 82" aria-hidden="true"><ellipse cx="51" cy="73" rx="42" ry="5" fill="#809276" opacity=".1"/><path d="M10 16L22 9H91L80 16Z" fill="${color}" opacity=".75"/><path d="M80 16L91 9V63L80 71Z" fill="${color}" opacity=".85"/><rect x="10" y="16" width="71" height="55" rx="3" fill="${color}"/><rect x="16" y="32" width="59" height="32" rx="2" fill="#263e3c"/><path d="M21 39H70" stroke="#b3c3b0" stroke-width="2"/><path d="M21 46H62L31 61H21Z" fill="#d7e2cd" opacity=".1"/><rect x="56" y="22" width="14" height="5" rx="1" fill="#adbdad"/><circle cx="26" cy="24" r="2" fill="#b6c6b5"/>${countertop?'<path d="M16 71V75M74 71V75" stroke="#5a7156" stroke-width="4"/>':''}</svg>`;
}

function selectInGroup(container, button){
 $$('button',container).forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
}

let journeyIndex=0;
function renderJourney(){
 $('#journey-tabs').innerHTML=journeyData.map((j,i)=>`<button class="journey-tab ${i===journeyIndex?'active':''}" role="tab" id="journey-tab-${i}" aria-controls="journey-panel" aria-selected="${i===journeyIndex}" tabindex="${i===journeyIndex?'0':'-1'}" data-journey="${i}"><span class="num">0${i+1}</span><span>${j.name}</span><span class="tab-arrow">↗</span></button>`).join('');
 const j=journeyData[journeyIndex];$('#journey-panel').setAttribute('aria-labelledby',`journey-tab-${journeyIndex}`);
 $('#journey-panel').innerHTML=`<div class="panel-eyebrow"><span>0${journeyIndex+1}</span> ${j.code}</div><h3>${j.title}</h3><p class="journey-desc">${j.desc}</p><div class="evidence-grid"><div><label>我从哪里看到</label><p>${j.evidence}</p>${refLink(j.key,j.source)}</div><div><label>我希望怎样改进</label><p>${j.response}</p><p style="margin-top:9px;color:#8a927d;font-size:10px">验证：${j.metric}</p></div></div>`;
}

let productFilter='all', selectedProducts=[];
function renderProducts(){
 const filtered=products.filter(p=>productFilter==='all'||p.type===productFilter);
 $('#product-grid').innerHTML=filtered.map(p=>`<article class="product-card"><div class="product-top"><div><div class="product-type">${p.type==='built'?'嵌入式':'台式'} / ${p.capacity}</div><div class="product-brand">${p.brand}</div><h3>${p.name}</h3></div>${ovenThumb(p.color,p.type==='counter')}</div><div class="product-tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><p class="product-insight"><strong>它帮助了什么</strong>${p.help}</p><p class="product-limit"><strong>仍需处理的事</strong>${p.limit}</p><div class="product-bottom"><div class="product-price">${p.price?`¥ <b>${p.price}</b><small>2026.10.11 页面标价</small>`:`<span class="product-scene">${p.type==='built'?'厨房嵌入':'台面使用'}</span>`}</div><button class="compare-toggle ${selectedProducts.includes(p.id)?'active':''}" data-compare="${p.id}" aria-pressed="${selectedProducts.includes(p.id)}" aria-label="${selectedProducts.includes(p.id)?'取消':'加入'}${p.brand} ${p.name}对比">${selectedProducts.includes(p.id)?'已选 ✓':'对比 ＋'}</button></div><a class="product-source" href="${p.url}" target="_blank" rel="noopener">${p.key==='JDm'||p.key==='JDs'?'京东归档页':'官方资料'} ↗</a></article>`).join('');
 renderComparison();
}
function renderComparison(){
 const panel=$('#compare-tray');panel.hidden=selectedProducts.length===0;
 $('#compare-count').textContent=`已选 ${selectedProducts.length} / 2 款产品`;
 if(selectedProducts.length<2){$('#compare-content').innerHTML='<p class="compare-placeholder">再选择一款产品，即可并排查看使用路线与限制。</p>';return;}
 const ps=selectedProducts.map(id=>products.find(p=>p.id===id));
 const rows=[['型号',p=>p.brand+' '+p.name],['类型 / 配置',p=>(p.type==='built'?'嵌入式':'台式')+' · '+p.capacity],['解决任务',p=>p.help],['使用条件',p=>p.limit]];
 $('#compare-content').innerHTML='<table class="compare-table"><caption class="skip">两款产品使用路线对照</caption><tbody>'+rows.map(([label,fn])=>`<tr><th scope="row">${label}</th>${ps.map(p=>`<td>${fn(p)}</td>`).join('')}</tr>`).join('')+'</tbody></table>';
}

let patentIndex=0;
function renderPatent(){
 $('#patent-tabs').innerHTML=patents.map((p,i)=>`<button class="patent-tab ${i===patentIndex?'active':''}" role="tab" id="patent-tab-${i}" aria-controls="patent-panel" aria-selected="${i===patentIndex}" tabindex="${i===patentIndex?'0':'-1'}" data-patent="${i}"><small>0${i+1}</small><span>${p.brand}<em>${p.topic}</em></span></button>`).join('');
 const p=patents[patentIndex];$('#patent-panel').setAttribute('aria-labelledby',`patent-tab-${patentIndex}`);
 $('#patent-panel').innerHTML=`<div class="patent-content"><figure class="patent-drawing" style="margin:0"><span class="patent-fig-label">PATENT DRAWING / 0${patentIndex+1}</span><button class="patent-image-button" id="zoom-patent" aria-label="放大${p.brand}专利附图"><img src="assets/${p.no}.png" alt="${p.brand}${p.no} ${p.fig}" loading="lazy"></button><figcaption class="zoom-hint">${p.fig} · 点击放大 ⤢</figcaption></figure><div class="patent-detail"><div class="mono">${p.no}</div><h3>${p.title}</h3><dl><dt>针对的问题</dt><dd>${p.problem}</dd><dt>怎样解决 / 优势</dt><dd>${p.method}${p.benefit}</dd><dt>我看到的后续问题</dt><dd>${p.boundary}</dd></dl></div></div><div class="patent-footer"><span>${p.page}</span><a href="https://patents.google.com/patent/${p.no}/zh" target="_blank" rel="noopener">阅读专利原文 ↗</a></div>`;
 $('#zoom-patent').addEventListener('click',()=>{const dialog=$('#patent-dialog');$('#dialog-title').textContent=`${p.brand} · ${p.no} · ${p.fig}`;$('#dialog-img').src=`assets/${p.no}.png`;$('#dialog-img').alt=p.fig;dialog.showModal();});
}

function renderPaths(){ $('#path-visual').innerHTML=`<img src="assets/m1-side.svg?v=6" alt="M1纵剖：后回风、前排水、三层门体和独立排汽湿管"><div class="path-readable"><span>供汽：净水盒 / 外置发生器 / 双侧入口</span><span>湿汽：调节阀 / 间壁冷凝 / 分离 / 末端出口</span><span>干风：独立风机 / 空气侧换热 / 末端混合</span><span>凝水：门槽与坡底 / 粗滤 / 废水盒</span></div>`; }

let currentPhase='steam';
function setPhase(phase){
 currentPhase=phase;const p=phases[phase];$('#path-visual').dataset.phase=phase;
 const tab=$(`[data-phase="${phase}"]`,$('#phase-tabs'));selectInGroup($('#phase-tabs'),tab);
 $('#phase-detail').innerHTML=`<div class="phase-title"><h4>${p.title}</h4><span>${p.en}</span></div><p class="phase-description">${p.desc}</p><div class="phase-states">${p.states.map(s=>`<span>${s}</span>`).join('')}</div>`;
 if(uiStep===2)renderInterface();
}

let uiStep=0, uiTask='蒸转烤', uiQuantity='2 人份', uiVessel='金属烤盘（仅蒸烤）', uiLayer='中层';
function renderInterface(){
 const screen=$('#device-screen');
 const next=(text='下一步')=>`<button class="screen-next" data-ui="next">${text} →</button>`;
 const back='<button class="screen-back" data-ui="back">返回</button>';
 const heads=['今天想做什么？','确认烹饪条件','当前任务正在进行','准备安全取餐','让机器回到干净状态'];
 let inner=`<div class="screen-step">STEP 0${uiStep+1} / 05</div><h4>${heads[uiStep]}</h4>`;
 if(uiStep===0){inner+=`<div class="task-options">${['蒸','烤','蒸转烤'].map(t=>`<button data-task="${t}" class="${uiTask===t?'selected':''}" aria-pressed="${uiTask===t}"><span>${t}</span><small>${t==='蒸'?'保湿烹饪':t==='烤'?'热风烘烤':'分阶段完成'}</small></button>`).join('')}</div><div class="screen-actions">${next('确认任务')}</div>`;}
 if(uiStep===1){inner+=`<div class="screen-field"><label for="ui-quantity">份量</label><select id="ui-quantity">${['1 人份','2 人份','3–4 人份'].map(v=>`<option ${v===uiQuantity?'selected':''}>${v}</option>`).join('')}</select></div><div class="screen-field"><label for="ui-vessel">器皿</label><select id="ui-vessel">${['金属烤盘（仅蒸烤）','耐热玻璃（依手册）'].map(v=>`<option ${v===uiVessel?'selected':''}>${v}</option>`).join('')}</select></div><div class="screen-field"><label for="ui-layer">层位</label><select id="ui-layer">${['中层','上层','下层'].map(v=>`<option ${v===uiLayer?'selected':''}>${v}</option>`).join('')}</select></div><p class="screen-note">${uiTask} · 请确认水位、器皿耐温与放置间隙。确认后进入运行演示。</p><div class="screen-actions">${back}${next('开始演示')}</div>`;}
 if(uiStep===2){inner+=`<div class="screen-stage"><span class="pulse-dot"></span><span><b>${phases[uiTask==='蒸'?'steam':uiTask==='烤'?'bake':currentPhase].screen}</b><small>${uiTask} · ${uiQuantity} · ${uiLayer}</small></span></div><p>当前阶段、门状态与异常提示应清楚显示。食品温度与腔温分开显示，下一阶段以过程反馈判断。</p><div class="screen-actions">${next('演示进入取餐')}</div><button class="screen-stop" data-ui="stop">停止 / 返回任务</button>`;}
 if(uiStep===3){inner+=`<div class="screen-success">↗</div><p class="screen-note">取餐前应完成设计规定的排汽步骤。门体和器皿仍可能高温，请使用隔热手套。</p><p style="margin-top:12px">请缓慢开门，并避开前上方排汽口。</p><div class="screen-actions">${back}${next('查看维护')}</div>`;}
 if(uiStep===4){inner+=`<label class="screen-check"><input type="checkbox" id="water-done"> 倒空并复位接水盒</label><label class="screen-check"><input type="checkbox" id="wipe-done"> 按说明擦拭并干燥炉腔</label><p style="margin-top:10px">等待设备冷却后，再进行拆洗。</p><div class="screen-actions">${back}<button class="screen-next" data-ui="finish">完成本次任务 ✓</button></div>`;}
 screen.innerHTML=inner;
 $('#interface-progress').innerHTML=['任务','确认','运行','取餐','维护'].map((s,i)=>`${i?'<i></i>':''}<span class="${i===uiStep?'active':''}">${s}</span>`).join('');
}

function toast(text){const box=$('#toast');box.textContent=text;box.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>{box.hidden=true;},3500);}

let sourceType='all', sourceQuery='', sourcesExpanded=false;
const refURLs={NEWS:'https://zxb.ccn.com.cn/html/zxb/20180524/91252.html'};
function referenceType(r){if(r.reference.includes('[P]'))return 'patent';if(/\[(J|D|C|R)\]/.test(r.reference))return 'paper';return 'web';}
function renderReferences(){
 const rows=window.RESEARCH_REFERENCES.filter(r=>(sourceType==='all'||referenceType(r)===sourceType)&&(!sourceQuery||r.reference.toLowerCase().includes(sourceQuery)));
 const shown=sourcesExpanded?rows:rows.slice(0,6);
 $('#reference-list').innerHTML=shown.length?shown.map(r=>{const type=referenceType(r),url=refURLs[r.key]||(r.reference.match(/https?:\/\/[^\s,]+/)||[])[0]||(type==='patent'?`https://patents.google.com/patent/${(r.reference.match(/(?:CN|US|DE)\d+[A-Z]\d?/)||[])[0]}/zh`:null);const text=r.reference.replace(/https?:\/\/[^\s,]+/g,'').replace(/\. ,/g,'.');return `<article class="reference-row" id="ref-${r.key}"><span class="ref-num">[${String(r.no).padStart(2,'0')}]</span><div><span class="ref-type">${type==='patent'?'PATENT / 专利公开文本':type==='paper'?'LITERATURE / 研究文献':'SOURCE / 产品与公开资料'}</span><p>${esc(text)}</p></div>${url?`<a class="ref-link" href="${esc(url.replace(/[.]+$/,''))}" target="_blank" rel="noopener" aria-label="打开参考资料${r.no}原文">原文 ↗</a>`:'<span class="ref-link muted">本地归档</span>'}</article>`;}).join(''):'<div class="empty-references">未找到匹配资料。试试品牌、作者或专利号。</div>';
 const btn=$('#expand-sources');btn.hidden=rows.length<=6;btn.innerHTML=sourcesExpanded?'收起参考资料 <span>－</span>':`展开全部 ${rows.length} 条参考资料 <span>＋</span>`;
}

renderHero();renderJourney();renderProducts();renderPatent();renderPaths();renderInterface();setPhase('steam');renderReferences();

$('#journey-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-journey]');if(!b)return;journeyIndex=+b.dataset.journey;renderJourney();});
$('#product-filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;productFilter=b.dataset.filter;selectInGroup($('#product-filters'),b);renderProducts();});
$('#product-grid').addEventListener('click',e=>{const b=e.target.closest('[data-compare]');if(!b)return;const id=b.dataset.compare;if(selectedProducts.includes(id))selectedProducts=selectedProducts.filter(p=>p!==id);else if(selectedProducts.length<2)selectedProducts.push(id);else{toast('已选两款。请先取消一款，再加入新的产品。');return;}renderProducts();if(selectedProducts.length===2)$('#compare-tray').scrollIntoView({behavior:'smooth',block:'nearest'});});
$('#clear-compare').addEventListener('click',()=>{selectedProducts=[];renderProducts();});
$('#patent-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-patent]');if(!b)return;patentIndex=+b.dataset.patent;renderPatent();});
$$('[data-hero-view]').forEach(b=>b.addEventListener('click',()=>{selectInGroup(b.parentElement,b);$('#hero-oven').classList.toggle('shell-view',b.dataset.heroView==='shell');}));
$('#phase-tabs').addEventListener('click',e=>{const b=e.target.closest('button[data-phase]');if(b)setPhase(b.dataset.phase);});
$('#toggle-labels').addEventListener('click',e=>{const hidden=$('#path-visual').classList.toggle('hide-labels');e.currentTarget.textContent=`路径说明 ${hidden?'关':'开'}`;e.currentTarget.setAttribute('aria-pressed',String(!hidden));});
$('#device-screen').addEventListener('click',e=>{const task=e.target.closest('[data-task]');if(task){uiTask=task.dataset.task;renderInterface();return;}const b=e.target.closest('[data-ui]');if(!b)return;const act=b.dataset.ui;if(act==='next'){if(uiStep===1){uiQuantity=$('#ui-quantity').value;uiVessel=$('#ui-vessel').value;uiLayer=$('#ui-layer').value;setPhase(uiTask==='烤'?'bake':'steam');}uiStep=Math.min(4,uiStep+1);if(uiStep===3)setPhase('serve');}else if(act==='back')uiStep=Math.max(0,uiStep-1);else if(act==='stop'){uiStep=0;toast('演示已停止，可以重新选择任务。');}else if(act==='finish'){if(!$('#water-done').checked||!$('#wipe-done').checked){toast('请先确认接水盒与炉腔的维护步骤。');return;}uiStep=0;toast('本次交互演示完成。');}renderInterface();});
$('#source-filters').addEventListener('click',e=>{const b=e.target.closest('[data-type]');if(!b)return;sourceType=b.dataset.type;selectInGroup($('#source-filters'),b);renderReferences();});
$('#source-search').addEventListener('input',e=>{sourceQuery=e.target.value.trim().toLowerCase();renderReferences();});
$('#expand-sources').addEventListener('click',()=>{sourcesExpanded=!sourcesExpanded;renderReferences();});
document.addEventListener('click',e=>{const a=e.target.closest('[data-ref]');if(!a)return;e.preventDefault();sourcesExpanded=true;sourceType='all';sourceQuery='';$('#source-search').value='';selectInGroup($('#source-filters'),$('[data-type="all"]'));renderReferences();const target=$(`#ref-${a.dataset.ref}`);target?.scrollIntoView({behavior:'smooth',block:'center'});history.replaceState(null,'',`#ref-${a.dataset.ref}`);});
$('#close-dialog').addEventListener('click',()=>$('#patent-dialog').close());
$('#patent-dialog').addEventListener('click',e=>{if(e.target===$('#patent-dialog'))$('#patent-dialog').close();});

function tabKeyboard(container,selector,update){container.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;const buttons=$$(selector,container);const i=buttons.indexOf(document.activeElement);if(i<0)return;e.preventDefault();let n=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+buttons.length)%buttons.length;update(n);$$(selector,container)[n].focus();});}
tabKeyboard($('#journey-tabs'),'button',n=>{journeyIndex=n;renderJourney();});tabKeyboard($('#patent-tabs'),'button',n=>{patentIndex=n;renderPatent();});

const navLinks=$$('.main-nav a');
const sectionObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;navLinks.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));});},{rootMargin:'-15% 0px -65% 0px',threshold:0});
navLinks.forEach(a=>{const section=$(a.hash);if(section)sectionObserver.observe(section);});

const engineeringTopics=[
 {title:'热量先分配，再由反馈修正',img:'heat',lead:'后部中央回风，双侧均压送风，按两层烤盘的高度分配送风。',details:['渐变孔阵让气流覆盖上下层，可拆孔板方便清洗。','环形主热源配合上下补偿，四点腔温判断热场差异。','浅拱顶采用光滑曲面与侧沟，减少顶部滴水落向食物。'],source:'AIR',label:'风道公开结构'},
 {title:'材料按接触环境分配',img:'door',lead:'316L用于湿腔，低膨胀内玻璃配合浮动边框，干侧夹层封装微孔保温材料。',details:['湿腔0.8–1.0 mm，连续焊接后酸洗钝化，R15圆角。','门体为低膨胀内片、Low-E中片及钢化外片，分别组织内侧热风与外侧冷却。','玻璃边缘弹性支承，设计每边2 mm初始间隙，避免刚性夹持。'],source:'GLASS',label:'低膨胀玻璃材料依据'},
 {title:'同时读取腔体、食物和水汽',img:'side',lead:'四点腔温、三点食品探针与专用高温氧探头共同参与过程控制。',details:['T1–T4观察前后、上下温差，Tf补充被测食物温度。','氧信号经温度补偿与标定，间接判断水蒸汽状态。','缺水、满水、门状态与漏水提供互锁，独立温控器负责硬件过温保护。'],source:'OXY',label:'高温水汽感知原理'},
 {title:'让冷凝水沿短路径离开',img:'water',lead:'1.5°坡底汇入前集水槽，门槽和冷凝件的水一并进入独立废水盒。',details:['净水1.2 L与废水0.8 L分盒，不混回供汽。','粗滤、轨架、孔板和冷凝件均可拆卸接近。','间壁冷凝只处理部分湿汽，常通旁路绕开阀与窄冷凝流道，无液封。'],source:'COND',label:'冷凝机理参考'}
];
function showEngineering(i){const t=engineeringTopics[i];$('#engineering-detail').innerHTML=`<div class="eng-detail-image"><img src="assets/m1-${t.img}.svg?v=6" alt="${t.title}"><a class="eng-zoom" href="assets/m1-${t.img}.svg?v=6" target="_blank" rel="noopener">打开原图 ⤢</a></div><div class="eng-detail-copy"><span class="eyebrow">M1 / 0${i+1}</span><h3>${t.title}</h3><p>${t.lead}</p><ul>${t.details.map(x=>`<li>${x}</li>`).join('')}</ul>${refLink(t.source,t.label)}</div>`;$$('[data-engineering]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.engineering===i)));}
$('#engineering-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-engineering]');if(b)showEngineering(+b.dataset.engineering);});showEngineering(0);

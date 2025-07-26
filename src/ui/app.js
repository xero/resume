/* ┳━┓┏┓┓┳━┓┳━┓┳━━┓ ┳  ┳ ┳┳━┓┳━┓┳━┓o┓━┓┏━┓┏┓┓
   ┃━┫┃┃┃┃ ┃┃┳┛┣━ ┃┃┃  ┃━┫┃━┫┃┳┛┃┳┛┃┗━┓┃ ┃┃┃┃
   ┇ ┗┛┗┛┗━┛┛┗━┻━┛┗┻┛  ┇ ┗┛ ┗┛┗━┛┗━┇━━┛┛━┛┛┗┛ */
(_=>{
	const D=document,W=window,
		// Helpers
		$=i=>D.getElementById(i),
		$$=i=>D.querySelector(i),
		$$$=i=>D.querySelectorAll(i),
		add=(t,f,k=0)=>{try{t.addEventListener(k?'keydown':'click',f,false)}catch{}},
		has=(i,c)=>i.classList.contains(c),
		sm=_=>W.innerWidth<=640,
		t=(i,c)=>i.classList.toggle(c),
		to=setTimeout,
		nt=_=>[show,hide].forEach(i=>t(i,'hidden')),
		mo=(i,e)=>{
			e.preventDefault();
			img.src=i.href;
			msg.showModal();
		},
		m=_=>{
			const S=sm();
			typeof e=='number'&&S&&nt();
			hide.style.display=show.style.display=S?'flex':'none';
			nav.transform=`translateX(${S?'-260px':'0px'})`;
		},
		// Roman Numerals
		roman=n=>{
			let s="",R={M:1000,CM:900,D:500,CD:400,C:100,
					XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
			for(let i in R){
				let q=Math.floor(n/R[i]);
				n-=q*R[i];
				s+=i.repeat(q)}
			return `${s}&nbsp;Andrew&nbsp;Harrison`;
		},
		// Time to Delta
		since=t=>{
			let u=[
				{ n:"second", l: 60,       s: 1 },
				{ n:"minute", l: 3600,     s: 60 },
				{ n:"hour",   l: 86400,    s: 3600 },
				{ n:"day",    l: 604800,   s: 86400 },
				{ n:"week",   l: 2629743,  s: 604800 },
				{ n:"month",  l: 31556926, s: 2629743 },
				{ n:"year",   l: null,     s: 31556926 }],
				d=Date.now()/1e3-t;
			if(d<5) return "now";
			for(let i=0,x;i<u.length;i++)
			if(((x=u[i]),d<x.l||!x.l))
				return((d=Math.floor(d/x.s))+" "+x.n+(d>1?"s":"")+" ago")},
		// Github API Parser
		activity=_=>{
			const A=(u,t)=>'<a target="_blank" href="'+u+'" tabindex="0">'+t+'</a>',
				M=i=>'<i class="mega '+i+'"></i>',
				I=i=>'<span class="octicon '+i+'"></span>',
				W=t=>'<span class="well">'+t+'</span>',
				Q=q=>'<blockquote>'+q.replace(/`([^`]+)`/g,'<kbd>$1</kbd>')+'</blockquote>',
			act=$('activity');
			t(act,'hidden');
			fetch('https://api.github.com/users/xero/events')
				.then(e=>e.json())
				.then(data=>{
					let x='<div class="container">';
					data.forEach((e,_)=>{
						let u=A('https://github.com/'+e.actor.login,e.actor.login),
								r=A('https://github.com/'+e.repo.name,e.repo.name),
								d=since(new Date(e.created_at).getTime()/1e3),
								i='mark-github',
								m='<br>',
								p=e.payload;
						switch(e.type){
							case'ReleaseEvent':
								i='package';
								m=`released ${W(A(p.release.zipball_url,I('cloud-download'))+' '+A(p.release.html_url,p.release.name))} to ${r}`;
							break;
							case'CommitCommentEvent':
								i='comment-discussion';
								m=`commented on commit: ${r} / ${A(p.comment.html_url,p.comment.commit_id.substring(0,10))}${Q(p.comment.body.length>250?p.comment.body.substring(0,249)+'...':p.comment.body)}`;
							break;
							case'CreateEvent':
								let type=p.ref_type;
								i=type=='branch'?'git-branch-create':type=='tag'?'tag-add':'repo-create';
								m=type=='branch'
									?`created branch ${W(I('git-branch-create')+' '+p.ref)} to ${r}`
									:type=='tag'
										?`tagged ${W(I('tag-add')+' '+p.ref)} at ${r}`
										:`created ${type} ${W(I('repo-create')+' '+r)}`;
							break;
							case'DeleteEvent':
								let ref=p.ref,typ=p.ref_type;
								i=typ=='branch'?'git-branch-delete':typ=='repo'?'repo-delete':'tag-remove';
								m=`deleted ${typ} ${W(I(i)+' '+ref)} at ${r}`;
							break;
							case'FollowEvent':
								i='person-follow';
								m=`started following ${A(p.target.html_url,p.target.login)}`;
							break;
							case'ForkEvent':
								i='repo-forked';
								m=`forked ${r} into ${W(I('repo-forked')+' '+A('https://github.com/'+p.forkee.full_name,p.forkee.full_name))}`;
							break;
							case'GollumEvent':
								i='file-text';
								m=`created the ${A(p.pages.html_url,p.pages[0].title)} page in the ${r} wiki.`;
							break;
							case'IssueCommentEvent':
								i='comment-add';
								let body=p.issue.body?Q(p.comment.body.length>250?p.comment.body.substring(0,249)+'...':p.comment.body):'';
								m=`commented on issue: ${r} / ${A(p.issue.html_url,p.issue.title)}${body}`;
							break;
							case'IssuesEvent':
								let action=p.action,
								bodyIs=p.issue.body.length>250?p.issue.body.substring(0,249)+'...':p.issue.body;
								i=action=='reopened'?'issue-reopened':action=='closed'?'issue-closed':'issue-opened';
								m=`${action} issue ${r} / ${A(p.issue.html_url,p.issue.title)}${Q(bodyIs)}`;
							break;
							case'MemberEvent':
								i='person';
								m=`${p.action} member ${A('https://github.com/'+p.member.login,p.member.login)} to ${r}`;
							break;
							case'PullRequestEvent':
								i='git-pull-request';
								m=`${p.action} a pull request: ${A(p.pull_request.html_url,e.repo.name+'/#'+p.number)}${Q(A(p.pull_request.head.repo.html_url+'/commit/'+p.pull_request.head.sha,p.pull_request.head.sha.substring(0,10))+' '+p.pull_request.title)}`;
							break;
							case'PushEvent':
								i='repo-push';
								let refP=p.ref.replace(/^.*\/(.*)$/,"$1"),
								c=p.commits.length,
								commit=c===1?'commit':'commits',
								ii=1,
								first=p.commits[0].sha.substring(0,10),
								last=p.commits[c-1].sha.substring(0,10),
								bodyPush='';
								if(c===1)
									bodyPush+=Q(A('https://github.com/'+e.repo.name+'/commit/'+p.commits[0].sha,p.commits[0].sha.substring(0,10))+' '+(p.commits[0].message.length>250?p.commits[0].message.substring(0,249)+'...':p.commits[0].message));
									else if(c>4){
										while(ii<=5)
										bodyPush+=Q(A('https://github.com/'+e.repo.name+'/commit/'+p.commits[ii-1].sha,p.commits[ii-1].sha.substring(0,10))+' '+(p.commits[ii-1].message.length>250?p.commits[ii-1].message.substring(0,249)+'...':p.commits[ii-1].message)),ii++;
										bodyPush+=A('https://github.com/'+e.repo.name+'/compare/'+first+'...'+last,`compare these commits and ${c-5} others &raquo;`,'diff');
									}else{
										while(ii<=c)
										bodyPush+=Q(A('https://github.com/'+e.repo.name+'/commit/'+p.commits[ii-1].sha,p.commits[ii-1].sha.substring(0,10))+' '+(p.commits[ii-1].message.length>250?p.commits[ii-1].message.substring(0,249)+'...':p.commits[ii-1].message)),ii++;
										bodyPush+=A('https://github.com/'+e.repo.name+'/compare/'+first+'...'+last,'compare these commits &raquo;','diff');
									}
								m=`pushed ${c} ${commit} to ${W(I('git-branch')+' '+A('https://github.com/'+e.repo.name+'/tree/'+refP,refP))} to ${r}<br>${bodyPush}`;
							break;
							case'WatchEvent':
								i='eye-watch';
								m=`started watching ${r}`;
							break;
						}
						x+=`<div class="row event"><aside class="ico">${M(i)}</aside><section class="log"><strong>${u}</strong> ${m} <cite>${d}</cite></section></div>`;
					});
					act.innerHTML=x+'</div>';
				})
				.catch(_=>act.innerHTML='<blockquote><i class="warn"></i>Failed loading the Github API</blockquote>');
		},
		// UI Elements
		nav=$('nav').style,
		msg=$("dialog"),
		img=$$("dialog>img"),
		show=$('show'),
		hide=$('hide');
	// Dark Mode toggle
	W.matchMedia('(prefers-color-scheme: dark)').matches&&$$('html').classList.add('dark')
	add($$('.darkmode'),_=>{
		nt();t($$('html'),'dark')
		$$('.darkmode')?.setAttribute('aria-pressed',has($$('html'),'dark'))
		to(_=>m(),sm()?750:1)
	});
	// Navigation
	m();
	W.onresize=m;
	[show,hide,...$$$('nav a')].forEach(i=>add(i,e=>{
		let x=e.currentTarget.id;
		sm()&&to(_=>{nt();
			nav.transform=`translateX(${has(hide,'hidden')?'-260px':'0px'})`
		},(x==="hide"||x==="show")?0:512)
	}));
	// Year
	$('year').innerHTML=roman(new Date().getFullYear());
	// Lightbox
	$$$(".lightbox a").forEach(i=>{
		add(i,e=>(mo(i,e)));
		add(i,e=>{if(e.key==='Enter'||e.key===' '){mo(i,e)}},1)
	});
	add(msg,_=>{
		msg.close();
		to(_=>img.src='',512)
	});
	// Email
	addEventListener('submit',e=>(e.preventDefault(),
		W.open(`mailto:${atob('YW5kcmV3QGhhcnJpc29uLm51')
			}?subject=hello%20from:%20${encodeURI($$('[name=from]').value)
			}&body=${encodeURI($$('[name=msg]').value)}`)))
	// Load Activities
	add($("loadact"),activity);
})();

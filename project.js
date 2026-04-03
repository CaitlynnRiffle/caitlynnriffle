const id=new URLSearchParams(location.search).get('id');
const project=projects.find(p=>p.id===id)||projects[0];
const params=new URLSearchParams(location.search);

document.getElementById('title').textContent=project.name;
document.getElementById('meta').textContent=`${project.sqft} sq ft | ${project.beds} beds | ${project.baths} baths | ${project.garage}`;

const sheets={
	foundation:project.foundation||project.image,
	floor:project.floor||project.image,
	roof:project.roof||project.image,
	elevation:project.elevation||project.image
};

const activeSheet=document.getElementById('active-sheet');
const controlButtons=[...document.querySelectorAll('[data-sheet]')];

function setActiveSheet(key){
	activeSheet.src=sheets[key]||project.image;
	activeSheet.alt=`${project.name} ${key} plan`;
	activeSheet.classList.toggle('is-plan-sheet',key!=='elevation');
	controlButtons.forEach((button)=>{
		button.classList.toggle('active',button.dataset.sheet===key);
	});
}

controlButtons.forEach((button)=>{
	button.addEventListener('click',()=>setActiveSheet(button.dataset.sheet));
});

setActiveSheet('foundation');

document.getElementById('specs').innerHTML=`
	<div class="spec"><b>SQUARE FOOTAGE</b>${project.sqft} sq ft</div>
	<div class="spec"><b>BEDROOMS</b>${project.beds}</div>
	<div class="spec"><b>BATHROOMS</b>${project.baths}</div>
	<div class="spec"><b>GARAGE</b>${project.garage}</div>
`;

const observer=new IntersectionObserver((entries)=>{
	entries.forEach((entry)=>{
		if(entry.isIntersecting){
			entry.target.classList.add('visible');
		}
	});
},{threshold:0.2});

document.querySelectorAll('.fade-section').forEach((section)=>observer.observe(section));

window.attachPlanModal?.('.active-sheet');

const sameOriginReferrer=(()=>{
	try{
		if(!document.referrer) return '';
		const referrerUrl=new URL(document.referrer);
		if(referrerUrl.origin!==location.origin) return '';
		if(referrerUrl.pathname.endsWith('/project.html')||referrerUrl.pathname.endsWith('project.html')) return '';
		return `${referrerUrl.pathname.split('/').pop()}${referrerUrl.search}`;
	}catch{
		return '';
	}
})();

const backHref=params.get('from')||sameOriginReferrer||'projects.html';

['nav-back-link','sidebar-back-link'].forEach((id)=>{
	const link=document.getElementById(id);
	if(!link) return;
	link.href=backHref;
});

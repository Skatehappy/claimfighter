import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID  = "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_EMAILJS_PUBLIC_KEY";
const API_BASE = "";

const STEPS = ['Intro', 'Policyholder', 'Property', 'Claim', 'Demand', 'Generate', 'Letter'];
const FORM_STEPS = ['Policyholder', 'Property', 'Claim', 'Demand'];
const SAMPLE_LETTER = `[DATE]\n\nVia Certified Mail — Return Receipt Requested\n\nClaims Department\nHomeState Insurance Company\nClaim Number: CLM-2026-88421\n\nRe: Formal Appeal of Claim Denial / Underpayment — 567 Maple Ave, Hartford, CT 06103\n\nDear Claims Manager:\n\nThis letter constitutes a formal appeal of the denial/underpayment of Claim No. CLM-2026-88421 for property damage at 567 Maple Ave, Hartford, Connecticut...`;

const TIPS=[
  {icon:"📸",title:"Document the damage thoroughly",body:"More photos than you think you need. Date-stamped, multiple angles, wide and close-up. This is your primary evidence."},
  {icon:"🔍",title:"Get an independent estimate",body:"A second contractor estimate that differs significantly from the insurer's is powerful evidence of underpayment."},
  {icon:"📋",title:"Read your policy",body:"The specific coverage language controls everything. Reference the exact policy provision you believe covers your claim."},
  {icon:"⚖️",title:"State insurance commissioners can help",body:"Filing a complaint with your state insurance commissioner is free, creates a record, and often prompts faster response."},
];

const stepFields={
  Policyholder:[
    {key:"ownerName",label:"Policyholder Name",type:"text",required:true,placeholder:"Jane Smith"},
    {key:"ownerAddress",label:"Your Mailing Address",type:"text",required:true,placeholder:"567 Maple Ave, Hartford, CT 06103"},
    {key:"state",label:"State",type:"text",required:true,placeholder:"Connecticut"},
    {key:"policyNumber",label:"Policy Number",type:"text",required:true,placeholder:"POL-1234567"},
    {key:"claimNumber",label:"Claim Number",type:"text",required:true,placeholder:"CLM-2026-88421"},
  ],
  Property:[
    {key:"propertyAddress",label:"Insured Property Address",type:"text",required:true,placeholder:"567 Maple Ave, Hartford, CT 06103"},
    {key:"insurerName",label:"Insurance Company Name",type:"text",required:true,placeholder:"HomeState Insurance Company"},
    {key:"adjusterName",label:"Claims Adjuster Name (if known)",type:"text",required:false,placeholder:"John Doe"},
    {key:"damageDate",label:"Date of Loss / Damage",type:"text",required:true,placeholder:"January 15, 2026"},
    {key:"damageType",label:"Type of Damage",type:"select",required:true,options:["Wind/Storm damage","Water/Flood damage","Fire damage","Hail damage","Theft/Vandalism","Roof damage","Foundation damage","Other"]},
  ],
  Claim:[
    {key:"claimOutcome",label:"What the Insurer Did",type:"select",required:true,options:["Denied the entire claim","Underpaid — offered less than actual damage","Delayed unreasonably without decision","Excluded coverage unfairly","Other"]},
    {key:"amountOffered",label:"Amount Offered by Insurer (if any)",type:"text",required:false,placeholder:"e.g. $8,500 or $0 (denied)"},
    {key:"actualDamage",label:"Your Actual Damage / Cost to Repair",type:"text",required:true,placeholder:"e.g. $24,000 per independent contractor estimate"},
    {key:"whyWrong",label:"Why You Believe the Decision Is Wrong",type:"textarea",required:true,placeholder:"e.g. The adjuster said roof damage was 'pre-existing' but the roof was inspected and certified as sound in November 2024. The damage clearly resulted from the January 14 storm which is a covered event under Section III of my policy."},
    {key:"policyCoverage",label:"Policy Section / Coverage You Believe Applies",type:"text",required:false,placeholder:"e.g. Section III — Coverage A, Extended Replacement Cost, Ordinance or Law Coverage"},
    {key:"evidence",label:"Evidence You Have",type:"textarea",required:false,placeholder:"e.g. Independent contractor estimate $24,000, roof inspection report Nov 2024, weather service storm records, dated photos, original adjuster report..."},
  ],
  Demand:[
    {key:"amountDemanded",label:"Total Amount You Are Demanding",type:"text",required:true,placeholder:"e.g. $24,000 repair cost + $3,000 additional living expenses"},
    {key:"deadline",label:"Response Deadline (days)",type:"text",required:true,placeholder:"14"},
    {key:"nextSteps",label:"If Ignored, You Will",type:"select",required:true,options:["File complaint with state insurance commissioner","Request appraisal process per policy","Retain a public adjuster","Retain an attorney","All of the above"]},
  ],
};

const requiredFields={
  Policyholder:["ownerName","ownerAddress","state","policyNumber","claimNumber"],
  Property:["propertyAddress","insurerName","damageDate","damageType"],
  Claim:["claimOutcome","actualDamage","whyWrong"],
  Demand:["amountDemanded","deadline","nextSteps"],
};

const colors = {
  paper:"#faf9f7",paperWarm:"#f5f3ef",paperDark:"#ece9e3",
  white:"#ffffff",ink:"#1a1208",inkLight:"#3a3020",
  inkMuted:"#6a5f4a",inkFaint:"#9a9080",
  gold:"#1a4a2e",goldLight:"#2a7a4a",
  border:"#d8d0c0",borderLight:"#ece6d8",
  green:"#1a5c2a",red:"#8b1a1a",
  errorBg:"#fff0f0",errorBorder:"#ffcccc",errorText:"#cc2222",
};

const inputStyle=(focused)=>({width:"100%",padding:"13px 16px",background:colors.white,border:`1px solid ${focused?colors.goldLight:colors.border}`,borderRadius:"8px",color:colors.ink,fontSize:"15px",fontFamily:"'Source Serif 4',Georgia,serif",outline:"none",boxSizing:"border-box",transition:"border-color 0.2s"});
const btnStyle=(active)=>({background:active?`linear-gradient(135deg,${colors.goldLight},${colors.gold})`:colors.paperDark,border:"none",color:active?"#fff":colors.inkFaint,padding:"13px 28px",borderRadius:"6px",cursor:active?"pointer":"default",fontSize:"15px",fontWeight:active?"700":"400",fontFamily:"'Source Serif 4',Georgia,serif",transition:"all 0.2s",display:"inline-flex",alignItems:"center",gap:"8px",boxShadow:active?`0 2px 12px ${colors.goldLight}55`:"none"});

function Tooltip({text}){const [open,setOpen]=useState(false);return(<span style={{position:"relative",display:"inline-block",marginLeft:"6px"}}><span onClick={()=>setOpen(o=>!o)} style={{cursor:"pointer",color:colors.goldLight,fontSize:"12px",border:`1px solid ${colors.goldLight}`,borderRadius:"50%",width:"16px",height:"16px",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>?</span>{open&&(<div style={{position:"absolute",left:"22px",top:"-4px",width:"240px",zIndex:20,background:colors.white,border:`1px solid ${colors.border}`,borderRadius:"8px",padding:"12px 14px",fontSize:"13px",color:colors.inkLight,lineHeight:"1.6",boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>{text}<div onClick={()=>setOpen(false)} style={{marginTop:"8px",color:colors.goldLight,cursor:"pointer",fontSize:"11px"}}>Close ×</div></div>)}</span>);}

function Field({field,value,onChange}){const [focused,setFocused]=useState(false);return(<div style={{marginBottom:"4px"}}><label style={{display:"block",marginBottom:"7px",fontSize:"13px",color:colors.inkMuted,letterSpacing:"0.03em"}}>{field.label}{field.required&&<span style={{color:colors.goldLight,marginLeft:"4px"}}>*</span>}{field.helper&&<Tooltip text={field.helper}/>}</label>{field.type==="select"?(<select value={value||""} onChange={e=>onChange(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} style={{...inputStyle(focused),cursor:"pointer"}}><option value="">Select...</option>{field.options?.map(o=><option key={o} value={o}>{o}</option>)}</select>):field.type==="textarea"?(<textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={field.placeholder} rows={field.rows||4} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} style={{...inputStyle(focused),resize:"vertical",lineHeight:"1.7",minHeight:`${(field.rows||4)*28}px`}}/>):(<input type="text" value={value||""} onChange={e=>onChange(e.target.value)} placeholder={field.placeholder} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} style={inputStyle(focused)}/>)}</div>);}

function Spinner(){return <span style={{width:"16px",height:"16px",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/>;}

export default function App(){
  const [step,setStep]=useState(0);
  const [formData,setFormData]=useState({});
  const [accessCode,setAccessCode]=useState("");
  const [codeValid,setCodeValid]=useState(false);
  const [codeError,setCodeError]=useState("");
  const [email,setEmail]=useState("");
  const [loading,setLoading]=useState(false);
  const [loadingMsg,setLoadingMsg]=useState("");
  const [letter,setLetter]=useState("");
  const [altLetter,setAltLetter]=useState("");
  const [activeTab,setActiveTab]=useState("standard");
  const [checklist,setChecklist]=useState([]);
  const [copied,setCopied]=useState(false);
  const [emailSent,setEmailSent]=useState(false);
  const [emailSending,setEmailSending]=useState(false);
  const [error,setError]=useState("");
  const [showSample,setShowSample]=useState(false);
  const [retryCount,setRetryCount]=useState(0);

  useEffect(()=>{const p=new URLSearchParams(window.location.search);const c=p.get("code");if(c){setAccessCode(c.toUpperCase());verifyCode(c.toUpperCase(),true);}},[]);
  useEffect(()=>{try{const s=sessionStorage.getItem("clf_form");if(s)setFormData(JSON.parse(s));}catch{}},[]);
  useEffect(()=>{try{sessionStorage.setItem("clf_form",JSON.stringify(formData));}catch{}},[formData]);

  const handleChange=(key,value)=>setFormData(prev=>({...prev,[key]:value}));
  const isStepValid=(stepName)=>{const req=requiredFields[stepName]||[];return req.every(k=>formData[k]?.trim());};

  const verifyCode=async(code,silent=false)=>{
    if(!code?.trim()){setCodeError("Please enter your access code.");return;}
    setCodeError("");
    try{
      const res=await fetch(`${API_BASE}/api/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessCode:code,systemPrompt:"Respond with only: VALID",userPrompt:"Access check"})});
      if(res.status===401){if(!silent)setCodeError("Invalid access code. Check your Payhip receipt email.");setCodeValid(false);}
      else{setCodeValid(true);if(!silent)setStep(1);}
    }catch{if(!silent)setCodeError("Could not verify. Check your connection.");}
  };

  const callAPI=async(systemPrompt,userPrompt,reviewMode=false,draftLetter="")=>{
    const res=await fetch(`${API_BASE}/api/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessCode,systemPrompt,userPrompt,reviewMode,draftLetter})});
    if(!res.ok){const err=await res.json();throw new Error(err.error||"Generation failed");}
    return(await res.json()).text;
  };

  const SYSTEM_PROMPT=`You are an expert insurance law attorney with 20 years handling property damage claim disputes. Write firm, legally precise appeal letters that cite policy language and invoke state bad faith insurance statutes. Rules: reference specific policy sections if provided; cite state insurance bad faith law (CT: §38a-816, FL: §624.155, CA: §790.03 — use correct state); invoke state insurance commissioner complaint leverage; reference independent estimates as evidence; 500-700 words; formal letter format with [DATE] placeholder; Output ONLY the letter.`;

  const buildPrompt=(tone)=>{
    const base=Object.entries(formData).map(([k,v])=>`${k}: ${v}`).join("\n");
    if(tone==="assertive")return `Write a MORE ASSERTIVE AND DETAILED version. Stronger language, more citations, different wording:\n${base}`;
    return `Write a STANDARD PROFESSIONAL letter for this situation:\n${base}`;
  };

  const generateLetter=async()=>{
    setLoading(true);setError("");setLetter("");setAltLetter("");setChecklist([]);
    try{
      setLoadingMsg("Drafting your letter...");
      const draft=await callAPI(SYSTEM_PROMPT,buildPrompt("standard"));
      setLoadingMsg("Running quality review...");
      const reviewed=await callAPI("","",true,draft);
      setLetter(reviewed);
      setLoadingMsg("Generating assertive version...");
      const alt=await callAPI(SYSTEM_PROMPT,buildPrompt("assertive"));
      setAltLetter(alt);
      setLoadingMsg("Building checklist...");
      const clRes=await fetch(`${API_BASE}/api/checklist`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessCode,address:formData.address||formData.propertyAddress||formData.rentalAddress||"",state:formData.state||"",issueType:formData.issueType||formData.letterType||formData.requestType||"",letterExcerpt:reviewed.substring(0,300)})});
      if(clRes.ok){const d=await clRes.json();setChecklist(d.checklist||[]);}
      setStep(STEPS.indexOf("Letter"));setRetryCount(0);
    }catch(e){
      const n=retryCount+1;setRetryCount(n);
      setError(n<3?`Generation failed: ${e.message}. Please try again.`:"Multiple failures. Try refreshing or contact support.");
    }
    setLoading(false);setLoadingMsg("");
  };

  const sendEmail=async()=>{
    if(!email?.includes("@"))return;
    setEmailSending(true);
    try{
      await emailjs.send(EMAILJS_SERVICE_ID,EMAILJS_TEMPLATE_ID,{to_email:email,to_name:formData.yourName||formData.ownerName||formData.tenantName||"Customer",property:formData.address||formData.propertyAddress||"",letter_standard:letter,letter_assertive:altLetter,from_name:"ClaimFighter",reply_to:"results@claimfighter.com"},EMAILJS_PUBLIC_KEY);
      setEmailSent(true);
    }catch{setError("Email send failed. Please copy the letter manually.");}
    setEmailSending(false);
  };

  const copyText=(text)=>{navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),2500);};const downloadPDF=(text,filename)=>{const {jsPDF}=window.jspdf;const doc=new jsPDF({unit:"pt",format:"letter"});const margin=72;const pageWidth=doc.internal.pageSize.getWidth();const usableWidth=pageWidth-margin*2;const lineHeight=14;doc.setFont("Times","normal");doc.setFontSize(11);const today=new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});const fullText=text.replace(/\[DATE\]/g,today);const lines=doc.splitTextToSize(fullText,usableWidth);let y=margin;lines.forEach(line=>{if(y+lineHeight>doc.internal.pageSize.getHeight()-margin){doc.addPage();y=margin;}doc.text(line,margin,y);y+=lineHeight;});doc.save(filename);};
  const reset=()=>{setStep(codeValid?1:0);setFormData({});setLetter("");setAltLetter("");setError("");setEmailSent(false);setChecklist([]);setRetryCount(0);try{sessionStorage.removeItem("clf_form");}catch{}};
  const currentStep=STEPS[step];

  return(
    <div style={{minHeight:"100vh",background:colors.paper,fontFamily:"'Source Serif 4',Georgia,serif",color:colors.ink}}>
      <div style={{background:colors.white,borderBottom:`1px solid ${colors.border}`,padding:"16px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:20,boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}><div style={{width:"34px",height:"34px",background:`linear-gradient(135deg,${colors.goldLight},${colors.gold})`,borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px"}}>🏚</div><div><div style={{fontSize:"18px",fontWeight:"700",fontFamily:"'Playfair Display',serif",color:colors.ink}}>ClaimFighter</div><div style={{fontSize:"10px",color:colors.inkFaint,letterSpacing:"0.1em",textTransform:"uppercase"}}>Property Insurance Claim Appeal Writer</div></div></div>
        <div style={{display:"flex",gap:"10px"}}>{step>0&&step<STEPS.indexOf("Letter")&&(<button onClick={()=>setShowSample(s=>!s)} style={{background:"transparent",border:`1px solid ${colors.border}`,color:colors.inkMuted,padding:"7px 14px",borderRadius:"6px",cursor:"pointer",fontSize:"12px"}}>{showSample?"Hide":"View"} Sample</button>)}{letter&&<button onClick={reset} style={{background:"transparent",border:`1px solid ${colors.border}`,color:colors.inkMuted,padding:"7px 14px",borderRadius:"6px",cursor:"pointer",fontSize:"12px"}}>← New Letter</button>}</div>
      </div>

      {showSample&&(<div style={{background:colors.paperWarm,borderBottom:`1px solid ${colors.border}`,padding:"24px 28px",maxHeight:"320px",overflowY:"auto"}}><div style={{fontSize:"11px",color:colors.goldLight,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"12px"}}>Example Output</div><pre style={{fontSize:"12px",color:colors.inkLight,lineHeight:"1.8",whiteSpace:"pre-wrap",margin:0}}>{SAMPLE_LETTER}</pre></div>)}

      <div style={{maxWidth:"720px",margin:"0 auto",padding:"40px 24px 80px"}}>

        {currentStep==="Intro"&&(
          <div style={{textAlign:"center"}}><div style={{fontSize:"13px",color:colors.goldLight,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"12px"}}>🏚 ClaimFighter</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,44px)",color:colors.ink,marginBottom:"16px",fontWeight:"900"}}>Property Insurance Claim Appeal Writer</h1>
          <p style={{fontSize:"17px",color:colors.inkMuted,marginBottom:"48px",maxWidth:"480px",margin:"0 auto 40px",lineHeight:"1.7"}}>Attorney-quality letters in 5 minutes. Enter your access code from your Payhip receipt to begin.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginBottom:"40px",textAlign:"left"}}>{TIPS.map(t=>(<div key={t.title} style={{background:colors.white,border:`1px solid ${colors.borderLight}`,borderRadius:"10px",padding:"20px",display:"flex",gap:"14px"}}><span style={{fontSize:"22px"}}>{t.icon}</span><div><div style={{fontSize:"13px",fontWeight:"600",color:colors.ink,marginBottom:"4px"}}>{t.title}</div><div style={{fontSize:"12px",color:colors.inkMuted,lineHeight:"1.6"}}>{t.body}</div></div></div>))}</div>
          <div style={{maxWidth:"400px",margin:"0 auto",background:colors.white,border:`1px solid ${colors.border}`,borderRadius:"12px",padding:"32px",boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}><div style={{fontSize:"14px",color:colors.inkLight,marginBottom:"16px",fontWeight:"600"}}>Enter Your Access Code</div>
          <input type="text" value={accessCode} onChange={e=>{setAccessCode(e.target.value.toUpperCase());setCodeError("");}} placeholder="Access Code" style={{...inputStyle(false),textAlign:"center",fontSize:"18px",letterSpacing:"0.1em",marginBottom:"12px",fontWeight:"600"}}/>
          {codeError&&<div style={{color:colors.errorText,fontSize:"13px",marginBottom:"12px"}}>{codeError}</div>}
          <button onClick={()=>verifyCode(accessCode)} style={{...btnStyle(!!accessCode.trim()),width:"100%",justifyContent:"center",padding:"14px"}}>Unlock My Letter →</button>
          <div style={{marginTop:"16px",fontSize:"12px",color:colors.inkFaint}}>Don't have a code? <a href="https://payhip.com/claimfighter" style={{color:colors.goldLight,textDecoration:"none"}}>Purchase for $49 →</a></div></div></div>
        )}

        {FORM_STEPS.includes(currentStep)&&(
          <><div style={{marginBottom:"36px"}}><div style={{display:"flex",gap:"6px",marginBottom:"10px"}}>{FORM_STEPS.map((s,i)=>{const idx=FORM_STEPS.indexOf(currentStep);return<div key={s} style={{flex:1,height:"3px",borderRadius:"2px",background:i<idx?colors.goldLight:i===idx?colors.gold:colors.borderLight,transition:"background 0.3s"}}/>;})}</div><div style={{display:"flex",justifyContent:"space-between"}}>{FORM_STEPS.map((s,i)=>{const idx=FORM_STEPS.indexOf(currentStep);return<div key={s} style={{fontSize:"10px",color:i<=idx?colors.goldLight:colors.borderLight,letterSpacing:"0.07em",textTransform:"uppercase"}}>{s}</div>;})</div></div>
          <div style={{marginBottom:"28px"}}><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"26px",color:colors.ink,marginBottom:"6px",fontWeight:"700"}}>{currentStep==="Policyholder"&&"About You"}{currentStep==="Property"&&"Your Property & Insurer"}{currentStep==="Claim"&&"The Claim"}{currentStep==="Demand"&&"Your Demand"}</h2><p style={{fontSize:"14px",color:colors.inkMuted,lineHeight:"1.6"}}>{currentStep==="Policyholder"&&"Your policy and contact information."}{currentStep==="Property"&&"The insured property and claim details."}{currentStep==="Claim"&&"What the insurer did and why they're wrong."}{currentStep==="Demand"&&"How much you want and what you'll do next."}</p></div>
          <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>{(stepFields[currentStep]||[]).map(f=>(<Field key={f.key} field={f} value={formData[f.key]} onChange={v=>handleChange(f.key,v)}/>))}</div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:"36px"}}><button onClick={()=>setStep(s=>s-1)} style={{...btnStyle(true),background:"transparent",border:`1px solid ${colors.border}`,color:colors.inkMuted,boxShadow:"none"}}>← Back</button><button onClick={()=>setStep(s=>s+1)} disabled={!isStepValid(currentStep)} style={btnStyle(isStepValid(currentStep))}>Continue →</button></div></>
        )}

        {currentStep==="Generate"&&(
          <div style={{textAlign:"center"}}><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"30px",color:colors.ink,marginBottom:"12px"}}>Ready to Generate</h2>
          <p style={{fontSize:"16px",color:colors.inkMuted,marginBottom:"40px",maxWidth:"480px",margin:"0 auto 36px",lineHeight:"1.7"}}>Enter your email to receive a copy, then click Generate. Two-pass AI review — about 20–30 seconds.</p>
          <div style={{maxWidth:"420px",margin:"0 auto"}}><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{...inputStyle(false),textAlign:"center",marginBottom:"16px",fontSize:"15px"}}/>
          <button onClick={generateLetter} disabled={loading} style={{...btnStyle(!loading),width:"100%",justifyContent:"center",padding:"16px",fontSize:"17px"}}>{loading?<><Spinner/>{loadingMsg||"Generating..."}</>:"Generate My Letter ✦"}</button>
          {error&&(<div style={{marginTop:"16px",padding:"13px 16px",background:colors.errorBg,border:`1px solid ${colors.errorBorder}`,borderRadius:"8px",color:colors.errorText,fontSize:"13px"}}>{error}{retryCount<3&&<button onClick={generateLetter} style={{marginLeft:"12px",background:"transparent",border:"none",color:colors.goldLight,cursor:"pointer",fontSize:"13px"}}>Try again →</button>}</div>)}
          <div style={{marginTop:"14px",fontSize:"12px",color:colors.inkFaint}}>Two-pass AI review • Standard + Assertive versions • Checklist included</div></div>
          <button onClick={()=>setStep(s=>s-1)} style={{marginTop:"28px",background:"transparent",border:"none",color:colors.inkFaint,cursor:"pointer",fontSize:"13px"}}>← Edit my answers</button></div>
        )}

        {currentStep==="Letter"&&letter&&(
          <div><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"28px"}}><div><div style={{fontFamily:"'Playfair Display',serif",fontSize:"24px",color:colors.gold,marginBottom:"4px"}}>Your Letter is Ready</div><div style={{fontSize:"13px",color:colors.inkFaint}}>Two-pass AI reviewed · Two versions · Checklist included</div></div><div style={{display:"flex",gap:"8px"}}><button onClick={()=>copyText(activeTab==="standard"?letter:altLetter)} style={btnStyle(true)}>{copied?"✓ Copied!":"Copy Letter"}</button><button onClick={()=>downloadPDF(activeTab==="standard"?letter:altLetter,"ClaimFighter-letter.pdf")} style={{...btnStyle(true),marginLeft:"8px",background:"transparent",border:`1px solid ${colors.goldLight}`,color:colors.goldLight}}>⬇ PDF</button></div></div>
          {altLetter&&(<div style={{display:"flex",gap:"2px",background:colors.paperDark,padding:"4px",borderRadius:"8px",marginBottom:"6px"}}>{[["standard","Standard / Professional"],["assertive","Assertive / Detailed"]].map(([key,label])=>(<button key={key} onClick={()=>setActiveTab(key)} style={{flex:1,padding:"10px",borderRadius:"6px",border:"none",cursor:"pointer",fontSize:"13px",transition:"all 0.2s",background:activeTab===key?`linear-gradient(135deg,${colors.goldLight},${colors.gold})`:"transparent",color:activeTab===key?"#fff":colors.inkMuted,fontWeight:activeTab===key?"600":"400"}}>{label}</button>)}</div>)}
          <div style={{fontSize:"12px",color:colors.inkFaint,marginBottom:"16px"}}>{activeTab==="standard"?"Measured, professional tone.":"More assertive framing for stronger cases."}</div>
          <div style={{background:colors.white,border:`1px solid ${colors.border}`,borderRadius:"10px",padding:"40px 48px",lineHeight:"1.9",fontSize:"14px",color:colors.inkLight,whiteSpace:"pre-wrap",boxShadow:"0 4px 32px rgba(0,0,0,0.08)",marginBottom:"24px"}}>{activeTab==="standard"?letter:altLetter}</div>
          {email&&!emailSent&&(<div style={{background:colors.paperWarm,border:`1px solid ${colors.border}`,borderRadius:"8px",padding:"18px 22px",marginBottom:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:"16px"}}><div style={{fontSize:"14px",color:colors.inkLight}}>Send a copy to <strong>{email}</strong></div><button onClick={sendEmail} disabled={emailSending} style={{...btnStyle(!emailSending),padding:"9px 20px",fontSize:"13px"}}>{emailSending?<><Spinner/>Sending...</>:"Send Copy →"}</button></div>)}
          {emailSent&&<div style={{background:"#e8f5e8",border:"1px solid #b0d8b0",borderRadius:"8px",padding:"14px 20px",marginBottom:"20px",fontSize:"14px",color:colors.green}}>✓ Letter emailed to {email}</div>}
          {checklist.length>0&&(<div style={{background:colors.white,border:`1px solid ${colors.border}`,borderRadius:"10px",padding:"24px 28px",marginBottom:"20px"}}><div style={{fontSize:"12px",color:colors.goldLight,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"16px"}}>Next Steps Checklist</div>{checklist.map((item,i)=>(<label key={i} style={{display:"flex",gap:"12px",marginBottom:"10px",cursor:"pointer",alignItems:"flex-start"}}><input type="checkbox" style={{marginTop:"3px",accentColor:colors.goldLight}}/><span style={{fontSize:"14px",color:colors.inkLight,lineHeight:"1.5"}}>{item}</span></label>))}</div>)}
          <div style={{background:"#fdf8ff",border:"1px solid #d8c8e8",borderRadius:"10px",padding:"20px 24px",marginBottom:"20px"}}><div style={{display:"flex",gap:"14px"}}><span style={{fontSize:"22px"}}>💡</span><div><div style={{fontSize:"13px",color:"#7050a0",fontWeight:"600",marginBottom:"6px"}}>Consider a public adjuster for large claims.</div><div style={{fontSize:"12px",color:"#9070b0",lineHeight:"1.6"}}>Public adjusters work on contingency (typically 10-15% of settlement) and specialize in maximizing claim payouts. For claims over $10,000, they often recover significantly more than the insurer's initial offer.</div><div style={{marginTop:"8px",fontSize:"12px",color:"#9070b0"}}>Search: <span style={{color:colors.goldLight}}>"{formData.state}} licensed public adjuster"</span></div></div></div></div>
          <div style={{padding:"14px 18px",background:colors.paperWarm,borderRadius:"8px",border:`1px solid ${colors.borderLight}`,fontSize:"11px",color:colors.inkFaint,lineHeight:"1.7"}}><strong>Legal Disclaimer:</strong> This letter is AI-generated and does not constitute legal advice. Insurance laws and policy terms vary significantly. For large or complex claims, consult a licensed public adjuster or insurance attorney.</div>
          <div style={{marginTop:"24px",textAlign:"center",padding:"20px",background:colors.white,borderRadius:"10px",border:`1px solid ${colors.borderLight}`}}><div style={{fontSize:"14px",color:colors.inkMuted,marginBottom:"6px"}}>Did your insurer respond or increase the offer?</div><div style={{fontSize:"12px",color:colors.inkFaint}}>Share your outcome → <span style={{color:colors.goldLight}}>results@claimfighter.com</span></div></div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}body{margin:0}`}</style>
      <footer style={{textAlign:"center",padding:"16px",fontSize:"0.72rem",color:"#888",borderTop:"1px solid #e5e0d6",marginTop:"40px"}}>ClaimFighter v1.0 · © 2026 The Super Simple Software Company · support@buyappsonce.com</footer>
    </div>
  );
}

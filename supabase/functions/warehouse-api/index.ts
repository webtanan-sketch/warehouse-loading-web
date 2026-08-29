import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
}

const adminKey = (() => {
  const modern = Deno.env.get('SUPABASE_SECRET_KEYS')
  if (modern) { try { return JSON.parse(modern).default } catch {} }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
})()
const sb = createClient(Deno.env.get('SUPABASE_URL')!, adminKey)

const json = (data:any, status=200) => new Response(JSON.stringify(data), {status, headers:cors})
const sha256 = async (s:string) => {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('')
}
const token = () => crypto.randomUUID().replaceAll('-','') + crypto.randomUUID().replaceAll('-','')
const salt = () => crypto.randomUUID().replaceAll('-','')

async function findUserByPin(pin:string, excludeId='') {
  const {data:users,error}=await sb.from('app_users').select('id,display_name,role,active,pin_salt,pin_hash').eq('active',true)
  if(error) throw error
  for(const u of users||[]) {
    if(excludeId && u.id===excludeId) continue
    if(await sha256(u.pin_salt+pin)===u.pin_hash) return u
  }
  return null
}

async function auth(req:Request, manager=false) {
  const raw = (req.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'').trim()
  if (!raw) return null
  const h = await sha256(raw)
  const {data:s} = await sb.from('app_sessions').select('user_id,expires_at').eq('token_hash',h).maybeSingle()
  if (!s || new Date(s.expires_at) <= new Date()) return null
  const {data:u} = await sb.from('app_users').select('id,display_name,role,active').eq('id',s.user_id).maybeSingle()
  if (!u?.active || (manager && u.role!=='manager')) return null
  return u
}

async function ensureSheet(userId:string) {
  let {data:s} = await sb.from('sheets').select('*').eq('owner_user_id',userId).eq('status','open').maybeSingle()
  if (!s) {
    const title = `برگه ${new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}`
    const r = await sb.from('sheets').insert({owner_user_id:userId,title}).select().single(); s=r.data
  }
  return s
}

Deno.serve(async (req:Request) => {
  if (req.method==='OPTIONS') return new Response('ok',{headers:cors})
  if (req.method!=='POST') return json({error:'روش درخواست نامعتبر است'},405)
  try {
    const body = await req.json().catch(()=>({}))
    const action = body.action

    if (action==='login') {
      const pin = String(body.pin||'').trim()
      if (!/^\d{4}$/.test(pin)) return json({error:'PIN چهار رقمی را وارد کنید'},400)
      const u = await findUserByPin(pin)
      if (!u) return json({error:'PIN اشتباه است'},401)
      const raw = token(); const th=await sha256(raw)
      await sb.from('app_sessions').insert({user_id:u.id,token_hash:th,expires_at:new Date(Date.now()+30*86400000).toISOString()})
      await sb.from('audit_logs').insert({actor_user_id:u.id,action:'login_pin',entity_type:'user',entity_id:u.id})
      return json({token:raw,user:{id:u.id,name:u.display_name,role:u.role}})
    }

    const user = await auth(req)
    if (!user) return json({error:'نشست معتبر نیست؛ دوباره وارد شوید'},401)

    if (action==='me') return json({user:{id:user.id,name:user.display_name,role:user.role}})

    if (action==='change_pin') {
      const pin=String(body.pin||'').trim(); if(!/^\d{4}$/.test(pin)) return json({error:'PIN باید دقیقاً ۴ رقم باشد'},400)
      if(await findUserByPin(pin,user.id)) return json({error:'این PIN برای کاربر دیگری استفاده شده است'},409)
      const s=salt(); await sb.from('app_users').update({pin_salt:s,pin_hash:await sha256(s+pin)}).eq('id',user.id)
      await sb.from('audit_logs').insert({actor_user_id:user.id,action:'change_pin',entity_type:'user',entity_id:user.id})
      return json({ok:true})
    }

    if (action==='list_workers') {
      const {data}=await sb.from('app_users').select('id,display_name,role,active').eq('active',true).order('display_name')
      return json({workers:data||[]})
    }

    if (action==='create_worker') {
      if(user.role!=='manager') return json({error:'فقط مدیر مجاز است'},403)
      const name=String(body.name||'').trim(), pin=String(body.pin||'').trim()
      if(!name || !/^\d{4}$/.test(pin)) return json({error:'نام و PIN چهار رقمی لازم است'},400)
      if(await findUserByPin(pin)) return json({error:'این PIN قبلاً استفاده شده است'},409)
      const s=salt(); const {data,error}=await sb.from('app_users').insert({display_name:name,role:'worker',pin_salt:s,pin_hash:await sha256(s+pin)}).select('id,display_name,role').single()
      if(error) return json({error:error.code==='23505'?'این نام قبلاً ثبت شده است':error.message},400)
      await sb.from('audit_logs').insert({actor_user_id:user.id,action:'create_worker',entity_type:'user',entity_id:data.id,details:{name}})
      return json({worker:data})
    }

    if (action==='register_stage') {
      const invoiceNo=String(body.invoice_no||'').trim(), customer=String(body.customer_name||'').trim()
      const items=Array.isArray(body.workers)?body.workers:[]
      if(!invoiceNo||!customer||!items.length) return json({error:'شماره فاکتور، نام مشتری و کارگر الزامی است'},400)
      const clean=items.map((x:any)=>({worker_id:String(x.worker_id||''),amount:Number(x.amount||0)})).filter((x:any)=>x.worker_id&&x.amount>0)
      if(!clean.length) return json({error:'مبلغ معتبر وارد کنید'},400)
      const total=clean.reduce((a:any,b:any)=>a+b.amount,0)
      let {data:inv}=await sb.from('invoices').select('*').eq('invoice_no',invoiceNo).maybeSingle()
      if(inv && inv.customer_name.trim()!==customer) return json({error:`این فاکتور قبلاً برای «${inv.customer_name}» ثبت شده است`},409)
      if(!inv){ const r=await sb.from('invoices').insert({invoice_no:invoiceNo,customer_name:customer,created_by:user.id}).select().single(); if(r.error) return json({error:r.error.message},400); inv=r.data }
      const since=new Date(Date.now()-10*60000).toISOString()
      const {data:recent}=await sb.from('load_stages').select('id,amount_total,created_at').eq('invoice_id',inv.id).gte('created_at',since).eq('amount_total',total)
      if(recent?.length) return json({error:'یک مرحله با همین فاکتور و همین مبلغ در ۱۰ دقیقه اخیر ثبت شده؛ برای جلوگیری از تکرار ثبت نشد.'},409)
      const {data:maxrow}=await sb.from('load_stages').select('stage_no').eq('invoice_id',inv.id).order('stage_no',{ascending:false}).limit(1).maybeSingle()
      const stageNo=(maxrow?.stage_no||0)+1; const sheet=await ensureSheet(user.id)
      const {data:stage,error}=await sb.from('load_stages').insert({invoice_id:inv.id,sheet_id:sheet.id,stage_no:stageNo,amount_total:total,notes:String(body.notes||'').trim()||null,created_by:user.id}).select().single()
      if(error) return json({error:error.message},400)
      const wr=await sb.from('stage_workers').insert(clean.map((x:any)=>({stage_id:stage.id,worker_id:x.worker_id,amount:x.amount})))
      if(wr.error){ await sb.from('load_stages').delete().eq('id',stage.id); return json({error:wr.error.message},400) }
      await sb.from('audit_logs').insert({actor_user_id:user.id,action:'register_stage',entity_type:'stage',entity_id:stage.id,details:{invoice_no:invoiceNo,stage_no:stageNo,total}})
      return json({ok:true,stage_no:stageNo,total})
    }

    if(action==='dashboard') {
      const isM=user.role==='manager'
      let q=sb.from('load_stages').select('id,stage_no,amount_total,created_at,settled_at,invoice:invoices(invoice_no,customer_name),creator:app_users!load_stages_created_by_fkey(display_name)').order('created_at',{ascending:false}).limit(100)
      if(!isM) q=q.eq('created_by',user.id)
      const {data:stages}=await q
      const rows=stages||[]; const total=rows.reduce((s:any,x:any)=>s+Number(x.amount_total),0); const settled=rows.filter((x:any)=>x.settled_at).reduce((s:any,x:any)=>s+Number(x.amount_total),0)
      return json({summary:{total,settled,unsettled:total-settled,count:rows.length},stages:rows})
    }

    if(action==='settle_stage') {
      if(user.role!=='manager') return json({error:'فقط مدیر مجاز است'},403)
      const id=String(body.stage_id||''); const {data:st}=await sb.from('load_stages').select('settled_at').eq('id',id).maybeSingle()
      if(!st) return json({error:'مرحله پیدا نشد'},404); if(st.settled_at) return json({error:'این مرحله قبلاً تسویه شده است'},409)
      await sb.from('load_stages').update({settled_at:new Date().toISOString(),settled_by:user.id}).eq('id',id)
      await sb.from('audit_logs').insert({actor_user_id:user.id,action:'settle_stage',entity_type:'stage',entity_id:id})
      return json({ok:true})
    }

    if(action==='archive_sheet') {
      const {data:s}=await sb.from('sheets').select('id').eq('owner_user_id',user.id).eq('status','open').maybeSingle()
      if(!s) return json({error:'برگه بازی وجود ندارد'},404)
      await sb.from('sheets').update({status:'archived',archived_at:new Date().toISOString()}).eq('id',s.id)
      await sb.from('audit_logs').insert({actor_user_id:user.id,action:'archive_sheet',entity_type:'sheet',entity_id:s.id})
      return json({ok:true})
    }

    return json({error:'عملیات ناشناخته است'},400)
  } catch(e) { console.error(e); return json({error:'خطای داخلی سرور'},500) }
})

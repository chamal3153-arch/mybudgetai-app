import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const API_KEY = process.env.DEEPSEEK_API_KEY!
const API_BASE = 'https://api.deepseek.com/v1'
const MODEL = 'deepseek-chat'

async function callDeepSeek(prompt: string, maxTokens: number) {
  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL, max_tokens: maxTokens, temperature: 0.7,
      messages: [
        { role: 'system', content: 'You are a world-class financial advisor. Always respond with valid JSON only — no markdown, no explanation.' },
        { role: 'user', content: prompt }
      ]
    })
  })
  if (!res.ok) throw new Error(`DeepSeek error ${res.status}`)
  const data = await res.json()
  const text = data.choices[0].message.content.trim().replace(/```json\n?/g,'').replace(/```\n?/g,'').trim()
  return JSON.parse(text)
}

export async function POST(req: Request) {
  try {
    const fd = await req.json()
    const { userId, isPaid, countryName, currency, currencyCode, name, age, income, expenses, savings, debt, goal, timeframe, risk } = fd

    const freePrompt = `You are a world-class financial advisor. Analyze this person's financial situation and return ONLY valid JSON:

Person: ${name}, age ${age}, in ${countryName}
Monthly income: ${currency}${income} (${currencyCode})
Monthly expenses: ${expenses > 0 ? currency + expenses : 'not specified'}
Existing savings: ${savings > 0 ? currency + savings : 'none'}
Outstanding debt: ${debt > 0 ? currency + debt : 'none'}
Primary goal: ${goal} | Timeframe: ${timeframe} | Risk: ${risk}/10

Return this exact JSON:
{"budget_allocation":{"needs_pct":number,"savings_pct":number,"invest_pct":number,"wants_pct":number,"debt_pct":number,"needs_amount":number,"savings_amount":number,"invest_amount":number,"wants_amount":number,"debt_amount":number},"grocery_tip":"string","savings_breadcrumb":"string","investment_breadcrumb":"string","brutal_honest_insight":"string"}

Percentages must sum to 100. Base amounts on income of ${income}.`

    const freeData = await callDeepSeek(freePrompt, 1200)

    let premiumData = null
    if (isPaid) {
      const premiumPrompt = `Financial advisor analysis for ${name}, ${countryName}. Income: ${currency}${income}/mo. Goal: ${goal}. Timeframe: ${timeframe}. Risk: ${risk}/10. ${risk >= 7 ? 'Include 2-3 crypto picks.' : 'No crypto.'}

Return ONLY valid JSON:
{"investment_picks":[{"name":"string","type":"Stock|ETF|Bond|Crypto|REIT","risk_level":"Low|Medium|High","why":"string","where_to_buy":"string","min_amount":"string"}],"savings_strategy":{"best_accounts":["string"],"monthly_target":number,"strategy_explanation":"string"},"best_businesses":[{"name":"string","startup_cost":"string","why_fits":"string","first_step":"string"}],"action_plan":{"month_1":["string"],"month_2":["string"],"month_3":["string"]},"goal_timeline":{"months_to_goal":number,"monthly_needed":number,"current_shortfall":number,"optimistic_months":number,"pessimistic_months":number},"motivational_quote":{"quote":"string","author":"string","relevance":"string"}}

All recommendations specific to ${countryName}. 4-6 investment picks. 2-3 businesses.`
      premiumData = await callDeepSeek(premiumPrompt, 2000)
    }

    // Save to Supabase
    const supabase = await createServiceClient()
    const { data: plan, error } = await supabase.from('plans').insert({
      user_id: userId,
      name, age: Number(age), country: countryName, currency, currency_code: currencyCode,
      income: Number(income), expenses: Number(expenses || 0), savings: Number(savings || 0), debt: Number(debt || 0),
      goal, timeframe, risk: Number(risk),
      free_data: freeData,
      premium_data: premiumData,
      is_premium: isPaid,
    }).select('id').single()

    if (error) throw error
    return NextResponse.json({ planId: plan.id })
  } catch (e: any) {
    console.error('generate-plan error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export const runtime = 'edge'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const API_KEY = process.env.DEEPSEEK_API_KEY!
const API_BASE = 'https://api.deepseek.com/v1'

export async function POST(req: Request) {
  try {
    const { planId, messages } = await req.json()
    if (!planId || !messages?.length) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // Load the plan
    const supabase = await createServiceClient()
    const { data: plan } = await supabase.from('plans').select('*').eq('id', planId).maybeSingle()
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

    const fr = plan.free_data || {}
    const pr = plan.premium_data || {}
    const ba = fr.budget_allocation || {}
    const sym = plan.currency || '$'

    // Build rich system prompt from the plan
    const systemPrompt = `You are a friendly, expert personal financial advisor chatting with ${plan.name}. You have FULL access to their financial plan and situation. Be conversational, specific, and practical. Never say "I don't have access to your plan" — you do.

=== THEIR FINANCIAL SITUATION ===
Name: ${plan.name}, Age: ${plan.age}
Country: ${plan.country} | Currency: ${plan.currency} (${plan.currency_code})
Monthly income: ${sym}${plan.income}
Monthly expenses: ${sym}${plan.expenses}
Existing savings: ${sym}${plan.savings}
Outstanding debt: ${sym}${plan.debt}
Primary goal: ${plan.goal}
Timeframe: ${plan.timeframe}
Risk tolerance: ${plan.risk}/10

=== THEIR BUDGET PLAN ===
- Needs: ${ba.needs_pct}% = ${sym}${ba.needs_amount}/mo
- Savings: ${ba.savings_pct}% = ${sym}${ba.savings_amount}/mo
- Investments: ${ba.invest_pct}% = ${sym}${ba.invest_amount}/mo
- Wants: ${ba.wants_pct}% = ${sym}${ba.wants_amount}/mo
${ba.debt_pct > 0 ? `- Debt repayment: ${ba.debt_pct}% = ${sym}${ba.debt_amount}/mo` : ''}

Key insight: ${fr.brutal_honest_insight || 'Not available'}
Grocery tip: ${fr.grocery_tip || 'Not available'}

${pr.investment_picks ? `=== INVESTMENT PICKS ===
${pr.investment_picks.map((p: any) => `- ${p.name} (${p.type}, ${p.risk_level} risk): ${p.why}. Buy via: ${p.where_to_buy}`).join('\n')}` : ''}

${pr.savings_strategy ? `=== SAVINGS STRATEGY ===
Target: ${sym}${pr.savings_strategy.monthly_target}/mo
Best accounts: ${pr.savings_strategy.best_accounts?.join(', ')}
Strategy: ${pr.savings_strategy.strategy_explanation}` : ''}

${pr.action_plan ? `=== 90-DAY ACTION PLAN ===
Month 1: ${pr.action_plan.month_1?.join(' | ')}
Month 2: ${pr.action_plan.month_2?.join(' | ')}
Month 3: ${pr.action_plan.month_3?.join(' | ')}` : ''}

${pr.goal_timeline ? `=== GOAL TIMELINE ===
Months to goal: ${pr.goal_timeline.months_to_goal}
Monthly needed: ${sym}${pr.goal_timeline.monthly_needed}
Current shortfall: ${sym}${pr.goal_timeline.current_shortfall}` : ''}

${pr.best_businesses ? `=== SIDE BUSINESS IDEAS ===
${pr.best_businesses.map((b: any) => `- ${b.name}: ${b.why_fits}. First step: ${b.first_step}`).join('\n')}` : ''}

=== GUIDELINES ===
- Answer based on THEIR specific numbers and country
- Keep answers concise (2-4 sentences max unless they ask for more detail)
- Use their currency symbol (${sym}) for all money amounts
- Be encouraging but honest
- If they ask something outside finance, gently redirect to their financial plan
- Never give generic advice — always tie it back to their specific situation`

    // Stream the response
    const deepseekRes = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 600,
        temperature: 0.7,
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ]
      })
    })

    if (!deepseekRes.ok) throw new Error(`DeepSeek error ${deepseekRes.status}`)

    // Forward the stream directly
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = deepseekRes.body!.getReader()
        const decoder = new TextDecoder()
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) { controller.close(); break }
            const chunk = decoder.decode(value)
            const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
            for (const line of lines) {
              const data = line.slice(6)
              if (data === '[DONE]') { controller.close(); return }
              try {
                const json = JSON.parse(data)
                const token = json.choices?.[0]?.delta?.content
                if (token) controller.enqueue(encoder.encode(token))
              } catch {}
            }
          }
        } catch (e) { controller.error(e) }
      }
    })

    return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

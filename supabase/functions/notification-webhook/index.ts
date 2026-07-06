import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Esta Edge Function é um template para enviar Webhooks ou Notificações 
// toda vez que um novo lead ou orçamento for criado.
// Acionada via Database Webhooks no Supabase (Database -> Webhooks).

console.log("Hello from Notification Webhook Edge Function!")

Deno.serve(async (req) => {
  try {
    // Apenas aceita requisições POST
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 })
    }

    // Lê o payload enviado pelo Database Webhook do Supabase
    const payload = await req.json()
    console.log("Recebido payload:", payload)

    // Extrair dados se for uma inserção na tabela 'leads'
    if (payload.type === 'INSERT' && payload.table === 'leads') {
      const novoLead = payload.record
      
      const apiUrl = Deno.env.get("EVOLUTION_API_URL")
      const apiKey = Deno.env.get("EVOLUTION_API_KEY")
      const instance = Deno.env.get("EVOLUTION_INSTANCE_NAME")
      const companyPhone = Deno.env.get("COMPANY_WHATSAPP_NUMBER")

      if (!apiUrl || !apiKey || !instance || !companyPhone) {
        console.error('Variáveis da Evolution API não configuradas, pulando notificação WPP.')
      } else {
        const fmt = (v: any) => {
          if (!v) return 'N/A'
          return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(Number(v))
        }
        
        let detalhesObj: any = {}
        try {
          if (novoLead.obs && novoLead.obs.includes("Detalhes:")) {
            const jsonStr = novoLead.obs.split("Detalhes: ")[1]
            if (jsonStr) detalhesObj = JSON.parse(jsonStr)
          }
        } catch(e) {}
        
        const detalhesMsg = Object.keys(detalhesObj).length > 0 
          ? `\n📍 *CEP*: ${detalhesObj.cep || 'N/A'}\n🗺️ *Endereço*: ${detalhesObj.endereco || 'N/A'}`
          : ''

        const text = `🚨 *NOVO ORÇAMENTO GERADO NO SITE!* 🚨

👤 *Nome*: ${novoLead.nome}
📱 *WhatsApp*: ${novoLead.telefone}
🛠️ *Serviço*: ${novoLead.servico_interesse?.toUpperCase()}${detalhesMsg}

💰 *Estimativa Gerada*: ${fmt(novoLead.valor_estimado_min)} a ${fmt(novoLead.valor_estimado_max)}

👉 Entre em contato o mais rápido possível!`

        const endpoint = `${apiUrl}/message/sendText/${instance}`
        
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey
          },
          body: JSON.stringify({
            number: companyPhone,
            options: {
              delay: 1200,
              presence: "composing"
            },
            textMessage: {
              text
            }
          })
        })

        if (!res.ok) {
          const dataText = await res.text()
          console.error(`Falha ao enviar WPP via Evolution API: ${res.status} ${dataText}`)
        } else {
          console.log(`Mensagem WPP enviada com sucesso para ${companyPhone}`)
        }
      }
      
      console.log(`Lead processado: ${novoLead.nome}`)
    }

    const data = {
      message: `Processado com sucesso!`,
    }

    return new Response(
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error: any) {
    console.error("Erro na Edge Function:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
})

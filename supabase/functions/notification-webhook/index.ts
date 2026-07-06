import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Esta Edge Function é um template para enviar Webhooks ou Notificações 
// toda vez que um novo lead ou orçamento for criado.
// Pode ser acionada via Database Webhooks no Supabase (Database -> Webhooks).

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

    // Exemplo: Extrair dados se for uma inserção na tabela 'leads'
    if (payload.type === 'INSERT' && payload.table === 'leads') {
      const novoLead = payload.record
      
      // Aqui você poderia integrar com uma API externa, por exemplo:
      // await fetch('https://hooks.zapier.com/hooks/catch/xxxxxx', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     mensagem: "Novo Lead no Casa Grande Drywall!",
      //     nome: novoLead.nome,
      //     telefone: novoLead.telefone,
      //     servico: novoLead.servico_interesse
      //   })
      // })
      
      console.log(`Lead processado: ${novoLead.nome}`)
    }

    const data = {
      message: `Processado com sucesso!`,
    }

    return new Response(
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
})

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API endpoint
    if (url.pathname === "/api/summarize" && request.method === "POST") {
      try {
        const { prompt } = await request.json();

        const r = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
"Authorization": Bearer ${env.OPENAI_API_KEY},
          "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "أنت مساعد ترشيح/تلخيص كتب للمرحلة الثانوية، مختصر ومفيد." },
              { role: "user", content: prompt }
            ],
            temperature: 0.6,
          }),
        });

        const data = await r.json();
        if (!r.ok) {
          return new Response(JSON.stringify({ error: data?.error?.message || "OpenAI error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const summary = data?.choices?.[0]?.message?.content?.trim() || "";
        return new Response(JSON.stringify({ summary }), {
          headers: { "Content-Type": "application/json" },
        });

      } catch (e) {
        return new Response(JSON.stringify({ error: "Server error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // fallback: serve site as-is
    return env.ASSETS.fetch(request);
  }
};

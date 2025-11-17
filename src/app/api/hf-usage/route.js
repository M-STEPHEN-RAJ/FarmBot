export async function GET() {

  const usageStats = { totalRequests: 120, maxRequests: 500 };

  return new Response(JSON.stringify(usageStats), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
  
}

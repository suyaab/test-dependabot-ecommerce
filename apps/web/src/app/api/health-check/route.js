// Used for Azure health checks, only needs to return a 200 status code
export function GET() {
  return new Response();
}

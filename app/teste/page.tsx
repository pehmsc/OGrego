export default function TestEnvPage() {
  return <pre>{process.env.POSTGRES_URL ? "OK" : "NÃO OK"}</pre>;
}

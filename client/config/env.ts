function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (value === undefined || value.length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  apiBaseUrl: getEnv(
    "NEXT_PUBLIC_API_BASE_URL",
    "http://localhost:8000/api/v1"
  ),
} as const;

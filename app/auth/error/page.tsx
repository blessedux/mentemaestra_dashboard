import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {params?.error_description ? (
                <p className="text-sm text-muted-foreground">{params.error_description}</p>
              ) : params?.error ? (
                <p className="text-sm text-muted-foreground">Error code: {params.error}</p>
              ) : (
                <p className="text-sm text-muted-foreground">An authentication error occurred.</p>
              )}
              <Button asChild>
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

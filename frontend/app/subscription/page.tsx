"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { subscriptionAPI } from "@/lib/api-client"
import MainLayout from "@/components/layout/main-layout"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Check } from "lucide-react"

interface Subscription {
  id: number
  startTime: string
  endTime: string
  planType: "FREE" | "MONTHLY" | "ANNUALLY"
  isActive: boolean
}

export default function SubscriptionPage() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return

      try {
        const data = await subscriptionAPI.getUserSubscription()
        setSubscription(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch subscription details")
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [user])

  const handleUpgrade = async (planType: "FREE" | "MONTHLY" | "ANNUALLY") => {
    setError("")
    setSuccessMessage("")
    setUpgrading(true)

    try {
      // First, create a payment link
      const paymentLink = await subscriptionAPI.createPaymentLink(planType)

      // In a real app, you would redirect to the payment link
      // window.location.href = paymentLink.url;

      // For demo purposes, we'll just update the subscription directly
      const updatedSubscription = await subscriptionAPI.updateSubscription(planType)
      setSubscription(updatedSubscription)
      setSuccessMessage(`Successfully upgraded to ${planType.toLowerCase()} plan!`)
    } catch (err: any) {
      setError(err.message || "Failed to upgrade subscription")
    } finally {
      setUpgrading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner />
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Subscription</h1>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="bg-green-50 text-green-800">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            {subscription && (
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Plan:</span>
                      <span>{subscription.planType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className={subscription.isActive ? "text-green-600" : "text-red-600"}>
                        {subscription.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Start Date:</span>
                      <span>{formatDate(subscription.startTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">End Date:</span>
                      <span>{formatDate(subscription.endTime)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Basic features for personal use</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-3xl font-bold">$0</div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Up to 3 projects</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Basic issue tracking</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Limited messaging</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleUpgrade("FREE")}
                  disabled={upgrading || (subscription?.planType === "FREE" && subscription?.isActive)}
                >
                  {upgrading ? (
                    <LoadingSpinner />
                  ) : subscription?.planType === "FREE" && subscription?.isActive ? (
                    "Current Plan"
                  ) : (
                    "Select Plan"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Monthly</CardTitle>
                <CardDescription>Recommended for small teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-3xl font-bold">$9.99</div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Up to 10 projects</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced issue tracking</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited messaging</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleUpgrade("MONTHLY")}
                  disabled={upgrading || (subscription?.planType === "MONTHLY" && subscription?.isActive)}
                >
                  {upgrading ? (
                    <LoadingSpinner />
                  ) : subscription?.planType === "MONTHLY" && subscription?.isActive ? (
                    "Current Plan"
                  ) : (
                    "Select Plan"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Annually</CardTitle>
                <CardDescription>Best value for businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-3xl font-bold">$99.99</div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited projects</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced issue tracking</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited messaging</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced analytics</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleUpgrade("ANNUALLY")}
                  disabled={upgrading || (subscription?.planType === "ANNUALLY" && subscription?.isActive)}
                >
                  {upgrading ? (
                    <LoadingSpinner />
                  ) : subscription?.planType === "ANNUALLY" && subscription?.isActive ? (
                    "Current Plan"
                  ) : (
                    "Select Plan"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

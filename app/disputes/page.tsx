"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, AlertTriangle, Upload, MessageSquare, Shield, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Add submit functionality to the dispute form
export default function DisputePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    issueType: "not-as-described",
    description: "",
    resolution: "refund",
  })
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)

      toast({
        title: "Dispute submitted",
        description: "Your dispute has been submitted successfully. We'll review it shortly.",
        duration: 5000,
      })

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Dispute Submitted</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for submitting your dispute. Our team will review it and get back to you within 24-48 hours.
          </p>
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm font-medium">Report an Issue</span>
              </div>
              <CardTitle>Submit a Dispute</CardTitle>
              <CardDescription>
                If you've received an item that doesn't match the description or has other issues, you can submit a
                dispute here.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Order #HT38290 - Mechanical Keyboard</h3>
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded border overflow-hidden flex-shrink-0">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Mechanical Keyboard"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Seller: TechTreasures</p>
                      <p className="text-sm text-muted-foreground">Delivered on March 18, 2025</p>
                      <p className="text-sm font-medium">$65.00</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">What's the issue?</h3>
                  <RadioGroup
                    defaultValue="not-as-described"
                    value={formData.issueType}
                    onValueChange={(value) => handleRadioChange("issueType", value)}
                  >
                    <div className="flex items-start space-x-2 mb-3">
                      <RadioGroupItem value="not-as-described" id="not-as-described" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="not-as-described" className="font-medium">
                          Item not as described
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          The item differs significantly from the listing description or photos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 mb-3">
                      <RadioGroupItem value="damaged" id="damaged" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="damaged" className="font-medium">
                          Item arrived damaged
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          The item was damaged during shipping or has defects not mentioned
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 mb-3">
                      <RadioGroupItem value="wrong-item" id="wrong-item" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="wrong-item" className="font-medium">
                          Wrong item received
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          You received a completely different item than what you ordered
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="missing-parts" id="missing-parts" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="missing-parts" className="font-medium">
                          Missing parts or accessories
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          The item is missing components that were included in the listing
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Describe the issue</h3>
                  <Textarea
                    placeholder="Please provide details about the problem..."
                    className="min-h-[120px]"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-3">Upload photos of the issue</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center h-32">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                    </div>
                    <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center h-32">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload clear photos showing the issue. Max 5MB per image, JPG or PNG format.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-3">What would you like as a resolution?</h3>
                  <RadioGroup
                    defaultValue="refund"
                    value={formData.resolution}
                    onValueChange={(value) => handleRadioChange("resolution", value)}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="refund" id="refund" />
                      <Label htmlFor="refund">Full refund</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="partial-refund" id="partial-refund" />
                      <Label htmlFor="partial-refund">Partial refund</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="replacement" id="replacement" />
                      <Label htmlFor="replacement">Replacement item</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Submitting...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    </>
                  ) : (
                    "Submit Dispute"
                  )}
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" type="button" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Dispute Process</CardTitle>
              <CardDescription>How the HanyThrift dispute resolution works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Submit your dispute</h4>
                    <p className="text-sm text-muted-foreground">Provide details and evidence of the issue</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Seller is notified</h4>
                    <p className="text-sm text-muted-foreground">The seller has 3 days to respond to your claim</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Resolution attempt</h4>
                    <p className="text-sm text-muted-foreground">
                      You and the seller can communicate to resolve the issue
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Admin review (if needed)</h4>
                    <p className="text-sm text-muted-foreground">
                      If no agreement is reached, our team will review the case
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium">Final decision</h4>
                    <p className="text-sm text-muted-foreground">Refund or release of funds based on the resolution</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800 mb-1">HanySecurePay Protection</h3>
                    <p className="text-sm text-blue-700">
                      Your payment is still being held securely. It will not be released to the seller until this
                      dispute is resolved.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


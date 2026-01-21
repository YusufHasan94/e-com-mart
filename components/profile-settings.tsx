"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiService } from "@/lib/api-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Loader2, Camera, Save, User, Mail, Phone, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox as UICheckbox } from "@/components/ui/checkbox"

export function ProfileSettings() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [profileData, setProfileData] = useState<any>({
        first_name: "",
        last_name: "",
        avatar: user?.avatar || "",
        dob: "",
        gender: "male",
        phone: "",
        alternate_phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "US",
        company: "",
        tax_id: "",
        newsletter_subscribed: false,
        preferred_currency: "USD",
        preferred_language: "en",
        email: user?.email || "", // For display
    })

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                setIsLoading(false)
                return
            }

            const response = await apiService.getProfile(token)
            if (response.success && response.data) {
                const data = response.data.data || response.data
                setProfileData((prev: any) => ({
                    ...prev,
                    first_name: data.first_name || prev.first_name || data.name?.split(' ')[0] || "",
                    last_name: data.last_name || prev.last_name || data.name?.split(' ').slice(1).join(' ') || "",
                    avatar: data.avatar || prev.avatar,
                    dob: data.dob || "",
                    gender: data.gender || "male",
                    phone: data.phone || data.mobile || "",
                    alternate_phone: data.alternate_phone || "",
                    address_line1: data.address_line1 || data.address || "",
                    address_line2: data.address_line2 || "",
                    city: data.city || "",
                    state: data.state || "",
                    postal_code: data.postal_code || data.zip || data.zip_code || "",
                    country: data.country || "US",
                    company: data.company || "",
                    tax_id: data.tax_id || "",
                    newsletter_subscribed: !!data.newsletter_subscribed,
                    preferred_currency: data.preferred_currency || "USD",
                    preferred_language: data.preferred_language || "en",
                    email: data.email || prev.email,
                }))
            } else {
                console.warn("Could not fetch detailed profile, using basic auth data.")
            }
            setIsLoading(false)
        }

        fetchProfile()
    }, [user])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        if (!token) return

        setIsSaving(true)
        const response = await apiService.updateProfile(token, profileData)
        if (response.success) {
            toast.success("Profile updated successfully")
        } else {
            toast.error(response.error || "Failed to update profile")
        }
        setIsSaving(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        setProfileData((prev: any) => ({ ...prev, [name]: val }))
    }

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account details and public profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdate} className="space-y-8">
                        <div className="flex flex-col items-center gap-4 sm:flex-row">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-2 border-border">
                                    <AvatarImage src={profileData.avatar || user?.avatar} />
                                    <AvatarFallback className="text-2xl">
                                        {profileData.first_name?.charAt(0) || user?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border border-border shadow-sm"
                                    type="button"
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg font-medium">
                                    {profileData.first_name} {profileData.last_name}
                                </h3>
                                <p className="text-sm text-muted-foreground">{profileData.email}</p>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Personal Information</h3>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="first_name"
                                            name="first_name"
                                            value={profileData.first_name}
                                            onChange={handleChange}
                                            className="pl-10"
                                            placeholder="John"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="last_name"
                                            name="last_name"
                                            value={profileData.last_name}
                                            onChange={handleChange}
                                            className="pl-10"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        value={profileData.dob}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender" value={profileData.gender} onValueChange={(val) => setProfileData((p: any) => ({ ...p, gender: val }))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Contact Details</h3>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            value={profileData.email}
                                            disabled
                                            className="pl-10 bg-muted/50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleChange}
                                            className="pl-10"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="alternate_phone">Alternate Phone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="alternate_phone"
                                            name="alternate_phone"
                                            value={profileData.alternate_phone}
                                            onChange={handleChange}
                                            className="pl-10"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Shipping Address</h3>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address_line1">Address Line 1</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="address_line1"
                                            name="address_line1"
                                            value={profileData.address_line1}
                                            onChange={handleChange}
                                            className="pl-10"
                                            placeholder="Street address, P.O. box, company name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address_line2">Address Line 2</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="address_line2"
                                            name="address_line2"
                                            value={profileData.address_line2}
                                            onChange={handleChange}
                                            className="pl-10"
                                            placeholder="Apartment, suite, unit, building, floor, etc."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={profileData.city}
                                        onChange={handleChange}
                                        placeholder="New York"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State / Province</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        value={profileData.state}
                                        onChange={handleChange}
                                        placeholder="NY"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postal_code">Postal / Zip Code</Label>
                                    <Input
                                        id="postal_code"
                                        name="postal_code"
                                        value={profileData.postal_code}
                                        onChange={handleChange}
                                        placeholder="10001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        value={profileData.country}
                                        onChange={handleChange}
                                        placeholder="US"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional & Preferences */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Professional & Preferences</h3>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company</Label>
                                    <Input
                                        id="company"
                                        name="company"
                                        value={profileData.company}
                                        onChange={handleChange}
                                        placeholder="ACME Corp"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tax_id">Tax ID</Label>
                                    <Input
                                        id="tax_id"
                                        name="tax_id"
                                        value={profileData.tax_id}
                                        onChange={handleChange}
                                        placeholder="VAT Number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="preferred_currency">Preferred Currency</Label>
                                    <Select name="preferred_currency" value={profileData.preferred_currency} onValueChange={(val) => setProfileData((p: any) => ({ ...p, preferred_currency: val }))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="preferred_language">Preferred Language</Label>
                                    <Select name="preferred_language" value={profileData.preferred_language} onValueChange={(val) => setProfileData((p: any) => ({ ...p, preferred_language: val }))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="fr">French</SelectItem>
                                            <SelectItem value="de">German</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-2 pt-4">
                                    <UICheckbox
                                        id="newsletter_subscribed"
                                        checked={profileData.newsletter_subscribed}
                                        onCheckedChange={(checked: boolean) => setProfileData((p: any) => ({ ...p, newsletter_subscribed: checked }))}
                                    />
                                    <Label htmlFor="newsletter_subscribed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Subscribe to newsletter
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

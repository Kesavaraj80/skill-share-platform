"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserType = "INDIVIDUAL" | "COMPANY";

export default function ProviderSignup() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("INDIVIDUAL");
  const [formData, setFormData] = useState({
    // Individual fields
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    streetNumber: "",
    streetName: "",
    city: "",
    state: "",
    postCode: "",
    // Company fields
    companyName: "",
    phoneNumber: "",
    businessTaxNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Prepare data based on user type
      const userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        mobileNumber: string;
        streetNumber: string;
        streetName: string;
        city: string;
        state: string;
        postCode: string;
        providerType: string;
        role: "PROVIDER";
        // company fields
        companyName?: string;
        businessTaxNumber?: string;
      } =
        userType === "INDIVIDUAL"
          ? {
              email: formData.email,
              password: formData.password,
              firstName: formData.firstName,
              lastName: formData.lastName,
              mobileNumber: formData.mobile,
              streetNumber: formData.streetNumber,
              streetName: formData.streetName,
              city: formData.city,
              state: formData.state,
              postCode: formData.postCode,
              providerType: userType,
              role: "PROVIDER",
            }
          : {
              email: formData.email,
              password: formData.password,
              companyName: formData.companyName,
              mobileNumber: formData.mobile,
              businessTaxNumber: formData.businessTaxNumber,
              firstName: formData.firstName,
              lastName: formData.lastName,
              streetNumber: formData.streetNumber,
              streetName: formData.streetName,
              city: formData.city,
              state: formData.state,
              postCode: formData.postCode,
              providerType: userType,
              role: "PROVIDER",
            };

      await authAPI.signupProvider(userData);
      toast.success("Account created successfully!");
      router.push("/auth/login");
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "An error occurred during signup";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Provider Signup
          </CardTitle>
          <CardDescription className="text-center">
            Join as a service provider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="w-full max-w-xs mx-auto space-y-2">
              <label className="text-sm font-medium">Provider Type</label>
              <Select
                value={userType}
                onValueChange={(value) => setUserType(value as UserType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INDIVIDUAL">
                    Individual Provider
                  </SelectItem>
                  <SelectItem value="COMPANY">Company Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {userType === "INDIVIDUAL" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name *</label>
                    <Input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name *</label>
                    <Input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number *</label>
                  <Input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter your mobile number"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name *</label>
                  <Input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Business Tax Number *
                  </label>
                  <Input
                    type="text"
                    name="businessTaxNumber"
                    required
                    value={formData.businessTaxNumber}
                    onChange={handleChange}
                    placeholder="Enter business tax number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Contact Person First Name *
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter contact person's first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Contact Person Last Name *
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter contact person's last name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter company email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number *</label>
                  <Input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter company mobile number"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Password *</label>
                <Input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Confirm Password *
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={8}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Street Number *</label>
                  <Input
                    type="text"
                    name="streetNumber"
                    required
                    value={formData.streetNumber}
                    onChange={handleChange}
                    placeholder="Enter street number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Street Name *</label>
                  <Input
                    type="text"
                    name="streetName"
                    required
                    value={formData.streetName}
                    onChange={handleChange}
                    placeholder="Enter street name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City *</label>
                  <Input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State *</label>
                  <Input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Post Code *</label>
                <Input
                  type="text"
                  name="postCode"
                  required
                  value={formData.postCode}
                  onChange={handleChange}
                  placeholder="Enter post code"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

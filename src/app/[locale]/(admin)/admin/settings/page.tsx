"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, CheckCircle2, Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

export default function AdminSettings() {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileImage, setProfileImage] = useState(""); 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        if (response.data.success && response.data.data) {
          const data = response.data.data;
          setFormData({
            name: data.name || "",
            email: data.email || "",
          });
          if (data.image || data.avatar) {
            setProfileImage(getImageUrl(data.image || data.avatar) || "");
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        name: formData.name,
      };

      const formDataObj = new FormData();
      formDataObj.append('data', JSON.stringify(payload));
      if (selectedFile) {
        formDataObj.append('image', selectedFile);
      }

      const response = await api.patch('/user/profile', formDataObj);

      if (response.data.success) {
        setIsSaved(true);
        toast.success(response.data.message || "Profile updated successfully");
        if (response.data.data) {
          const data = response.data.data;
          setFormData({
            name: data.name || formData.name,
            email: data.email || formData.email,
          });
          if (data.image || data.avatar) {
            setProfileImage(getImageUrl(data.image || data.avatar) || "");
          }
        }
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.currentPassword.trim()) {
      toast.error("Please enter your current password");
      return;
    }

    if (!passwordData.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setIsChangingPassword(true);
      const response = await api.post("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      if (response.data.success) {
        setIsPasswordSaved(true);
        toast.success(response.data.message || "Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setIsPasswordSaved(false), 3000);
      } else {
        toast.error(response.data.message || "Failed to change password");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your administrator account details and security.</p>
      </div>

      {/* Administrator Details Card */}
      <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-6 md:p-8">
          <CardTitle className="text-xl font-bold text-slate-800">Administrator Details</CardTitle>
          <CardDescription>Update your photo and personal information.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group cursor-pointer" onClick={triggerFileUpload}>
              <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-sm">
                <AvatarImage src={profileImage} alt="Profile" />
                <AvatarFallback className="text-xl bg-blue-50 text-blue-600 font-bold">SA</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white h-6 w-6" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    setProfileImage(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <Button variant="outline" size="sm" className="rounded-xl border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-all" onClick={triggerFileUpload}>
                Change Photo
              </Button>
            </div>
          </div>

          <Separator className="bg-slate-50" />

          {/* Form Section */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-blue-500/10 transition-all font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                  <Input 
                    id="email" 
                    value={formData.email}
                    disabled
                    className="h-11 rounded-xl border-slate-100 bg-slate-100/60 text-slate-500 cursor-not-allowed font-medium" 
                  />
                </div>
              </div>
            )}
          </div>

          <Separator className="bg-slate-50" />

          {/* Footer Section */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              {isSaved && (
                <div className="flex items-center gap-2 text-emerald-600 font-bold animate-in fade-in slide-in-from-left-4 duration-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Settings saved successfully</span>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button 
                className="px-8 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-70"
                onClick={handleSave}
                disabled={isSaving || isLoading}
              >
                {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">Change Password</CardTitle>
              <CardDescription>Update your password to keep your administrator account secure.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-4 max-w-md">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-semibold text-slate-700">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    placeholder="Enter current password"
                    className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-blue-500/10 transition-all font-medium pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-semibold text-slate-700">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    placeholder="Enter new password (min. 8 characters)"
                    className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-blue-500/10 transition-all font-medium pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Must be at least 8 characters long.
                </p>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    placeholder="Re-enter new password"
                    className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:ring-blue-500/10 transition-all font-medium pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-50" />

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                {isPasswordSaved && (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold animate-in fade-in slide-in-from-left-4 duration-300">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Password updated successfully!</span>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="px-8 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-70"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifySellerEmail, getAuthUser } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";

export default function VerifySeller() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid verification link.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await verifySellerEmail(token);
        toast.success(res.message || "Seller verified successfully!");
        await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      } catch (err) {
        toast.error(err.response?.data?.message || "Verification failed.");
      } finally {
        setLoading(false);
        setTimeout(() => navigate("/sellermarket"), 1500);
      }
    };


    verify();
  }, [searchParams, navigate, queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {loading ? (
        <p className="text-xl">Verifying your account, please wait...</p>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Verification Completed</h1>
          <p className="text-white/70">
            You will be redirected to your dashboard shortly.
          </p>
        </div>
      )}
    </div>
  );
}


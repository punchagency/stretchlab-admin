import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBusinessInfo } from "@/service/dashboard";
import type { BusinessInfoResponse } from "@/types";

export const useBusinessDetail = () => {
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: businessInfoData, 
    isLoading: isBusinessInfoLoading,
    error: businessInfoError,
    refetch: refetchBusinessInfo,
  } = useQuery<BusinessInfoResponse>({
    queryKey: ['businessInfo', selectedBusinessId],
    queryFn: () => getBusinessInfo(selectedBusinessId!),
    enabled: !!selectedBusinessId,  
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const openBusinessDetail = (businessId: number) => {
    setSelectedBusinessId(businessId);
    setIsModalOpen(true);
  };

  const closeBusinessDetail = () => {
    setIsModalOpen(false);
    setSelectedBusinessId(null);
  };

  return {
    businessInfo: businessInfoData?.data || null,
    isModalOpen,
    isBusinessInfoLoading,
    businessInfoError,
    openBusinessDetail,
    closeBusinessDetail,
    refetchBusinessInfo,
  };
}; 
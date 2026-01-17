import { api } from "@/lib/api";
import { LedgerLog, Plan, PurchasedPlan } from "@/types/billing";

const billingService = {
  getPlans: () => api.get<Plan[]>("/notification/plans"),

  getPurchasedPlans: (showAll = true) =>
    api.get<PurchasedPlan[]>(
      `/notification/plans/purchased?showAll=${showAll}`,
    ),

  getLedger: (pageNo = 1, pageSize = 10) =>
    api.get<LedgerLog[]>(
      `/notification/admin/ledger?pageNo=${pageNo}&pageSize=${pageSize}`,
    ),
};

export default billingService;

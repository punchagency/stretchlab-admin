import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/datatable";
import { Input, Button, SvgIcon } from "@/components/shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { useInvoiceHistory, type InvoiceHistoryItem } from "@/service/billing";
import { convertStripePrice } from "@/utils/billing";
import { motion } from "framer-motion";

interface ProcessedInvoiceData {
  id: string;
  invoiceDate: string;
  invoiceId: string;
  amount: string;
  status: "Paid" | "Unpaid";
  downloadUrl: string;
}

export const InvoiceHistoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("All");
  const { data: invoiceHistory = [], isLoading, error } = useInvoiceHistory();

  const handleDownload = (invoiceId: string) => {
    console.log(`Downloading invoice ${invoiceId}`);
  };

  const processedInvoiceData: ProcessedInvoiceData[] = invoiceHistory.map((invoice: InvoiceHistoryItem) => ({
    id: invoice.id,
    invoiceDate: new Date(invoice.invoice_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }),
    invoiceId: invoice.invoice_id,
    amount: `$${convertStripePrice(invoice.amount).toFixed(2)}`,
    status: invoice.status === "paid" ? "Paid" : "Unpaid",
    downloadUrl: invoice.download_url || "#"
  }));

  const columns: ColumnDef<ProcessedInvoiceData>[] = [
    {
      accessorKey: "invoiceDate",
      header: "Invoice Date",
      cell: ({ getValue }) => (
        <div className="text-gray-600">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "invoiceId",
      header: "Invoice ID",
      cell: ({ getValue }) => (
        <div className="text-gray-600">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ getValue }) => (
        <div className="text-gray-600">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as "Paid" | "Unpaid";
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${status === "Paid"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
              }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "download",
      header: "Download",
      cell: ({ row }) => (
        <button
          onClick={() => handleDownload(row.original.invoiceId)}
          className="flex items-center gap-2 text-gray-600 text-sm"
        >
          <Download className="h-4 w-4" />
          PDF
        </button>
      ),
    },
  ];

  const filteredData = processedInvoiceData.filter((invoice: ProcessedInvoiceData) => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceDate.toLowerCase().includes(searchTerm.toLowerCase());

    // Period filter
    let matchesPeriod = true;
    if (filterPeriod !== "All") {
      const originalInvoice = invoiceHistory.find(orig => orig.id === invoice.id);
      if (originalInvoice) {
        const invoiceDate = new Date(originalInvoice.invoice_date);
        const currentDate = new Date();

        if (filterPeriod === "Monthly") {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(currentDate.getMonth() - 1);
          matchesPeriod = invoiceDate >= oneMonthAgo;
        } else if (filterPeriod === "Yearly") {
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
          matchesPeriod = invoiceDate >= oneYearAgo;
        }
      }
    }

    return matchesSearch && matchesPeriod;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="py-3 px-3 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col gap-4 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Invoice History</h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 items-stretch sm:items-center">
            <div className="flex-1 sm:min-w-[280px]">
              <Input
                type="search"
                icon="search"
                placeholder="Search by invoice ID & date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 rounded-md"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center justify-center gap-2 py-3 px-4 border border-primary-base rounded-md bg-white text-primary-base hover:bg-primary-base hover:text-white whitespace-nowrap">
                  <SvgIcon name="filter" width={16} height={16} fill="currentColor" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-34 p-3">
                <DropdownMenuItem
                  onClick={() => setFilterPeriod("All")}
                  className={filterPeriod === "All" ? "bg-primary-base/10 text-gray-900" : "text-primary-base"}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterPeriod("Monthly")}
                  className={filterPeriod === "Monthly" ? "bg-primary-base/10 text-gray-900" : "text-primary-base"}
                >
                  Monthly
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterPeriod("Yearly")}
                  className={filterPeriod === "Yearly" ? "bg-primary-base/10 text-gray-900" : "text-primary-base"}
                >
                  Yearly
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6 relative">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-primary-base font-medium"
            >
              Loading invoices...
            </motion.div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-red-500 font-medium">Failed to load invoices</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={filteredData}
              emptyText="No invoices found"
              tableContainerClassName="xs:w-[80vw]"
            />
          </div>
        )}
      </div>
    </div>
  );
}; 

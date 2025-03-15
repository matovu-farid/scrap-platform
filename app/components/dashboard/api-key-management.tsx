"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@hooks/use-toast";
import { findOrCreateUsageKey, regenerateApiKey } from "@/lib/apikey";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderComponent } from "@/components/loader";

export function APIKeyManagement() {
  const queryClient = useQueryClient();

  const { data: apiKey, isLoading: isLoadingApiKey } = useQuery({
    queryKey: ["usageKey"],
    queryFn: () => findOrCreateUsageKey(),
  });

  const { mutate: regenerateMyApiKey } = useMutation({
    mutationFn: () => regenerateApiKey(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usageKey"] });
      setShowApiKey(true); // Show the new key automatically
      toast({
        title: "API Key Regenerated",
        description: "Your new API key has been generated.",
      });
    },
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey || "");
    toast({
      title: "API Key Copied",
      description: "Your API key has been copied to the clipboard.",
    });
  };

  const maskedApiKey = ".".repeat(apiKey?.length || 0);

  if (isLoadingApiKey) {
    return <LoaderComponent />;
  }

  if (!apiKey) {
    return <div>No API key found</div>;
  }

  return (
    <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
      <div className="flex space-x-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            value={showApiKey ? apiKey : maskedApiKey}
            readOnly
            className="pr-24 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 font-mono"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-12 top-1/2 -translate-y-1/2 h-7 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setShowApiKey(!showApiKey)}
          >
            {showApiKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={copyToClipboard}
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
          >
            Copy
          </Button>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Regenerate API Key
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will revoke your current API key and generate a new
              one. Any applications using the old key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => regenerateMyApiKey()}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">API Usage</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Calls this month: 1,234
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Rate limit: 1,000 calls per minute
        </p>
      </div>
    </div>
  );
}

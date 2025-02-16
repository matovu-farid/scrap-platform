"use client";

import { motion } from "framer-motion";
import { AccountSettings } from "@components/dashboard/account-settings";

export default function AccountPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AccountSettings />
    </motion.div>
  );
}

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  show: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
};

export const Modal: React.FC<ModalProps> = ({
  children,
  onClose,
  show,
  size = "md",
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={`bg-white max-h-[90%] overflow-y-auto relative rounded-lg shadow-lg p-6 ${
              size === "sm" && "w-[30rem]"
            } ${size === "md" && "w-[40rem]"} ${
              size === "lg" && "w-[50rem]"
            }  ${size === "xl" && "w-[70rem]"}
            ${size === "2xl" && "w-[90rem]"}
            `}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 cursor-pointer text-2xl text-gray-500 hover:text-gray-700"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

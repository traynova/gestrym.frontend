/**
 * TrainingNotifications - Componentes para notificaciones del módulo de entrenamiento
 */

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  InfoIcon,
  X,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";

interface TrainingNotificationProps {
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  autoClose?: number; // milisegundos
  onClose?: () => void;
}

export function TrainingNotification({
  type,
  title,
  message,
  autoClose = 5000,
  onClose,
}: TrainingNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-600/20 border border-green-600",
          text: "text-green-400",
          icon: CheckCircle2,
        };
      case "error":
        return {
          bg: "bg-red-600/20 border border-red-600",
          text: "text-red-400",
          icon: AlertCircle,
        };
      case "warning":
        return {
          bg: "bg-yellow-600/20 border border-yellow-600",
          text: "text-yellow-400",
          icon: AlertTriangle,
        };
      default:
        return {
          bg: "bg-blue-600/20 border border-blue-600",
          text: "text-blue-400",
          icon: InfoIcon,
        };
    }
  };

  const styles = getStyles();
  const Icon = styles.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={clsx(
            "flex items-start gap-3 p-4 rounded-lg",
            styles.bg
          )}
        >
          <Icon className={clsx("h-5 w-5 flex-shrink-0 mt-0.5", styles.text)} />

          <div className="flex-1">
            <h4 className={clsx("font-semibold", styles.text)}>{title}</h4>
            {message && (
              <p className="text-sm text-slate-300 mt-1">{message}</p>
            )}
          </div>

          <motion.button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={clsx("flex-shrink-0", styles.text)}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Contenedor para apilar notificaciones
interface NotificationContainerProps {
  notifications: Array<TrainingNotificationProps & { id: string }>;
  onRemove: (id: string) => void;
}

export function NotificationContainer({
  notifications,
  onRemove,
}: NotificationContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
          >
            <TrainingNotification
              {...notif}
              onClose={() => onRemove(notif.id)}
              autoClose={notif.autoClose}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import styles from "./notificationModal.module.css";
import logo from "../../images/logo.png";

export default function NotificationModal({
  show,
  type = "info",
  mode = "ok",            
  message = "",
  onClose = () => {},
  onConfirm = () => {},
}) {
   
  const titles = {
    success: "Sucesso!",
    error: "Atenção",
    warning: "Aviso",
    info: "Informação",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`${styles.content} ${styles[type]}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <img src={logo} alt="Logo" className={styles.logo} />

            <h3 className={styles.title}>
              {mode === "confirm" ? "Confirmação" : titles[type] || "Mensagem"}
            </h3>

            <p className={styles.text}>{message}</p>

            <div className={styles.buttons}>
              {mode === "confirm" ? (
                <>
                  <motion.button
                    className={styles.cancel}
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancelar
                  </motion.button>

                  <motion.button
                    className={styles.confirm}
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Confirmar
                  </motion.button>
                </>
              ) : (
                <motion.button
                  className={styles.ok}
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  OK
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

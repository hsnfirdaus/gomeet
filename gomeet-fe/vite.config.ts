import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "SSL_");

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 8082,
      https:
        env.SSL_CERT_PATH && env.SSL_KEY_PATH
          ? {
              key: env.SSL_KEY_PATH,
              cert: env.SSL_CERT_PATH,
            }
          : undefined,
    },
  };
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Progetto-Front-End-Esame-20-06/",
  plugins: [react()],
  server: { port: 5173 },
});

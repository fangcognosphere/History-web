import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/theme-colors.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AOS from 'aos';
import 'aos/dist/aos.css';

// Khởi tạo AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Helmet>
      <title>Lịch Sử Việt Nam</title>
      <meta name="description" content="Website thông tin lịch sử Việt Nam với các bài viết về nhân vật, sự kiện và triều đại lịch sử" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </Helmet>
    <App />
  </HelmetProvider>
);
